"use strict"
const express = require("express");
const client = require("../client");
const axios=require("axios")
const movie=require("../MovieData/data.json")
const Router = express.Router();

Router.get("/", moviesInfoHandler);
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

Router.get("/favorite",(req,res,next) => {
    try{
        res.send("Welcome to Favorite Page")
    }catch(e){
        next(`Favorite Movie Route: ${e}`)
    }
})
    
Router.get("/trending", async (req,res,next) => {
    try{
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
    }catch(e){
        next(`Trending Movies Route: ${e}`)
    }
    });

Router.get("/search", async(req,res,next) => {
    try{
        let MovieName = req.query.title;
        let axiosResponse = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.SecretAPI}&language=en-US&query=${MovieName}`);
        res.send(axiosResponse.data);
    }catch (e){
        next(`Search Movies Route: ${e}`)
    }
 
  });

Router.get("/people", async(req,res,next) => {
   try{
    let people= await axios.get(`https://api.themoviedb.org/3/person/changes?api_key=${process.env.SecretAPI}&language=en-US`)
    const peopleData=people.data.results.map(person =>({
        id:person.id,
        name:person.adult
    }))
    res.json(peopleData);
   }catch(e){
    next(`People Route: ${e}`)
   }
})  

Router.get("/tv_list", async (req,res,next)=>{
    try{
        let list= await axios.get(`https://api.themoviedb.org/3/tv/changes?api_key=${process.env.SecretAPI}&language=en-US&page=1`)
    console.log(list);
    res.send(list.data);
    }catch(e){
        next(`Tv_list Route: ${e}`)
    }
})


Router.post("/addMovie", (req, res,next) => {
  try{
    let title = req.body.t;
  let overview = req.body.o;
  let comments = req.body.c;
  let year = req.body.y;

  let sql = `insert into movie(title,overview,comments,year) values($1,$2,$3,$4)`;
  client.query(sql, [title, overview, comments, year]).then(() => {
    res.status(201).send(`movie ${title} added to database`);
  });
  }catch{
    next(`Add movie Route: ${e}`)
  }
});

// {
//     "t":"",
//     "o":"",
//     "c":"",
//     "y":""
// }

Router.get("/getMovies", (req, res,next) => {
 try{
    let sql = `SELECT * FROM movie`;
    client.query(sql).then((moviesData) => {
      res.status(200).send(moviesData.rows);
    });
 }catch{
    next(`Get movie Route: ${e}`)
 }
});

Router.put("/UPDATE/:id", (req,res,next)=>{
  try{
    let { newComment } = req.body;
  let sql= `UPDATE movie SET comments=$1 WHERE id=${req.params.id}`;
  client.query(sql, [newComment]).then(()=>{
    res.status(200).send("Comments have been updated");
  })
  }catch{
    next(`Update movie Route: ${e}`)
  }
  });
  

Router.delete("/DELETE/:id", (req,res,next)=>{
  try{
    let sql= `DELETE FROM movie WHERE id=${req.params.id}`;
  client.query(sql).then(()=>{
    res.status(200).send("Movie has been deleted");
  });
  }catch{
    next(`Delete movie Route: ${e}`)
  }
})

Router.get("/getMovie/:id", (req,res,next)=>{
  try{
    let sql= `SELECT * FROM movie WHERE id=${req.params.id}`;
  client.query(sql).then(moviesData => {
    res.status(200).send(moviesData.rows);})
  }catch{
    next(`Get movie with ID Route: ${e}`)
  }
})


module.exports = Router;