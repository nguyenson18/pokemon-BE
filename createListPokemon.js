const fs = require("fs")
const csv = require("csvtojson")
const {faker} = require('@faker-js/faker')

const createListPokemon = async()=>{
    let newData = await csv().fromFile("pokemon.csv")
    let data = JSON.parse(fs.readFileSync("pokemon.json"))
    let id = 1
    newData = newData.slice(0,721).map((e)=> {
        let product= {
            name: e.Name,
            types: [
                e.Type1.toLowerCase(),
                !e.Type2 ? "" : e.Type2.toLowerCase()
            ],      
            url:`http://localhost:8000/pokemon/${id}.png`,
            id: id++,
            height: `${faker.datatype.number({min:2, max:50, precision:0.1})}`,
            weight: `${faker.datatype.number({min:10, max:100, precision:0.01})} lbs`,
        }
        product.types = product.types.filter((e)=> e)
        return product
    })
   
    data.data = newData
    data.totalPokemon = newData.length
    fs.writeFileSync("pokemon.json", JSON.stringify(data))
}
createListPokemon();

// const datas1 =[{
//     name: 'bulbasaur',
//     types: [ 'grass', 'poison' ],
//     url: 'http://localhost:8000/pokemon/1.png',
//     id: 1,
//     height: '48.4',
//     weight: '31.84 lbs'
//   },
//   {
//     name: 'ivysaur',
//     types: [ 'grass', 'poison' ],
//     url: 'http://localhost:8000/pokemon/2.png',
//     id: 2,
//     height: '2.9',
//     weight: '65.67 lbs'
//   },
//   {
//     name: 'venusaur',
//     types: [ 'grass', 'poison' ],
//     url: 'http://localhost:8000/pokemon/3.png',
//     id: 3,
//     height: '25.4',
//     weight: '43.84 lbs'
//   },
//   {
//     name: 'charmander',
//     types: [ 'fire', '' ],
//     url: 'http://localhost:8000/pokemon/4.png',
//     id: 4,
//     height: '34.6',
//     weight: '44.8 lbs'
//   },
//   {
//     name: 'charmeleon',
//     types: [ 'fire', '' ],
//     url: 'http://localhost:8000/pokemon/5.png',
//     id: 5,
//     height: '40.5',
//     weight: '52.44 lbs'
//   },
//   {
//     name: 'charizard',
//     types: [ 'fire', 'flying' ],
//     url: 'http://localhost:8000/pokemon/6.png',
//     id: 6,
//     height: '27.2',
//     weight: '95.88 lbs'
//   },
//   {
//     name: 'squirtle',
//     types: [ 'water', '' ],
//     url: 'http://localhost:8000/pokemon/7.png',
//     id: 7,
//     height: '13.8',
//     weight: '25.35 lbs'
//   },
//   {
//     name: 'wartortle',
//     types: [ 'water', '' ],
//     url: 'http://localhost:8000/pokemon/8.png',
//     id: 8,
//     height: '26.4',
//     weight: '82.48 lbs'
//   },
//   {
//     name: 'blastoise',
//     types: [ 'water', '' ],
//     url: 'http://localhost:8000/pokemon/9.png',
//     id: 9,
//     height: '28.7',
//     weight: '87.88 lbs'
//   },
//   {
//     name: 'caterpie',
//     types: [ 'bug', '' ],
//     url: 'http://localhost:8000/pokemon/10.png',
//     id: 10,
//     height: '39.1',
//     weight: '69.72 lbs'
//   },
// ]
// const adasdsa = datas1.map((e)=> {
//     const type = e.types
//     const dadsadsa = type.filter(e=> e)
//     return {
//         name: e.name,
//         types: dadsadsa
//     }
// })
// console.log(adasdsa)