from logging import basicConfig

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from chris.app.routes import (
    archive_routes,
    art_routes,
    blog_routes,
    feed_routes,
    info_routes,
    media_routes,
    outdoor_routes,
    professional_routes,
    project_routes,
    recipe_routes,
    surveys_routes,
)

basicConfig(level="INFO")

ALLOWED_ORIGINS = [
    "http://localhost:3001",
    "https://www.chrisgregory.me",
    "https://chrisgregory.me",
]

app = FastAPI()

app.include_router(archive_routes.router)
app.include_router(art_routes.router)
app.include_router(blog_routes.router)
app.include_router(feed_routes.router)
app.include_router(info_routes.router)
app.include_router(media_routes.router)
app.include_router(outdoor_routes.router)
app.include_router(professional_routes.router)
app.include_router(project_routes.router)
app.include_router(recipe_routes.router)
app.include_router(surveys_routes.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
