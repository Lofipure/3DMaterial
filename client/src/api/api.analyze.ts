import { ROOT_PATH } from "@/constant";
const commonPath = `${ROOT_PATH}/analyze`;

export default {
  // 模型类型占比
  getModelTypeAnalyze: {
    url: `${commonPath}/model_type`,
    method: "GET",
  },
  // 模型访问情况
  getModelVisitAnalyze: {
    url: `${commonPath}/model_visit`,
    method: "GET",
  },
  // 标签热度分布
  getTagPopularity: {
    url: `${commonPath}/tag_pupularity`,
    method: "GET",
  },
  // 数据综合分析
  getComprehensiveAnalyze: {
    url: `${commonPath}/comprehensive_analyze`,
    method: "GET",
  },
};
