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
    icon: <PieChartOutlined />,
  },
  {
    path: routesPath.property,
    name: "我的资产",
    icon: <FileSyncOutlined />,
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
  fixSiderbar: true,
  // layout: "top",
  // navTheme: "dark",
  layout: "mix",
  navTheme: "light",
  disableMobile: true,
  fixedHeader: true,
};

export const Logo = <img src={logo} alt="" />;

export const excludeRoutes = [routesPath.ar, "/"];
