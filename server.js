'use strict';

const express = require("express");
const movie = require("./MovieData/data.json");
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