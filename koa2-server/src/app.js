import Koa from "koa";
import Router from "@koa/router";
import bodyParser from "koa-bodyparser";
import cors from "@koa/cors";
import logger from "koa-logger";
import apiRouter from "./routes/api.js";

const app = new Koa();
const router = new Router();

// ===== 中间件 =====
app.use(logger());
app.use(cors());
app.use(bodyParser());

// ===== 路由 =====
router.get("/", (ctx) => {
  ctx.body = {
    code: 200,
    message: "Koa2 Server is running!",
    timestamp: new Date().toISOString(),
  };
});

router.get("/health", (ctx) => {
  ctx.body = {
    code: 200,
    status: "ok",
  };
});

// 引入路由模块
router.use("/api", apiRouter.routes(), apiRouter.allowedMethods());

app.use(router.routes());
app.use(router.allowedMethods());

// ===== 错误处理 =====
app.on("error", (err, ctx) => {
  console.error("Server error:", err.message, ctx);
});

export default app;
