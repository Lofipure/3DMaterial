import Router from "koa-router";
import { resCreator } from "../../utils";
import * as TagMethod from "../../Models/Tags";
import * as ModelMethod from "../../Models/Models";

const analyzeRouter = new Router({
  prefix: "/analyze",
});

analyzeRouter.get("/model_type", async (ctx) => {
  ctx.body = resCreator(1, await TagMethod.getModelTypeAnalyze());
});

analyzeRouter.get("/model_visit", async (ctx) => {
  ctx.body = resCreator(1, await ModelMethod.getModelVisitAnalyze());
});

analyzeRouter.get("/tag_pupularity", async (ctx) => {
  ctx.body = resCreator(1, await TagMethod.getTagPopularAnalyze());
});

analyzeRouter.get("/comprehensive_analyze", async (ctx) => {
  ctx.body = resCreator(1, await ModelMethod.getComprehensiveAyalyze());
});

export default analyzeRouter;
