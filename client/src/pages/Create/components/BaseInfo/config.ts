import { AuthControl } from "@/types";

export const AuthControlOptions = [
  {
    value: AuthControl.public,
    label: "公共模型",
  },
  {
    value: AuthControl.protected,
    label: "协作模型",
  },
];
