'use strict';

const express = require("express");
const app = express();
app.listen(3001);

const cors=require("cors");
app.use(cors());

app.get("/", moviesInfoHandler);
app.get("/favorite",handleFav)
app.get("/error",serverError)
app.get("*",notFoundError)

function moviesInfoHandler(req, res) 
{

  function MoviesInfo(title, posterPath, overview) 
  {
     this.mTitle = title;
     this.mPosterPath = posterPath;
     this.mOverview = overview;
  }

    const movie = {
        "title": "Spider-Man: No Way Home",
        "genre_ids": [28, 12, 878],
        "original_language": "en",
        "original_title": "Spider-Man: No Way Home",
        "poster_path": "/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
        "video": false,
        "vote_average": 8.4,
        "overview": "Peter Parker is unmasked and no longer able to separate his normal life from the high-stakes of being a super-hero. When he asks for help from Doctor Strange the stakes become even more dangerous, forcing him to discover what it truly means to be Spider-Man.",
        "release_date": "2021-12-15",
        "vote_count": 3160,
        "id": 634649,
        "adult": false,
        "backdrop_path": "/1Rr5SrvHxMXHu5RjKpaMba8VTzi.jpg",
        "popularity": 10039.54,
        "media_type": "movie"
    };
    const movieObj = new MoviesInfo(movie.title, movie.poster_path, movie.overview);

    res.json({
        title: movieObj.mTitle,
        poster_path: movieObj.mPosterPath,
        overview: movieObj.mOverview
    });
}

function handleFav(req,res)
{
    res.send("Welcome to Favorite Page")
}

function serverError(req,res)
{
    res.status(500).send("Sorry, something went wrong");
}

function notFoundError(req,res)
{
    res.status(404).send("Page not found");
}