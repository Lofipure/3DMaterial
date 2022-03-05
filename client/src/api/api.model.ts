import { ROOT_PATH } from "@/constant";
const commonPath = `${ROOT_PATH}/model`;

export default {
  // 获取模型列表
  getModelList: {
    url: `${commonPath}/list`,
    method: "POST",
  },
  // 获取模型详情
  getModelDetail: {
    url: `${commonPath}/detail`,
    method: "GET",
  },
  // 删除模型
  deleteModel: {
    url: `${commonPath}/delete`,
    method: "POST",
  },
  // 设置协作者权限
  setAuth: {
    url: `${commonPath}/set_auth`,
    method: "POST",
  },
  // 保存模型
  saveModel: {
    url: `${commonPath}/save`,
    method: "POST",
  },
};
