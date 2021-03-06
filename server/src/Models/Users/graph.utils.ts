import { Op } from "sequelize";
import {
  Model,
  ModelsAndUsers,
  Tag,
  TagsAndModels,
  TagsAndUsers,
  User,
} from "../../connection/modelDefine";
import { EntityType } from "../../types";

export interface INodeType {
  type: EntityType;
  name: string;
  id: string;
  uid?: number;
}

export interface ILinkType {
  source: string;
  target: string;
  is_owner: boolean;
}

export const getRelaWithTag = async (uid: number, isOwner: number) => {
  const tag: INodeType[] = (
    await TagsAndUsers.findAll({
      where: {
        uid,
        is_owner: isOwner,
      },
      attributes: [],
      include: [
        {
          association: TagsAndUsers.belongsTo(Tag, {
            foreignKey: "tid",
          }),
          attributes: ["tid", "tag_name"],
        },
      ],
    })
  ).map((item) => {
    return {
      type: EntityType.Tag,
      name: item.get().tag.tag_name,
      id: `TAG_${item.get().tag.tid}`,
    };
  });
  const tagLinks: ILinkType[] = (
    await TagsAndUsers.findAll({
      where: {
        uid,
        is_owner: isOwner,
      },
      attributes: ["tid", "uid"],
    })
  ).map((item) => {
    const { tid, uid } = item.get();
    return {
      source: `TAG_${tid}`,
      target: `USER_${uid}`,
      is_owner: !!isOwner,
    };
  });
  return [tag, tagLinks];
};

export const getRelaWithModel = async (uid: number, isOwner: number) => {
  const model: INodeType[] = (
    await ModelsAndUsers.findAll({
      where: {
        uid,
        is_owner: isOwner,
      },
      attributes: [],
      include: [
        {
          association: ModelsAndUsers.belongsTo(Model, {
            foreignKey: "mid",
          }),
          attributes: ["mid", "model_name"],
        },
      ],
    })
  ).map((item) => {
    return {
      type: EntityType.Model,
      name: item.get().model.model_name,
      id: `MODEL_${item.get().model.mid}`,
    };
  });
  const modelLinks: ILinkType[] = (
    await ModelsAndUsers.findAll({
      where: {
        uid,
        is_owner: isOwner,
      },
      attributes: ["mid", "uid"],
    })
  ).map((item) => {
    const { mid, uid } = item.get();
    return {
      source: `MODEL_${mid}`,
      target: `USER_${uid}`,
      is_owner: !!isOwner,
    };
  });
  return [model, modelLinks];
};

export const getRelaBetweenModelAndTag = async (uid: number) => {
  // ? ?????????????????????????????????????????????????????????
  // ? ???????????????????????????????????????????????????????????????
  const mids = (
    await ModelsAndUsers.findAll({
      where: {
        uid,
      },
      attributes: ["mid"],
    })
  ).map((item) => item.get().mid);

  return (
    await TagsAndModels.findAll({
      where: {
        mid: {
          [Op.in]: mids,
        },
      },
      attributes: ["mid", "tid"],
    })
  ).map((item) => ({
    source: `MODEL_${item.get().mid}`,
    target: `TAG_${item.get().tid}`,
    is_owner: true,
  }));
};

export const getRelaUser = async (uid: number) => {
  // ? ???????????????????????????
  const mids = (
    await ModelsAndUsers.findAll({
      where: {
        uid,
        is_owner: 1,
      },
      attributes: ["mid"],
    })
  ).map((item) => item.get().mid);
  // ? ???????????????????????????
  const tids = (
    await TagsAndUsers.findAll({
      where: {
        uid,
        is_owner: 1,
      },
      attributes: ["tid"],
    })
  ).map((item) => item.get().tid);
  // ? ????????????????????????????????????
  const relaUser: INodeType[] = (
    await ModelsAndUsers.findAll({
      where: {
        mid: {
          [Op.in]: mids,
        },
        is_owner: 0,
      },
      attributes: ["mid", "uid"],
      include: [
        {
          association: ModelsAndUsers.belongsTo(User, {
            foreignKey: "uid",
          }),
          attributes: ["uid", "username"],
        },
      ],
    })
  ).map((item) => ({
    name: item.get().user.username,
    type: EntityType.User,
    uid: item.get().user.uid,
    id: `USER_${item.get().user.uid}`,
  }));
  const uids = relaUser.map((item) => item.uid) as number[];

  const relaUserWithModel: ILinkType[] = (
    await ModelsAndUsers.findAll({
      where: {
        mid: {
          [Op.in]: mids,
        },
        uid: {
          [Op.in]: uids,
        },
      },
      attributes: ["uid", "mid"],
    })
  ).map((item) => ({
    source: `MODEL_${item.get().mid}`,
    target: `USER_${item.get().uid}`,
    is_owner: false,
  }));

  const relaUserWithTag: ILinkType[] = (
    await TagsAndUsers.findAll({
      where: {
        tid: {
          [Op.in]: tids,
        },
        uid: {
          [Op.in]: uids,
        },
      },
      attributes: ["uid", "tid"],
    })
  ).map((item) => ({
    source: `TAG_${item.get().tid}`,
    target: `USER_${item.get().uid}`,
    is_owner: false,
  }));

  return [relaUser, relaUserWithModel, relaUserWithTag];
};
