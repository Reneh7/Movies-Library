'use strict';

const express = require("express");
const movie = require("./MovieData/data.json");
const app = express();
const movie=require("./MovieData/data.json")
const axios=require("axios")
const pg=require("pg");
const e = express();
require("dotenv").config();
app.use(express.json());


// app.listen(3000);

const cors=require("cors");
app.use(cors());

const DB_URL = process.env.DATABASE_URL;
const client = new pg.Client(DB_URL);

app.get("/", moviesInfoHandler);
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

app.get("/favorite",(req,res) => send("Welcome to Favorite Page"))

app.get("/trending", async (req,res) => {
    let trendingMovies = await axios.get(
        `https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.SecretAPI}&language=en-US`
      );
      const moviesData = trendingMovies.data.results.map(movie => ({
        id: movie.id,
        title: movie.title,
        release_date: movie.release_date,
        poster_path: movie.poster_path,
        overview: movie.overview
      }));
      res.json(moviesData)
    });

app.get("/search", async(req,res) => {
    let MovieName = req.query.title;
    let axiosResponse = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.SecretAPI}&language=en-US&query=${MovieName}`);
    res.send(axiosResponse.data);
  });

app.get("/people", async(req,res) => {
    let people= await axios.get(`https://api.themoviedb.org/3/person/changes?api_key=${process.env.SecretAPI}&language=en-US`)
    const peopleData=people.data.results.map(person =>({
        id:person.id,
        name:person.adult
    }))
    res.json(peopleData);
})  

app.get("/tv_list", async (req,res)=>{
    let list= await axios.get(`https://api.themoviedb.org/3/tv/changes?api_key=${process.env.SecretAPI}&language=en-US&page=1`)
    console.log(list);
    res.send(list.data);
})


app.post("/addMovie", (req, res) => {
  let title = req.body.t;
  let overview = req.body.o;
  let comments = req.body.c;
  let year = req.body.y;

  let sql = `insert into movie(title,overview,comments,year) values($1,$2,$3,$4)`;
  client.query(sql, [title, overview, comments, year]).then(() => {
    res.status(201).send(`movie ${title} added to database`);
  });
});

app.get("/getMovies", (req, res) => {
  let sql = `SELECT * FROM movie`;
  client.query(sql).then((moviesData) => {
    res.status(200).send(moviesData.rows);
  });
});

client.connect().then(() => {
  app.listen(3000, () => {
    console.log(`Listening at 3000`);
  });
});

app.use("/error",(req,res,next) => res.status(500).send("Sorry, something went wrong"))

app.use("*",(req,res,next) => res.status(404).send("Page not found"))

