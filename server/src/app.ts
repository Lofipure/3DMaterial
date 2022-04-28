import Koa from "koa";
import path from "path";
import cors from "koa-cors";
import bodyParser from "koa-bodyparser";
import KoaBody from "koa-body";
import KoaStatic from "koa-static";
import userRouter from "./routers/User";
import toolsRouter from "./routers/Tools";
import tagRouter from "./routers/Tag";
import analyzeRouter from "./routers/Analyze";
import modelRouter from "./routers/Models";
import { PORT } from "./constant";
import { checkAuthMiddleware, debugMiddleware } from "./middleware";

const app: Koa = new Koa();

app.use(
  KoaBody({
    multipart: true,
  }),
);
app.use(bodyParser());
app.use(
  cors({
    credentials: true,
  }),
);

/**
 * Debug 专用中间件
 */
app.use(debugMiddleware);

/**
 * 检查登录态
 */
app.use(checkAuthMiddleware);

app.use(userRouter.routes());
app.use(userRouter.allowedMethods());

app.use(toolsRouter.routes());
app.use(toolsRouter.allowedMethods());

app.use(tagRouter.routes());
app.use(tagRouter.allowedMethods());

app.use(modelRouter.routes());
app.use(modelRouter.allowedMethods());

app.use(analyzeRouter.routes());
app.use(analyzeRouter.allowedMethods());

/**
 * 静态资源服务器，存储 image 和 gltf 文件
 */
app.use(KoaStatic(path.join(process.cwd(), "/")));

app.listen(PORT, () => {
  console.log("「 🚀 」Server Work On Port " + PORT);
});
