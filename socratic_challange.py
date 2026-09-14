import json
import random

# Paths
VAULT_PATH = "PAIDAI_WORLD/Admiral/70/heritage_vault.json"
ENGINE_PATH = "PAIDAI_WORLD/Admiral/93/socratic_engine.json"

def generate_challenge():
    # Load Vault and Engine
    with open(VAULT_PATH, 'r') as f:
        vault = json.load(f)
    with open(ENGINE_PATH, 'r') as f:
        engine = json.load(f)

    if not vault['education_stored']:
        print("📭 The vault is empty. Harvest more knowledge first!")
        return

    # Select a random topic and a random Socratic prompt
    topic = random.choice(vault['education_stored'])['topic']
    prompt = random.choice(engine['prompts'])

    print(f"\n🧠 MISSION CORE: COGNITIVE CHALLENGE")
    print(f"Topic: {topic}")
    print(f"Question: {prompt}\n")

if __name__ == "__main__":
    generate_challenge()