import json
import datetime

# Absolute Paths for Windows Environment
# Simplified Paths for your Unified Structure
VAULT_PATH = "PAIDAI_WORLD/Admiral/70/heritage_vault.json"
ENGINE_PATH = "PAIDAI_WORLD/Admiral/93/socratic_engine.json"
TRACKER_PATH = "PAIDAI_WORLD/Admiral/94/pattern_tracker.json"
RESPONSE_PATH = "PAIDAI_WORLD/Admiral/95/response_vault.json"

def run_session():
    # 1. Challenge
    with open(VAULT_PATH, 'r') as f: vault = json.load(f)
    with open(ENGINE_PATH, 'r') as f: engine = json.load(f)
    
    topic = vault['education_stored'][-1]['topic'] # Get the last harvested item
    prompt = engine['prompts'][0] # "Why?"
    
    print(f"\n🧠 TOPIC: {topic}")
    answer = input(f"Socratic Question ({prompt}): ")

    # 2. Logic Scoring (Simulated: longer answer = higher score)
    score = min(len(answer) / 100, 1.0) 

    # 3. Log the Response
    with open(RESPONSE_PATH, 'r') as f: r_vault = json.load(f)
    r_vault['logs'].append({
        "timestamp": str(datetime.datetime.now()),
        "topic": topic,
        "answer": answer,
        "logic_score": score
    })
    with open(RESPONSE_PATH, 'w') as f: json.dump(r_vault, f, indent=4)

    # 4. Update Tracker
    with open(TRACKER_PATH, 'r') as f: tracker = json.load(f)
    tracker['total_responses'] += 1
    tracker['avg_logic_score'] = (tracker['avg_logic_score'] + score) / 2
    with open(TRACKER_PATH, 'w') as f: json.dump(tracker, f, indent=4)

    print(f"✅ LOGGED. Logic Score: {score*100}%")

if __name__ == "__main__":
    run_session()