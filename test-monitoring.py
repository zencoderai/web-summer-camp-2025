#!/usr/bin/env python3
"""
Simple script to test the monitoring setup by generating API requests
"""

import requests
import time
import random
import json

API_BASE_URL = "http://localhost:8000"

def create_sample_talk():
    """Create a sample talk"""
    talk_data = {
        "title": f"Sample Talk {random.randint(1, 1000)}",
        "speaker_name": f"Speaker {random.randint(1, 100)}",
        "speaker_email": f"speaker{random.randint(1, 100)}@example.com",
        "description": "This is a sample talk for testing monitoring",
        "track": random.choice(["JavaScript", "PHP", "Python/AI", "UX", "Founders", "Digital Change"]),
        "duration": random.choice([15, 30, 45, 60]),
        "level": random.choice(["Beginner", "Intermediate", "Advanced"])
    }
    
    try:
        response = requests.post(f"{API_BASE_URL}/api/talks", json=talk_data)
        if response.status_code == 200:
            print(f"✅ Created talk: {talk_data['title']}")
            return response.json()
        else:
            print(f"❌ Failed to create talk: {response.status_code}")
            return None
    except Exception as e:
        print(f"❌ Error creating talk: {e}")
        return None

def get_all_talks():
    """Get all talks"""
    try:
        response = requests.get(f"{API_BASE_URL}/api/talks")
        if response.status_code == 200:
            talks = response.json()
            print(f"📋 Retrieved {len(talks)} talks")
            return talks
        else:
            print(f"❌ Failed to get talks: {response.status_code}")
            return []
    except Exception as e:
        print(f"❌ Error getting talks: {e}")
        return []

def get_talk_by_id(talk_id):
    """Get a specific talk by ID"""
    try:
        response = requests.get(f"{API_BASE_URL}/api/talks/{talk_id}")
        if response.status_code == 200:
            print(f"📖 Retrieved talk ID {talk_id}")
            return response.json()
        else:
            print(f"❌ Failed to get talk {talk_id}: {response.status_code}")
            return None
    except Exception as e:
        print(f"❌ Error getting talk {talk_id}: {e}")
        return None

def delete_talk(talk_id):
    """Delete a talk"""
    try:
        response = requests.delete(f"{API_BASE_URL}/api/talks/{talk_id}")
        if response.status_code == 200:
            print(f"🗑️ Deleted talk ID {talk_id}")
            return True
        else:
            print(f"❌ Failed to delete talk {talk_id}: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error deleting talk {talk_id}: {e}")
        return False

def check_health():
    """Check API health"""
    try:
        response = requests.get(f"{API_BASE_URL}/health")
        if response.status_code == 200:
            health_data = response.json()
            print(f"💚 Health check: {health_data['status']}")
            return health_data
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return None
    except Exception as e:
        print(f"❌ Error checking health: {e}")
        return None

def check_metrics():
    """Check if metrics endpoint is accessible"""
    try:
        response = requests.get(f"{API_BASE_URL}/metrics")
        if response.status_code == 200:
            print("📊 Metrics endpoint is accessible")
            # Count the number of metrics
            metrics_text = response.text
            metric_lines = [line for line in metrics_text.split('\n') if line and not line.startswith('#')]
            print(f"📈 Found {len(metric_lines)} metric entries")
            return True
        else:
            print(f"❌ Metrics endpoint failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error checking metrics: {e}")
        return False

def main():
    print("🚀 Starting monitoring test...")
    print("=" * 50)
    
    # Check health first
    print("\n1. Health Check:")
    check_health()
    
    # Check metrics endpoint
    print("\n2. Metrics Check:")
    check_metrics()
    
    # Generate some API activity
    print("\n3. Generating API Activity:")
    
    created_talks = []
    
    # Create some talks
    for i in range(5):
        talk = create_sample_talk()
        if talk:
            created_talks.append(talk['id'])
        time.sleep(0.5)
    
    # Get all talks multiple times
    for i in range(3):
        get_all_talks()
        time.sleep(0.5)
    
    # Get individual talks
    for talk_id in created_talks[:3]:
        get_talk_by_id(talk_id)
        time.sleep(0.5)
    
    # Delete some talks
    for talk_id in created_talks[:2]:
        delete_talk(talk_id)
        time.sleep(0.5)
    
    print("\n4. Final Status:")
    remaining_talks = get_all_talks()
    check_health()
    
    print("\n" + "=" * 50)
    print("✅ Monitoring test completed!")
    print("\nNext steps:")
    print("1. Open Grafana at http://localhost:3001 (admin/admin)")
    print("2. Check the 'Conference API Dashboard'")
    print("3. Verify metrics are being collected")
    print("4. Run this script multiple times to generate more data")

if __name__ == "__main__":
    main()