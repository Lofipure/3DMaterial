type NameValue = {
  name: string;
  value: number;
};

export interface IModelTypeAnalyze {
  list: NameValue[];
  total: number;
}

export interface IModelVisitAnalyze {
  model_visit: NameValue[];
  daily_visit: NameValue[];
  popular_model: {
    mid: string;
    model_name: string;
    goods: number;
  };
  [key: string]: any;
}

export interface ITagPopularityAnalyze {
  list: NameValue[];
}

export interface IComprehensiveAnalyze {
  model_cnt: number;
  user_cnt: number;
  popular_model: {
    mid: string;
    model_name: string;
    model_cover: string;
  };
}
