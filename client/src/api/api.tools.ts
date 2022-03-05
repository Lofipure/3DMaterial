import { ROOT_PATH } from "@/constant";
const commonPath = `${ROOT_PATH}/tools`;

export default {
  uploadUserAvatar: {
    url: `${commonPath}/user_avatar`,
    method: "POST",
  },
  uploadModelCover: {
    url: `${commonPath}/model_cover`,
    method: "POST",
  },
  uploadModelUrl: {
    url: `${commonPath}/model_url`,
    method: "POST",
  },
};
