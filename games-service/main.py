from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from pydantic import BaseModel
import os

SECRET_KEY = "your-secret-key"  # Use env var in production!
ALGORITHM = "HS256"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

app = FastAPI(title="Games Service")

class ScoreRequest(BaseModel):
    total_score: int
    highest_score: int

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        return email
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid credentials")

@app.post("/games/score")
def save_score(score: ScoreRequest, user=Depends(get_current_user)):
    # Replace with DB logic to persist scores
    print(f"Score for {user}: total={score.total_score}, highest={score.highest_score}")
    return {"msg": f"Score saved for {user}", "total_score": score.total_score, "highest_score": score.highest_score}

@app.get("/")
def root():
    return {"status": "Games Service running"}
