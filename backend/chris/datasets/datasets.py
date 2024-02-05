"""Datasets."""

from chris.datasets.dataset_info import DatasetInfo


class Datasets:
    PODCAST_EPISODES = DatasetInfo("Podcast Episodes", "blog/podcast-episodes.json")
    POSTS = DatasetInfo("Posts", "blog/posts.json")
    RECIPES = DatasetInfo("Recipes", "cooking/recipes.json")
    MOVIES = DatasetInfo("Movies", "media/movies.json")
    PODCASTS = DatasetInfo("Podcasts", "media/podcasts.json")
    TV_SHOWS = DatasetInfo("TV Shows", "media/tv-shows.json")
    YOUTUBE_CHANNELS = DatasetInfo("YouTube Channels", "media/youtube-channels.json")
    BOOKS = DatasetInfo("Books", "media/books.json")
    CYCLING_ROUTES = DatasetInfo("Cycling Routes", "outdoor/cycling-routes.json")
    HIKING_ROUTES = DatasetInfo("Hiking Routes", "outdoor/hiking-routes.json")
    RUNNING_ROUTES = DatasetInfo("Running Routes", "outdoor/running-routes.json")
    COURSES = DatasetInfo("College Courses", "professional/courses.json")
    JOBS = DatasetInfo("Jobs", "professional/jobs.json")
    PROJECTS = DatasetInfo("Projects", "projects/projects.json")
    ARCHIVE = DatasetInfo("Archive", "archive/archive.json")
    SURVEYS = DatasetInfo("Surveys", "surveys/surveys.json")
