"""Information for all package datasets."""
from chris.datasets.dataset_formats import DatasetFormats
from chris.datasets.dataset_info import DatasetInfo


class Datasets:
    """Information for all package datasets."""

    # region blog

    PODCAST_EPISODES = DatasetInfo(
        "Podcast Episodes",
        "blog/podcast-episodes.json",
        DatasetFormats.JSON,
        "Podcast episodes.",
    )

    POSTS = DatasetInfo(
        "Posts",
        "blog/posts.json",
        DatasetFormats.JSON,
        "Blog posts.",
    )

    # endregion blog

    # region cooking

    RECIPES = DatasetInfo(
        "Recipes",
        "cooking/recipes.json",
        DatasetFormats.JSON,
        "Cooking recipes.",
    )

    # endregion cooking

    # region media

    MOVIES = DatasetInfo(
        "Movies",
        "media/movies.json",
        DatasetFormats.JSON,
        "Movies.",
    )

    PODCASTS = DatasetInfo(
        "Podcasts",
        "media/podcasts.json",
        DatasetFormats.JSON,
        "Podcasts.",
    )

    TV_SHOWS = DatasetInfo(
        "TV Shows",
        "media/tv-shows.json",
        DatasetFormats.JSON,
        "TV shows.",
    )

    YOUTUBE_CHANNELS = DatasetInfo(
        "YouTube Channels",
        "media/youtube-channels.json",
        DatasetFormats.JSON,
        "YouTube channels.",
    )

    BOOKS = DatasetInfo(
        "Books",
        "media/books.json",
        DatasetFormats.JSON,
        "Books.",
    )

    # endregion media

    # region outdoor

    CYCLING_ROUTES = DatasetInfo(
        "Cycling Routes",
        "outdoor/cycling-routes.json",
        DatasetFormats.JSON,
        "Cycling routes.",
    )

    HIKING_ROUTES = DatasetInfo(
        "Hiking Routes",
        "outdoor/hiking-routes.json",
        DatasetFormats.JSON,
        "Hiking routes.",
    )

    RUNNING_ROUTES = DatasetInfo(
        "Running Routes",
        "outdoor/running-routes.json",
        DatasetFormats.JSON,
        "Running routes.",
    )

    # endregion outdoor

    # region professional

    COURSES = DatasetInfo(
        "College Courses",
        "professional/courses.json",
        DatasetFormats.JSON,
        "College courses.",
    )

    JOBS = DatasetInfo(
        "Jobs",
        "professional/jobs.json",
        DatasetFormats.JSON,
        "Jobs.",
    )

    # endregion professional

    # region projects

    PROJECTS = DatasetInfo(
        "Projects",
        "projects/projects.json",
        DatasetFormats.JSON,
        "Software projects.",
    )

    # endregion projects

    # region archive

    ARCHIVE = DatasetInfo(
        "Archive",
        "archive/archive.json",
        DatasetFormats.JSON,
        "Personal website revision archive.",
    )

    # endregion archive

    # region surveys

    SURVEYS = DatasetInfo(
        "Surveys",
        "surveys/surveys.json",
        DatasetFormats.JSON,
        "Surveys.",
    )

    # endregion surveys
