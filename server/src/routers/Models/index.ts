import Router from "koa-router";
import { resCreator } from "../../utils";
import * as ReqType from "../../types/Model/req.type";
import * as ModelMethod from "../../Models/Models";

const modelRouter = new Router({
  prefix: "/model",
});

modelRouter.post("/save", async (ctx) => {
  const req: ReqType.ISave = ctx.request.body;
  const res = await ModelMethod.saveModel(req);
  ctx.body = resCreator(1, res);
});

modelRouter.post("/list", async (ctx) => {
  const req: ReqType.IList = ctx.request.body;
  const res = await ModelMethod.getModelList(req);
  ctx.body = resCreator(1, res);
});

modelRouter.post("/set_auth", async (ctx) => {
  const req: ReqType.ISetAuth = ctx.request.body;
  const res = await ModelMethod.setAuth(req);
  ctx.body = resCreator(1, res);
});

modelRouter.post("/delete", async (ctx) => {
  const req: ReqType.IDelete = ctx.request.body;
  const res = await ModelMethod.deleteModel(req);
  ctx.body = resCreator(1, res);
});

modelRouter.get("/detail", async (ctx) => {
  const req: ReqType.IDetail = ctx.request.query as any;
  const res = await ModelMethod.getModelDetail(req);
  ctx.body = resCreator(1, res);
});

export default modelRouter;
