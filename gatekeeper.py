import json
import os
from dotenv import load_dotenv

# Force clear the parse errors from image_7083ac
load_dotenv('.env.local')

# Use the exact paths from your sidebar in image_70de42
TRACKER_PATH = "PAIDAI_WORLD/Admiral/94/pattern_tracker.json"
RESOURCE_PATH = "PAIDAI_WORLD/Admiral/64/resource_efficiency.json"
THRESHOLD = float(os.getenv('LOGIC_THRESHOLD', 0.7))

def sync_hardware(is_granted):
    """Physically writes the logic result to Folder 64"""
    with open(RESOURCE_PATH, 'r') as f:
        res = json.load(f)
    
    # 100% Logic = 1.0 Burn. Failure = 0.2 Burn + Savings Mode.
    res['burn_rate'] = 1.0 if is_granted else 0.2
    res['savings_mode'] = not is_granted
    
    with open(RESOURCE_PATH, 'w') as f:
        json.dump(res, f, indent=4)
    print(f"⚙️ Folder 64 Synchronized: Burn Rate @ {res['burn_rate']}")

def check_access():
    with open(TRACKER_PATH, 'r') as f:
        data = json.load(f)
    
    score = data.get('avg_logic_score', 0)
    
    if score >= THRESHOLD:
        print(f"✅ ADMIRAL VERIFIED. Score {score} > {THRESHOLD}")
        sync_hardware(True)
    else:
        print(f"❌ ACCESS DENIED. Score {score} < {THRESHOLD}")
        sync_hardware(False)

if __name__ == "__main__":
    check_access()