from fastapi import APIRouter, Depends
from database import db
from models import UserInResponse
from auth import verify_token

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me", response_model=UserInResponse)
async def get_current_user(token_data = Depends(verify_token)):
    user = await db.users.find_one({"email": token_data.email})
    return UserInResponse(**user)