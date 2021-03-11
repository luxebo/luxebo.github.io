from flask import Flask, request
import requests
import json
import re
app = Flask(__name__)

@app.route("/")
def home():
    return app.send_static_file("hw6.html")

@app.route("/TMDBTrending")
def getTrending():
    trending = requests.get("https://api.themoviedb.org/3/trending/movie/week?api_key=bf55bbc29b98e46ba33455411642f8e6")
    dictFromJson = trending.json()
    dictJson = dict()
    listOfDicts = []
    for ind, elem in enumerate(dictFromJson.get('results',{})):
        if ind > 4:
            break
        oneMovie = dict()
        oneMovie["title"] = elem.get("original_title", "")
        oneMovie["backdrop_path"] = elem.get("backdrop_path", "")
        oneMovie["release_date"] = elem.get("release_date", "")
        listOfDicts.append(oneMovie)
    dictJson["requests"] = listOfDicts
    jsonReturnObj = json.dumps(dictJson)
    response = app.response_class(response=jsonReturnObj, status=200, mimetype='application/json')
    return response

@app.route("/TMDBTVAiring")
def getTVAiring():
    TVAiring = requests.get("https://api.themoviedb.org/3/tv/airing_today?api_key=bf55bbc29b98e46ba33455411642f8e6")
    dictFromJson = TVAiring.json()
    dictJson = dict()
    listOfDicts = []
    for ind, elem in enumerate(dictFromJson.get('results',{})):
        if ind > 4:
            break
        oneTV = dict()
        oneTV["name"] = elem.get("original_name", "")
        oneTV["backdrop_path"] = elem.get("backdrop_path", "")
        oneTV["first_air_date"] = elem.get("first_air_date", "")
        listOfDicts.append(oneTV)
    dictJson["requests"] = listOfDicts
    jsonReturnObj = json.dumps(dictJson)
    response = app.response_class(response=jsonReturnObj, status=200, mimetype='application/json')
    return response

@app.route("/SearchMovie/<query>")
def getMovieQuery(query):
    query = re.sub(r"^\s+", "%20", query)
    genreList = requests.get("https://api.themoviedb.org/3/genre/movie/list?api_key=bf55bbc29b98e46ba33455411642f8e6&language=en-US")
    genreDict = genreList.json()
    MovieList = requests.get("https://api.themoviedb.org/3/search/movie?api_key=bf55bbc29b98e46ba33455411642f8e6&query=" + query + "&language=en-US&page=1&include_adult=false")
    dictFromJson = MovieList.json()
    dictJson = dict()
    listOfDicts = []
    for ind, elem in enumerate(dictFromJson.get('results',{})):
        if ind > 9:
            break
        oneMovie = dict()
        oneMovie["id"] = elem.get("id", 0)
        oneMovie["title"] = elem.get("original_title", "")
        oneMovie["overview"] = elem.get("overview", "")
        oneMovie["poster_path"] = elem.get("poster_path", "")
        oneMovie["release_date"] = elem.get("release_date", "")
        average = elem.get("vote_average", None)
        if (type(average) == float or type(average) == int):
            oneMovie["vote_average"] = (average/2)
        else:
            oneMovie["vote_average"] = average
        oneMovie["vote_count"] = elem.get("vote_count", None)
        listOfGenres = []
        mappingGenres = elem.get("genre_ids",[])
        for genre_id in mappingGenres:
            for genre in genreDict["genres"]:
                if genre_id == genre["id"]:
                    listOfGenres.append(genre["name"])
        oneMovie["genre_ids"] = listOfGenres
        listOfDicts.append(oneMovie)
    dictJson["requests"] = listOfDicts
    jsonReturnObj = json.dumps(dictJson)
    response = app.response_class(response=jsonReturnObj, status=200, mimetype='application/json')
    return response

