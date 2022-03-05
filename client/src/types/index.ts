export interface IUserForStorage {
  username: string;
  email: string;
  avatar: string;
  uid: number;
}

export enum Sex {
  Male = 1,
  Female = 2,
}

export enum EntityType {
  User = 1,
  Tag = 2,
  Model = 3,
  Root = 4,
}

export enum AuthControl {
  private = 1,
  public = 2,
  protected = 3,
}

export interface ICheckStatus {
  status: number;
}
