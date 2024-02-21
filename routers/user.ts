import express,{Request,Response} from "express";
import { verifyUser } from "../middleware/middleware";
import userController from "../controller/userController";

const router = express.Router();

const controller = new userController()
router.get("/placesDrop",controller.dropDowns)
router.get("/availableSlots",controller.availableSlots)
router.post("/bookTheSlot",controller.bookTheSlot)




export default router