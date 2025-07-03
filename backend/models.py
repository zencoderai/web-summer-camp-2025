from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from database import Base

class Talk(Base):
    __tablename__ = "talks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    speaker_name = Column(String(255), nullable=False)
    speaker_email = Column(String(255), nullable=False)
    speaker_bio = Column(Text)
    description = Column(Text, nullable=False)
    duration = Column(Integer, default=30)  # Duration in minutes
    level = Column(String(50), default="Intermediate")  # Beginner, Intermediate, Advanced
    track = Column(String(50), default="JavaScript")  # Conference track
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())