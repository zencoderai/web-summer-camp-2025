#!/usr/bin/env python3
"""
Simple migration script to add the track column to existing talks table
"""
import os
from sqlalchemy import create_engine, text
from database import DATABASE_URL

def migrate_database():
    engine = create_engine(DATABASE_URL)
    
    with engine.connect() as connection:
        # Check if track column exists
        result = connection.execute(text("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='talks' AND column_name='track'
        """))
        
        if not result.fetchone():
            print("Adding track column to talks table...")
            connection.execute(text("""
                ALTER TABLE talks 
                ADD COLUMN track VARCHAR(50) DEFAULT 'JavaScript'
            """))
            connection.commit()
            print("Track column added successfully!")
        else:
            print("Track column already exists.")

if __name__ == "__main__":
    migrate_database()