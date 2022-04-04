import { LoginUserStatus, saveUserStatus } from "../../constant";
import {
  Goods,
  Model,
  ModelsAndUsers,
  Tag,
  TagsAndModels,
  TagsAndUsers,
  UpdateModel,
  User,
  Visit,
} from "../../connection/modelDefine";
import * as ReqType from "@/types/User/req.type";
import moment from "moment";
import { Model as SeqModel, ModelCtor, Op, fn, col } from "sequelize";
import { EntityType, EventType } from "../../types";
import {
  getRelaBetweenModelAndTag,
  getRelaUser,
  getRelaWithModel,
  getRelaWithTag,
  INodeType,
} from "./graph.utils";

const formatRecordInfo = async (
  modelCtor: ModelCtor<SeqModel>,
  type: EventType,
  mid: number[],
  year: number,
  extra?: Record<string, any>,
) =>
  (
    await modelCtor.findAll({
      where: {
        mid: {
          [Op.in]: mid,
        },
        ...extra,
      },
      attributes: ["uid", "mid", "createdAt"],
      include: [
        {
          association: modelCtor.belongsTo(User, {
            foreignKey: "uid",
          }),
          attributes: ["username"],
        },
        {
          association: modelCtor.belongsTo(Model, {
            foreignKey: "mid",
          }),
          attributes: ["model_name"],
        },
      ],
    })
  )
    .map((item) => item.get())
    .map(
      (item) =>
        moment(item.createdAt).format("YYYY") == year.toString() && {
          ...item,
          username: item.user.username,
          model_name: item.model.model_name,
          date: moment(item.createdAt).format("MM-DD"),
          year,
          type,
        },
    );

/**
 * 持久化 token，存储在 Sql 中
 * @param {string} email 用户邮箱
 * @param {string} token token
 * @notice 前端的土方法
 */
export const setLoginToken = async (email: string, token: string) => {
  const user = await User.findOne({
    where: {
      email,
    },
  });
  if (user) {
    User.update(
      {
        ...user,
        login_token: token,
      },
      {
        where: {
          email,
        },
      },
    );
  }
};

/**
 * 注册 / 修改用户信息
 * @param {string} userInfo.email
 * @param {string} userInfo.username
 * @param {SexType} userInfo.sex
 * @param {string} userInfo.password
 * @param {number} userInfo.uid
 * @returns 状态
 */
export const saveUser = async (userInfo: ReqType.IRegister) => {
  const result = await User.findAll({
    where: {
      email: userInfo.email,
    },
  });
  if (userInfo.uid) {
    await User.update(userInfo, {
      where: {
        uid: userInfo.uid,
      },
    });
    return {
      status: saveUserStatus.success,
    };
  }
  if (result.length != 0) {
    return {
      status: saveUserStatus.has,
    };
  } else {
    await User.create(<any>userInfo);
    const _info = await User.findAll({
      where: {
        email: userInfo.email,
      },
    });
    return {
      status: saveUserStatus.success,
      ...(_info[0] as Record<string, any>).dataValues,
    };
  }
};

/**
 * 用户登录
 * @param {string} userInfo.email
 * @param {string} userInfo.password
 * @param {string} token token
 * @returns 状态
 */
export const login = async (
  userInfo: ReqType.ILogin,
  token: string,
): Promise<{
  status: LoginUserStatus;
  [key: string]: any;
}> => {
  const _info =
    (
      (await User.findOne({
        where: {
          email: userInfo.email,
        },
      })) as Record<string, any>
    )?.dataValues ?? {};
  if (Object.keys(_info).length == 0) {
    return {
      status: LoginUserStatus.noUser,
      ...(_info as any),
    };
  }
  if (_info.password != userInfo.password) {
    return {
      status: LoginUserStatus.passwordError,
      ...(_info as any),
    };
  }
  await setLoginToken(userInfo.email, token);
  return {
    status: LoginUserStatus.success,
    ...(_info as any),
  };
};

/**
 * 获取用户列表
 */
export const getUserList = async () => {
  const userList = await User.findAll();
  return {
    list: userList.map((item) => item.get()),
  };
};

/**
 * 获取用户详细信息
 * @param {string} userId 用户 id
 * @returns 用户信息
 */
export const getUserDetail = async (userId: string) => {
  const userInfo = (
    await User.findOne({
      where: {
        uid: userId,
      },
      attributes: [
        "uid",
        "username",
        "email",
        "user_avatar",
        "sex",
        "createdAt",
      ],
    })
  )?.get();
  const create_time = moment(userInfo.createdAt).format("YYYY-MM-DD");
  const tag_num = (
      await TagsAndUsers.findAll({
        where: {
          uid: userId,
        },
      })
    ).length,
    model_num = (
      await ModelsAndUsers.findAll({
        where: {
          uid: userId,
        },
      })
    ).length;

  return {
    ...userInfo,
    tag_num,
    model_num,
    create_time,
  };
};

/**
 * 获取用户协作者
 * @param {number} req.uid 用户id
 * @returns 用户的协作者
 */
export const getRelativeCreator = async (req: ReqType.IRelativeCreator) => {
  const { uid } = req;
  const models = (
    await ModelsAndUsers.findAll({
      where: {
        uid,
      },
    })
  ).map((item) => item.get().mid);

  const uids = (
    await Promise.all(
      models.map(async (mid) => {
        return (
          await ModelsAndUsers.findAll({
            where: {
              mid,
              uid: {
                [Op.ne]: uid,
              },
            },
            attributes: ["uid"],
          })
        ).map((item) => item.get().uid);
      }),
    )
  ).flatMap((item) => item);

  const userList = (
    await User.findAll({
      where: {
        uid: {
          [Op.in]: uids,
        },
      },
      attributes: ["uid", "username", "user_avatar", "email"],
    })
  ).map((item) => item.get());
  return {
    list: userList,
    total: userList.length,
  };
};

