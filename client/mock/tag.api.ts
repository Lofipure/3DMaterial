import mock from "mockjs";

export default {
  "GET /api/tag/list": mock.mock({
    code: 1,
    data: {
      "list|30": [
        {
          "tid|+1": 0,
          tag_name: "@cword(3,5)",
          tag_create_time: "@date(yyyy-mm-dd)",
          "relative_creator_list|3-5": [
            {
              "uid|+1": 0,
              username: "@cname(2)",
            },
          ],
          model_num: "@integer(100000, 300000)",
        },
      ],
      total: 30,
    },
  }),
  "POST /api/tag/delete": {
    code: 1,
    data: {
      status: 1,
    },
  },
  "GET /api/tag/check_name": {
    code: 1,
    data: {
      status: 1,
    },
  },
  "GET /api/tag/add": {
    code: 1,
    data: {
      status: 1,
    },
  },
};
