import { SexType } from "../../types";

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

export interface IGraph extends IRelativeCreator {}

export interface IAnalyze extends IRelativeCreator {}
export interface IVisit {
  uid: number;
  mid: number;
}

export interface IGoods extends IVisit {}
