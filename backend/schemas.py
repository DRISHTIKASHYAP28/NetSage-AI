from pydantic import BaseModel
from typing import List, Optional


class Diagnosis(BaseModel):
    case_id: str
    root_cause: str
    confidence: float
    evidence: List[str]
    next_command: str
    suggested_fix: str


class Review(BaseModel):
    case_id: str
    reviewer: str
    status: str
    feedback: str
    final_diagnosis: Optional[str] = None