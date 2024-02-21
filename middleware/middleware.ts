import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"


export const verifyUser = (req:any,res:Response,next:NextFunction)=>{
    try {
            
        if (req.headers.authorization) {
          const {id}:any = jwt.verify(req.headers.authorization, process.env.TOKEN + "");
          console.log(id,"auth");
          
          req.id = id;
          next();
        } else {
          console.log("not authenticated")
          res.sendStatus(403);
        }
      } catch (err) {
        console.log(err);
        res.sendStatus(403);
      }
}

export const verifyAndGetId = (token:string)=>{
  try {
          
      if (token) {
        const {id}:any = jwt.verify(token, process.env.TOKEN + "");
        console.log(id,"auth");
        
       return id;
      } else {
        throw new Error("no token")
      }
    } catch (err) {
      throw new Error("Token not verified")
    }
}