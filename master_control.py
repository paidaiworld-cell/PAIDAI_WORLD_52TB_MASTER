import subprocess
import os
import shutil
from datetime import datetime

def launch_mission():
    print("🚀 PHASE 1: STARTING SOCRATIC HARVEST...")
    # This triggers your brain script sitting in the PAIDAI folder
    subprocess.run(["python", "brain_complete.py"])


    print("\n🛡️ PHASE 2: TRIGGERING GATEKEEPER & HARDWARE SYNC...")
    # This triggers the gatekeeper to check logic and update Folder 64
    subprocess.run(["python", "gatekeeper.py"])

    print("\n📦 PHASE 3: SECURING LEGACY IN THE_BLACK_LAYER...")
    # Source: Your latest response. Destination: Your 52TB Master Archive.
    src = "PAIDAI_WORLD/Admiral/95/response_vault.json"
    dst_dir = "PAIDAI_WORLD_52TB_MASTER/THE_BLACK_LAYER/AI_LOUNGE_ARCHIVE"
    
    if not os.path.exists(dst_dir):
        os.makedirs(dst_dir)
        
    if os.path.exists(src):
        shutil.copy(src, os.path.join(dst_dir, "legacy_log.json"))
        print(f"✅ DATA ARCHIVED TO BLACK LAYER AT {datetime.now()}")
    else:
        print("⚠️ Warning: Source vault not found. Check Folder 95.")

if __name__ == "__main__":
    launch_mission()