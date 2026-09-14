import json
import os

# Paths
VAULT_PATH = "PAIDAI_WORLD/Admiral/70/heritage_vault.json"
LIST_PATH = "PAIDAI_WORLD/Admiral/96/reading_list.json"

def harvest():
    # Load the Reading List
    with open(LIST_PATH, 'r') as f:
        reading_list = json.load(f)

    if reading_list['pending']:
        # "Harvest" the first item
        item = reading_list['pending'].pop(0)
        reading_list['completed'].append(item)
        
        # Save updated Reading List
        with open(LIST_PATH, 'w') as f:
            json.dump(reading_list, f, indent=4)

        # Move Knowledge into the Heritage Vault
        with open(VAULT_PATH, 'r') as f:
            vault = json.load(f)
        
        vault['education_stored'].append({
            "topic": item,
            "status": "Distilled",
            "access_tier": "All_Gens"
        })

        with open(VAULT_PATH, 'w') as f:
            json.dump(vault, f, indent=4)

        print(f"✅ HARVEST SUCCESS: '{item}' has been archived in the Heritage Vault.")
    else:
        print("📭 Nothing left to harvest, Admiral.")

if __name__ == "__main__":
    harvest()