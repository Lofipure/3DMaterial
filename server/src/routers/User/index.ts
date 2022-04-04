import Router from "koa-router";
import * as ReqType from "@/types/User/req.type";
import * as UserMethod from "@/Models/Users";
import { resCreator } from "@/utils";
import md5 from "md5";
import {
  EMAIL_COOKIE_KEY,
  LoginUserStatus,
  TOKEN_COOKIE_KEY,
} from "@/constant";

const userRouter = new Router({
  prefix: "/user",
});

userRouter.post("/login", async (ctx) => {
  const req: ReqType.ILogin = ctx.request.body;
  const token = md5(new Date().toDateString());
  const res = await UserMethod.login(req, token);
  if (res.status === LoginUserStatus.success) {
    ctx.cookies.set(EMAIL_COOKIE_KEY, req.email, {
      httpOnly: false,
    });
    ctx.cookies.set(TOKEN_COOKIE_KEY, token, {
      httpOnly: false,
    });
  }
  ctx.body = resCreator(1, res);
});

userRouter.post("/save", async (ctx) => {
  const req: ReqType.IRegister = ctx.request.body;
  const res = await UserMethod.saveUser(req);
  ctx.body = resCreator(1, res);
});

userRouter.get("/list", async (ctx) => {
  ctx.body = resCreator(1, await UserMethod.getUserList());
});

userRouter.get("/detail", async (ctx) => {
  ctx.body = resCreator(
    1,
    await UserMethod.getUserDetail(ctx.request.query.uid as string),
  );
});

userRouter.get("/relative_creator", async (ctx) => {
  const req: ReqType.IRelativeCreator = ctx.request.query as any;
  ctx.body = resCreator(1, await UserMethod.getRelativeCreator(req));
});

userRouter.get("/record", async (ctx) => {
  const req: ReqType.IRecord = ctx.request.query as any;
  ctx.body = resCreator(1, await UserMethod.getUserRecord(req));
});

userRouter.get("/analyze/graph", async (ctx) => {
  const req: ReqType.IGraph = ctx.request.query as any;
  ctx.body = resCreator(1, await UserMethod.getUserGraph(req));
});

userRouter.get("/analyze/detail", async (ctx) => {
  const req: ReqType.IAnalyze = ctx.request.query as any;
  ctx.body = resCreator(1, await UserMethod.getUserAnalyze(req));
});

userRouter.get("/visit", async (ctx) => {
  const req: ReqType.IVisit = ctx.request.query as any;
  ctx.body = resCreator(1, await UserMethod.visitModel(req));
});

userRouter.get("/goods_to", async (ctx) => {
  const req: ReqType.IGoods = ctx.request.query as any;
  ctx.body = resCreator(1, await UserMethod.goodsToModel(req));
});
export default userRouter;