@app.route("/SearchTV/<query>")
def getTVQuery(query):
    query = re.sub(r"^\s+", "%20", query)
    genreList = requests.get("https://api.themoviedb.org/3/genre/tv/list?api_key=bf55bbc29b98e46ba33455411642f8e6&language=en-US")
    genreDict = genreList.json()
    TVList = requests.get("https://api.themoviedb.org/3/search/tv?api_key=bf55bbc29b98e46ba33455411642f8e6&query=" + query + "&language=en-US&page=1&include_adult=false")
    dictFromJson = TVList.json()
    dictJson = dict()
    listOfDicts = []
    for ind, elem in enumerate(dictFromJson.get('results',{})):
        if ind > 9:
            break
        oneTV = dict()
        oneTV["id"] = elem.get("id", 0)
        oneTV["name"] = elem.get("original_name", "")
        oneTV["overview"] = elem.get("overview", "")
        oneTV["poster_path"] = elem.get("poster_path", "")
        oneTV["first_air_date"] = elem.get("first_air_date", "")
        average = elem.get("vote_average", None)
        if (type(average) == float or type(average) == int):
            oneTV["vote_average"] = (average/2)
        else:
            oneTV["vote_average"] = average
        oneTV["vote_count"] = elem.get("vote_count", 0)
        listOfGenres = []
        mappingGenres = elem.get("genre_ids",[])
        for genre_id in mappingGenres:
            for genre in genreDict["genres"]:
                if genre_id == genre["id"]:
                    listOfGenres.append(genre["name"])
        oneTV["genre_ids"] = listOfGenres
        listOfDicts.append(oneTV)
    dictJson["requests"] = listOfDicts
    jsonReturnObj = json.dumps(dictJson)
    response = app.response_class(response=jsonReturnObj, status=200, mimetype='application/json')
    return response

@app.route("/MultiSearch/<query>")
def getMultiQuery(query):
    query = re.sub(r"^\s+", "%20", query)
    genreList1 = requests.get("https://api.themoviedb.org/3/genre/movie/list?api_key=bf55bbc29b98e46ba33455411642f8e6&language=en-US")
    genreDict1 = genreList1.json()
    genreList2 = requests.get("https://api.themoviedb.org/3/genre/tv/list?api_key=bf55bbc29b98e46ba33455411642f8e6&language=en-US")
    genreDict2 = genreList2.json()
    MultiList = requests.get("https://api.themoviedb.org/3/search/multi?api_key=bf55bbc29b98e46ba33455411642f8e6&query=" + query + "&language=en-US&page=1&include_adult=false")
    dictFromJson = MultiList.json()
    dictJson = dict()
    listOfDicts = []
    ind = 0
    for elem in dictFromJson.get('results',{}):
        if ind > 9:
            break
        if (elem["media_type"] == "movie"):
            oneMovie = dict()
            oneMovie["id"] = elem.get("id", 0)
            oneMovie["title"] = elem.get("original_title", "")
            oneMovie["overview"] = elem.get("overview", "")
            oneMovie["poster_path"] = elem.get("poster_path", "")
            oneMovie["release_date"] = elem.get("release_date", "")
            average = elem.get("vote_average", None)
            if (type(average) == float or type(average) == int):
                oneMovie["vote_average"] = (average/2)
            else:
                oneMovie["vote_average"] = average
            oneMovie["vote_count"] = elem.get("vote_count", 0)
            listOfGenres = []
            mappingGenres = elem.get("genre_ids",[])
            for genre_id in mappingGenres:
                for genre in genreDict1["genres"]:
                    if genre_id == genre["id"]:
                        listOfGenres.append(genre["name"])
            oneMovie["genre_ids"] = listOfGenres
            listOfDicts.append(oneMovie)
            ind += 1
        elif (elem["media_type"] == "tv"):
            oneTV = dict()
            oneTV["id"] = elem.get("id", 0)
            oneTV["name"] = elem.get("original_name", "")
            oneTV["overview"] = elem.get("overview", "")
            oneTV["poster_path"] = elem.get("poster_path", "")
            oneTV["first_air_date"] = elem.get("first_air_date", "")
            average = elem.get("vote_average", None)
            if (type(average) == float or type(average) == int):
                oneTV["vote_average"] = (average/2)
            else:
                oneTV["vote_average"] = average
            oneTV["vote_count"] = elem.get("vote_count", 0)
            listOfGenres = []
            mappingGenres = elem.get("genre_ids",[])
            for genre_id in mappingGenres:
                for genre in genreDict2["genres"]:
                    if genre_id == genre["id"]:
                        listOfGenres.append(genre["name"])
            oneTV["genre_ids"] = listOfGenres
            listOfDicts.append(oneTV)
            ind += 1
    dictJson["requests"] = listOfDicts
    jsonReturnObj = json.dumps(dictJson)
    response = app.response_class(response=jsonReturnObj, status=200, mimetype='application/json')
    return response

