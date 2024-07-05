import logging
import os

from httpx import Client as HttpClient

logger = logging.getLogger(__name__)


def get_media_movies_poster(imdb_id: str) -> str:
    logger.info(f"Getting poster for movie with IMDB ID {imdb_id}")
    api_key = os.getenv("TMDB_API_KEY")
    if api_key is None:
        raise ValueError("No TMDB API key found in environment variables")

    request_url = f"https://api.themoviedb.org/3/find/{imdb_id}?api_key={api_key}&external_source=imdb_id"
    client = HttpClient()
    response = client.get(request_url)
    response.raise_for_status()
    response_json = response.json()

    if "movie_results" not in response_json:
        logger.error(f"Error response from TMDB API: {response_json}")
        raise ValueError(f"Error response from TMDB API for IMDB ID {imdb_id}")

    for result in response_json["movie_results"]:
        poster_path = result["poster_path"]
        return f"https://image.tmdb.org/t/p/w500{poster_path}"

    raise ValueError(f"No entry found for movie with IMDB ID {imdb_id}")


def get_media_tv_poster(imdb_id: str) -> str:
    logger.info(f"Getting poster for TV show with IMDB ID {imdb_id}")
    api_key = os.getenv("TMDB_API_KEY")
    if api_key is None:
        raise ValueError("No TMDB API key found in environment variables")

    request_url = f"https://api.themoviedb.org/3/find/{imdb_id}?api_key={api_key}&external_source=imdb_id"
    client = HttpClient()
    response = client.get(request_url)
    response.raise_for_status()
    response_json = response.json()

    if "tv_results" not in response_json:
        logger.error(f"Error response from TMDB API: {response_json}")
        raise ValueError(f"Error response from TMDB API for IMDB ID {imdb_id}")

    for result in response_json["tv_results"]:
        poster_path = result["poster_path"]
        return f"https://image.tmdb.org/t/p/w500{poster_path}"

    raise ValueError(f"No entry found for TV show with IMDB ID {imdb_id}")
