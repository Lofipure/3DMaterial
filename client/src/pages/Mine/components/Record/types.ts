export enum EventType {
  create = 1,
  modify = 2,
  visit = 3,
  praise = 4,
}

export interface IEvent {
  year: string;
  date: string;
  type: EventType;
  username: string;
  model_name: string;
}

export interface IRecord {
  commit: IEvent[];
  visit: IEvent[];
}

export interface IRecordProps {
  className?: string;
  uid: number;
}
