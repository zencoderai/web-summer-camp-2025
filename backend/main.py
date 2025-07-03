from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List
import models
import schemas
from database import SessionLocal, engine

# Create database tables
models.Base.metadata.create_all(bind=engine)

# Run migration to add track column if it doesn't exist
def migrate_database():
    with engine.connect() as connection:
        try:
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
        except Exception as e:
            print(f"Migration error (might be expected): {e}")

# Run migration
migrate_database()

app = FastAPI(title="Conference API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Conference API is running!"}

@app.post("/api/talks", response_model=schemas.Talk)
def create_talk(talk: schemas.TalkCreate, db: Session = Depends(get_db)):
    db_talk = models.Talk(**talk.dict())
    db.add(db_talk)
    db.commit()
    db.refresh(db_talk)
    return db_talk

@app.get("/api/talks", response_model=List[schemas.Talk])
def get_talks(db: Session = Depends(get_db)):
    talks = db.query(models.Talk).all()
    return talks

@app.get("/api/talks/{talk_id}", response_model=schemas.Talk)
def get_talk(talk_id: int, db: Session = Depends(get_db)):
    talk = db.query(models.Talk).filter(models.Talk.id == talk_id).first()
    if talk is None:
        raise HTTPException(status_code=404, detail="Talk not found")
    return talk

@app.delete("/api/talks/{talk_id}")
def delete_talk(talk_id: int, db: Session = Depends(get_db)):
    talk = db.query(models.Talk).filter(models.Talk.id == talk_id).first()
    if talk is None:
        raise HTTPException(status_code=404, detail="Talk not found")
    db.delete(talk)
    db.commit()
    return {"message": "Talk deleted successfully"}