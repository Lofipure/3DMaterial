/**
 * 格式化响应体
 * @param {number} code 响应码
 * @param {any} data 响应信息
 * @returns 格式化之后的 Http Response
 */
export const resCreator = (code: number, data: any) => ({
  code,
  data,
});