@app.route("/MovieDetails/<movie>")
def getMovieDetails(movie):
    movieJSON = requests.get("https://api.themoviedb.org/3/movie/" + str(movie) + "?api_key=bf55bbc29b98e46ba33455411642f8e6&language=en-US")
    dictFromJSON = movieJSON.json()
    dictJson = dict()
    dictJson["id"] = dictFromJSON.get("id", 0)
    dictJson["title"] = dictFromJSON.get("original_title", "")
    dictJson["overview"] = dictFromJSON.get("overview", "")
    dictJson["release_date"] = dictFromJSON.get("release_date", "")
    listOfLang = []
    for lang in dictFromJSON.get("spoken_languages",[]):
        listOfLang.append(lang["english_name"])
    dictJson["spoken_languages"] = listOfLang
    average = dictFromJSON.get("vote_average", None)
    if (type(average) == float or type(average) == int):
        dictJson["vote_average"] = (average/2)
    else:
        dictJson["vote_average"] = average
    dictJson["vote_count"] = dictFromJSON.get("vote_count", 0)
    dictJson["poster_path"] = dictFromJSON.get("poster_path", "")
    dictJson["backdrop_path"] = dictFromJSON.get("backdrop_path", "")
    listOfGenres = []
    for genre in dictFromJSON.get("genres",[]):
        listOfGenres.append(genre["name"])
    dictJson["genres"] = listOfGenres
    jsonReturnObj = json.dumps(dictJson)
    response = app.response_class(response=jsonReturnObj, status=200, mimetype='application/json')
    return response


@app.route("/MovieCredits/<movie>")
def getMovieCredits(movie):
    movieJSON = requests.get("https://api.themoviedb.org/3/movie/" + str(movie) + "/credits?api_key=bf55bbc29b98e46ba33455411642f8e6&language=en-US")
    dictFromJSON = movieJSON.json()
    dictJson = dict()
    listOfActors = []
    for ind, actor in enumerate(dictFromJSON.get("cast",{})):
        if ind > 7:
            break
        internalDict = dict()
        internalDict["name"] = actor.get("name", "")
        internalDict["profile_path"] = actor.get("profile_path", "")
        internalDict["character"] = actor.get("character", "")
        listOfActors.append(internalDict)
    dictJson["requests"] = listOfActors
    jsonReturnObj = json.dumps(dictJson)
    response = app.response_class(response=jsonReturnObj, status=200, mimetype='application/json')
    return response

@app.route("/MovieReviews/<movie>")
def getMovieReviews(movie):
    movieJSON = requests.get("https://api.themoviedb.org/3/movie/" + str(movie) + "/reviews?api_key=bf55bbc29b98e46ba33455411642f8e6&language=en-US&page=1")
    dictFromJSON = movieJSON.json()
    dictJson = dict()
    listOfReviews = []
    for ind, review in enumerate(dictFromJSON.get("results",{})):
        if ind > 4:
            break
        internalDict = dict()
        internalDict["username"] = review.get("author_details", "").get("username", "")
        internalDict["content"] = review.get("content", "")
        rating = review.get("author_details", "").get("rating", None)
        if (type(rating) == float or type(rating) == int):
            internalDict["rating"] = (rating/2)
        else:
            internalDict["rating"] = rating
        internalDict["created_at"] = review.get("created_at", "")
        listOfReviews.append(internalDict)
    dictJson["requests"] = listOfReviews
    jsonReturnObj = json.dumps(dictJson)
    response = app.response_class(response=jsonReturnObj, status=200, mimetype='application/json')
    return response

