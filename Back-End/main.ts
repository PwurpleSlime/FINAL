// @ts-types="npm:@types/express"
import express from "npm:express" 
import {ethers} from "npm:ethers" 
import artifact from "../Contract/artifacts/contracts/FinalContract.sol/FinalContract.json" with { type: "json"}
import cors from "npm:cors"
import mysql from "npm:mysql2"
import "jsr:@std/dotenv/load";
import { env } from 'node:process';

const app = express();
app.use(cors())
app.use(express.json())
// Getting Keys from the .env file.
const key:string = env.MainWalletKey!; 
const contractAddress = env.ContractAddress!


// Setting our blockchain network to Hardhat
const provider = new ethers.JsonRpcProvider();
// Setting our main wallet to pay for gas as the first wallet in Hardhat
const wallet = new ethers.Wallet(key, provider); //issue
// Setting up our contract as the snowday contract
const contract = new ethers.Contract(contractAddress, artifact.abi, wallet); 


// const code = await provider.getCode(contractAddress);
// console.log("Deployed bytecode at contract address:", code);


app.listen(3005)
console.log(`Listening on port 3005`);



const connection = mysql.createConnection({ //Conects to the database
  host: 'localhost',
  user: 'web',
  password: 'AGoodPassword',
  database: 'Final'
})
connection.connect((err)=>{
  if (err) console.error(err)
})

async function hashString(input: string): Promise<string> { // Hashes strings
  const encoder = new TextEncoder();
  const data = encoder.encode(input); // Uint8Array

  const hashBuffer = await crypto.subtle.digest("SHA-256", data); // returns ArrayBuffer
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array

  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

app.get("/", ( _ , response)=>{
  response.send("Empty Route")
})


app.post("/removeAdmin", async( req , response)=>{
  const {removeAddr, adminAddr} = req.body // Retrieves the address being removed and the address trying
  // v-- Hashes both of them
  const removeHash = hashString(removeAddr)
  const adminHash = hashString(adminAddr)
  
  console.log(await contract.removeAdmin(removeHash,adminHash)) // Runs the contract to remove an admin
  response.send("Ran")
})


app.get("/getAdminNameList", async( _ , response)=>{ // Calls the contract function to get all names and returns it
  const list = await contract.getAllAdminNames()
  response.send(list)
})
app.get("/getMeetingPlaces", ( _ , response)=>{
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'web',
    password: 'AGoodPassword',
    database: 'Final'
  })
  
  connection.connect((err)=>{
    if (err) console.error(err)
  })
  
  connection.query(`SELECT * FROM Meeting`, (err, result)=>{ // Simply gets all meetings in the database
    if (err) throw err
    console.log(result);
    response.send(result)
  })
  
})
app.post("/addAdmin", async( req , response)=>{
  const {newName, newAddr, adderAddr} = req.body // Gets info
  const newAddrHash = await hashString(newAddr) // Hashes both ---v
  const oldAddrHash = await hashString(adderAddr)
  await contract.addAdmin(newAddrHash, oldAddrHash, newName) // Runs the contract to add an admin
  response.send("Ran")
})
app.post("/addMeeting", ( req , response)=>{
  const {host, timeStart, dateStart, timeEnd, address} = req.body // Gets info
  const query = `INSERT INTO Meeting (host, timeStart, dateStart, timeEnd, address) VALUES (?, ?, ?, ?, ?)`; // Sets the query
  const values = [host, timeStart, dateStart, timeEnd, address]; // Inputs the values to be safe from injections

connection.query(query, values, (err, results) => { 
  if (err) {
    console.error("Database error:", err);
    // handle error
  } else {
    console.log("Insert successful:", results);
    // handle success
  }
});
    response.send("Welcome to our Route")
})

app.post("/addMeeting", ( req , response)=>{
  let {host, timeStart, dateStart, timeEnd, address} = req.body
  if (timeEnd === null || timeEnd === undefined){ // Fills timeEnd if it wasn't inputed
    timeEnd = ""
  }
  if (!host || !timeStart || !dateStart || !address) { // Requires these four 
    response.send("Missing Required Fields")
    return
  }
    const query = `INSERT INTO Meeting (host, timeStart, dateStart, timeEnd, address) VALUES (?, ?, ?, ?, ?)`
    const values = [host, timeStart, dateStart, timeEnd, address]
    connection.query(query, values, (err, result)=>{
      if (err) throw err
      console.log(result);
      response.send(result)
    })
    
})
app.post("/verifyAdmin", async( req , response)=>{ // Returns a true or false
  const {checkName} = req.body
  let found = false
  const list = await contract.getAllAdminNames()
  for (let i = 0; i < list.length; i++) { // Loops through all the names and sees if the passed in name matches
    if (list[i] == checkName){
      found = true
      response.send(true)
    }
  }
  if (!found) response.send(false)
})