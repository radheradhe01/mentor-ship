from fastapi import FastAPI, HTTPException, Query, Depends, status, APIRouter
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware  # Add CORS Middleware
from sqlalchemy import create_engine, Column, String, Integer, Boolean, Text, Table, Enum as SQLAlchemyEnum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.exc import IntegrityError
import os
from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta
from pydantic import BaseModel, EmailStr
from typing import List, Optional
import httpx
import uuid
import enum
import requests
from requests.auth import HTTPBasicAuth

# --- Configuration ---
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://mentorship:mentorshippass@localhost:5432/mentorshipdb")
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
OPENVIDU_URL = os.getenv("OPENVIDU_URL", "http://localhost:4443")
OPENVIDU_SECRET = os.getenv("OPENVIDU_SECRET", "MY_SECRET")

# --- Database Setup ---
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# --- Security ---
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login/")

# --- SQLAlchemy Model ---
class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    avatar_url = Column(String, nullable=True)
    user_type = Column(String, nullable=False)
    password_hash = Column(String, nullable=False)

# --- New Enum for Interest Category ---
class InterestCategoryEnum(enum.Enum):
    technology = "technology"
    business = "business"
    creative = "creative"
    academic = "academic"
    personal = "personal"

# --- SQLAlchemy Models ---
class Interest(Base):
    __tablename__ = "interests"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    icon = Column(String, nullable=True)
    category = Column(SQLAlchemyEnum(InterestCategoryEnum), nullable=False)

# --- Pydantic Models ---
class UserBase(BaseModel):
    email: EmailStr
    name: str
    avatar_url: Optional[str] = None
    user_type: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: str

class TokenData(BaseModel):
    email: Optional[str] = None
    user_type: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str

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

class InterestResponse(BaseModel):
    id: int
    name: str
    icon: Optional[str] = None
    category: InterestCategoryEnum

    class Config:
        orm_mode = True
        use_enum_values = True

class SessionRequest(BaseModel):
    session_name: str

class TokenResponseModel(BaseModel):
    token: str

# --- FastAPI App ---
app = FastAPI(title="Mentorship Platform Backend")

# --- Add CORS Middleware ---
# Allow requests from your frontend development server
origins = [
    "http://localhost:5173",  # Vite default port
    "http://127.0.0.1:5173",
    # Add other origins if needed (e.g., your deployed frontend URL)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# --- Database Dependency ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Utility Functions ---
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# --- Authentication Dependency ---
async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> UserResponse:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        user_type: str = payload.get("user_type")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email, user_type=user_type)
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.email == token_data.email).first()
    if user is None:
        raise credentials_exception
    return UserResponse(
        id=str(user.id),
        email=user.email,
        name=user.name,
        avatar_url=user.avatar_url,
        user_type=user.user_type
    )

# --- Dummy DB fetch functions ---
def get_mentee_profile_from_db(mentee_id: str, db: Session) -> Optional[MenteeProfile]:
    return MenteeProfile(
        id=mentee_id,
        name="Alice",
        interests=["Data Science", "Machine Learning"]
    )

def get_mentors_from_db(db: Session) -> List[MentorProfile]:
    return [
        MentorProfile(
            id="mentor1",
            name="Dr. Bob",
            qualifications="PhD in Machine Learning, 10 years in Data Science"
        ),
        MentorProfile(
            id="mentor2",
            name="Dr. Carol",
            qualifications="MS in Data Science, 5 years in Analytics"
        )
    ]

# --- API Endpoints ---
@app.post("/login/", response_model=Token, tags=["Authentication"])
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()

    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "user_type": user.user_type},
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/users/", response_model=UserResponse, status_code=status.HTTP_201_CREATED, tags=["Users"])
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = get_password_hash(user.password)
    user_id = str(uuid.uuid4())

    db_user = User(
        id=user_id,
        email=user.email,
        name=user.name,
        avatar_url=user.avatar_url,
        user_type=user.user_type,
        password_hash=hashed_password
    )
    try:
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return UserResponse(
            id=str(db_user.id),
            email=db_user.email,
            name=db_user.name,
            avatar_url=db_user.avatar_url,
            user_type=db_user.user_type
        )
    except IntegrityError as e:
        db.rollback()
        print(f"Database Integrity Error: {e}")
        raise HTTPException(status_code=400, detail=f"Could not create user. Database error.")
    except Exception as e:
        db.rollback()
        print(f"An unexpected error occurred: {e}")
        raise HTTPException(status_code=500, detail="An internal server error occurred.")

