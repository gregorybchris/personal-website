import logging
import os

from httpx import Client as HttpClient

logger = logging.getLogger(__name__)

MOVIE_POSTER_CACHE = {
    "cdd3c597-3b3d-4f0d-b0fc-8d10907ab66a": "https://image.tmdb.org/t/p/w500/2MSGZEE6XZd2r4ODNziwAw7Hpw0.jpg",
    "069b9c53-eaa9-422a-8ce1-17bb407b67f8": "https://image.tmdb.org/t/p/w500/mOyZ0UAWaOJartFq2G3Cv0soFtQ.jpg",
    "52feabf6-f872-4492-a079-12d9d46f6540": "https://image.tmdb.org/t/p/w500/n0ybibhJtQ5icDqTp8eRytcIHJx.jpg",
    "df9b72c7-0f1d-4e37-b84a-cd283acd55db": "https://image.tmdb.org/t/p/w500/wucOQrqihOtHToP7UAPKMFRJ9LL.jpg",
    "440b4e3e-c1e4-43c3-925b-e5eb20cf39b7": "https://image.tmdb.org/t/p/w500/efG8Po57alqSlhqHU1lXJ3duG6t.jpg",
    "bea09d22-8cc1-48f3-8669-fba49d8d82a1": "https://image.tmdb.org/t/p/w500/zSqJ1qFq8NXFfi7JeIYMlzyR0dx.jpg",
    "67f7a05d-8a37-4d57-ab4b-e3138f91596a": "https://image.tmdb.org/t/p/w500/pBejcCxQ3WQW0cWmgjpFOoLWMuS.jpg",
    "ef6b8311-87e4-43e7-939c-b6222c1f86c3": "https://image.tmdb.org/t/p/w500/bABCBKYBK7A5G1x0FzoeoNfuj2.jpg",
    "95184be8-93d9-4c5d-a372-d218b5f649e7": "https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg",
    "faa63924-05d4-43a3-98da-93ba0582d845": "https://image.tmdb.org/t/p/w500/zwzWCmH72OSC9NA0ipoqw5Zjya8.jpg",
    "c7bff94d-dc13-413b-8c0c-9735b1ec55ae": "https://image.tmdb.org/t/p/w500/tRNlZbgNCNOpLpbPEz5L8G8A0JN.jpg",
    "7b40d536-00aa-4b98-a9eb-9907f3649193": "https://image.tmdb.org/t/p/w500/9lfz2W2uGjyow3am00rsPJ8iOyq.jpg",
    "2deb4fab-5720-4b29-9b0c-be148a897549": "https://image.tmdb.org/t/p/w500/hmGAF5NDoYB6S39UONevjHCESOI.jpg",
    "d1c25c43-1a48-4ed3-b701-1905d484fe7e": "https://image.tmdb.org/t/p/w500/2DvjkCbmlg8sbBHZKUZvYPgsT5V.jpg",
    "a8435584-0ea3-4782-a5c3-91fd8daf3e66": "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    "3660c6fb-2e31-47ff-ac1f-0f1b6b0024c8": "https://image.tmdb.org/t/p/w500/x5T0cQDYws0xRBVG4Q3wpcrcmax.jpg",
    "c0c6ddb2-f9fa-447a-86fe-f11e2e185001": "https://image.tmdb.org/t/p/w500/7fn624j5lj3xTme2SgiLCeuedmO.jpg",
    "602cb1fe-46d9-4959-8847-1b5c2fda885f": "https://image.tmdb.org/t/p/w500/rNzQyW4f8B8cQeg7Dgj3n6eT5k9.jpg",
    "958690c0-fc9f-46ef-b264-40e5c4c4641c": "https://image.tmdb.org/t/p/w500/mZ4gBdfkhP9tvLH1DO4m4HYtiyi.jpg",
    "19666380-00bf-4c46-b727-4d8718b57ec2": "https://image.tmdb.org/t/p/w500/lBYOKAMcxIvuk9s9hMuecB9dPBV.jpg",
    "41978292-7202-4a2e-9a9e-2f429d8936d3": "https://image.tmdb.org/t/p/w500/2sFME73GaD8UsUxPUKe60cPdLif.jpg",
    "5b72d7db-dd02-448d-a03b-12ab0589fb97": "https://image.tmdb.org/t/p/w500/gWkgMnIsd8Od7iyhEEKL5G4Qq6J.jpg",
    "cf25f785-eb17-4d0f-8c6d-5482e00127e4": "https://image.tmdb.org/t/p/w500/8sRQSvEeJodJ0yC9pXJW4ufO3ky.jpg",
    "483adc4d-4318-4730-bdbd-186ef3507604": "https://image.tmdb.org/t/p/w500/8eIhNKnRfayRwWChx0atZh4vGua.jpg",
    "0fca9f57-847b-4b6f-81de-fe401b8f434c": "https://image.tmdb.org/t/p/w500/7duaCSqyA76tgLojkdnXTHcaqXV.jpg",
}

