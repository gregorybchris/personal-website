import argparse
import json
import re

from sty import fg
from tabulate import tabulate

from post import Post
from post_properties import PostProperties


DEFAULT_POSTS_FILEPATH = '../src/data/posts.json'

class FieldConstraints:
    MIN_POST_TAGS = 5
    MAX_POST_TAGS = 11
    MIN_TAG_LENGTH = 2
    MAX_TAG_LENGTH = 25
    MIN_SUMMARY_LENGTH = 100
    MAX_SUMMARY_LENGTH = 1200
    MIN_LINK_LENGTH = 5


class Color:
    GREEN = (110, 220, 100)
    RED = (200, 80, 90)

def print_rgb(s, *args, rgb=None, **kwargs):
    print(f"{fg(*rgb)}{s}{fg.rs}", *args, **kwargs)


class ValidationResults:
    def __init__(self, n_posts):
        self._n_posts = n_posts
        self._errors = list()
        self._completed = dict()

    def add(self, message):
        self._errors.append(message)

    def add_completed(self, field, count=1):
        if field not in self._completed:
            self._completed[field] = 0
        self._completed[field] += count

    def print(self):
        n_errors = len(self._errors)
        if n_errors == 0:
            print_rgb(f"Successfully validated {self._n_posts} posts", rgb=Color.GREEN)
            completed_table = {
                'Field': self._completed.keys(),
                'Number Completed': self._completed.values(),
            }
            print()
            print(tabulate(completed_table, headers='keys', tablefmt='github'))
        else:
            print_rgb(f"Found {n_errors} errors while validating:", rgb=Color.RED)
            for error in self._errors:
                print(f"- {error}")

    def has_errors(self):
        return len(self.errors) > 0

    def get_errors(self):
        return self.errors


