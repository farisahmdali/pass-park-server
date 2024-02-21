import { connectDb } from "./utils/database";
import { createServer } from "./utils/express";
import dotenv from "dotenv";


const startServer = async() =>{
    dotenv.config()

 connectDb()
  const app = createServer()
  app.listen(8080,()=>{
    console.log("server started in port 8080");
    
  })

}

startServer()