import cors from "cors";
import logger from "morgan";
import express from "express";
import cookieParser from "cookie-parser";

const corsOptions = {
    origin: [
        "http://localhost:3000",
        "http://localhost:3000/",
        "https://pose2team.vercel.app",
        "https://lolmadmovie.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    };

export const setupMiddlewares = (app) => {
    app.use(cors(corsOptions));
    app.use(logger("dev"));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
};