import { Sex } from "@/types";

export enum TabKeys {
  baseInfo = "baseInfo",
  modelShow = "modelShow",
}
interface ICreator {
  uid: number;
  username: string;
  sex: Sex;
  email: string;
}

interface IRelativeModel {
  mid: number;
  model_name: string;
  tid: number;
  tag_name: string;
}

export interface IModelDetail {
  mid: number;
  model_name: string;
  model_cover: string;
  model_desc: string;
  model_goods: number;
  model_visit: number;
  creator: ICreator;
  relative_model_list: IRelativeModel[];
  model_url: string;
  model_intro: string;
}
