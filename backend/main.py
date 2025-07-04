from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List
import models
import schemas
from database import SessionLocal, engine
from prometheus_fastapi_instrumentator import Instrumentator
from prometheus_client import Counter, Histogram, Gauge
import time

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

# Initialize Prometheus metrics
instrumentator = Instrumentator()
instrumentator.instrument(app).expose(app)

# Custom metrics
talks_created_total = Counter('talks_created_total', 'Total number of talks created')
talks_deleted_total = Counter('talks_deleted_total', 'Total number of talks deleted')
talks_retrieved_total = Counter('talks_retrieved_total', 'Total number of talks retrieved')
database_operations_duration = Histogram('database_operations_duration_seconds', 'Time spent on database operations', ['operation'])
active_talks_gauge = Gauge('active_talks_total', 'Current number of talks in the database')

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

@app.get("/health")
def health_check(db: Session = Depends(get_db)):
    """Health check endpoint with database connectivity test"""
    try:
        # Test database connectivity
        db.execute(text("SELECT 1"))
        db_status = "healthy"
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"
    
    return {
        "status": "healthy" if db_status == "healthy" else "unhealthy",
        "database": db_status,
        "timestamp": time.time()
    }

@app.post("/api/talks", response_model=schemas.Talk)
def create_talk(talk: schemas.TalkCreate, db: Session = Depends(get_db)):
    start_time = time.time()
    try:
        db_talk = models.Talk(**talk.dict())
        db.add(db_talk)
        db.commit()
        db.refresh(db_talk)
        
        # Update metrics
        talks_created_total.inc()
        active_talks_gauge.set(db.query(models.Talk).count())
        
        return db_talk
    finally:
        database_operations_duration.labels(operation='create_talk').observe(time.time() - start_time)

@app.get("/api/talks", response_model=List[schemas.Talk])
def get_talks(db: Session = Depends(get_db)):
    start_time = time.time()
    try:
        talks = db.query(models.Talk).all()
        
        # Update metrics
        talks_retrieved_total.inc()
        active_talks_gauge.set(len(talks))
        
        return talks
    finally:
        database_operations_duration.labels(operation='get_talks').observe(time.time() - start_time)

@app.get("/api/talks/{talk_id}", response_model=schemas.Talk)
def get_talk(talk_id: int, db: Session = Depends(get_db)):
    start_time = time.time()
    try:
        talk = db.query(models.Talk).filter(models.Talk.id == talk_id).first()
        if talk is None:
            raise HTTPException(status_code=404, detail="Talk not found")
        
        # Update metrics
        talks_retrieved_total.inc()
        
        return talk
    finally:
        database_operations_duration.labels(operation='get_talk').observe(time.time() - start_time)

@app.delete("/api/talks/{talk_id}")
def delete_talk(talk_id: int, db: Session = Depends(get_db)):
    start_time = time.time()
    try:
        talk = db.query(models.Talk).filter(models.Talk.id == talk_id).first()
        if talk is None:
            raise HTTPException(status_code=404, detail="Talk not found")
        db.delete(talk)
        db.commit()
        
        # Update metrics
        talks_deleted_total.inc()
        active_talks_gauge.set(db.query(models.Talk).count())
        
        return {"message": "Talk deleted successfully"}
    finally:
        database_operations_duration.labels(operation='delete_talk').observe(time.time() - start_time)