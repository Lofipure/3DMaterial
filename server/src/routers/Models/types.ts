import { AuthControl } from "src/types";
import { IModel } from "src/types/User";

export interface ISave extends IModel {
  auth: AuthControl;
  tag_list: number[];
  uid: number;
}

export interface IList {
  creators: number[];
  is_self: false;
  name: string;
  model_tags: number[];
  uid: number;
}

export interface ISetAuth {
  mid: number;
  creator_id: number[];
}

export interface IDelete {
  mid: number[];
}

export interface IDetail {
  mid: number;
}
