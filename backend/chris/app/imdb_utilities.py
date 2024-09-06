import logging
import os

from httpx import Client as HttpClient

logger = logging.getLogger(__name__)

MOVIE_POSTER_CACHE = {
    "tt0758758": "https://image.tmdb.org/t/p/w500/2MSGZEE6XZd2r4ODNziwAw7Hpw0.jpg",
    "tt2357129": "https://image.tmdb.org/t/p/w500/mOyZ0UAWaOJartFq2G3Cv0soFtQ.jpg",
    "tt1285016": "https://image.tmdb.org/t/p/w500/n0ybibhJtQ5icDqTp8eRytcIHJx.jpg",
    "tt2980516": "https://image.tmdb.org/t/p/w500/wucOQrqihOtHToP7UAPKMFRJ9LL.jpg",
    "tt0478087": "https://image.tmdb.org/t/p/w500/efG8Po57alqSlhqHU1lXJ3duG6t.jpg",
    "tt2084970": "https://image.tmdb.org/t/p/w500/zSqJ1qFq8NXFfi7JeIYMlzyR0dx.jpg",
    "tt0132477": "https://image.tmdb.org/t/p/w500/pBejcCxQ3WQW0cWmgjpFOoLWMuS.jpg",
    "tt0119217": "https://image.tmdb.org/t/p/w500/bABCBKYBK7A5G1x0FzoeoNfuj2.jpg",
    "tt0172495": "https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg",
    "tt0268978": "https://image.tmdb.org/t/p/w500/zwzWCmH72OSC9NA0ipoqw5Zjya8.jpg",
    "tt0482571": "https://image.tmdb.org/t/p/w500/tRNlZbgNCNOpLpbPEz5L8G8A0JN.jpg",
    "tt4846340": "https://image.tmdb.org/t/p/w500/9lfz2W2uGjyow3am00rsPJ8iOyq.jpg",
    "tt0097165": "https://image.tmdb.org/t/p/w500/hmGAF5NDoYB6S39UONevjHCESOI.jpg",
    "tt1781769": "https://image.tmdb.org/t/p/w500/2DvjkCbmlg8sbBHZKUZvYPgsT5V.jpg",
    "tt0816692": "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    "tt0490215": "https://image.tmdb.org/t/p/w500/x5T0cQDYws0xRBVG4Q3wpcrcmax.jpg",
    "tt2582802": "https://image.tmdb.org/t/p/w500/7fn624j5lj3xTme2SgiLCeuedmO.jpg",
    "tt0332280": "https://image.tmdb.org/t/p/w500/rNzQyW4f8B8cQeg7Dgj3n6eT5k9.jpg",
    "tt5726616": "https://image.tmdb.org/t/p/w500/mZ4gBdfkhP9tvLH1DO4m4HYtiyi.jpg",
    "tt0454921": "https://image.tmdb.org/t/p/w500/lBYOKAMcxIvuk9s9hMuecB9dPBV.jpg",
    "tt3553976": "https://image.tmdb.org/t/p/w500/2sFME73GaD8UsUxPUKe60cPdLif.jpg",
    "tt1895587": "https://image.tmdb.org/t/p/w500/gWkgMnIsd8Od7iyhEEKL5G4Qq6J.jpg",
    "tt0119934": "https://image.tmdb.org/t/p/w500/8sRQSvEeJodJ0yC9pXJW4ufO3ky.jpg",
    "tt1758692": "https://image.tmdb.org/t/p/w500/8eIhNKnRfayRwWChx0atZh4vGua.jpg",
    "tt3810760": "https://image.tmdb.org/t/p/w500/7duaCSqyA76tgLojkdnXTHcaqXV.jpg",
}

TV_POSTER_CACHE = {
    "tt1439629": "https://image.tmdb.org/t/p/w500/3KUjDt8XY7w2Ku70UE0SECmv1zP.jpg",
    "tt0475784": "https://image.tmdb.org/t/p/w500/8MfgyFHf7XEboZJPZXCIDqqiz6e.jpg",
    "tt0412142": "https://image.tmdb.org/t/p/w500/3Cz7ySOQJmqiuTdrc6CY0r65yDI.jpg",
    "tt2543312": "https://image.tmdb.org/t/p/w500/8P2hs6Ok5DvieM9N2VjDZfJ6v59.jpg",
    "tt2085059": "https://image.tmdb.org/t/p/w500/5UaYsGZOFhjFDwQh6GuLjjA1WlF.jpg",
    "tt1475582": "https://image.tmdb.org/t/p/w500/7WTsnHkbA0FaG6R9twfFde0I9hl.jpg",
    "tt14452776": "https://image.tmdb.org/t/p/w500/3MVHF64rlvH1eofKefIoazXwOK0.jpg",
    "tt3581920": "https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg",
    "tt10050772": "https://image.tmdb.org/t/p/w500/26fMaTPRczCrTUOQ5svA1Db7l4h.jpg",
    "tt0460649": "https://image.tmdb.org/t/p/w500/b34jPzmB0wZy7EjUZoleXOl2RRI.jpg",
    "tt14688458": "https://image.tmdb.org/t/p/w500/zBx1X06G1OlndbXTCZI13FECNz2.jpg",
    "tt2861424": "https://image.tmdb.org/t/p/w500/gdIrmf2DdY5mgN6ycVP0XlzKzbE.jpg",
    "tt11280740": "https://image.tmdb.org/t/p/w500/lFf6LLrQjYldcZItzOkGmMMigP7.jpg",
    "tt9059760": "https://image.tmdb.org/t/p/w500/c4mk4EQVIM11yd3W43DDdqDazDU.jpg",
    "tt13911628": "https://image.tmdb.org/t/p/w500/tCPIf5f6jUIr8KDMWsfaXwXW0kl.jpg",
    "tt1266020": "https://image.tmdb.org/t/p/w500/dDuzrl9rUIBYieZjqmtNCdncrmZ.jpg",
    "tt1780441": "https://image.tmdb.org/t/p/w500/pfaxCP6YqlFHCL3QytnTanwRTL5.jpg",
    "tt10048342": "https://image.tmdb.org/t/p/w500/zU0htwkhNvBQdVSIKB9s6hgVeFK.jpg",
    "tt2575988": "https://image.tmdb.org/t/p/w500/dc5r71XI1gD4YwIUoEYCLiVvtss.jpg",
    "tt7768848": "https://image.tmdb.org/t/p/w500/kprB5Jj2LYQAYlqVQMEucT2vGt.jpg",
}


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