/**
 * 获取特定年用户记录
 * @param {number} req.uid
 * @param {number} req.year
 * @returns 用户的操作记录
 */
export const getUserRecord = async (req: ReqType.IRecord) => {
  const { year, uid } = req;
  // 用户操作的所有模型，包括 「创建」 / 「共建」
  const mid = (
    await ModelsAndUsers.findAll({
      where: {
        uid,
      },
      attributes: ["mid"],
    })
  ).map((item) => item.get().mid);

  // ? 用户创建模型的记录
  const createRecord = await formatRecordInfo(
    ModelsAndUsers,
    EventType.create,
    mid,
    year,
    {
      is_owner: 1,
    },
  );

  // ? 用户更新模型的记录
  const updateRecord = await formatRecordInfo(
    UpdateModel,
    EventType.modify,
    mid,
    year,
  );

  return {
    commit: [...createRecord, ...updateRecord],
    visit: [],
  };
};

/**
 * 用户关系图
 * @param {number} req.uid
 * @returns 用户关系图数据 links & nodes
 */
export const getUserGraph = async (req: ReqType.IGraph) => {
  const { uid } = req;
  // ? 用户的个人信息
  const userInfo: INodeType[] = (
    await User.findAll({
      where: {
        uid,
      },
    })
  ).map((item) => {
    return {
      type: EntityType.User,
      name: item.get().username,
      id: `USER_${item.get().uid}`,
      uid: item.get().uid,
    };
  });
  // ? 用户自己创建的标签
  const [ownerTag, ownerTagLinks] = await getRelaWithTag(uid, 1);
  // ? 用户协作的标签
  const [relaTag, relaTagLinks] = await getRelaWithTag(uid, 0);
  // ? 用户自己创建的模型
  const [ownerModel, ownerModelLinks] = await getRelaWithModel(uid, 1);
  // ? 用户协作的模型
  const [relaModel, relaModelLinks] = await getRelaWithModel(uid, 0);
  // ? 模型与标签之间的关系
  const relaBetweenModelAndTag = await getRelaBetweenModelAndTag(uid);
  // ? 协作者与用户创建的模型的关系
  const [relaUser, relaUserWithModel, relaUserWithTag] = await getRelaUser(uid);
  return {
    links: [
      // ...ownerTagLinks,
      // ...relaTagLinks,
      ...ownerModelLinks,
      ...relaModelLinks,
      ...relaBetweenModelAndTag,
      ...relaUserWithModel,
      ...relaUserWithTag,
    ],
    nodes: [
      ...ownerTag,
      ...userInfo,
      ...relaTag,
      ...ownerModel,
      ...relaModel,
      ...relaUser,
    ],
  };
};

/** 用户访问模型记录 */
export const visitModel = async (req: ReqType.IVisit) => {
  const { uid, mid } = req;
  await Visit.create({
    uid,
    mid,
  });
  return {
    status: 1,
  };
};

/**
 * 获取用户的点赞记录
 * @param {number} req.uid
 * @param {number} req.mid
 */
export const goodsToModel = async (req: ReqType.IGoods) => {
  const { uid, mid } = req;
  if (
    !(await Goods.findOne({
      where: { uid, mid },
    }))
  ) {
    await Goods.create({
      uid,
      mid,
    });
    return {
      status: 1,
    };
  } else {
    return {
      status: 0,
    };
  }
};

/** 用户分析图 */
export const getUserAnalyze = async (req: ReqType.IAnalyze) => {
  const { uid } = req;
  const tids: number[] = (
    await TagsAndUsers.findAll({
      where: {
        uid,
        is_owner: 1,
      },
      attributes: ["tid"],
    })
  ).map((item) => item.get().tid);
  /*
    set @@GLOBAL.sql_mode='STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
    set @@SESSION.sql_mode='STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
  */
  // tag_analyze: 用户创建的每个标签下有几个模型
  // power_analyze: 用户能力分析：「建设力、创造力、人气」
  const mids = (
    await ModelsAndUsers.findAll({
      where: {
        uid,
      },
      attributes: ["mid"],
    })
  ).map((item) => item.get().mid);

  const buildPower = await ModelsAndUsers.count({
    where: {
      uid,
      is_owner: 0,
    },
  });
  const createPower = await ModelsAndUsers.count({
    where: {
      uid,
      is_owner: 1,
    },
  });
  const popular = await Goods.count({
    where: {
      mid: {
        [Op.in]: mids,
      },
    },
  });
  return {
    tag_analyze: (
      await TagsAndModels.findAll({
        where: {
          tid: {
            [Op.in]: tids,
          },
        },
        attributes: ["tid", [fn("COUNT", col("mid")), "count"]],
        include: {
          association: TagsAndModels.belongsTo(Tag, {
            foreignKey: "tid",
          }),
          attributes: ["tag_name"],
        },
        group: "tid",
      })
    ).map((item) => ({
      label: item.get().tag.tag_name,
      value: item.get().count,
    })),
    power_analyze: [
      {
        label: "创造力",
        value: createPower,
      },
      {
        label: "建设力",
        value: buildPower,
      },
      {
        label: "人气",
        value: popular,
      },
    ],
  };
};

export const getUserLoginToken = async (email: string) =>
  (
    await User.findOne({
      where: {
        email,
      },
      attributes: ["login_token"],
    })
  )?.get("login_token") as string;
