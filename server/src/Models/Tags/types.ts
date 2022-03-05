export interface IBaseType {
  createdAt: Date;
  updatedAt: Date;
}

export interface ITagDataItem extends IBaseType {
  tid: number;
  tag_name: string;
}
