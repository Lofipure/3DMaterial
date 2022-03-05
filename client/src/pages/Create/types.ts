import { AuthControl } from "@/types";

export interface ITag {
  tid: number;
  tag_name: string;
}

export interface IBaseInfo extends Record<string, any> {
  mid: number;
  model_name: string;
  tag_list: ITag[];
  auth: AuthControl;
  model_url: string;
  model_cover: string;
  model_desc: string;
  model_intro: string;
}

export enum STEP_KEY {
  baseInfo = 0,
  introduce = 1,
  result = 2,
}
