export const PORT = 9015;
export const IP = "http://localhost";

export enum saveUserStatus {
  success = 1, // 成功
  has = 2, // 已经存在
}

export enum LoginUserStatus {
  success = 1, // 成功
  noUser = 2, // 用户不存在
  passwordError = 3, // 密码错误
}

/**
 * Response Cookie 中的 Key
 */
export const EMAIL_COOKIE_KEY = "__3d_material_email";
export const TOKEN_COOKIE_KEY = "__3d_material_login-token";

/**
 * 不校验登录态的路由
 */
export const wihteList = [
  "/tools/user_avatar",
  "/tools/model_cover",
  "/tools/model_url",
  "/user/login",
  "/user/save"
];

export const DB_NAME = "3d_material";
export const DB_USER_NAME = "root";
export const DB_PWD = "12345678";
