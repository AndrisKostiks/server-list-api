import express from "express";

const app = express();
const port = 8080;

app.use(express.urlencoded({extended: true})); 
app.use(express.json());

type thingType = {
  ip: string,
  port: string,
  uuid: string,
  timeAdded: number,
}

let things: thingType[] = [];

const clearThings = () => {
  if(things.length > 0) {
    things = things.filter((value: thingType) => Date.now() - value.timeAdded < 120000);
  }
}

setInterval(clearThings,10000);

app.get( "/", ( req, res ) => {
  res.send({events:[...things]});
});

app.post( "/", (req, res) => {
  try{
    // IDI NAHUY ANDRIS
    let thing: thingType = req.body[Object.keys(req.body)[0]] === "" ? JSON.parse(Object.keys(req.body)[0]) : req.body;
    
    if (things.length === 0) {
      console.log(thing);
      
      things.push({...thing, timeAdded: Date.now()})
      return res.send("sucess");
    } 

    const index = things.findIndex(value => value.uuid === thing.uuid );
    if (index === -1) {
      things.push({...thing, timeAdded: Date.now()});
    } else {
      things[index] = {...things[index], timeAdded: Date.now()};
    }
    res.send("sucess");
  }catch (e){
    res.send(e);
  }
});

app.listen( port, () => {
  console.log( `server started at http://localhost:${ port }` );
} );