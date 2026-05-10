# from pydantic import BaseModel
# from typing import Optional


# class UserCreate(BaseModel):
#     email: str
#     name: str
#     password: str
#     role: Optional[str] = "member"


# class UserLogin(BaseModel):
#     email: str
#     password: str


# class ProjectCreate(BaseModel):
#     title: str
#     description: str


# class TaskCreate(BaseModel):
#     title: str
#     description: str
#     assignee_id: Optional[str] = None
#     due_date: str


# class TaskUpdate(BaseModel):
#     status: Optional[str] = None
#     assignee_id: Optional[str] = None
#     due_date: Optional[str] = None

from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: Optional[str] = "member"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class ProjectCreate(BaseModel):
    title: str
    description: Optional[str] = ""

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None

class MemberAdd(BaseModel):
    user_id: str

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = ""
    assignee_id: Optional[str] = None
    due_date: datetime
    status: Optional[str] = "pending"

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    assignee_id: Optional[str] = None
    due_date: Optional[datetime] = None
    status: Optional[str] = None