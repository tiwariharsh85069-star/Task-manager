# from fastapi import APIRouter, Depends, HTTPException, status
# from bson import ObjectId
# from database import db
# from models import Project, User
# from schemas import ProjectCreate
# from auth import verify_token, require_admin
# from typing import List

# router = APIRouter(prefix="/projects", tags=["projects"])

# @router.get("/", response_model=List[Project])
# async def list_projects(token_data = Depends(verify_token)):
#     user = await db.users.find_one({"email": token_data.email})
#     from fastapi import APIRouter, Depends, HTTPException, status
# from bson import ObjectId
# from database import db
# from models import Project, User
# from schemas import ProjectCreate
# from routes.auth import verify_token, require_admin
# from typing import List

# router = APIRouter(prefix="/projects", tags=["projects"])

# @router.get("/", response_model=List[Project])
# async def list_projects(token_data = Depends(verify_token)):
#     user = await db.users.find_one({"email": token_data.email})
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")
#     user_obj = User(**user)

#     if user_obj.role == "admin":
#         cursor = db.projects.find()
#     else:
#         cursor = db.projects.find({"members": user_obj.id})

#     projects = await cursor.to_list(length=100)
#     return projects

# @router.post("/", response_model=Project, status_code=status.HTTP_201_CREATED)
# async def create_project(
#     project_in: ProjectCreate,
#     token_data = Depends(require_admin),
# ):
#     user = await db.users.find_one({"email": token_data.email})
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")
#     user_obj = User(**user)

#     project_dict = project_in.dict()
#     project_dict["admin_id"] = user_obj.id
#     project_dict["members"] = [user_obj.id]

#     result = await db.projects.insert_one(project_dict)
#     new_project = await db.projects.find_one({"_id": result.inserted_id})
#     return Project(**new_project)user_obj = User(**user)

#     if user_obj.role == "admin":
#         cursor = db.projects.find()
#     else:
#         cursor = db.projects.find({"members": user_obj.id})

#     projects = await cursor.to_list(length=100)
#     return projects

# @router.post("/", response_model=Project, status_code=status.HTTP_201_CREATED)
# async def create_project(
#     project_in: ProjectCreate,
#     token_data = Depends(require_admin),
# ):
#     user = await db.users.find_one({"email": token_data.email})
#     user_obj = User(**user)

#     project_dict = project_in.dict()
#     project_dict["admin_id"] = user_obj.id
#     project_dict["members"] = [user_obj.id]

#     result = await db.projects.insert_one(project_dict)
#     new_project = await db.projects.find_one({"_id": result.inserted_id})
#     return Project(**new_project)

from fastapi import APIRouter, HTTPException, Depends
from bson import ObjectId
from datetime import datetime
from database import db
from schemas import ProjectCreate, ProjectUpdate, MemberAdd
from routes.auth import verify_token

router = APIRouter(prefix="/projects", tags=["projects"])

def doc_id(value):
    return str(value["_id"])

@router.post("")
async def create_project(payload: ProjectCreate, token=Depends(verify_token)):
    doc = {
        "title": payload.title,
        "description": payload.description,
        "created_by": token.email,
        "members": [token.email],
        "created_at": datetime.utcnow(),
    }
    result = await db.projects.insert_one(doc)
    created = await db.projects.find_one({"_id": result.inserted_id})
    return {
        "id": str(created["_id"]),
        "title": created["title"],
        "description": created["description"],
        "created_by": created["created_by"],
        "members": created["members"],
        "created_at": created["created_at"],
    }

@router.get("")
async def list_projects(token=Depends(verify_token)):
    items = []
    async for p in db.projects.find({"members": token.email}):
        items.append({
            "id": str(p["_id"]),
            "_id": str(p["_id"]),
            "title": p["title"],
            "description": p.get("description", ""),
            "created_by": p.get("created_by"),
            "members": p.get("members", []),
            "created_at": p.get("created_at"),
        })
    return items

@router.get("/{project_id}")
async def get_project(project_id: str, token=Depends(verify_token)):
    p = await db.projects.find_one({"_id": ObjectId(project_id)})
    if not p:
        raise HTTPException(status_code=404, detail="Project not found")
    return {
        "id": str(p["_id"]),
        "_id": str(p["_id"]),
        "title": p["title"],
        "description": p.get("description", ""),
        "created_by": p.get("created_by"),
        "members": p.get("members", []),
        "created_at": p.get("created_at"),
    }

@router.patch("/{project_id}")
async def update_project(project_id: str, payload: ProjectUpdate, token=Depends(verify_token)):
    update = {k: v for k, v in payload.dict().items() if v is not None}
    if not update:
        return {"message": "No changes"}
    res = await db.projects.update_one({"_id": ObjectId(project_id)}, {"$set": update})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"message": "Project updated"}

@router.post("/{project_id}/members")
async def add_member(project_id: str, payload: MemberAdd, token=Depends(verify_token)):
    res = await db.projects.update_one(
        {"_id": ObjectId(project_id)},
        {"$addToSet": {"members": payload.user_id}}
    )
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"message": "Member added"}