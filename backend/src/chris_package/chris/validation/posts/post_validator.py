"""Validator for posts."""
import re

from chris.validation.posts.post_properties import PostProperties
from chris.validation.validation_results import ValidationResults
from chris.validation.validator import Validator


class PostValidator(Validator):
    """Validator for posts."""

    DATA_FILENAME = 'blog/posts.json'

    MIN_POST_TAGS = 5
    MAX_POST_TAGS = 11
    MIN_AREAS = 1
    MAX_AREAS = 5
    MIN_TAG_LENGTH = 2
    MAX_TAG_LENGTH = 25
    MIN_SUMMARY_LENGTH = 100
    MAX_SUMMARY_LENGTH = 2100
    MIN_HOOK_LENGTH = 50
    MAX_HOOK_LENGTH = 100
    MIN_LINK_LENGTH = 5
    MIN_SLUG_LENGTH = 5
    MAX_SLUG_LENGTH = 32

    @classmethod
    def validate(cls):
        """Validate posts."""
        posts = cls.load_items(cls.DATA_FILENAME)
        n_posts = len(posts)
        results = ValidationResults(n_posts, 'post')

        seen_content_type = set()
        seen_id = set()
        seen_link = set()
        seen_series = set()
        seen_slug = set()
        seen_source = set()
        seen_title = set()

        for post in posts:
            for field in PostProperties.FIELDS:
                if not hasattr(post, field):
                    results.add_error(f"Post \"{post.title}\" is missing field \"{field}\"")

            if post.post_id in seen_id:
                results.add_error(f"Duplicate post_id \"{post.post_id}\"")
            if not re.fullmatch(r'[a-z0-9-]{36}', post.post_id):
                results.add_error(f"Invalid post_id format \"{post.post_id}\"")
            seen_id.add(post.post_id)

            if post.title in seen_title:
                results.add_error(f"Duplicate title \"{post.title}\"")
            seen_title.add(post.title)

            if post.slug is None:
                results.add_error(f"Post \"{post.title}\" is missing the required 'slug' field")
            else:
                slug_length = len(post.slug)
                if slug_length < cls.MIN_SLUG_LENGTH:
                    results.add_error(f"Slug length ({slug_length}) for \"{post.slug}\" "
                                      f"is less than {cls.MIN_SLUG_LENGTH}")

                if slug_length > cls.MAX_SLUG_LENGTH:
                    results.add_error(f"Slug length ({slug_length}) for \"{post.slug}\" "
                                      f"is more than {cls.MAX_SLUG_LENGTH}")

                if not re.fullmatch(r'[a-z0-9-]+', post.slug):
                    results.add_error(f"Invalid slug format \"{post.slug}\"")

                if post.slug in seen_slug:
                    results.add_error(f"Duplicate slug \"{post.slug}\"")
                seen_slug.add(post.slug)

            if not re.fullmatch(r'[a-z0-9-]+', post.slug):
                results.add_error(f"Invalid slug format \"{post.slug}\"")

            if post.link in seen_link:
                results.add_error(f"Duplicate link \"{post.link}\"")
            seen_link.add(post.link)

            n_areas = len(post.areas)
            if n_areas < cls.MIN_AREAS:
                results.add_error(f"Number of areas ({n_areas}) for \"{post.title}\" "
                                  f"is less than {cls.MIN_AREAS}")
            if n_areas > cls.MAX_AREAS:
                results.add_error(f"Number of areas ({n_areas}) for \"{post.title}\" "
                                  f"is more than {cls.MAX_AREAS}")

            for area in post.areas:
                if area not in PostProperties.AREAS:
                    results.add_error(f"Unknown area \"{area}\" for \"{post.title}\"")

            if post.content_type is not None:
                if post.content_type not in PostProperties.CONTENT_TYPES:
                    results.add_error(f"Unknown content type \"{post.content_type}\" for \"{post.title}\"")
                seen_content_type.add(post.content_type)

            if post.date_created is not None:
                if not re.fullmatch(r'[0-9]{4}-[0-9]{2}-[0-9]{2}', post.date_created):
                    results.add_error(f"Invalid date_created format \"{post.date_created}\"")
                results.add_completed('date_created')

            if post.date_posted is None:
                results.add_error(f"Post \"{post.title}\" is missing the required 'date_posted' field")
            else:
                if not re.fullmatch(r'[0-9]{4}-[0-9]{2}-[0-9]{2}', post.date_posted):
                    results.add_error(f"Invalid date_posted format \"{post.date_posted}\"")

            if post.length is None:
                if post.content_type == 'video':
                    results.add_error(f"Post \"{post.title}\" is missing the required \"length\" field for videos")
            else:
                if not re.fullmatch(r'[0-9]{2}:[0-5][0-9]:[0-5][0-9]', post.length):
                    results.add_error(f"Invalid video length format \"{post.length}\"")
                results.add_completed('length')

            if post.link is None:
                if not post.deleted:
                    results.add_error(f"Post \"{post.title}\" is missing the required 'link' field")
            else:
                if not len(post.link) > cls.MIN_LINK_LENGTH:
                    results.add_error(f"Invalid link length \"{post.link}\"")

            if post.series is not None:
                if post.series not in PostProperties.SERIES:
                    results.add_error(f"Unknown series \"{post.series}\" for \"{post.title}\"")
                seen_series.add(post.series)

            if post.source is not None:
                if post.source not in PostProperties.SOURCES:
                    results.add_error(f"Unknown source \"{post.source}\" for \"{post.title}\"")
                seen_source.add(post.source)

            if post.summary is not None:
                summary_length = len(post.summary)
                if summary_length < cls.MIN_SUMMARY_LENGTH:
                    results.add_error(f"Summary length ({summary_length}) for \"{post.title}\" "
                                      f"is less than {cls.MIN_SUMMARY_LENGTH}")

                if summary_length > cls.MAX_SUMMARY_LENGTH:
                    results.add_error(f"Summary length ({summary_length}) for \"{post.title}\" "
                                      f"is more than {cls.MAX_SUMMARY_LENGTH}")

                results.add_completed('summary')

            if post.hook is not None:
                hook_length = len(post.hook)
                if hook_length < cls.MIN_HOOK_LENGTH:
                    results.add_error(f"Hook length ({hook_length}) for \"{post.title}\" "
                                      f"is less than {cls.MIN_HOOK_LENGTH}")

                if hook_length > cls.MAX_HOOK_LENGTH:
                    results.add_error(f"Hook length ({hook_length}) for \"{post.title}\" "
                                      f"is more than {cls.MAX_HOOK_LENGTH}")

                results.add_completed('hook')

            n_tags = len(post.tags)
            if n_tags < cls.MIN_POST_TAGS:
                results.add_error(f"Number of tags ({n_tags}) for \"{post.title}\" "
                                  f"is less than {cls.MIN_POST_TAGS}")
            if n_tags > cls.MAX_POST_TAGS:
                results.add_error(f"Number of tags ({n_tags}) for \"{post.title}\" "
                                  f"is more than {cls.MAX_POST_TAGS}")

            for tag in post.tags:
                tag_length = len(tag)
                if tag != tag.lower():
                    results.add_error(f"Tag \"{tag}\" must be lowercase for \"{post.title}\"")
                if len(tag) < cls.MIN_TAG_LENGTH:
                    results.add_error(f"Length of tag \"{tag}\" ({tag_length}) for \"{post.title}\" "
                                      f"is less than {cls.MIN_TAG_LENGTH}")
                if len(tag) > cls.MAX_TAG_LENGTH:
                    results.add_error(f"Length of tag \"{tag}\" ({tag_length}) for \"{post.title}\" "
                                      f"is more than {cls.MAX_TAG_LENGTH}")

        # Validate unused

        seen_known_map = [
            ('content_type', seen_content_type, PostProperties.CONTENT_TYPES),
            ('series', seen_series, PostProperties.SERIES),
            ('source', seen_source, PostProperties.SOURCES),
        ]

        for field, seen_set, known_set in seen_known_map:
            for value in known_set:
                if value not in seen_set:
                    results.add_error(f"Unused {field} \"{value}\"")

        # Validate constants

        for area in PostProperties.AREAS:
            if not re.fullmatch(r'[a-z]+', area):
                results.add_error(f"Invalid area format \"{area}\"")

        for content_type in PostProperties.CONTENT_TYPES:
            if not re.fullmatch(r'[a-z]+', content_type):
                results.add_error(f"Invalid content type format \"{content_type}\"")

        for field, _, known_set in seen_known_map:
            last_value = None
            for value in known_set:
                if last_value is not None and value.lower() <= last_value.lower():
                    results.add_error(f"Unordered constants for {field}: \"{last_value}\" vs \"{value}\"")
                last_value = value

        return results


def validate():
    """Run validation for posts."""
    validator = PostValidator()
    results = validator.validate()
    results.print()


if __name__ == '__main__':
    validate()
