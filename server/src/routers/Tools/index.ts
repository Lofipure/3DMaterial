import Router from "koa-router";
import fse from "fs-extra";
import path from "path";
import { resCreator } from "../../utils";
import { IP, PORT } from "../../constant";
const toolRouter = new Router({
  prefix: "/tools",
});

const createHash = () =>
  Array.from(Array(24), () => Math.floor(Math.random() * 36).toString(36)).join(
    "",
  );

toolRouter.post("/user_avatar", async (ctx) => {
  const hash = createHash();
  const { user_avatar } = ctx.request.files as Record<string, any>;
  const { name, path: filePath } = user_avatar;
  const dest = path.join(process.cwd(), "/file/user_avatar", hash + name);
  await fse.move(filePath, dest);
  ctx.body = resCreator(1, {
    path: `${IP}:${PORT}/file/user_avatar/${hash + name}`,
  });
});

toolRouter.post("/model_cover", async (ctx) => {
  const hash = createHash();
  const { model_cover } = ctx.request.files as Record<string, any>;
  const { name, path: filePath } = model_cover;
  const dest = path.join(process.cwd(), "/file/model_cover", hash + name);
  await fse.move(filePath, dest);
  ctx.body = resCreator(1, {
    path: `${IP}:${PORT}/file/model_cover/${hash + name}`,
  });
});

toolRouter.post("/model_url", async (ctx) => {
  const hash = createHash();
  const { model_url } = ctx.request.files as Record<string, any>;
  const { name, path: filePath } = model_url;
  const dest = path.join(process.cwd(), "/file/model_url", hash + name);
  await fse.move(filePath, dest);
  ctx.body = resCreator(1, {
    path: `${IP}:${PORT}/file/model_url/${hash + name}`,
  });
});

export default toolRouter;
