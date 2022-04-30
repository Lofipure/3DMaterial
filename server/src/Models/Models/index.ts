import * as ModelReqType from "../../types/Model/req.type";
import * as ModelResType from "../../types/Model/res.type";
import _ from "lodash";
import {
  Model,
  ModelsAndUsers,
  Tag,
  TagsAndModels,
  TagsAndUsers,
  User,
  Visit,
  Goods,
  UpdateModel,
} from "../../connection/modelDefine";
import { Op, Model as SeqModel, fn, Sequelize, col } from "sequelize";
import moment from "moment";
import { AuthControl } from "../../types";
import * as AnalyzeResType from "../../types/Analyze/res.type";

/** 保存模型 */
export const saveModel = async (
  req: ModelReqType.ISave,
): Promise<ModelResType.ISave> => {
  const {
    model_cover,
    model_desc,
    model_intro,
    model_name,
    model_url,
    auth,
    tag_list,
    uid,
    mid: _mid,
  } = req;
  if (_mid) {
    // 从 tags_and_models 表中找到所有的记录
    const currentTagList = (
      await TagsAndModels.findAll({
        where: {
          mid: _mid,
        },
        attributes: ["tid"],
      })
    ).map((item) => item.get().tid);
    const __modelResult = await Model.update(
      {
        model_cover,
        model_desc,
        model_intro,
        model_name,
        model_url,
        auth,
      },
      {
        where: {
          mid: _mid,
        },
      },
    );
    const __updateResult = await UpdateModel.create({
      uid,
      mid: _mid,
    });
    // * 更新标签信息
    // ? 如果 tag_list 在 记录中，不处理
    // ? 如果不在 记录中，加入
    const __tagResult = await Promise.all(
      tag_list.map(
        async (tid) =>
          !currentTagList.includes(tid) &&
          (await TagsAndModels.create({
            tid,
            mid: _mid,
          })),
      ),
    );
    // ! 最后要删除 tags_and_models 中 不在 tag_list中的记录
    await TagsAndModels.destroy({
      where: {
        tid: {
          [Op.notIn]: tag_list,
        },
        mid: _mid,
      },
    });
    return {
      status: Number(!!__tagResult && !!__updateResult && !!__modelResult),
    };
  }
  const __createModelResult = await Model.create({
    model_cover,
    model_desc,
    model_intro,
    model_name,
    model_url,
    auth,
  });
  const { mid } = __createModelResult.get();
  const __createRelaWithUserResult = await ModelsAndUsers.create({
    mid,
    uid,
    is_owner: 1,
  });
  const __createRelaWithTagsResult = await Promise.all(
    tag_list.map(
      async (item) =>
        await TagsAndModels.create({
          tid: item,
          mid,
        }),
    ),
  );
  return {
    status: Number(
      __createRelaWithTagsResult &&
        !!__createRelaWithUserResult &&
        !!__createModelResult,
    ),
  };
};

/** 获取模型列表 */
export const getModelList = async (req: ModelReqType.IList) => {
  const { creators, is_self, name, model_tags, uid } = req;
  const result = await Promise.all(
    (
      await Model.findAll({
        where: name
          ? {
              model_name: {
                [Op.like]: `%${name}%`,
              },
            }
          : {},
        include: [
          {
            association: Model.hasMany(TagsAndModels, {
              foreignKey: "mid",
            }),
            attributes: ["tid"],
          },
          {
            association: Model.hasMany(ModelsAndUsers, {
              foreignKey: "mid",
            }),
            attributes: ["uid", "is_owner"],
          },
        ],
      })
    )
      .reduce<any[]>((curList, item) => {
        const creatorIds = (<SeqModel[]>item.get().models_and_users).map(
          (i) => i.get().uid,
        );
        // ? is_self 用来标记是不是从广场获取，
        // ! is_self == true，不是从广场获取
        // * 需要自己的所有模型「作者 / 协作者」

        // ! is_self == false，是从广场获取
        // * 所有 AuthControl.public
        // * 自己的所有模型「作者 / 协作者」
        if (
          (is_self && creatorIds.includes(uid)) ||
          (!is_self &&
            (creatorIds.includes(uid) || item.get().auth == AuthControl.public))
        ) {
          curList.push(item.get());
        }
        return curList;
      }, [])
      .filter((item) =>
        model_tags?.length
          ? model_tags.some((tag) =>
              item.tags_and_models.map((item: any) => item.tid).includes(tag),
            )
          : true,
      )
      .filter((item) =>
        creators?.length
          ? creators.some((uid) =>
              item.models_and_users.map((item: any) => item.uid).includes(uid),
            )
          : true,
      )
      .map(async (item) => {
        const tagIdList: number[] = item.tags_and_models.map(
          (i: SeqModel) => i.get().tid,
        );
        const userIdList: number[] = item.models_and_users.map(
          (i: SeqModel) => i.get().uid,
        );
        const tag_list = await Promise.all(
          tagIdList.map(async (_tagId) =>
            (
              await Tag.findOne({
                where: {
                  tid: _tagId,
                },
                attributes: ["tag_name", "tid"],
              })
            )?.get(),
          ),
        );
        const creator_list = await Promise.all(
          userIdList.map(async (_userId) =>
            (
              await User.findOne({
                where: {
                  uid: _userId,
                },
                attributes: ["username", "user_avatar", "uid"],
              })
            )?.get(),
          ),
        );
        const model_goods = (
          await Goods.findAll({
            where: {
              mid: item.mid,
            },
          })
        ).length;
        const model_visited = (
          await Visit.findAll({
            where: {
              mid: item.mid,
            },
          })
        ).length;

        return {
          ...item,
          tag_list,
          creator_list,
          model_goods,
          model_visited,
          model_create_time: moment(item.createdAt).format("YYYY-MM-DD"),
          is_owner: !!(
            item.models_and_users.find((i: any) => i.is_owner == 1).get().uid ==
            uid
          ),
        };
      }),
  );
  return {
    list: result,
    total: result.length,
  };
};

