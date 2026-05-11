# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from routes.auth import router as auth_router
# from routes.projects import router as projects_router
# from routes.tasks import router as tasks_router

# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# app.include_router(auth_router)
# app.include_router(projects_router)
# app.include_router(tasks_router)

import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.auth import router as auth_router
from routes.projects import router as projects_router
from routes.tasks import router as tasks_router

app = FastAPI(title="Task Manager API")

origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in origins if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Task Manager API is running"}

app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(projects_router, prefix="/projects", tags=["Projects"])
app.include_router(tasks_router, prefix="/tasks", tags=["Tasks"])