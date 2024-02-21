import { Request, Response } from "express";
import adminHandler from "../handler/adminHandler";

const handler = new adminHandler()
class adminController {
    async login(req: Request, res: Response) {
        try {

            const { username, password } = req.body;
            const token = await handler.login(username, password)
            res.send({ token })
        } catch (err) {
            res.status(403).send(err)
        }
    }

    onboard(req: Request, res: Response) {
        try {
            handler.onboarding(req.body)
            res.sendStatus(200)
        } catch (err) {
            res.status(403).send(err)
        }
    }

    async getBookings(req: Request, res: Response) {
        try {
            const result = await handler.getBookings()
            res.status(200).send(result)
        } catch (err) {
            res.status(403).send(err)
        }
    }

    async reached(req:Request,res:Response){
        try{
            await handler.reached(parseInt(req.params.id+""))
            res.sendStatus(200)
        }catch(err){
            console.log(err);
            
            res.status(403).send(err)
        }
    }
}

export default adminController