/** 为模型设置协作者 */
export const setAuth = async (req: ModelReqType.ISetAuth) => {
  const { creator_id, mid } = req;
  const tags = (
    await TagsAndModels.findAll({
      where: {
        mid,
      },
    })
  ).map((item) => item.get().tid);

  creator_id.forEach(async (userId) => {
    // ? 当前的「作者」&「协作者」的id
    const lastUids = (
      await ModelsAndUsers.findAll({
        where: {
          mid,
        },
        attributes: ["uid"],
      })
    ).map((item) => item.get().uid);
    // * 如果 userId 已经存在于 lastUids，则不需要操作
    // * 如果 userId 不存在于 lastUids，则需要新增
    if (!lastUids.includes(userId)) {
      await ModelsAndUsers.create({
        mid,
        uid: userId,
        is_owner: false,
      });
    }
  });
  // * 最后还要判断 lastUids 中是否含有creator_id中没有的，如果有的话，需要删除
  (
    await ModelsAndUsers.findAll({
      where: {
        mid,
      },
      attributes: ["uid"],
    })
  )
    .map((item) => item.get().uid)
    .filter((id) => !creator_id.includes(id))
    .forEach(async (uid) => {
      await ModelsAndUsers.destroy({
        where: {
          uid,
          mid,
        },
      });
    });

  // ! 逻辑同上
  tags.forEach(async (tagId) => {
    creator_id.forEach(async (userId) => {
      const lastIds = (
        await TagsAndUsers.findAll({
          where: {
            tid: tagId,
          },
          attributes: ["uid"],
        })
      ).map((item) => item.get().uid);
      if (!lastIds.includes(userId)) {
        await TagsAndUsers.create({
          uid: userId,
          tid: tagId,
          is_owner: false,
        });
      }
    });
    (
      await TagsAndUsers.findAll({
        where: {
          tid: tagId,
        },
        attributes: ["uid"],
      })
    )
      .map((item) => item.get().uid)
      .filter((id) => !creator_id.includes(id))
      .forEach(async (uid) => {
        await TagsAndModels.destroy({
          where: {
            uid,
            tid: tagId,
          },
        });
      });
  });
  return {
    status: 1,
  };
};

/** 删除模型 */
export const deleteModel = async (req: ModelReqType.IDelete) => {
  const { mid } = req;
  const deleteModel = await Promise.all(
    mid.map(
      async (id) =>
        await Model.destroy({
          where: {
            mid: id,
          },
        }),
    ),
  );
  const deleteRelaWithUser = await Promise.all(
    mid.map(
      async (id) =>
        await ModelsAndUsers.destroy({
          where: {
            mid: id,
          },
        }),
    ),
  );
  const deleteRelaWithTag = await Promise.all(
    mid.map(
      async (id) =>
        await TagsAndModels.destroy({
          where: {
            mid: id,
          },
        }),
    ),
  );

  return {
    status: !!deleteModel && !!deleteRelaWithTag && !!deleteRelaWithUser,
  };
};

