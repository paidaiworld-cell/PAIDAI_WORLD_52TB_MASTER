import os
import json
# Import your 3-level processing logic directly from your glory indexer
from high_glory_indexer import parse_hierarchical_structures, calculate_tokens, AGENT_ID, REGION_TAG, GLORY_SCORE_G

def build_paidai_index(data_path='.'):
    index = []
    target_extensions = ('.txt', '.py', '.jsx', '.html')

    print(f"Scanning directory: {os.path.abspath(data_path)}")

    for root, dirs, files in os.walk(data_path):
        # Skip system dependencies and caches to ensure a clean data dump
        if any(x in root for x in ['node_modules', 'emsdk', '.git', 'package-lock.json']):
            continue
            
        for file in files:
            # Prevent the indexer from recursively parsing its own data dump file
            if file.endswith(target_extensions) and file not in ['rag_index.json', 'package-lock.json']:
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        if not content.strip():
                            continue
                        
                        # Execute the 3-Level Hierarchical Splitter on the file contents
                        file_shards = parse_hierarchical_structures(content)
                        
                        for i, (lvl1, lvl2, content_block) in enumerate(file_shards):
                            token_count = calculate_tokens(content_block)
                            
                            # Log every single shard back to its master file coordinates
                            index.append({
                                'shard_id': f"{file}_{i:03d}",
                                'source_file': file,
                                'physical_path': file_path.replace('\\', '/'),
                                'hierarchy_level_1': lvl1, # Surface Concept
                                'hierarchy_level_2': lvl2, # Structural Core
                                'text_payload': content_block, # Level 3: Deep Technical Analysis
                                'metadata': {
                                    "source_expert": "Steven",
                                    "region": REGION_TAG,
                                    "glory_score_G": GLORY_SCORE_G,
                                    "agent_id": AGENT_ID,
                                    "token_size": token_count
                                }
                            })
                except Exception as e:
                    print(f"Could not read {file}: {e}")

    output_path = './rag_index.json'
    with open(output_path, 'w', encoding='utf-8') as out:
        json.dump(index, out, indent=4)

    print(f"SUCCESS: Hierarchical RAG Shard Map Built! Generated {len(index)} total data shards.")
    print(f"File saved to: {os.path.abspath(output_path)}")

if __name__ == '__main__':
    build_paidai_index()