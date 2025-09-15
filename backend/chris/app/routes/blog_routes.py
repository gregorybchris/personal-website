import logging
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path

import frontmatter
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel, TypeAdapter

from chris.app import logging_utilities

logger = logging.getLogger(__name__)

router = APIRouter()


class BlogPost(BaseModel):
    title: str
    slug: str
    topics: list[str]
    date: datetime
    content: str
    archived: bool


class BlogPostMetadata(BaseModel):
    title: str
    slug: str
    topics: list[str]
    date: datetime
    archived: bool


def load_post(filepath: Path) -> BlogPost:
    fm_post = frontmatter.load(filepath)
    fm_post_dict = fm_post.to_dict()
    return BlogPost(**fm_post_dict)


def load_posts() -> list[BlogPost]:
    posts_dirpath = Path(__file__).parent.parent.parent / "datasets" / "data" / "blog" / "posts"
    posts: list[BlogPost] = []
    for filepath in posts_dirpath.glob("*.md"):
        post = load_post(filepath)
        if post.archived:
            continue
        posts.append(post)
    return posts


def post_to_metadata(post: BlogPost) -> BlogPostMetadata:
    return BlogPostMetadata(
        title=post.title,
        slug=post.slug,
        topics=post.topics,
        date=post.date,
        archived=post.archived,
    )


@router.get(path="/blog/posts")
@logging_utilities.log_context("get_blog_posts", tag="api")
def get_blog_posts() -> JSONResponse:
    posts = load_posts()
    post_metadata = [post_to_metadata(post) for post in posts]
    sorted_post_metadata = sorted(post_metadata, key=lambda post: post.date, reverse=True)
    posts_json = [post.model_dump(mode="json") for post in sorted_post_metadata]
    return JSONResponse(posts_json)


@router.get(path="/blog/posts/{slug}")
@logging_utilities.log_context("get_blog_post", tag="api")
def get_blog_post(slug: str) -> JSONResponse:
    posts = load_posts()
    matching_posts = [post for post in posts if post.slug == slug]
    if not matching_posts:
        return JSONResponse({"error": "Post not found"}, status_code=404)
    post = matching_posts[0]
    post_json = post.model_dump(mode="json")
    return JSONResponse(post_json)