def validate(posts):
    n_posts = len(posts)
    results = ValidationResults(n_posts)

    seen_areas = set()
    seen_content_type = set()
    seen_link = set()
    seen_series = set()
    seen_source = set()
    seen_title = set()

    for post in posts:
        for field in PostProperties.FIELDS:
            if not hasattr(post, field):
                results.add(f"Post \"{post.title}\" is missing field \"{field}\"")

        if not re.fullmatch(r'[a-z0-9-]{36}', post.post_id):
            results.add(f"Invalid post_id format \"{post.post_id}\"")

        if post.title in seen_title:
            results.add(f"Duplicate title \"{post.title}\"")
        seen_title.add(post.title)

        if post.link in seen_link:
            results.add(f"Duplicate link \"{post.link}\"")
        seen_link.add(post.link)

        if len(post.areas) > 0:
            for area in post.areas:
                if area not in PostProperties.AREAS:
                    results.add(f"Unknown area \"{area}\" for \"{post.title}\"")
                seen_areas.add(area)
            results.add_completed('area')

        if post.content_type is not None:
            if post.content_type not in PostProperties.CONTENT_TYPES:
                results.add(f"Unknown content type \"{post.content_type}\" for \"{post.title}\"")
            seen_content_type.add(post.content_type)

        if post.date_created is not None:
            if not re.fullmatch(r'[0-9]{4}-[0-9]{2}-[0-9]{2}', post.date_created):
                results.add(f"Invalid date_created format \"{post.date_created}\"")
            results.add_completed('date_created')

        if post.date_posted is None:
            results.add(f"Post \"{post.title}\" is missing the required 'date_posted' field")
        else:
            if not re.fullmatch(r'[0-9]{4}-[0-9]{2}-[0-9]{2}', post.date_posted):
                results.add(f"Invalid date_posted format \"{post.date_posted}\"")

        if post.length is None:
            if post.content_type == 'video':
                results.add(f"Post \"{post.title}\" is missing the required \"length\" field for videos")
        else:
            if not re.fullmatch(r'[0-9]{2}:[0-5][0-9]:[0-5][0-9]', post.length):
                results.add(f"Invalid video length format \"{post.length}\"")

        if post.link is None:
            if not post.deleted:
                results.add(f"Post \"{post.title}\" is missing the required 'link' field")
        else:
            if not len(post.link) > FieldConstraints.MIN_LINK_LENGTH:
                results.add(f"Invalid link length \"{post.link}\"")

        if post.series is not None:
            if post.series not in PostProperties.SERIES:
                results.add(f"Unknown series \"{post.series}\" for \"{post.title}\"")
            seen_series.add(post.series)

        if post.source is not None:
            if post.source not in PostProperties.SOURCES:
                results.add(f"Unknown source \"{post.source}\" for \"{post.title}\"")
            seen_source.add(post.source)

        if post.summary is not None:
            summary_length = len(post.summary)
            if summary_length < FieldConstraints.MIN_SUMMARY_LENGTH:
                results.add(f"Summary length ({summary_length}) for \"{post.title}\" "
                            f"is less than {FieldConstraints.MIN_SUMMARY_LENGTH}")

            if summary_length > FieldConstraints.MAX_SUMMARY_LENGTH:
                results.add(f"Summary length ({summary_length}) for \"{post.title}\" "
                            f"is more than {FieldConstraints.MAX_SUMMARY_LENGTH}")

            results.add_completed('summary')

        n_tags = len(post.tags)
        if n_tags < FieldConstraints.MIN_POST_TAGS:
            results.add(f"Number of tags ({n_tags}) for \"{post.title}\" "
                        f"is less than {FieldConstraints.MIN_POST_TAGS}")
        if n_tags > FieldConstraints.MAX_POST_TAGS:
            results.add(f"Number of tags ({n_tags}) for \"{post.title}\" "
                        f"is more than {FieldConstraints.MAX_POST_TAGS}")

        for tag in post.tags:
            tag_length = len(tag)
            if tag != tag.lower():
                results.add(f"Tag \"{tag}\" must be lowercase for \"{post.title}\"")
            if len(tag) < FieldConstraints.MIN_TAG_LENGTH:
                results.add(f"Length of tag \"{tag}\" ({tag_length}) for \"{post.title}\" "
                            f"is less than {FieldConstraints.MIN_TAG_LENGTH}")
            if len(tag) > FieldConstraints.MAX_TAG_LENGTH:
                results.add(f"Length of tag \"{tag}\" ({tag_length}) for \"{post.title}\" "
                            f"is more than {FieldConstraints.MAX_TAG_LENGTH}")

    # Validate unused

    seen_known_map = [
        ('areas', seen_areas, PostProperties.AREAS),
        ('content_type', seen_content_type, PostProperties.CONTENT_TYPES),
        ('series', seen_series, PostProperties.SERIES),
        ('source', seen_source, PostProperties.SOURCES),
    ]

    for field, seen_set, known_set in seen_known_map:
        for value in known_set:
            if value not in seen_set:
                results.add(f"Unused {field} \"{value}\"")

    # Validate constants

    for area in PostProperties.AREAS:
        if not re.fullmatch(r'[a-z]+', area):
            results.add(f"Invalid area format \"{area}\"")

    for content_type in PostProperties.CONTENT_TYPES:
        if not re.fullmatch(r'[a-z]+', content_type):
            results.add(f"Invalid content type format \"{content_type}\"")

    for field, _, known_set in seen_known_map:
        last_value = None
        for value in known_set:
            if last_value is not None and value.lower() <= last_value.lower():
                results.add(f"Unordered constants for {field}: \"{last_value}\" vs \"{value}\"")
            last_value = value

    return results


def get_posts_from_file(filepath):
    with open(filepath, 'r') as f:
        post_records = json.load(f)
    posts = [Post.from_record(record) for record in post_records]
    return posts


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument('--filepath', default=DEFAULT_POSTS_FILEPATH)
    args = parser.parse_args()
    return args


if __name__ == '__main__':
    args = parse_args()
    posts = get_posts_from_file(args.filepath)
    results = validate(posts)

    results.print()
