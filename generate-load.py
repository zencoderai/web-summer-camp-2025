#!/usr/bin/env python3
"""
Script to generate continuous load for monitoring demonstration
"""

import requests
import time
import random
import threading
import signal
import sys

API_BASE_URL = "http://localhost:8000"
running = True

def signal_handler(sig, frame):
    global running
    print('\n🛑 Stopping load generation...')
    running = False
    sys.exit(0)

signal.signal(signal.SIGINT, signal_handler)

def create_talk():
    """Create a random talk"""
    talk_data = {
        "title": f"Talk {random.randint(1, 10000)}",
        "speaker_name": f"Speaker {random.randint(1, 1000)}",
        "speaker_email": f"speaker{random.randint(1, 1000)}@example.com",
        "description": f"Description for talk {random.randint(1, 1000)}",
        "track": random.choice(["JavaScript", "PHP", "Python/AI", "UX", "Founders", "Digital Change"]),
        "duration": random.choice([15, 30, 45, 60]),
        "level": random.choice(["Beginner", "Intermediate", "Advanced"])
    }
    
    try:
        response = requests.post(f"{API_BASE_URL}/api/talks", json=talk_data, timeout=5)
        return response.status_code == 200
    except:
        return False

def get_talks():
    """Get all talks"""
    try:
        response = requests.get(f"{API_BASE_URL}/api/talks", timeout=5)
        return response.status_code == 200
    except:
        return False

def get_random_talk():
    """Get a random talk by ID"""
    talk_id = random.randint(1, 50)  # Assume we have talks with IDs 1-50
    try:
        response = requests.get(f"{API_BASE_URL}/api/talks/{talk_id}", timeout=5)
        return response.status_code in [200, 404]  # 404 is expected for non-existent talks
    except:
        return False

def delete_random_talk():
    """Delete a random talk"""
    talk_id = random.randint(1, 50)
    try:
        response = requests.delete(f"{API_BASE_URL}/api/talks/{talk_id}", timeout=5)
        return response.status_code in [200, 404]
    except:
        return False

def worker_thread(thread_id):
    """Worker thread that generates API requests"""
    print(f"🚀 Worker {thread_id} started")
    
    while running:
        try:
            # Random operation selection with weights
            operation = random.choices(
                ['create', 'get_all', 'get_one', 'delete'],
                weights=[20, 40, 30, 10],  # More reads than writes
                k=1
            )[0]
            
            if operation == 'create':
                create_talk()
            elif operation == 'get_all':
                get_talks()
            elif operation == 'get_one':
                get_random_talk()
            elif operation == 'delete':
                delete_random_talk()
            
            # Random delay between requests
            time.sleep(random.uniform(0.1, 2.0))
            
        except Exception as e:
            print(f"❌ Worker {thread_id} error: {e}")
            time.sleep(1)

def main():
    print("🔥 Starting load generation for monitoring...")
    print("📊 This will generate continuous API requests to populate Grafana dashboards")
    print("🛑 Press Ctrl+C to stop")
    print("=" * 60)
    
    # Start multiple worker threads
    num_workers = 3
    threads = []
    
    for i in range(num_workers):
        thread = threading.Thread(target=worker_thread, args=(i+1,))
        thread.daemon = True
        thread.start()
        threads.append(thread)
    
    try:
        # Monitor and report stats
        start_time = time.time()
        while running:
            elapsed = time.time() - start_time
            print(f"⏱️  Running for {elapsed:.0f} seconds - Check Grafana at http://localhost:3001")
            time.sleep(30)  # Report every 30 seconds
            
    except KeyboardInterrupt:
        print("\n🛑 Stopping load generation...")
        running = False

if __name__ == "__main__":
    main()