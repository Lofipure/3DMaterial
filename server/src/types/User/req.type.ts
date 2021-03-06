import { SexType } from "..";

export interface ILogin {
  email: string;
  password: string;
}

export interface IRegister {
  email: string;
  username: string;
  sex: SexType;
  password: string;
  uid?: number;
}

export interface IRelativeCreator {
  uid: number;
}

export interface IRecord {
  uid: number;
  year: number;
}

export type IGraph = IRelativeCreator;
export type IAnalyze = IRelativeCreator;

export interface IVisit {
  uid: number;
  mid: number;
}

export type IGoods = IVisit;
