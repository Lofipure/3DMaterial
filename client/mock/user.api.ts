import mock from "mockjs";

export default {
  "POST /api/user/login": {
    code: 1,
    data: {
      status: 1,
      uid: 4,
      user_avatar:
        "http://114.116.246.240:1188/img/8bcw89ktrgocbazftjf917sn123.jpg",
      username: "Wangziheng",
    },
  },
  "POST /api/user/save": {
    code: 1,
    data: {
      status: 1,
      uid: 4,
      user_avatar:
        "http://114.116.246.240:1188/img/8bcw89ktrgocbazftjf917sn123.jpg",
      username: "Wangziheng",
    },
  },
  "GET /api/user/list": mock.mock({
    code: 1,
    data: {
      "list|100": [
        {
          "uid|+1": 0,
          username: "@cname(3)",
          email: "@email",
          user_avatar:
            "http://114.116.246.240:1188/img/8bcw89ktrgocbazftjf917sn123.jpg",
        },
      ],
    },
  }),
  "GET /api/user/detail": mock.mock({
    code: 1,
    data: {
      username: "WangZiHeng.",
      create_time: "2021-12-12",
      uid: 4,
      user_avatar:
        "http://114.116.246.240:1188/img/8bcw89ktrgocbazftjf917sn123.jpg",
      email: "wangziheng.0915@bytedance.com",
      "sex|1": [1, 2],
      tag_num: "@integer(2000, 30000)",
      model_num: "@integer(2000, 30000)",
    },
  }),
  "GET /api/user/relative_creator": mock.mock({
    code: 1,
    data: {
      "list|10": [
        {
          "uid|+1": 1,
          username: "@cname(3)",
          user_avatar:
            "http://114.116.246.240:1188/img/8bcw89ktrgocbazftjf917sn123.jpg",
          email: "@email",
        },
      ],
    },
  }),
  "GET /api/user/record": mock.mock({
    code: 1,
    data: {
      "commit|500": [
        {
          year: "2021",
          date: "@date(MM-dd)",
          "type|1": [1, 2],
          username: "@cname(2)",
          model_name: "@cword(5)",
        },
      ],
      "visit|500": [
        {
          year: "2021",
          date: "@date(MM-dd)",
          "type|1": [3, 4],
          username: "@cname(2)",
          model_name: "@cword(5)",
        },
      ],
    },
  }),
  "GET /api/user/analyze/graph": mock.mock({
    code: 1,
    data: {
      links: [
        {
          source: "1_1",
          target: "1_2",
        },
        {
          source: "1_1",
          target: "1_3",
        },
        {
          source: "1_1",
          target: "2_1",
        },
        {
          source: "1_1",
          target: "2_2",
        },
        {
          source: "2_1",
          target: "3_1",
        },
        {
          source: "2_2",
          target: "3_1",
        },
        {
          source: "1_3",
          target: "3_2",
        },
        {
          source: "1_2",
          target: "3_3",
        },
        {
          source: "1_3",
          target: "3_3",
        },
        {
          source: "1_3",
          target: "3_4",
        },
        {
          source: "1_2",
          target: "3_5",
        },
        {
          source: "2_1",
          target: "3_2",
        },
        {
          source: "2_2",
          target: "3_3",
        },
      ],
      nodes: [
        {
          type: 1,
          name: "@cname(2)",
          id: "1_1",
          uid: 1,
        },
        {
          type: 1,
          name: "@cname(2)",
          id: "1_2",
          uid: 2,
        },
        {
          type: 1,
          name: "@cname(2)",
          id: "1_3",
          uid: 3,
        },
        {
          type: 2,
          name: "@cword(2)",
          id: "2_1",
        },
        {
          type: 2,
          name: "@cword(3)",
          id: "2_2",
        },
        {
          type: 3,
          name: "@cword(6)",
          id: "3_1",
        },
        {
          type: 3,
          name: "@cword(6)",
          id: "3_2",
        },
        {
          type: 3,
          name: "@cword(6)",
          id: "3_3",
        },
        {
          type: 3,
          name: "@cword(6)",
          id: "3_4",
        },
        {
          type: 3,
          name: "@cword(6)",
          id: "3_5",
        },
      ],
    },
  }),
  "GET /api/user/analyze/detail": mock.mock({
    code: 1,
    data: {
      "tag_analyze|5": [
        {
          label: "@cword(3, 6)",
          value: "@integer(4, 20)",
        },
      ],
      "power_analyze|3": [
        {
          label: "@cword(3)",
          value: "@integer(4, 20)",
        },
      ],
    },
  }),
  "GET /api/user/goods_to": {
    code: 1,
    data: {
      status: 1,
    },
  },
  "GET /api/user/visit": {
    code: 1,
    data: {
      status: 1,
    },
  },
};
