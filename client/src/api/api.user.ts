import { ROOT_PATH } from "@/constant";
const commonPath = `${ROOT_PATH}/user`;

export default {
  // 登录
  login: {
    url: `${commonPath}/login`,
    method: "POST",
  },
  // 注册 && 修改用户信息
  save: {
    url: `${commonPath}/save`,
    method: "POST",
  },
  // 获取全量的用户列表
  getUserList: {
    url: `${commonPath}/list`,
    method: "GET",
  },
  // 获取用户详情
  getUserDeatil: {
    url: `${commonPath}/detail`,
    method: "GET",
  },
  // 获取某一用户的 协作者
  getRelativeUserList: {
    url: `${commonPath}/relative_creator`,
    method: "GET",
  },
  // 获取用户的 「访问记录」和「提交记录」
  getRecord: {
    url: `${commonPath}/record`,
    method: "GET",
  },
  // 获取用户的 关系图
  getAnalyzeGraph: {
    url: `${commonPath}/analyze/graph`,
    method: "GET",
  },
  // 获取用户的 分析图表数据
  getAnalyzeDetail: {
    url: `${commonPath}/analyze/detail`,
    method: "GET",
  },
  // 点赞
  goodsTo: {
    url: `${commonPath}/goods_to`,
    method: "GET",
  },
  // 访问
  visit: {
    url: `${commonPath}/visit`,
    method: "GET",
  },
};