@app.route("/TVDetails/<tv>")
def getTVDetails(tv):
    tvJSON = requests.get("https://api.themoviedb.org/3/tv/" + str(tv) + "?api_key=bf55bbc29b98e46ba33455411642f8e6&language=en-US")
    dictFromJSON = tvJSON.json()
    dictJson = dict()
    dictJson["id"] = dictFromJSON.get("id", 0)
    dictJson["name"] = dictFromJSON.get("original_name", "")
    dictJson["overview"] = dictFromJSON.get("overview", "")
    dictJson["first_air_date"] = dictFromJSON.get("first_air_date", "")
    listOfLang = []
    for lang in dictFromJSON.get("spoken_languages",[]):
        listOfLang.append(lang["english_name"])
    dictJson["spoken_languages"] = listOfLang
    average = dictFromJSON.get("vote_average", None)
    if (type(average) == float or type(average) == int):
        dictJson["vote_average"] = (average/2)
    else:
        dictJson["vote_average"] = average
    dictJson["vote_count"] = dictFromJSON.get("vote_count", 0)
    dictJson["poster_path"] = dictFromJSON.get("poster_path", "")
    dictJson["backdrop_path"] = dictFromJSON.get("backdrop_path", "")
    listOfGenres = []
    for genre in dictFromJSON.get("genres",[]):
        listOfGenres.append(genre["name"])
    dictJson["genres"] = listOfGenres
    jsonReturnObj = json.dumps(dictJson)
    response = app.response_class(response=jsonReturnObj, status=200, mimetype='application/json')
    return response

@app.route("/TVCredits/<tv>")
def getTVCredits(tv):
    tvJSON = requests.get("https://api.themoviedb.org/3/tv/" + str(tv) + "/credits?api_key=bf55bbc29b98e46ba33455411642f8e6&language=en-US")
    dictFromJSON = tvJSON.json()
    dictJson = dict()
    listOfActors = []
    for ind, actor in enumerate(dictFromJSON.get("cast",{})):
        if ind > 7:
            break
        internalDict = dict()
        internalDict["name"] = actor.get("name", "")
        internalDict["profile_path"] = actor.get("profile_path", "")
        internalDict["character"] = actor.get("character", "")
        listOfActors.append(internalDict)
    dictJson["requests"] = listOfActors
    jsonReturnObj = json.dumps(dictJson)
    response = app.response_class(response=jsonReturnObj, status=200, mimetype='application/json')
    return response

@app.route("/TVReviews/<tv>")
def getTVReviews(tv):
    tvJSON = requests.get("https://api.themoviedb.org/3/tv/" + str(tv) + "/reviews?api_key=bf55bbc29b98e46ba33455411642f8e6&language=en-US&page=1")
    dictFromJSON = tvJSON.json()
    dictJson = dict()
    listOfReviews = []
    for ind, review in enumerate(dictFromJSON.get("results",{})):
        if ind > 4:
            break
        internalDict = dict()
        internalDict["username"] = review.get("author_details", "").get("username", "")
        internalDict["content"] = review.get("content", "")
        rating = review.get("author_details", "").get("rating", None)
        if (type(rating) == float or type(rating) == int):
            internalDict["rating"] = (rating/2)
        else:
            internalDict["rating"] = rating
        internalDict["created_at"] = review.get("created_at", "")
        listOfReviews.append(internalDict)
    dictJson["requests"] = listOfReviews
    jsonReturnObj = json.dumps(dictJson)
    response = app.response_class(response=jsonReturnObj, status=200, mimetype='application/json')
    return response

if __name__=="__main__":
    app.run()
