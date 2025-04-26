from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import google.generativeai as genai
import os
from dotenv import load_dotenv


# Load environment variables from .env file
load_dotenv()

app = FastAPI(title="Mentor-Mentee AI Matching Service")

# Set your Gemini API key as an environment variable: GEMINI_API_KEY
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY environment variable not set")

genai.configure(api_key=GEMINI_API_KEY)

class MentorProfile(BaseModel):
    id: str
    name: str
    qualifications: str

class MenteeProfile(BaseModel):
    id: str
    name: str
    interests: List[str]

class MatchRequest(BaseModel):
    mentee: MenteeProfile
    mentors: List[MentorProfile]

class MatchResult(BaseModel):
    mentor_id: str
    score: float
    reason: str

class MatchResponse(BaseModel):
    matches: List[MatchResult]

@app.post("/match", response_model=MatchResponse)
async def match_mentors(request: MatchRequest):
    mentee = request.mentee
    mentors = request.mentors

    # Prepare prompt for Gemini
    prompt = (
        f"You are an expert mentorship matchmaker. "
        f"Given a mentee with interests: {', '.join(mentee.interests)}, "
        f"and the following mentors with their qualifications, "
        f"rank the mentors from best to worst fit for the mentee. "
        f"For each mentor, provide a match score (0-1, 1=best) and a short reason.\n\n"
        f"Mentee Interests: {', '.join(mentee.interests)}\n\n"
        f"Mentors:\n"
    )
    for idx, mentor in enumerate(mentors):
        prompt += f"{idx+1}. {mentor.name}: {mentor.qualifications}\n"

    prompt += (
        "\nRespond in JSON as a list of objects with keys: mentor_id, score, reason. "
        "Example: [{\"mentor_id\": \"...\", \"score\": 0.92, \"reason\": \"...\"}, ...]"
    )

    # Call Gemini LLM
    model = genai.GenerativeModel("gemini-pro")
    response = model.generate_content(prompt)
    try:
        # Extract JSON from LLM response
        import json
        matches = json.loads(response.text)
        # Validate and sort
        matches = sorted(matches, key=lambda x: x["score"], reverse=True)
        return {"matches": matches}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LLM response parsing failed: {str(e)}")

@app.get("/")
def root():
    return {"status": "AI Matching Service running"}
