import express from "express";
import userRoute from "../routers/user"
import adminRoute from "../routers/admin"
import cors from "cors"
import morgan from "morgan"
import http from "http"

export const createServer = ()=>{
    const app = express();
    const server = http.createServer(app);
    app.use(express.json());
    app.use(cors({origin:"*"}));
    app.use(morgan("dev"));
    app.use("/admin",adminRoute)
    app.use("/",userRoute)
    return server
}


