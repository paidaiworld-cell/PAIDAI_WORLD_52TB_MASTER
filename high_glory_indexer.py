import tiktoken
import uuid
import os

# --- 1. CORE ARCHITECTURE DEFINITIONS ---
AGENT_ID = str(uuid.uuid4())
GLORY_SCORE_G = 950  
REGION_TAG = "Western_Canada_RAG_V1"

try:
    TOKENIZER = tiktoken.encoding_for_model("gpt-4o-mini")
except Exception:
    def TOKENIZER(text): return [1] * (len(text) // 4)

def calculate_tokens(text: str) -> int:
    """Calculates the token count for precision runtime tracking."""
    if hasattr(TOKENIZER, 'encode'):
        return len(TOKENIZER.encode(text))
    return len(text) // 4

# --- 2. HIERARCHICAL PROCESSING ENGINE ---
def parse_hierarchical_structures(raw_text: str) -> list:
    """
    Parses documents according to the 3-Level Logic Framework:
    Level 1: Surface / Conceptual (Titles, Missions)
    Level 2: Core Structural (Component blocks, routing logic)
    Level 3: Deep Technical Analysis (Exact code snippets, variables)
    """
    lines = raw_text.split('\n')
    chunks = []
    
    current_level_1 = "Global Context"
    current_level_2 = "General Systems"
    current_block_text = []

    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue
            
        # Level 1 Anchor: Broad Context Definition
        if stripped.startswith("=== LEVEL 1:") or stripped.startswith("# "):
            if current_block_text:
                chunks.append((current_level_1, current_level_2, "\n".join(current_block_text)))
                current_block_text = []
            current_level_1 = stripped.replace("=== LEVEL 1:", "").replace("#", "").strip()
            
        # Level 2 Anchor: Core Structural Mapping
        elif stripped.startswith("--- LEVEL 2:") or stripped.startswith("## "):
            if current_block_text:
                chunks.append((current_level_1, current_level_2, "\n".join(current_block_text)))
                current_block_text = []
            current_level_2 = stripped.replace("--- LEVEL 2:", "").replace("##", "").strip()
            
        # Level 3 Processing: Deep Technical Context accumulation
        else:
            current_block_text.append(line)

    # Flush remaining buffer
    if current_block_text:
        chunks.append((current_level_1, current_level_2, "\n".join(current_block_text)))

    return chunks

# --- 3. THE HIGH-GLORY RUNTIME EXECUTION ---
def submit_high_glory_ip(document_path: str, expert_name: str) -> list:
    """
    Cleans, chunk-groups, and maps RAG vectors matching the user hierarchy.
    """
    if not os.path.exists(document_path):
        with open(document_path, 'w') as f:
            f.write("=== LEVEL 1: PAIDAI WORLD Spatial Identity\n")
            f.write("Philosophy governing the localized interface.\n")
            f.write("--- LEVEL 2: Identity Architecture Rule\n")
            f.write("Enforcing database integrity parameters across nodes.\n")
            f.write("One Use, One Life, One Database\n")
            
    with open(document_path, 'r') as f:
        raw_data = f.read()
        
    structured_chunks = parse_hierarchical_structures(raw_data)
    indexed_nodes = []
    
    for i, (lvl1, lvl2, content_block) in enumerate(structured_chunks):
        token_count = calculate_tokens(content_block)
        
        chunk_metadata = {
            "source_expert": expert_name,
            "region": REGION_TAG,
            "glory_score_G": GLORY_SCORE_G,
            "agent_id": AGENT_ID,
            "token_size": token_count,
            "hierarchy_level_1": lvl1,
            "hierarchy_level_2": lvl2,
            "content_type": "Alberta_Hierarchical_Node",
        }

        indexed_nodes.append({
            "node_id": f"node_shard_{i:03d}",
            "content": content_block,
            "metadata": chunk_metadata,
            "vector_placeholder": f"LOCAL_VEC_REF_{i}"
        })

    print(f"\n--- Hierarchical IP Submission Successful for: {expert_name} ---")
    print(f"Total Structural Shards Created: {len(indexed_nodes)}")
    return indexed_nodes

if __name__ == "__main__":
    submission_data = submit_high_glory_ip("alberta_code_docs.txt", "Steven")