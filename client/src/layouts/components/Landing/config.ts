import goodGirl from "@/assets/svg/goodGirl.svg";
import phone from "@/assets/svg/phone.svg";
import modularIcon from "@/assets/svg/modularIcon.svg";
import trendIcon from "@/assets/svg/trendIcon.svg";

interface IBlock {
  title: string;
  desc: string;
  img: string;
  icon: string;
}
interface IModular {
  title: string;
  configs: IBlock[];
}

export const modularConfigs: IModular[] = [
  {
    title: "功能特性",
    configs: [
      {
        title: "丰富社区",
        desc: "提供了强大的社区交往能力，覆盖各个行业，是学习和交流的不二之选。",
        icon: modularIcon,
        img: goodGirl,
      },
      {
        title: "效果监测",
        desc: "提供站点统计服务，可以时刻洞察模型投放效果，为进一步优化素材表现提供依据。",
        img: phone,
        icon: trendIcon,
      },
    ],
  },
];
