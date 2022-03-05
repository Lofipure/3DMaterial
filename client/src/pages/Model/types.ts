export interface IParams {
  model_name?: string;
  model_tags?: number[];
  creators?: number[];
}

export interface ITag {
  tid: number;
  tag_name: string;
}

export interface IUser {
  uid: number;
  username: string;
  user_avatar: string;
}

export interface IModel {
  mid: number;
  model_cover: string;
  model_desc: string;
  model_name: string;
  model_goods: number;
  model_visited: number;
  tag_list: ITag[];
  creator_list: IUser[];
}
