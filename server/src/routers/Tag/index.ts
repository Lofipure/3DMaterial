import { resCreator } from "@/utils";
import * as TagMethod from "@/Models/Tags";
import Router from "koa-router";

const tagRouter = new Router({
  prefix: "/tag",
});

tagRouter.get("/add", async (ctx) => {
  const res = await TagMethod.addTag(
    ctx.request.query.tag_name as string,
    Number(ctx.request.query.uid),
    Number(ctx.request.query.tid),
  );
  ctx.body = resCreator(1, res);
});

tagRouter.get("/check_name", async (ctx) => {
  const result = await TagMethod.checkTagName(
    ctx.request.query.tag_name as string,
  );
  ctx.body = resCreator(1, {
    status: !result,
  });
});

tagRouter.get("/list", async (ctx) => {
  const { uid, name, is_self } = ctx.request.query;
  console.log(typeof uid, typeof name);
  if (
    (typeof uid == "string" || typeof uid == "undefined") &&
    (typeof name == "string" || typeof name == "undefined") &&
    (typeof is_self == "string" || typeof is_self == "undefined")
  ) {
    ctx.body = resCreator(
      1,
      await TagMethod.getTagList(Number(uid), name, !!is_self),
    );
  } else {
    ctx.body = resCreator(0, { status: 0 });
  }
});

tagRouter.post("/delete", async (ctx) => {
  const req = ctx.request.body.tid;
  ctx.body = resCreator(1, await TagMethod.deleteTags(req));
});
export default tagRouter;