@app.get("/users/me/", response_model=UserResponse, tags=["Users"])
async def read_users_me(current_user: UserResponse = Depends(get_current_user)):
    return current_user

@app.post("/mentors/", tags=["Mentors"])
def create_mentor(mentor_data: MentorProfile, current_user: UserResponse = Depends(get_current_user), db: Session = Depends(get_db)):
    print(f"Mentor {mentor_data.name} creation requested by {current_user.email}")
    return {"msg": f"Mentor profile creation for {mentor_data.name} needs implementation."}

@app.post("/mentees/", tags=["Mentees"])
def create_mentee(mentee_data: MenteeProfile, current_user: UserResponse = Depends(get_current_user), db: Session = Depends(get_db)):
    print(f"Mentee {mentee_data.name} creation requested by {current_user.email}")
    return {"msg": f"Mentee profile creation for {mentee_data.name} needs implementation."}

@app.get("/recommendations/", response_model=MatchResponse, tags=["AI Matching"])
async def get_recommendations(
    mentee_id: str = Query(...),
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.id != mentee_id and current_user.user_type != 'admin':
         raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to get recommendations for this mentee")

    mentee = get_mentee_profile_from_db(mentee_id, db)
    if not mentee:
        raise HTTPException(status_code=404, detail="Mentee profile not found")

    mentors = get_mentors_from_db(db)
    if not mentors:
        return MatchResponse(matches=[])

    ai_service_url = os.getenv("AI_SERVICE_URL", "http://ai-service:8000/match")

    async with httpx.AsyncClient() as client:
        try:
            match_request_data = MatchRequest(mentee=mentee, mentors=mentors)
            resp = await client.post(
                ai_service_url,
                json=match_request_data.dict(),
                timeout=30
            )
            resp.raise_for_status()
            return resp.json()
        except httpx.RequestError as exc:
             print(f"Error requesting AI service: {exc}")
             raise HTTPException(status_code=503, detail=f"AI service unavailable: {exc}")
        except httpx.HTTPStatusError as exc:
             print(f"AI service returned error: {exc.response.status_code} - {exc.response.text}")
             raise HTTPException(status_code=exc.response.status_code, detail=f"AI service error: {exc.response.text}")
        except Exception as e:
            print(f"Unexpected error during AI service call: {e}")
            raise HTTPException(status_code=500, detail=f"Internal error processing recommendations: {str(e)}")

@app.get("/users/", response_model=List[UserResponse], tags=["Users"])
def read_users(skip: int = 0, limit: int = 10, db: Session = Depends(get_db), current_user: UserResponse = Depends(get_current_user)):
    users = db.query(User).offset(skip).limit(limit).all()
    return [UserResponse(id=str(u.id), email=u.email, name=u.name, avatar_url=u.avatar_url, user_type=u.user_type) for u in users]

@app.get("/interests/", response_model=List[InterestResponse], tags=["Interests"])
def read_interests(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Retrieve a list of interests.
    """
    try:
        interests = db.query(Interest).offset(skip).limit(limit).all()
        return interests
    except Exception as e:
        print(f"Error fetching interests: {e}")
        raise HTTPException(status_code=500, detail="Could not fetch interests")

@app.post("/sessions/get-token", response_model=TokenResponseModel, tags=["Video Sessions"])
async def get_openvidu_token(session_request: SessionRequest, current_user: UserResponse = Depends(get_current_user), db: Session = Depends(get_db)):
    session_name = session_request.session_name
    user_email = current_user.email

    print(f"--- OpenVidu Token Request ---")
    print(f"Session Name: {session_name}")
    print(f"User: {user_email}")
    print(f"OpenVidu URL: {OPENVIDU_URL}")
    print(f"Using Secret: {'*' * len(OPENVIDU_SECRET)}")  # Avoid logging the actual secret

    session_url = f"{OPENVIDU_URL}/openvidu/api/sessions"
    connection_base_url = f"{OPENVIDU_URL}/openvidu/api/sessions"  # Base URL for connection endpoint
    headers = {"Content-Type": "application/json"}
    auth = HTTPBasicAuth("OPENVIDUAPP", OPENVIDU_SECRET)
    session_id = None  # Initialize session_id

    try:
        # 1. Create or Get Session
        print(f"Attempting to POST to {session_url} to create/get session '{session_name}'")
        session_payload = {"customSessionId": session_name}
        response = requests.post(session_url, json=session_payload, headers=headers, auth=auth, verify=False, timeout=10)  # Added timeout

        print(f"Create/Get Session Response Status: {response.status_code}")

        if response.status_code == 409:
            print(f"Session '{session_name}' already exists.")
            session_id = session_name
        elif response.status_code == 200:
            session_data = response.json()
            session_id = session_data.get("id")
            print(f"Session '{session_name}' created successfully with ID: {session_id}")
        else:
            print(f"ERROR creating/getting session: {response.status_code} - {response.text}")
            raise HTTPException(status_code=500, detail=f"Error creating/getting OpenVidu session (Status: {response.status_code}): {response.text}")

        if not session_id:
            print("ERROR: Could not determine OpenVidu session ID after create/get attempt.")
            raise HTTPException(status_code=500, detail="Could not determine OpenVidu session ID.")

        # 2. Create Connection (Token)
        connection_url = f"{connection_base_url}/{session_id}/connection"
        connection_payload = {
            "role": "PUBLISHER",
            "data": f'{{"serverData": "{current_user.name or current_user.email}"}}'
        }
        print(f"Attempting to POST to {connection_url} to create connection")

        token_response = requests.post(connection_url, json=connection_payload, headers=headers, auth=auth, verify=False, timeout=10)  # Added timeout

        print(f"Create Connection Response Status: {token_response.status_code}")
        token_response.raise_for_status()  # Raise HTTPError for bad responses (4xx or 5xx)

        token_data = token_response.json()
        token = token_data.get("token")

        if not token:
            print("ERROR: Token not found in OpenVidu response.")
            raise HTTPException(status_code=500, detail="Failed to get OpenVidu token from response.")

        print(f"Token generated successfully for session: {session_name}")
        print(f"--- End OpenVidu Token Request ---")
        return TokenResponseModel(token=token)

    except requests.exceptions.Timeout:
        print(f"ERROR: Timeout connecting to OpenVidu server at {OPENVIDU_URL}")
        raise HTTPException(status_code=504, detail=f"Timeout connecting to OpenVidu server.")
    except requests.exceptions.ConnectionError as e:
        print(f"ERROR: Connection error connecting to OpenVidu server at {OPENVIDU_URL}: {e}")
        raise HTTPException(status_code=503, detail=f"Could not connect to OpenVidu server: {e}")
    except requests.exceptions.RequestException as e:  # Catch other request errors
        print(f"ERROR: RequestException during OpenVidu communication: {e}")
        if e.response is not None:
            print(f"Underlying HTTP Error: {e.response.status_code} - {e.response.text}")
            raise HTTPException(status_code=e.response.status_code, detail=f"OpenVidu API error: {e.response.text}")
        else:
            raise HTTPException(status_code=503, detail=f"Error communicating with OpenVidu: {e}")
    except HTTPException as e:  # Re-raise HTTPExceptions
        print(f"Re-raising HTTPException: {e.status_code} - {e.detail}")
        raise e
    except Exception as e:  # Catch any other unexpected errors
        print(f"ERROR: Unexpected error generating token: {type(e).__name__} - {e}")
        import traceback
        traceback.print_exc()  # Print full traceback for unexpected errors
        raise HTTPException(status_code=500, detail=f"Internal server error generating token: {str(e)}")

@app.get("/", tags=["Root"])
def root():
    return {"status": "Backend running"}

# --- OpenVidu Router ---
class SessionRequest(BaseModel):
    customSessionId: str

class TokenRequest(BaseModel):
    sessionId: str

router = APIRouter()

@router.post("/api/sessions")
def create_session(req: SessionRequest):
    response = requests.post(
        f"{OPENVIDU_URL}/openvidu/api/sessions",
        auth=("OPENVIDUAPP", OPENVIDU_SECRET),
        json={"customSessionId": req.customSessionId},
        verify=False
    )
    if response.status_code not in (200, 409):
        raise HTTPException(status_code=500, detail=response.text)
    session_id = response.json().get("id", req.customSessionId)
    return {"sessionId": session_id}

@router.post("/api/sessions/{sessionId}/connections")
def create_connection(sessionId: str):
    response = requests.post(
        f"{OPENVIDU_URL}/openvidu/api/sessions/{sessionId}/connection",
        auth=("OPENVIDUAPP", OPENVIDU_SECRET),
        json={},
        verify=False
    )
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail=response.text)
    return {"token": response.json()["token"]}

app.include_router(router)
