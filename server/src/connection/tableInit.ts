import {
  User,
  Model,
  Tag,
  ModelsAndUsers,
  TagsAndModels,
  TagsAndUsers,
  Visit,
  Goods,
  UpdateModel,
} from "./modelDefine";

(() => {
  [
    User,
    Model,
    Tag,
    ModelsAndUsers,
    TagsAndModels,
    TagsAndUsers,
    Visit,
    Goods,
    UpdateModel,
  ].forEach((item) =>
    item.sync({
      force: true,
    }),
  );
})();
