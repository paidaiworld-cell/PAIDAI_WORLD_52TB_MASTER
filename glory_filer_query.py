import chromadb
# from langchain_google_genai import GoogleGenerativeAIEmbeddings

# --- 1. CONFIGURATION ---
# We assume the collection has already been created by high_glory_indexer.py

GLORY_THRESHOLD = 800  # Enforcing High-Glory standard (G >= 800)
DB_PATH = "./PAIDAI_vector_store" # Local Chroma DB path
COLLECTION_NAME = "paidai_knowledge"

# --- 2. THE GLORY-FILTERED QUERY FUNCTION ---

def retrieve_gold_standard_context(user_query: str):
    """
    Queries the RAG index, strictly filtering results to include only
    chunks tagged with a high Glory Score and the Western Canada region.
    """
    # 1. Initialize the Vector Store client
    client = chromadb.PersistentClient(path=DB_PATH)
    collection = client.get_collection(name=COLLECTION_NAME)
    
    # 2. DEFINE THE METADATA FILTER (The Core Logic)
    # ChromaDB uses MongoDB-like syntax for filtering on metadata fields.
    glory_filter = {
        # Filter 1: Only retrieve documents where glory_score_G is >= 800 (High-Glory)
        "$and": [
            {
                "glory_score_G": {"$gte": GLORY_THRESHOLD}
            },
            # Filter 2: Ensure the data is from the Western Canada Branch
            {
                "region": {"$eq": "Western_Canada_RAG_V1"}
            }
        ]
    }

    # 3. Perform the combined Semantic and Metadata Search
    # The ChromaDB query method handles both semantic search (query_texts) and metadata filtering (where)
    results = collection.query(
        query_texts=[user_query],
        n_results=5, # Retrieve up to 5 chunks
        where=glory_filter # Apply the mandatory Glory filter
    )
    
    # 4. Process and Display Results
    if results['documents'] and results['documents'][0]:
        print("\n--- GLORY-FILTERED RETRIEVAL SUCCESS ---")
        print(f"Query: {user_query}")
        print("---------------------------------------")
        
        # Display each retrieved chunk content and its Glory metadata
        for i, doc in enumerate(results['documents'][0]):
            metadata = results['metadatas'][0][i]
            score = metadata.get('glory_score_G', 'N/A')
            
            # Display only the first 50 characters of content for conciseness (G2)
            print(f"[{i+1}] G={score}: {doc[:50]}...")
            print(f"      Source: {metadata.get('agent_id')[:8]}... (Token Size: {metadata.get('token_size')})")
        
        return results
    else:
        print("\n--- RETRIEVAL FAILED: NO HIGH-GLORY MATCHES FOUND ---")
        print(f"No documents matched the criteria (G >= {GLORY_THRESHOLD} in Western Canada).")
        return None

# --- EXAMPLE EXECUTION ---
if __name__ == "__main__":
    # High-Glory RAG Question (Testing G3 Specificity: "Alberta code")
    test_query = "What is the token-efficient initialization protocol for the vector store?"
    
    # Run the query function
    retrieve_gold_standard_context(test_query)