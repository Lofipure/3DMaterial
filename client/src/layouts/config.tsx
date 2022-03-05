import { Route } from "@ant-design/pro-layout/lib/typings";
import {
  PieChartOutlined,
  ProfileOutlined,
  FileSyncOutlined,
  UserOutlined,
} from "@ant-design/icons";
import logo from "@/assets/svg/logo.svg";
import { BasicLayoutProps } from "@ant-design/pro-layout";
import { routes as routesPath } from "@/constant";

export const routes: Route[] = [
  {
    path: routesPath.model,
    name: "模型列表",
    icon: <ProfileOutlined />,
  },
  {
    path: routesPath.analyze,
    name: "分析面板",
    icon: <PieChartOutlined size={14} />,
  },
  {
    path: routesPath.property,
    name: "我的资产",
    icon: <FileSyncOutlined size={14} />,
  },
  {
    path: routesPath.mine,
    name: "我的信息",
    icon: <UserOutlined />,
  },
];

export const layoutConfig: BasicLayoutProps = {
  contentWidth: "Fixed",
  splitMenus: false,
  fixedHeader: true,
  layout: "top",
  navTheme: "dark",
};

export const Logo = <img src={logo} alt="" />;
