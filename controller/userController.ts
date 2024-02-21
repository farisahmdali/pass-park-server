import { Request, Response, query } from "express";
import UserHandler from "../handler/userHandler";

const handler = new UserHandler()
class userController{
  async dropDowns(req:Request,res:Response){
    try{
      const dropDowns = await  handler.getDropDowns()
      res.status(200).send(dropDowns)
    }catch(err){
        res.status(403).send(err)
    }
   }
 async availableSlots(req:Request,res:Response){
    try{
        console.log(req.query)
       const token = await handler.slotsAvailable(req.query.area+"")
       res.status(200).send(token)
    }catch(err){
        res.status(403).send(err)
    }
   }

   async bookTheSlot(req:Request,res:Response){
    try{
      console.log(req.query)
     const token = await handler.bookSlot(req.body)
     res.status(200).send(token)
  }catch(err){
    console.log(err)
      res.status(403).send(err)
  }
   }
}

export default userController