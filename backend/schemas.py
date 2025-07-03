from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class TalkBase(BaseModel):
    title: str
    speaker_name: str
    speaker_email: EmailStr
    speaker_bio: Optional[str] = None
    description: str
    duration: Optional[int] = 30
    level: Optional[str] = "Intermediate"
    track: Optional[str] = "JavaScript"

class TalkCreate(TalkBase):
    pass

class Talk(TalkBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True