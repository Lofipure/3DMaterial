import { DataTypes } from "sequelize";
import { connection } from "../index";

export const User = connection.define("users", {
  uid: {
    field: "uid",
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
  },
  username: {
    field: "username",
    type: DataTypes.STRING,
  },
  email: {
    field: "email",
    type: DataTypes.STRING,
  },
  password: {
    field: "password",
    type: DataTypes.STRING,
  },
  user_avatar: {
    field: "user_avatar",
    type: DataTypes.STRING,
  },
  sex: {
    field: "sex",
    type: DataTypes.TINYINT,
  },
  login_token: {
    field: "login_token",
    type: DataTypes.STRING,
    allowNull: true,
  },
});

export const Model = connection.define("models", {
  mid: {
    field: "mid",
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },
  model_name: {
    field: "model_name",
    type: DataTypes.STRING,
  },
  model_desc: {
    field: "model_desc",
    type: DataTypes.STRING,
  },
  model_cover: {
    field: "model_cover",
    type: DataTypes.STRING,
  },
  model_url: {
    field: "model_url",
    type: DataTypes.STRING,
  },
  model_intro: {
    field: "model_intro",
    type: DataTypes.TEXT,
  },
  auth: {
    field: "auth",
    type: DataTypes.TINYINT,
  },
});

export const Tag = connection.define("tags", {
  tid: {
    field: "tid",
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  tag_name: {
    field: "tag_name",
    type: DataTypes.STRING,
  },
});

export const TagsAndModels = connection.define("tags_and_models", {
  record_id: {
    field: "record_id",
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  tid: {
    field: "tid",
    type: DataTypes.INTEGER,
  },
  mid: {
    field: "mid",
    type: DataTypes.INTEGER,
  },
});

export const ModelsAndUsers = connection.define("models_and_users", {
  record_id: {
    field: "record_id",
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  mid: {
    field: "mid",
    type: DataTypes.INTEGER,
  },
  uid: {
    field: "uid",
    type: DataTypes.INTEGER,
  },
  is_owner: {
    field: "is_owner",
    type: DataTypes.TINYINT,
  },
});

export const TagsAndUsers = connection.define("tags_and_users", {
  record_id: {
    field: "record_id",
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  uid: {
    field: "uid",
    type: DataTypes.INTEGER,
  },
  tid: {
    field: "tid",
    type: DataTypes.INTEGER,
  },
  is_owner: {
    field: "is_owner",
    type: DataTypes.TINYINT,
  },
});

export const Goods = connection.define("goods", {
  record_id: {
    field: "record_id",
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  uid: {
    field: "uid",
    type: DataTypes.INTEGER,
  },
  mid: {
    field: "mid",
    type: DataTypes.INTEGER,
  },
});

export const Visit = connection.define("visit", {
  record_id: {
    field: "record_id",
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  uid: {
    field: "uid",
    type: DataTypes.INTEGER,
  },
  mid: {
    field: "mid",
    type: DataTypes.INTEGER,
  },
});

export const UpdateModel = connection.define("update_models", {
  record_id: {
    field: "record_id",
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  mid: {
    field: "mid",
    type: DataTypes.INTEGER,
  },
  uid: {
    field: "uid",
    type: DataTypes.INTEGER,
  },
});
