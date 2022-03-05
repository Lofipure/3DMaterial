export interface ICreator {
  uid: number;
  username: string;
}

export interface ITag {
  tid: number;
  tag_name: string;
}

export interface IModelItem {
  mid?: number;
  model_name?: string;
  model_create_time?: string;
  model_goods?: number;
  model_visited?: number;
  tag_list?: ITag[];
  creator_list?: ICreator[];
  is_owner?: boolean;
}

export interface ITagItem {
  tid?: number;
  tag_name?: string;
  tag_create_time?: string;
  relative_creator_list?: ICreator[];
  model_num?: number;
}

export enum PropertyType {
  model = "model",
  tag = "tag",
}
