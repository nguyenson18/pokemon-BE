const express = require('express')
const router = express.Router()
const fs = require("fs")



router.get('/pokemons',(req, res, next)=>{
    const allowedFilter = [
        "search",
        "type",
      ];
    try {
        let { page, limit, ...filterQuery} = req.query;
        console.log(filterQuery)
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 20;
         //allow title,limit and page query string only
        const filterKeys = Object.keys(filterQuery);
        filterKeys.forEach((key) => {
        if (!allowedFilter.includes(key)) {
            const exception = new Error(`Query ${key} is not allowed`);
            exception.statusCode = 401;
            throw exception;
        }
        if (!filterQuery[key]) delete filterQuery[key];
        });

        //Number of items skip for selection
        let offset = limit * (page - 1);

        let db = fs.readFileSync("pokemon.json", "utf-8");
        db = JSON.parse(db);
        const {data, totalPokemon } = db;
        let result = [];
        let totalPage = Math.ceil(totalPokemon/ limit)
        if (filterKeys.length) {
         filterKeys.forEach((condition) => {
        
           if(condition === "search"){
            result = result.length
            ? result.filter((poke) =>  poke.name.includes(filterQuery[condition]))
            : result = data.filter((poke) => poke.name.includes(filterQuery[condition])); 
           } 

           if(condition === "type"){
            result = result.length
            ? result.filter((poke) => poke.types.find(e => e=== filterQuery[condition]))
            : result = data.filter((poke) => poke.types.find(e => e=== filterQuery[condition])); 
           }          
          });

          result = result.slice(offset, offset + limit)
        } else {
          result = data.slice(offset, offset + limit)
        }
        
        res.status(200).send({data: result, totalPokemon, totalPage})
    } catch (error) {
        next(error)
    }
})

router.get('/pokemons/:pokemonId', (req, res, next)=> {
  
 try {
      const allowUpdate= ["name", "types", "url", "height", "weight"]
      const { pokemonId }=req.params
      const updates=req.body
      const updateKeys=Object.keys(updates)
      const notAllow = updateKeys.filter(el=>!allowUpdate.includes(el));
        if(notAllow.length){
        const exception = new Error(`Update field not allow`);
        exception.statusCode = 401;
        throw exception;
        }
        let db = fs.readFileSync("pokemon.json", "utf-8");
        db = JSON.parse(db);
        const {data, totalPokemon} = db;

        let result = {
          pokemon:{},
          previousPokemon:{},
          nextPokemon:{}
        }
        const targetIndex = data.findIndex(e => e.id === parseInt(pokemonId))
        if(targetIndex < 0){
          const exception = new Error(`pokemon not found`);
              exception.statusCode = 404;
              throw exception;
        }
      const updatedPoke={...db.data[targetIndex],...updates}
      const nextPoke= {...db.data[targetIndex + 1 === totalPokemon ? (count = 1)-1 : targetIndex + 1],...updates}
      const previousPoke= {...db.data[targetIndex-1 < 0 ? data.length -1 : targetIndex - 1],...updates}

      result.pokemon=updatedPoke
      result.nextPokemon = nextPoke
      result.previousPokemon = previousPoke
    res.status(200).send({data: result})
 } catch (error) {
    next(error)
 }
})

router.post('/pokemons',(req, res, next) => {
  const crypto=require('crypto')
    try{
        const { name, types, url, height, weight } = req.body;
    if(!name || !types || !url || !height || !weight ){
        const exception = new Error(`Missing body info`);
        exception.statusCode = 401;
        throw exception;
    }
    //post processing
    const newPoke = {name, types, url, height: parseInt(height) , weight: parseInt(weight), id: crypto.randomBytes(4).toString("hex")
        };
        //Read data from db.json then parse to JSobject
        let db = fs.readFileSync("pokemon.json", "utf-8");
        db = JSON.parse(db);
        const { data } = db;

        //Add new book to book JS object
        data.push(newPoke)
        //Add new book to db JS object
        db.data=data
        //db JSobject to JSON string
        db= JSON.stringify(db)
        //write and save to db.json
    fs.writeFileSync("pokemon.json",db)
    res.status(200).send(newPoke)
    }catch(error){
        next(error)
    }
})

router.put("/pokemons/:pokemonId", (req, res, next)=> {
  try {
    const allowUpdate= ["name", "types", "url", "height", "weight"]

    const { pokemonId }=req.params
    const updates=req.body
    const updateKeys=Object.keys(updates)
    //find update request that not allow
    const notAllow = updateKeys.filter(el=>!allowUpdate.includes(el));
    if(notAllow.length){
    const exception = new Error(`Update field not allow`);
    exception.statusCode = 401;
    throw exception;
    }
//put processing
//Read data from db.json then parse to JSobject
    let db = fs.readFileSync("pokemon.json", "utf-8");
    db = JSON.parse(db);
    const { data } = db;
    //find book by id
    const targetIndex=data.findIndex(poke=>poke.id=== pokemonId)

    if(targetIndex < 0){
        const exception = new Error(`Book not found`);
            exception.statusCode = 404;
            throw exception;
    }
        //Update new content to db book JS object
    const updatedPokemon={...db.data[targetIndex],...updates}
    db.data[targetIndex]=updatedPokemon
    //db JSobject to JSON string

    db=JSON.stringify(db)
        //write and save to db.json
    fs.writeFileSync("pokemon.json",db)
  //put send response
  res.status(200).send(updatedPokemon)
  } catch (error) {
    next(error)
  }
})

router.delete('/pokemons/:pokemonId', (req, res, next)=>{
  try {
    const { pokemonId }=req.params
    //delete processing
    //Read data from db.json then parse to JSobject
    let db = fs.readFileSync("pokemon.json", "utf-8");
    db = JSON.parse(db);
    const { data } = db;
    //find book by id
    const targetIndex=data.findIndex(poke=>poke.id===pokemonId)
    if(targetIndex < 0){
        const exception = new Error(`pokemon not found`);
            exception.statusCode = 404;
            throw exception;
    }
        //filter db books object
    db.data = data.filter(poke=>poke.id !== pokemonId)
        //db JSobject to JSON string

    db=JSON.stringify(db)
        //write and save to db.json

    fs.writeFileSync("pokemon.json",db)
    //delete send response
  } catch (error) {
    next(error)
  }
})
module.exports = router