TV_POSTER_CACHE = {
    "2073c8f7-716f-47ed-b747-cf50f65fd314": "https://image.tmdb.org/t/p/w500/3KUjDt8XY7w2Ku70UE0SECmv1zP.jpg",
    "11b4f301-d31b-46db-aaae-cdd659fafc4e": "https://image.tmdb.org/t/p/w500/8MfgyFHf7XEboZJPZXCIDqqiz6e.jpg",
    "ab2e0a0a-ae47-4c1a-8563-6737b2d6d7cc": "https://image.tmdb.org/t/p/w500/3Cz7ySOQJmqiuTdrc6CY0r65yDI.jpg",
    "325e5bc9-13f4-4eea-a489-75365006e5e7": "https://image.tmdb.org/t/p/w500/8P2hs6Ok5DvieM9N2VjDZfJ6v59.jpg",
    "634c492a-d1d2-4ae3-a37d-e7b7b4af9e74": "https://image.tmdb.org/t/p/w500/5UaYsGZOFhjFDwQh6GuLjjA1WlF.jpg",
    "2917c110-7683-4739-9585-36f59a8a6463": "https://image.tmdb.org/t/p/w500/7WTsnHkbA0FaG6R9twfFde0I9hl.jpg",
    "d94a2098-ccc8-4318-ab9d-6da8d664718f": "https://image.tmdb.org/t/p/w500/3MVHF64rlvH1eofKefIoazXwOK0.jpg",
    "ee80348d-c132-4147-9880-11e336cf922a": "https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg",
    "0f64cc6d-23f7-41d1-a2f4-f1bab9280b2c": "https://image.tmdb.org/t/p/w500/26fMaTPRczCrTUOQ5svA1Db7l4h.jpg",
    "5f8ad48d-4313-4e0a-8255-a9c73c1fae5d": "https://image.tmdb.org/t/p/w500/b34jPzmB0wZy7EjUZoleXOl2RRI.jpg",
    "d439683f-65ca-422e-8712-9a9b97e1095d": "https://image.tmdb.org/t/p/w500/zBx1X06G1OlndbXTCZI13FECNz2.jpg",
    "13f4799d-c427-4f58-a95f-6fc4401976b5": "https://image.tmdb.org/t/p/w500/gdIrmf2DdY5mgN6ycVP0XlzKzbE.jpg",
    "41a2db4f-8b8b-48bc-b578-34d0586d59ae": "https://image.tmdb.org/t/p/w500/lFf6LLrQjYldcZItzOkGmMMigP7.jpg",
    "ffb34205-d06b-4863-bcf1-f043e461837e": "https://image.tmdb.org/t/p/w500/c4mk4EQVIM11yd3W43DDdqDazDU.jpg",
    "3f9acfeb-78db-4ce0-ad81-84a2ea25d3de": "https://image.tmdb.org/t/p/w500/tCPIf5f6jUIr8KDMWsfaXwXW0kl.jpg",
    "ff39acfd-22a4-454d-908e-ab5f9f8fa85a": "https://image.tmdb.org/t/p/w500/dDuzrl9rUIBYieZjqmtNCdncrmZ.jpg",
    "09bb27a3-f726-4042-ae53-a1a350b87c97": "https://image.tmdb.org/t/p/w500/pfaxCP6YqlFHCL3QytnTanwRTL5.jpg",
    "c80f741f-2c4c-4c32-945c-777bea632eb6": "https://image.tmdb.org/t/p/w500/zU0htwkhNvBQdVSIKB9s6hgVeFK.jpg",
    "159afe84-2f0c-47df-a71f-dfff1a22df4d": "https://image.tmdb.org/t/p/w500/dc5r71XI1gD4YwIUoEYCLiVvtss.jpg",
    "bac03bfe-7712-4f28-ad73-d4fe59c2fa68": "https://image.tmdb.org/t/p/w500/kprB5Jj2LYQAYlqVQMEucT2vGt.jpg",
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
