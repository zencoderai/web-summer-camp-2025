#!/usr/bin/env python3
"""
Simple script to test the monitoring setup by generating some API traffic
"""

import requests
import time
import random
import json

API_BASE_URL = "http://localhost:8000"

def test_api_endpoints():
    """Test various API endpoints to generate metrics"""
    
    # Test health endpoint
    try:
        response = requests.get(f"{API_BASE_URL}/health")
        if response.status_code == 200:
            data = response.json()
            print(f"Health check: {response.status_code}, Talks count: {data.get('talks_count', 'N/A')}")
        else:
            print(f"Health check: {response.status_code}")
    except Exception as e:
        print(f"Health check failed: {e}")
    
    # Test metrics refresh endpoint
    try:
        response = requests.get(f"{API_BASE_URL}/metrics/refresh")
        if response.status_code == 200:
            data = response.json()
            print(f"Metrics refresh: {response.status_code}, Active talks: {data.get('active_talks_count', 'N/A')}")
        else:
            print(f"Metrics refresh: {response.status_code}")
    except Exception as e:
        print(f"Metrics refresh failed: {e}")
    
    # Test root endpoint
    try:
        response = requests.get(f"{API_BASE_URL}/")
        print(f"Root endpoint: {response.status_code}")
    except Exception as e:
        print(f"Root endpoint failed: {e}")
    
    # Test getting talks
    try:
        response = requests.get(f"{API_BASE_URL}/api/talks")
        print(f"Get talks: {response.status_code}, Count: {len(response.json()) if response.status_code == 200 else 'N/A'}")
    except Exception as e:
        print(f"Get talks failed: {e}")
    
    # Test creating a talk
    sample_talk = {
        "title": f"Test Talk {random.randint(1, 1000)}",
        "description": "This is a test talk for monitoring purposes",
        "speaker_name": f"Test Speaker {random.randint(1, 100)}",
        "speaker_email": f"test{random.randint(1, 100)}@example.com",
        "duration": random.choice([20, 30, 45, 60]),
        "level": random.choice(["Beginner", "Intermediate", "Advanced"]),
        "track": random.choice(["JavaScript", "PHP", "Python/AI", "UX", "Founders", "Digital Change"])
    }
    
    try:
        response = requests.post(f"{API_BASE_URL}/api/talks", json=sample_talk)
        print(f"Create talk: {response.status_code}")
        if response.status_code == 200:
            talk_id = response.json().get("id")
            
            # Test getting specific talk
            try:
                response = requests.get(f"{API_BASE_URL}/api/talks/{talk_id}")
                print(f"Get specific talk: {response.status_code}")
            except Exception as e:
                print(f"Get specific talk failed: {e}")
                
    except Exception as e:
        print(f"Create talk failed: {e}")

def generate_load(duration_minutes=5, requests_per_minute=10):
    """Generate continuous load for testing"""
    print(f"Generating load for {duration_minutes} minutes at {requests_per_minute} requests per minute...")
    
    end_time = time.time() + (duration_minutes * 60)
    request_interval = 60 / requests_per_minute
    
    while time.time() < end_time:
        test_api_endpoints()
        time.sleep(request_interval)
        
    print("Load generation completed!")

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == "load":
        # Generate load for testing
        duration = int(sys.argv[2]) if len(sys.argv) > 2 else 5
        rate = int(sys.argv[3]) if len(sys.argv) > 3 else 10
        generate_load(duration, rate)
    else:
        # Single test run
        print("Testing API endpoints...")
        test_api_endpoints()
        print("Test completed!")
        
        print("\nTo generate continuous load for testing, run:")
        print("python test_monitoring.py load [duration_minutes] [requests_per_minute]")
        print("Example: python test_monitoring.py load 10 20")