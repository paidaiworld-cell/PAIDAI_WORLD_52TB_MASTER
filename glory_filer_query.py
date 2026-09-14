import json
import os
import sys
sys.stdout.reconfigure(encoding='utf-8')

def local_rag_query(query_text: str, index_path='./rag_index.json', top_k=3):
    """
    Executes a localized RAG search across your 176 generated structural shards.
    Ranks text blocks by calculating token intersections across your 3-level hierarchy.
    """
    if not os.path.exists(index_path):
        print(f"ERROR: Cannot execute query. Shard index map missing at {index_path}")
        return []

    with open(index_path, 'r', encoding='utf-8') as f:
        shard_database = json.load(f)

    query_tokens = set(query_text.lower().split())
    ranked_results = []

    print(f"\n[RAG ENGINE] Processing query: '{query_text}'")
    print(f"[RAG ENGINE] Scanning all {len(shard_database)} localized shards...")

    for shard in shard_database:
        score = 0
        
        lvl1 = shard.get('hierarchy_level_1', '').lower()
        lvl2 = shard.get('hierarchy_level_2', '').lower()
        payload = shard.get('text_payload', '').lower()

        # Weighted Structural Scoring Engine
        for token in query_tokens:
            if token in lvl1:
                score += 5  # Level 1 Match
            if token in lvl2:
                score += 3  # Level 2 Match
            if token in payload:
                score += 1  # Level 3 Match

        if score > 0:
            ranked_results.append((score, shard))

    ranked_results.sort(key=lambda x: x[0], reverse=True)
    top_shards = ranked_results[:top_k]

   # 1. Create a clean list to hold the parsed search results
    clean_output = []
    
    for idx, (score, shard) in enumerate(top_shards):
        # 2. Extract only the exact data keys you want to send to the UI
        result_payload = {
            "rank": idx + 1,
            "score": score,
            "physical_path": shard.get('physical_path'),
            "shard_id": shard.get('shard_id'),
            "hierarchy_level_1": shard.get('hierarchy_level_1'),
            "hierarchy_level_2": shard.get('hierarchy_level_2'),
            "text_payload": shard.get('text_payload', '')[:300]
        }
        clean_output.append(result_payload)
        
    # 3. Print ONLY the final clean JSON dump so Node can parse it instantly
   # 3. Print ONLY the final clean JSON dump so Node can parse it instantly
    print(json.dumps(clean_output))
    return top_shards

if __name__ == '__main__':
    # If a query argument was passed by Node, use it; otherwise default to test query
    test_query = sys.argv[1] if len(sys.argv) > 1 else "One Use One Life One Database"
    local_rag_query(test_query)