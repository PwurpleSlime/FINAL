// @ts-types="npm:@types/express"
import express from "express" // Errors out with npm:express, no idea why
import {ethers} from "ethers" // Same Issue ---^
import artifact from "../Contract/artifacts/contracts/FinalContract.sol/FinalContract.json" with { type: "json"}
import cors from "cors"
import mysql from "mysql2"
import process from "node:process";
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



const connection = mysql.createConnection({
  host: 'localhost',
  user: 'web',
  password: 'AGoodPassword',
  database: 'Final'
})


async function hashString(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input); // Uint8Array

  const hashBuffer = await crypto.subtle.digest("SHA-256", data); // returns ArrayBuffer
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array

  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

app.get("/", ( _ , response)=>{
  connection.connect((err)=>{
    if (err) console.error(err)
  })
  
  // connection.query(`SELECT * FROM Meeting`, (err, result)=>{
  //   if (err) throw err
  //   console.log(result);
    
  // })
  response.send("Welcome to our Route")
})

app.get("/getAdminNameList", async( _ , response)=>{
  console.log("Getting admins");
  
  const list = await contract.getAllAdminNames()

  
  response.send(list)
  // response.send("yes")
})

app.post("/addAdminOwner", async( req , response)=>{
  const {name, newAddr} = req.body
  const addrHash = await hashString(newAddr)
  await contract.addAdmin(addrHash, "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d", name )
  response.send("Yes")
})