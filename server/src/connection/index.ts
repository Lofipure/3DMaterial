import { Sequelize } from "sequelize";
import { DB_NAME, DB_PWD, DB_USER_NAME } from "../constant";

export const connection = new Sequelize(DB_NAME, DB_USER_NAME, DB_PWD, {
  host: "localhost",
  dialect: "mysql",
});
