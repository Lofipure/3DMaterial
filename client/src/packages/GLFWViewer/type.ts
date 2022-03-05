export interface IViewOptions {
  url: string;
  width: number;
  height: number;
  wrapper: HTMLDivElement;
  onFinish: () => void;
}
