import traceback
from fastapi import FastAPI, Depends, HTTPException, status, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from datetime import timedelta

from models import UserCreate, UserLogin, Token, TokenData, CommunicationLog
from database import user_collection, log_collection
from auth import verify_password, get_password_hash, create_access_token, get_current_user, ACCESS_TOKEN_EXPIRE_MINUTES
from cv_module.ws_handler import handle_websocket_stream

app = FastAPI(title="GazeSense API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/signup", response_model=Token)
async def signup(user: UserCreate):
    existing_user = await user_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_dict = user.dict()
    user_dict["password_hash"] = get_password_hash(user_dict.pop("password"))
    
    await user_collection.insert_one(user_dict)
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/login", response_model=Token)
async def login(user: UserLogin):
    db_user = await user_collection.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user["email"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/profile")
async def read_users_me(current_user: TokenData = Depends(get_current_user)):
    user = await user_collection.find_one({"email": current_user.email})
    if user:
        user["_id"] = str(user["_id"])
        user.pop("password_hash", None)
        return user
    raise HTTPException(status_code=404, detail="User not found")

@app.post("/logs")
async def save_log(log: CommunicationLog, current_user: TokenData = Depends(get_current_user)):
    user = await user_collection.find_one({"email": current_user.email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    log_dict = log.dict()
    log_dict["user_id"] = str(user["_id"])
    await log_collection.insert_one(log_dict)
    return {"message": "Log saved"}

@app.get("/logs")
async def get_logs(current_user: TokenData = Depends(get_current_user)):
    user = await user_collection.find_one({"email": current_user.email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    cursor = log_collection.find({"user_id": str(user["_id"])}).sort("timestamp", -1).limit(50)
    logs = await cursor.to_list(length=50)
    for log in logs:
        log["_id"] = str(log["_id"])
    return logs

@app.websocket("/ws/detect")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    await handle_websocket_stream(websocket)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
