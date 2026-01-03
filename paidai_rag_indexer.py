import os
import json

def build_paidai_index(data_path='.'):
    index = []
    # These are the files we want the AI to remember
    target_extensions = ('.txt', '.py', '.jsx', '.html')

    print(f"Scanning directory: {os.path.abspath(data_path)}")

    for root, dirs, files in os.walk(data_path):
        # Skip internal folders to keep the index clean
        if any(x in root for x in ['node_modules', 'emsdk', '.git']):
            continue
            
        for file in files:
            if file.endswith(target_extensions) and file != 'rag_index.json':
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        if content.strip(): 
                            index.append({
                                'source': file,
                                'path': file_path.replace('\\', '/'),
                                'text': content[:2000] 
                            })
                except Exception as e:
                    print(f"Could not read {file}: {e}")

    output_path = './rag_index.json'
    with open(output_path, 'w', encoding='utf-8') as out:
        json.dump(index, out, indent=4)

    # NO EMOJIS HERE - This prevents the UnicodeEncodeError crash
    print(f"SUCCESS: RAG Index Rebuilt! Found {len(index)} documents.")
    print(f"File saved to: {os.path.abspath(output_path)}")

if __name__ == '__main__':
    build_paidai_index()