import moment from "moment";
import { Op } from "sequelize";
import {
  Tag,
  TagsAndUsers,
  User,
  TagsAndModels,
  Goods,
} from "../../connection/modelDefine";
import { ITagDataItem } from "./types";
import * as AnalyzeResType from "../../types/Analyze/res.type";

/** 检查是否有重名表标签 */
export const checkTagName = async (tagName: string) => {
  const result = await Tag.findAll({
    where: {
      tag_name: tagName,
    },
  });
  return result.length;
};

/** 新增标签 */
export const addTag = async (tagName: string, uid: number, tid: number) => {
  const check = tid
    ? !!(
        await Tag.findAll({
          where: {
            tid: tid,
          },
        })
      ).length
    : false;
  if (check) {
    // 已存在，更改标签名称即可
    const updateTagResult = await Tag.update(
      {
        tag_name: tagName,
      },
      {
        where: {
          tid,
        },
      },
    );
    return {
      status: !!updateTagResult,
    };
  } else {
    // 不存在，要创建
    const addTagResult = await Tag.create({
      tag_name: tagName,
    });
    const { tid } = addTagResult?.get();
    const addRelationResult = await TagsAndUsers.create({
      tid,
      uid,
      is_owner: 1,
    });
    return {
      status: addTagResult && addRelationResult,
    };
  }
};

/** 标签列表 */
export const getTagList = async (
  uid?: number,
  tagName?: string,
  is_self?: boolean,
) => {
  // * 如果 is_self == true 的话只返回「自己创建 / 协作」的标签
  // * 否则返回全量
  const result: ITagDataItem[] = await Promise.all(
    (
      await Tag.findAll<any>({
        where: tagName
          ? {
              tag_name: {
                [Op.like]: `%${tagName}%`,
              },
            }
          : {},
        include: {
          association: Tag.hasMany(TagsAndUsers, {
            foreignKey: "tid",
          }),
          attributes: ["is_owner", "uid"],
        },
        attributes: ["tid", "tag_name", "createdAt"],
      })
    )
      .filter((item) =>
        is_self
          ? item.tags_and_users.map((item: any) => item.uid).includes(uid)
          : true,
      )
      .map(async (item) => {
        const tid: number = item.tid;
        const creatorList = await Promise.all(
          (
            await TagsAndUsers.findAll({
              where: {
                tid,
              },
            })
          ).map(async (item) => {
            const userInfo = (
              await User.findOne({
                where: {
                  uid: item.get().uid,
                },
              })
            )?.get();
            return {
              uid: item.get().uid,
              username: userInfo.username,
            };
          }),
        );
        const modelNum = (
          await TagsAndModels.findAll({
            where: {
              tid,
            },
          })
        ).length;
        return {
          ...item.dataValues,
          tag_create_time: moment(item.dataValues.createdAt).format(
            "YYYY-MM-DD",
          ),
          relative_creator_list: creatorList,
          model_num: modelNum,
          is_owner:
            item.tags_and_users.find((item: any) => item.is_owner == 1).uid ==
            uid,
        };
      }),
  );
  return {
    list: result,
    total: result.length,
  };
};

/** 删除标案 */
export const deleteTags = async (tagIds: number[]) => {
  const deleteTag = await Promise.all(
    tagIds.map(
      async (tid) =>
        await Tag.destroy({
          where: {
            tid,
          },
        }),
    ),
  );
  const deleteRelaWithUser = await Promise.all(
    tagIds.map(
      async (tid) =>
        await TagsAndUsers.destroy({
          where: {
            tid,
          },
        }),
    ),
  );

  const deleteRelaWithModel = await Promise.all(
    tagIds.map(
      async (tid) =>
        await TagsAndModels.destroy({
          where: {
            tid,
          },
        }),
    ),
  );

  return {
    status: !!deleteRelaWithModel && !!deleteRelaWithUser && !!deleteTag,
  };
};

/** 分析模型标签类型占比 */
export const getModelTypeAnalyze =
  async (): Promise<AnalyzeResType.IModelTypeAnalyze> => {
    const __result = await Promise.all(
      (
        await TagsAndModels.findAll({
          attributes: ["tid"],
          group: ["tid"],
          include: [
            {
              association: Tag.hasOne(Tag, {
                foreignKey: "tid",
              }),
            },
          ],
        })
      ).map(async (item) => {
        const { tid, tag } = item.get();
        const { count } = await TagsAndModels.findAndCountAll({
          where: {
            tid,
          },
        });
        return {
          name: tag?.tag_name,
          value: count,
        };
      }),
    );
    return {
      list: __result,
      total: __result.reduce<number>((cnt, item) => cnt + item.value, 0),
    };
  };

// 标签热度分布
export const getTagPopularAnalyze =
  async (): Promise<AnalyzeResType.ITagPopularityAnalyze> => {
    const tagPopular = await Promise.all(
      (
        await TagsAndModels.findAll({
          group: ["tid"],
          attributes: ["tid"],
          include: [
            {
              association: Tag.hasOne(TagsAndModels, {
                foreignKey: "tid",
              }),
              attributes: ["tag_name"],
            },
          ],
        })
      ).map(async (item) => {
        const { tid, tags_and_model: tag } = item.get();
        const modelList = await TagsAndModels.findAll({
          where: {
            tid,
          },
          attributes: ["mid"],
        });
        const goods = (
          await Promise.all(
            modelList?.map(async (item) => {
              const { mid } = item.get();
              const { count } = await Goods.findAndCountAll({
                where: {
                  mid,
                },
              });
              return count;
            }),
          )
        ).reduce<number>((total, value) => total + value, 0);
        return {
          name: tag?.tag_name,
          value: goods,
        };
      }),
    );
    return {
      list: tagPopular,
    };
  };
