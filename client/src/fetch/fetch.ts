import axios, { AxiosResponse } from "axios";
import { Modal } from "antd";
import { ResponseCode } from "@/constant/enums";
import { SUCCESS_CODE } from "@/api/config";
import { history } from "umi";

const _succed = (reps: any): boolean =>
  SUCCESS_CODE.includes(reps?.code) || reps.success;

const checkCode = (
  response: ResponseCode,
  // eslint-disable-next-line @typescript-eslint/ban-types
  succeed?: Function,
): Promise<any> => {
  if ((response as any).code === 403) {
    Modal.info({
      title: "登录态失效，请重新登陆",
      onOk: () => {
        history.push("/");
      },
    });
    return Promise.reject(response);
  }
  if (succeed ? succeed(response) : _succed(response)) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(response);
  }
};

/**
 * 返回状态码对应文本提示信息
 * @param {number} code 响应状态码
 * @param {string} msg 响应状态码
 * @return {string} 文本提示
 */
const getErrorMsgByStatusCode = (msg: string, code: number): string => {
  let result = "Unknow Error";
  if (
    code >= ResponseCode.BAD_REQUEST &&
    code < ResponseCode.INTERVAL_SERVER_ERROR
  ) {
    switch (code) {
      case ResponseCode.UNAUTHORIZED:
        result = msg || "You are not logged in, please log in and visit.";
        break;
      case ResponseCode.FORBIDDEN:
        result = msg || "The resource you requested is forbidden to access.";
        break;
      case ResponseCode.NOT_FOUND:
        result = msg || "The resource you requested does not exist.";
        break;
      case ResponseCode.METHOD_NOT_ALLOWED:
        result = msg || "Illegal request is forbidden.";
        break;
      case ResponseCode.NOT_ACCEPTABLE:
        result = msg || "Parameter error.";
        break;
      default:
        result = `${"Sorry, there is a problem with the system."}(${code}).`;
    }
  } else if (
    code >= ResponseCode.INTERVAL_SERVER_ERROR &&
    code < ResponseCode.OTHER
  ) {
    result = msg ?? "The Server is wrong";
  }
  return result;
};

/**
 * 检查接口响应状态码
 * @param {Object} response fetch返回的响应对象
 * @return {Object} 状态码正常时返回响应本身，否则返回 reject 信息
 */
function checkStatus(response: AxiosResponse): Promise<any> {
  if (
    response.status >= ResponseCode.OK &&
    response.status < ResponseCode.MULTIPLE_CHOICE
  ) {
    return Promise.resolve(response.data);
  } else {
    const message = getErrorMsgByStatusCode(
      response.data.message,
      response.status,
    );
    return Promise.reject({ message, response: response.data });
  }
}

/**
 * 异常处理函数，包含错误提示
 * @param {Object} e 错误信息
 */
function handleError(e: any, showMessage: boolean): void {
  // 断网情况
  if (!e) {
    e.message =
      navigator && navigator.onLine ? "Network error" : "Network interruption";
  }
  // showMessage && message.error(e.message || e.msg);
  if (showMessage) {
    console.error(e.message);
  }
  throw e;
}

/**
 * 服务端返回响应值
 * @param {Object} res response的响应信息
 */
function jsonParse(res: Response): Promise<any> {
  return Promise.resolve(res)
    .then((jsonResult) => jsonResult)
    .catch((err) => {
      return Promise.reject({
        message: err.message || "JSON error",
      });
    });
}

export default {
  request: (
    url: string,
    config: Record<string, any>,
    // eslint-disable-next-line @typescript-eslint/ban-types
    succeed: Function | undefined,
    showMessage: boolean,
  ) => {
    return axios(url, {
      ...config,
      withCredentials: true,
    })
      .then(checkStatus)
      .then(jsonParse)
      .then((res) => checkCode(res, succeed))
      .catch((e) => handleError(e, showMessage));
  },
};
