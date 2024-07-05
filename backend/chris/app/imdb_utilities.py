import os

from httpx import Client as HttpClient


def get_media_movies_poster(imdb_id: str) -> str:
    api_key = os.getenv("TMDB_API_KEY")
    request_url = f"https://api.themoviedb.org/3/find/{imdb_id}?api_key={api_key}&external_source=imdb_id"
    client = HttpClient()
    response = client.get(request_url)
    response_json = response.json()

    for result in response_json["movie_results"]:
        poster_path = result["poster_path"]
        return f"https://image.tmdb.org/t/p/w500{poster_path}"

    raise ValueError(f"No entry found for movie with IMDB ID {imdb_id}")


def get_media_tv_poster(imdb_id: str) -> str:
    api_key = os.getenv("TMDB_API_KEY")
    request_url = f"https://api.themoviedb.org/3/find/{imdb_id}?api_key={api_key}&external_source=imdb_id"
    client = HttpClient()
    response = client.get(request_url)
    response_json = response.json()

    for result in response_json["tv_results"]:
        poster_path = result["poster_path"]
        return f"https://image.tmdb.org/t/p/w500{poster_path}"

    raise ValueError(f"No entry found for TV show with IMDB ID {imdb_id}")