/** 查看模型详情 */
export const getModelDetail = async (req: ModelReqType.IDetail) => {
  const { mid } = req;
  const modelInfo = (
    await Model.findOne({
      where: {
        mid,
      },
      attributes: [
        "mid",
        "auth",
        "model_cover",
        "model_desc",
        "model_intro",
        "model_url",
        "model_name",
      ],
      include: [
        {
          association: Model.hasMany(Goods, {
            foreignKey: "mid",
          }),
          attributes: ["record_id"],
        },
        {
          association: Model.hasMany(Visit, {
            foreignKey: "mid",
          }),
          attributes: ["record_id"],
        },
        {
          association: Model.hasMany(TagsAndModels, {
            foreignKey: "mid",
          }),
          attributes: ["tid"],
        },
        {
          association: Model.hasOne(ModelsAndUsers, {
            foreignKey: "mid",
          }),
          where: {
            is_owner: 1,
          },
          attributes: ["uid"],
        },
      ],
    })
  )?.get();

  const model_goods = modelInfo.goods?.length ?? 0,
    model_visited = modelInfo.visits?.length ?? 0;
  delete modelInfo.visits;
  delete modelInfo.goods;

  const { uid } = modelInfo.models_and_user;
  const tids: number[] = modelInfo.tags_and_models.map(
    (item: SeqModel) => item.get().tid,
  );

  const tag_list = await Promise.all(
    tids.map(
      async (tid) =>
        await Tag.findOne({
          where: { tid },
          attributes: ["tag_name", "tid"],
        }),
    ),
  );

  const creator = await User.findOne({
    where: { uid },
    attributes: ["uid", "username", "sex", "email"],
  });

  const relative_model_list = await Promise.all(
    tids.map(async (tid) => {
      return (
        await TagsAndModels.findAll({
          where: {
            tid,
          },
          attributes: ["mid", "tid"],
          include: [
            {
              association: TagsAndModels.belongsTo(Tag, {
                foreignKey: "tid",
              }),
              attributes: ["tag_name"],
            },
            {
              association: TagsAndModels.belongsTo(Model, {
                foreignKey: "mid",
              }),
              attributes: ["model_name"],
            },
          ],
        })
      ).map((item) => {
        const { mid, tid, tag, model } = item.get();
        return {
          tag_name: tag.tag_name,
          model_name: model.model_name,
          tid,
          mid,
        };
      });
    }),
  );

  delete modelInfo.models_and_user;
  delete modelInfo.tags_and_models;
  return {
    ...modelInfo,
    model_goods,
    model_visited,
    tag_list,
    creator,
    relative_model_list: relative_model_list.flatMap((item) => item),
  };
};

/** 获取模型维度的分析数据 */
export const getModelVisitAnalyze =
  async (): Promise<AnalyzeResType.IModelVisitAnalyze> => {
    const modelVisit = (
      await Visit.findAll({
        attributes: ["mid", [fn("COUNT", col("record_id")), "value"]],
        group: ["mid"],
        include: [
          {
            association: Model.hasOne(Model, {
              foreignKey: "mid",
            }),
            attributes: ["model_name"],
          },
        ],
      })
    ).map((item) => {
      const atom = item.get();

      return {
        name: atom?.model?.model_name,
        value: atom?.value,
      };
    });

    const dailyVisit = (
      await Visit.findAll({
        attributes: ["createdAt"],
      })
    ).reduce<{ name: string; value: number }[]>((list, item: any) => {
      const { createdAt } = item;
      const atom = list.find(
        (_item) => _item?.name == new Date(createdAt).toLocaleDateString(),
      );
      if (!atom) {
        list.push({
          name: new Date(createdAt).toLocaleDateString(),
          value: 1,
        });
      } else {
        ++atom.value;
      }
      return list;
    }, []);

    const popularModel = _.first(
      (
        await Goods.findAll({
          group: ["mid"],
          attributes: ["mid", [fn("COUNT", col("record_id")), "cnt"]],
          include: [
            {
              association: Model.hasOne(Model, {
                foreignKey: "mid",
              }),
              as: "model",
              attributes: ["mid", "model_name"],
            },
          ],
        })
      )
        .map((item) => item.get())
        .sort((a, b) => b.cnt - a.cnt),
    );
    const { mid, model_name } = popularModel.model as {
      mid: string;
      model_name: string;
    };

    return {
      model_visit: modelVisit,
      daily_visit: dailyVisit,
      popular_model: {
        mid,
        model_name,
        goods: popularModel?.cnt ?? 0,
      },
    };
  };

// 系统数据综合分析
export const getComprehensiveAyalyze =
  async (): Promise<AnalyzeResType.IComprehensiveAnalyze> => {
    const { count: model_cnt } = await Model.findAndCountAll();
    const { count: user_cnt } = await User.findAndCountAll();

    const popularModel = _.first(
      (
        await Goods.findAll({
          group: ["mid"],
          attributes: ["mid", [fn("COUNT", col("record_id")), "cnt"]],
          include: [
            {
              association: Model.hasOne(Model, {
                foreignKey: "mid",
              }),
              as: "model",
              attributes: ["mid", "model_name", "model_cover"],
            },
          ],
        })
      )
        .map((item) => item.get())
        .sort((a, b) => b.cnt - a.cnt),
    );

    return {
      model_cnt,
      user_cnt,
      popular_model: popularModel.model.get() as any,
    };
  };
