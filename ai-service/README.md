# Mentor-Mentee AI Matching Microservice

## Setup

1. Install dependencies:
   pip install -r requirements.txt

2. Set your Gemini API key:
   export GEMINI_API_KEY=your-key-here

3. Run the service:
   uvicorn main:app --reload --port 8001

## API

POST /match

Request:
{
  "mentee": {
    "id": "mentee1",
    "name": "Alice",
    "interests": ["Data Science", "Machine Learning"]
  },
  "mentors": [
    {
      "id": "mentor1",
      "name": "Dr. Bob",
      "qualifications": "PhD in Machine Learning, 10 years in Data Science"
    }
  ]
}

Response:
{
  "matches": [
    {
      "mentor_id": "mentor1",
      "score": 0.95,
      "reason": "Strong background in Data Science and ML"
    }
  ]
}
