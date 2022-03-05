import { SexType } from "../types";

export interface IUserProps {
  uid: number;
  username: string;
  email: string;
  sex: SexType;
  user_avatar: string;
  password: string;
}

export interface ITag {
  tid: number;
  tag_name: string;
}

export interface IModel {
  mid?: string;
  model_name: string;
  model_desc: string;
  model_cover: string;
  model_intro: string;
  model_url: string;
}
