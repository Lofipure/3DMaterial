import { ROOT_PATH } from "@/constant";
const commonPath = `${ROOT_PATH}/tag`;

export default {
  // 获取标签列表
  getTagList: {
    url: `${commonPath}/list`,
    method: "GET",
  },
  // 删除标签
  deleteTag: {
    url: `${commonPath}/delete`,
    method: "POST",
  },
  // 检查标签名重复
  checkName: {
    url: `${commonPath}/check_name`,
    method: "GET",
  },
  // 新增标签
  addTag: {
    url: `${commonPath}/add`,
    method: "GET",
  },
};
