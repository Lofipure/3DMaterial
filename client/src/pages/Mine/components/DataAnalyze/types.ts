import { EntityType } from "@/types";

export interface INode {
  type: EntityType;
  name: string;
  id: string;
  uid?: number;
}

export interface ILink {
  source: string;
  target: string;
  is_owner: boolean;
}

export interface IDataAnalyzeProps {
  uid: number;
  className?: string;
}

export interface ILabelValue {
  label: string;
  value: number;
}
