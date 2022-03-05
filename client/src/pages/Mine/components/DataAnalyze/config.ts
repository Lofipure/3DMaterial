import { EntityType } from "@/types";
import { ILink, INode } from "./types";
import { IGraphDataProps } from "@/packages/ForceGraph/types";
import { getUserLocalInfo } from "@/utils";

/**
 * 节点样式配置映射
 */
export const entityStyleMap: Record<EntityType, any> = {
  [EntityType.Model]: {
    color: "#65D7E6",
    border: "#D6F4F8",
    radius: 50,
  },
  [EntityType.Tag]: {
    color: "#FFA900",
    border: "#FFE9BC",
    radius: 30,
  },
  [EntityType.User]: {
    color: "#338AFF",
    border: "#C6DFFF",
    radius: 30,
  },
  [EntityType.Root]: {
    color: "#F65656",
    border: "#FCCECE",
    radius: 30,
  },
};

export const ROOT_STYLE = {
  color: "#F65656",
  border: "#FCCECE",
};
/**
 * 节点名映射
 */
export const relativeText: Record<EntityType, string> = {
  [EntityType.Model]: "模型",
  [EntityType.Tag]: "标签",
  [EntityType.User]: "作者",
  [EntityType.Root]: "是你吖",
};

export const getRelativeText = (isOwner: boolean, type: EntityType) => {
  if (type == EntityType.User) {
    return isOwner ? relativeText[type] : "协作者";
  }
  return relativeText[type];
};
/**
 * 将数据格式化为组件可识别的格式
 * @param {INode * ILink} data 格式化之前的数据
 * @param {Function} handleClickNode 点击节点触发的回调
 * @returns {IGraphDataProps} 格式化之后的数据
 */
export const dataFormatter = (
  data: {
    nodes: INode[];
    links: ILink[];
  },
  handleClickNode: (node: INode) => void,
): IGraphDataProps => ({
  nodes: data.nodes.map((node) => ({
    id: node.id,
    labelText: node.name,
    nodeStyle: {
      borderColor:
        node?.uid === getUserLocalInfo().uid
          ? ROOT_STYLE.border
          : entityStyleMap[node.type].border,
      color:
        node?.uid === getUserLocalInfo().uid
          ? ROOT_STYLE.color
          : entityStyleMap[node.type].color,
      radius: entityStyleMap[node.type].radius,
    },
    textStyle: {
      color: "#FFFFFF",
      fontSize: 12,
    },
    onClick: () => {
      handleClickNode?.(node);
    },
  })),
  links: data.links.map((item) => ({
    source: item.source,
    target: item.target,
    drawArrow: true,
    lineStyle: {
      color:
        entityStyleMap[
          data.nodes.find((node) => node.id == item.target)?.type ??
            EntityType.User
        ].color,
    },
    labelType: "text",
    labelText: getRelativeText(
      item.is_owner,
      data.nodes.find((node) => node.id == item.target)?.type ??
        EntityType.User,
    ),
    textStyle: {
      limit: 4,
    },
  })),
});
