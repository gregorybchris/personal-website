import logging
from datetime import datetime
from enum import StrEnum
from pathlib import Path
from typing import Any, Iterator, Optional
from xml.dom import minidom
from xml.etree.ElementTree import Element, SubElement, tostring

import frontmatter
from fastapi import APIRouter
from fastapi.responses import JSONResponse, Response
from pydantic import BaseModel, Field

from chris.app import logging_utilities

logger = logging.getLogger(__name__)

router = APIRouter()


class Status(StrEnum):
    New = "new"
    Draft = "draft"
    Published = "published"


class BlogPostPreview(BaseModel):
    title: str
    slug: str
    date: datetime
    status: Status
    reading_time: Optional[int] = None


class BlogPost(BaseModel):
    title: str
    slug: str
    date: datetime
    content: str
    archived: bool = Field(exclude=True)
    status: Status
    reading_time: Optional[int] = None

    def __init__(self, **data: Any):
        super().__init__(**data)
        self.reading_time = content_to_reading_time(self.content)

    def to_preview(self) -> BlogPostPreview:
        return BlogPostPreview(
            title=self.title,
            slug=self.slug,
            date=self.date,
            status=self.status,
            reading_time=self.reading_time,
        )


def content_to_reading_time(content: str) -> int:
    # Brysbaert, M. (2019) - English non-fiction reading speed
    # wpm = 238 * (4.6  / avg letters per word)
    words = content.split()
    n_words = len(words)
    n_letters = sum(len(word) for word in words)
    avg_letters_per_word = n_letters / n_words if n_words > 0 else 0
    wpm = 238 * (4.6 / avg_letters_per_word) if avg_letters_per_word > 0 else 0
    reading_time_minutes = n_words / wpm if wpm > 0 else 0
    return max(1, round(reading_time_minutes))


def load_post(filepath: Path) -> BlogPost:
    fm_post = frontmatter.load(filepath)
    fm_post_dict = fm_post.to_dict()
    return BlogPost(**fm_post_dict)


def iter_posts() -> Iterator[BlogPost]:
    posts_dirpath = Path(__file__).parent.parent.parent / "datasets" / "data" / "blog" / "posts"
    for filepath in posts_dirpath.glob("*.md"):
        post = load_post(filepath)
        if not post.archived:
            yield post


@router.get(path="/blog/posts")
@logging_utilities.log_context("get_blog_posts", tag="api")
def get_blog_posts() -> JSONResponse:
    previews = [post.to_preview() for post in iter_posts()]
    sorted_previews = sorted(previews, key=lambda post: post.date, reverse=True)
    posts_json = [post.model_dump(mode="json") for post in sorted_previews]
    return JSONResponse(posts_json)


@router.get(path="/blog/posts/{slug}")
@logging_utilities.log_context("get_blog_post", tag="api")
def get_blog_post(slug: str) -> JSONResponse:
    for post in iter_posts():
        if post.slug == slug:
            post_json = post.model_dump(mode="json")
            return JSONResponse(post_json)
    return JSONResponse({"error": "Post not found"}, status_code=404)


@router.get(path="/feed.xml")
@logging_utilities.log_context("get_blog_feed", tag="api")
def get_blog_feed() -> Response:
    title = "Chris Gregory Blog"
    link = "https://chrisgregory.me"
    description = "Latest posts from Chris Gregory"

    posts = [post for post in iter_posts() if post.status == Status.Published]
    sorted_posts = sorted(posts, key=lambda post: post.date, reverse=True)

    rss_content = generate_rss(
        posts=sorted_posts,
        title=title,
        link=link,
        description=description,
    )
    return Response(content=rss_content, media_type="application/rss+xml")


def generate_rss(
    posts: list[BlogPost],
    title: str,
    link: str,
    description: str,
) -> str:
    rss = Element("rss", version="2.0")
    channel = SubElement(rss, "channel")

    SubElement(channel, "title").text = title
    SubElement(channel, "link").text = link
    SubElement(channel, "description").text = description
    SubElement(channel, "lastBuildDate").text = datetime.utcnow().strftime("%a, %d %b %Y %H:%M:%S +0000")

    for post in posts:
        url = f"{link}/blog/{post.slug}"
        item = SubElement(channel, "item")
        SubElement(item, "title").text = post.title
        SubElement(item, "link").text = url
        SubElement(item, "pubDate").text = post.date.strftime("%a, %d %b %Y %H:%M:%S +0000")

    return minidom.parseString(tostring(rss)).toprettyxml(indent="  ")
