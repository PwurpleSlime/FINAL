// @ts-types="npm:@types/express"
import express from "express" // Errors out with npm:express, no idea why
import {ethers} from "ethers" // Same Issue ---^
import artifact from "../Contract/artifacts/contracts/FinalContract.sol/FinalContract.json" with { type: "json"}
import cors from "cors"
import mysql from "mysql2"
import process from "node:process";
const app = express();
app.use(cors())

// Getting Keys from the .env file.
const key:string = process.env.MainWalletKey!; 
const contractAddress = process.env.ContractAddress!

// Setting our blockchain network to Hardhat
const provider = new ethers.JsonRpcProvider();
// Setting our main wallet to pay for gas as the first wallet in Hardhat
// const wallet = new ethers.Wallet(key, provider); //issue
// Setting up our contract as the snowday contract
// const contract = new ethers.Contract(contractAddress, artifact.abi, wallet); 

app.listen(3005)
console.log(`Listening on port 3005`);



const connection = mysql.createConnection({
  host: 'localhost',
  user: 'web',
  password: 'AGoodPassword',
  database: 'Final'
})




app.get("/", ( _ , response)=>{
  connection.connect((err)=>{
    if (err) console.error(err)
  })
  
  connection.query(`SELECT * FROM Meeting`, (err, result)=>{
    if (err) throw err
    console.log(result);
    
  })
  response.send("Welcome to our Route")
})

app.post("/getAdminNameList", async( _ , response)=>{
  // const list = await contract.getAllAdminNames()
  // response.send(list)
  response.send("yes")
})