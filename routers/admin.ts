import express,{Request,Response} from "express";
import { verifyUser } from "../middleware/middleware";
import adminController from "../controller/adminController";

const router = express.Router();

const controller = new adminController()

router.post("/login",controller.login)
router.post("/onBoard",verifyUser,controller.onboard)
router.get("/bookings",verifyUser,controller.getBookings)
router.delete("/reached/:id",verifyUser,controller.reached)





export default router