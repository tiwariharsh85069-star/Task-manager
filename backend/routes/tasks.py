# from fastapi import APIRouter, Depends, HTTPException, status
# from bson import ObjectId
# from database import db
# from models import Task, Project, User
# from schemas import TaskCreate, TaskUpdate
# from routes.auth import verify_token
# from datetime import datetime
# from typing import List

# router = APIRouter(prefix="/tasks", tags=["tasks"])

# @router.get("/", response_model=List[Task])
# async def list_tasks(project_id: str, token_data = Depends(verify_token)):
#     user = await db.users.find_one({"email": token_data.email})
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")
#     user_obj = User(**user)

#     try:
#         oid = ObjectId(project_id)
#     except Exception:
#         raise HTTPException(status_code=400, detail="Invalid project_id")

#     project = await db.projects.find_one({"_id": oid})
#     if not project or (user_obj.role != "admin" and user_obj.id not in project.get("members", [])):
#         raise HTTPException(status_code=403, detail="Access denied to project")

#     cursor = db.tasks.find({"project_id": oid})
#     tasks = await cursor.to_list(length=100)
#     return tasks

# @router.post("/{project_id}", response_model=Task, status_code=status.HTTP_201_CREATED)
# async def create_task(
#     project_id: str,
#     task_in: TaskCreate,
#     token_data = Depends(verify_token),
# ):
#     user = await db.users.find_one({"email": token_data.email})
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")
#     user_obj = User(**user)

#     try:
#         oid = ObjectId(project_id)
#     except Exception:
#         raise HTTPException(status_code=400, detail="Invalid project_id")

#     project = await db.projects.find_one({"_id": oid})
#     if not project or (user_obj.role != "admin" and user_obj.id not in project.get("members", [])):
#         raise HTTPException(status_code=403, detail="Access denied to project")

#     task_dict = task_in.dict()
#     task_dict["project_id"] = oid
#     if task_in.assignee_id:
#         try:
#             task_dict["assignee_id"] = ObjectId(task_in.assignee_id)
#         except Exception:
#             pass
#     task_dict["due_date"] = datetime.fromisoformat(task_in.due_date)

#     result = await db.tasks.insert_one(task_dict)
#     new_task = await db.tasks.find_one({"_id": result.inserted_id})
#     return Task(**new_task)

# @router.patch("/{task_id}", response_model=Task)
# async def update_task(
#     task_id: str,
#     task_update: TaskUpdate,
#     token_data = Depends(verify_token),
# ):
#     user = await db.users.find_one({"email": token_data.email})
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")
#     user_obj = User(**user)

#     try:
#         oid = ObjectId(task_id)
#     except Exception:
#         raise HTTPException(status_code=400, detail="Invalid task_id")

#     task = await db.tasks.find_one({"_id": oid})
#     if not task:
#         raise HTTPException(status_code=404, detail="Task not found")

#     project = await db.projects.find_one({"_id": ObjectId(task["project_id"])})
#     if not project or (user_obj.role != "admin" and user_obj.id not in project.get("members", [])):
#         raise HTTPException(status_code=403, detail="Access denied to project")

#     update_dict = {}
#     if task_update.status:
#         update_dict["status"] = task_update.status
#     if task_update.assignee_id:
#         try:
#             update_dict["assignee_id"] = ObjectId(task_update.assignee_id)
#         except Exception:
#             pass
#     if task_update.due_date:
#         update_dict["due_date"] = datetime.fromisoformat(task_update.due_date)

#     await db.tasks.update_one({"_id": oid}, {"$set": update_dict})
#     updated = await db.tasks.find_one({"_id": oid})
#     return Task(**updated)

from fastapi import APIRouter, HTTPException, Depends, Query
from bson import ObjectId
from datetime import datetime
from database import db
from schemas import TaskCreate, TaskUpdate
from routes.auth import verify_token

router = APIRouter(prefix="/tasks", tags=["tasks"])

@router.post("/{project_id}")
async def create_task(project_id: str, payload: TaskCreate, token=Depends(verify_token)):
    project = await db.projects.find_one({"_id": ObjectId(project_id)})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    doc = {
        "project_id": project_id,
        "title": payload.title,
        "description": payload.description,
        "assignee_id": payload.assignee_id,
        "due_date": payload.due_date,
        "status": payload.status or "pending",
        "created_by": token.email,
        "created_at": datetime.utcnow(),
    }
    result = await db.tasks.insert_one(doc)
    created = await db.tasks.find_one({"_id": result.inserted_id})
    return {
        "id": str(created["_id"]),
        "_id": str(created["_id"]),
        "project_id": created["project_id"],
        "title": created["title"],
        "description": created.get("description", ""),
        "assignee_id": created.get("assignee_id"),
        "due_date": created.get("due_date"),
        "status": created.get("status", "pending"),
        "created_by": created.get("created_by"),
    }

@router.get("")
async def list_tasks(project_id: str = Query(...), token=Depends(verify_token)):
    items = []
    async for t in db.tasks.find({"project_id": project_id}):
        items.append({
            "id": str(t["_id"]),
            "_id": str(t["_id"]),
            "project_id": t["project_id"],
            "title": t["title"],
            "description": t.get("description", ""),
            "assignee_id": t.get("assignee_id"),
            "due_date": t.get("due_date"),
            "status": t.get("status", "pending"),
            "created_by": t.get("created_by"),
        })
    return items

@router.patch("/{task_id}")
async def update_task(task_id: str, payload: TaskUpdate, token=Depends(verify_token)):
    update = {k: v for k, v in payload.dict().items() if v is not None}
    if not update:
        return {"message": "No changes"}
    res = await db.tasks.update_one({"_id": ObjectId(task_id)}, {"$set": update})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"message": "Task updated"}

@router.delete("/{task_id}")
async def delete_task(task_id: str, token=Depends(verify_token)):
    res = await db.tasks.delete_one({"_id": ObjectId(task_id)})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"message": "Task deleted"}