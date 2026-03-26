import motor.motor_asyncio
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_DETAILS = os.getenv("MONGO_URL", "mongodb://localhost:27017")

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)
database = client.gazesense

user_collection = database.get_collection("users")
session_collection = database.get_collection("sessions")
log_collection = database.get_collection("logs")
