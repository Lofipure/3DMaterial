import Koa from "koa";
import { EMAIL_COOKIE_KEY, TOKEN_COOKIE_KEY, wihteList } from "../constant";
import { getUserLoginToken } from "../Models/Users";
import { resCreator } from "../utils";

/**
 * 检查登录态是否有效
 * @param {Koa.ParameterizedContext} ctx http 上下文
 * @param {Koa.Next} next next
 */
export const checkAuthMiddleware = async (
  ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext, any>,
  next: Koa.Next,
) => {
  if (!wihteList.includes(ctx.path)) {
    const login_token = ctx.cookies.get(TOKEN_COOKIE_KEY);
    const email = ctx.cookies.get(EMAIL_COOKIE_KEY);

    if (!email || !login_token) {
      ctx.body = resCreator(1, {
        missingLogin: true,
      });
      return;
    }

    const localToken = await getUserLoginToken(email);
    if (localToken != login_token) {
      ctx.body = resCreator(1, {
        missingLogin: true,
      });
      return;
    }
  }
  await next();
};

/**
 * Debug 专用中间件 
 */
export const debugMiddleware = async (
  ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext, any>,
  next: Koa.Next,
) => {
  console.log(`「 🎉 」请求方法: ${ctx.method}`);
  console.log(`「 🎉 」请求路径: ${ctx.url}`);

  await next();
};
