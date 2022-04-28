import { User, Model } from "./modelDefine";
import { IP } from "../constant";

const update = (str: string): string =>
  String(str).replace(/http:\/\/(.*)\:/g, `${IP}:`);

(async () => {
  console.log("[🎉  Update 🎉] Start");

  await Promise.all(
    (
      await User.findAll()
    ).map(async (item) => {
      const user = item.get();
      const { user_avatar, uid } = user;
      return await User.update(
        { ...user, user_avatar: update(user_avatar) },
        {
          where: {
            uid,
          },
        },
      );
    }),
  );

  await Promise.all(
    (
      await Model.findAll()
    ).map(async (item) => {
      const model = item.get();
      const { model_url, model_cover, mid } = model;
      return await Model.update(
        {
          ...model,
          model_url: update(model_url),
          model_cover: update(model_cover),
        },
        {
          where: {
            mid,
          },
        },
      );
    }),
  );
  console.log("[🎉  Update 🎉] End");
})();
