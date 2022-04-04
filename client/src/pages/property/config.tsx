import SearchTable from "./components/SearchTable";
import { PropertyType } from "./types";

interface IGetTagConfigParams {
  uid: number;
  onDetail?: (mid: number) => void;
}

export const getPropertyTabConfig = (param: IGetTagConfigParams) => {
  const { uid, onDetail } = param;

  return [
    {
      key: "model_property",
      label: "我的模型",
      component: (
        <SearchTable uid={uid} type={PropertyType.model} onDetail={onDetail} />
      ),
    },
    {
      key: "tag_property",
      label: "我的标签",
      component: (
        <SearchTable uid={uid} type={PropertyType.tag} onDetail={onDetail} />
      ),
    },
  ];
};
