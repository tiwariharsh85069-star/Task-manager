from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field
from bson import ObjectId


class OID(str):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not isinstance(v, ObjectId):
            if not ObjectId.is_valid(v):
                raise ValueError("Invalid ObjectId")
            return ObjectId(v)
        return v

    @classmethod
    def __get_pydantic_json_schema__(cls, schema, handler):
        schema.update({"type": "string", "format": "objectid"})
        return schema


class User(BaseModel):
    id: Optional[OID] = Field(None, alias="_id")
    email: str
    name: str
    role: str = "member"
    password_hash: str


class UserInResponse(BaseModel):
    id: OID = Field(..., alias="_id")
    email: str
    name: str
    role: str


class Project(BaseModel):
    id: Optional[OID] = Field(None, alias="_id")
    title: str
    description: str
    admin_id: OID
    members: List[OID] = Field(default_factory=list)


class Task(BaseModel):
    id: Optional[OID] = Field(None, alias="_id")
    title: str
    description: str
    project_id: OID
    assignee_id: Optional[OID] = None
    status: str = "pending"
    due_date: datetime
    created_at: datetime = Field(default_factory=datetime.utcnow)