//패키지 임포트
import express from "express";
import debug from "debug";
import http from "http";
import dotenv from "dotenv";

import { setupMiddlewares } from "./middleware.js";
import { setupSecurity } from "./security.js";
import { notFound, errorHandler } from "./errorHandler.js";
import initializeSocket from "./socket.js";

import './poseDatabase.js'
import './lolDatabase.js'

dotenv.config();
debug("server:server");
const app = express();

//기타 미들웨어 설정
setupMiddlewares(app);
// 보안 미들웨어 설정
setupSecurity(app);



//db 컬렉션 임포트
import "./models/user.js";
import "./models/index.js";
import "./models/team.js";
import "./models/playList.js";
import "./models/memo.js"
// import "./models/lolUser.js"

//라우터 임포트
import indexRouter from "./routes/indexs.js";
import usersRouter from "./routes/users.js";
import teamRouter from "./routes/teams.js";
import playListRouter from "./routes/playLists.js";
import memoRouter from "./routes/memos.js";
// import lolUserRouter from "./routes/lolUsers.js";

//라우터 설정
app.use("/index", indexRouter);
app.use("/user", usersRouter);
app.use("/team", teamRouter);
app.use("/playlist", playListRouter);
app.use("/memo", memoRouter);
// app.use("/loluser", lolUserRouter);

// catch 404 and forward to error handler
app.use(notFound);

// error handler
app.use(errorHandler);

const port = normalizePort(process.env.PORT || "3001");
app.set("port", port);


const server = http.createServer(app);
server.listen(port, () => console.log(`socketio server on ${port}`));
server.on("error", onError);
server.on("listening", onListening);


const io = initializeSocket(server);

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
}

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}
