# 3D Material Backend API Doc

### /model

#### 1. 保存模型

- URL：`/model/save`
- Method：POST
- Request：

| Parmas      | Type        | Description     | Is Required |
| ----------- | ----------- | --------------- | ----------- |
| mid         | string      | 模型ID          | false       |
| model_name  | string      | 模型名称        | true        |
| model_desc  | string      | 模型简介        | true        |
| model_cover | string      | 模型展示图      | true        |
| model_intro | string      | 模型介绍        | true        |
| model_url   | string      | 模型gltf资源URL | true        |
| auth        | AuthControl | 模型权限类型    | true        |
| tag_list    | string[]    | 模型标签列表    | true        |
| uid         | string      | 模型所有者ID    | true        |

```typescript
enum AuthControl {
  public = 1, // 公共模型，所有人可见
  protected = 2, // 受保护模型，仅自己与协作者可见
}
```

- Response：

```json
{
  "code": 1,
  "data": {
    "status": 1 ｜ 0， // 保存状态『是否成功』
  }
}
```

#### 2. 获取模型列表

- URL：`/model/list`
- Method：POST
- Request：

| Params     | Type     | Description      | Is Required |
| ---------- | -------- | ---------------- | ----------- |
| creators   | string[] | 创建者ID 列表    | false       |
| is_self    | boolean  | 只获取自己的模型 | false       |
| name       | string   | 模型名称         | false       |
| model_tags | string[] | 模型标签列表     | false       |
| uid        | string   | 当前用户ID       | true        |

- Response：

```json
{
  "code": 1,
  "data": {
    "list": [{
      "mid": 1, // 模型ID
      "model_name": "string", // 模型名称
      "model_desc": "string", // 模型简介
      "model_cover": "string", // 模型缩略图
      "model_url": "string", // 模型gltf 地址
      "model_intro": "string", // 模型介绍
      "auth": AuthControl, // 模型权限控制
      "createdAt": "Date",
      "updatedAt": "Date",
      "tag_list": [{ // 模型与标签关联关系
        "tid": "string",
        "tag_name": "string"
      }],
      "creator_list": [{ // 模型与作者关联关系
        "username": "string",
        "user_avatar": "string",
        "uid": "string"
      }],
      "model_goods": "number", // 获赞数
      "model_visited": "number", // 访问数
      "model_create_time": "string", // 创建时间
      "is_owner": boolean // 是不是用户自己的模型
    }],
    "total": 10,
  }
}
```

#### 3. 设置权限

- URL：`/model/set_auth`

- Method：POST

- Request：

  | Params     | Type     | Description             | Is Required |
  | ---------- | -------- | ----------------------- | ----------- |
  | mid        | number   | 模型ID                  | true        |
  | creator_id | number[] | 新设置的协作者的ID List | true        |

- Response：

  ```json
  {
    "code": 1,
    "data": {
      "staus": 1,
    }
  }
  ```

#### 4. 删除模型

- URL：`/model/delete`

- Method：POST

- Request：

  | Params | Type     | Description           | Is Required |
  | ------ | -------- | --------------------- | ----------- |
  | mid    | number[] | 要删除的模型的ID List | true        |

- Response：

  ```json
  {
    "code": 1,
    "data": {
      "staus": 1,
    }
  }
  ```

#### 5. 查看模型详细

- URL：`/model/detail`

- Method：GET

- Request：

  | Params | Type     | Description | Is Required |
  | ------ | -------- | ----------- | ----------- |
  | mid    | number[] | 模型ID      | true        |

- Response：

  ```json
  {
    "code": 1,
    "data": {
      "creator": {
        "uid": "number", // User ID
        "email": "string",
        "username": "string",
        "sex": 1, // 性别 「1: 男」「2: 女」
      },
      "mid": 1, // 模型ID
      "model_name": "string", // 模型名称
      "model_desc": "string", // 模型简介
      "model_cover": "string", // 模型缩略图
      "model_url": "string", // 模型gltf 地址
      "model_intro": "string", // 模型介绍
      "auth": AuthControl, // 模型权限控制
      "model_goods": "number", // 模型获赞数
      "model_visit": "number", // 模型访问数
      "relative_model_list": [{
        "mid": "number", //模型ID
        "model_name": "string", // 模型名称
        "tid": "number", // 相关标签ID
        "tag_name": "string", // 标签名称
      }],
      "tag_list": [{
        "tid": "number", // 标签ID
        "tag_name": "string", // 标签名称
      }]
    }
  }
  ```



### /tag

#### 1. 新增/修改 标签

- URL：`/tag/save`

- Method：GET

- Request：

  | Params   | Type   | Description      | Is Required |
  | -------- | ------ | ---------------- | ----------- |
  | tag_name | string | 标签名称         | true        |
  | uid      | number | 变更标签的用户ID | true        |
  | tid      | number | 标签ID「编辑」   | false       |

- Response：

  ```json
  {
    "code": 1,
    "data": {
      "status": 1
    }
  }
  ```

#### 2. 标签名称校重

- URL：`/tag/check_name`

- Method：GET

- Request：

  | Params   | Type   | Description | Is Required |
  | -------- | ------ | ----------- | ----------- |
  | tag_name | string | 标签名称    | true        |

- Response：

  ```json
  {
    "code": 1,
    "data": {
      "status": 1,
    }
  }
  ```

#### 3. 获取标签列表

- URL：`/tag/list`

- Method：GET

- Request：

  | Params  | Type    | Description    | Is Required |
  | ------- | ------- | -------------- | ----------- |
  | uid     | number  | 操作人 ID      | false       |
  | name    | string  | 标签名称       | false       |
  | is_self | boolean | 只看自己的标签 | false       |

- Response：

  ```json
  {
    "code": 1,
    "data": {
      list: [{
        tid: "number", // 标签ID
        is_owner: "boolean", // 是不是自己的标签
        model_num: "number", // 标签下模型数量
        relative_creator_list: [{
          uid: "number", // 协作者 ID
          username: "string", // 协作者用户名
        }],
        tag_create_time: "string", // 标签创作时间
        tag_name: "string", // 标签名称
      }]
    }
  }
  ```

#### 4. 删除标签

- URL：`/tag/delete`

- Method：POST

- Request：

  | Params | Type     | Description | Is Required |
  | ------ | -------- | ----------- | ----------- |
  | tid    | number[] | 标签ID      | true        |

- Response：

  ```json
  {
    "code": 1,
    "data": {
      "status": 1
    }
  }
  ```

  

### /user

#### 1. 登陆

- URL：`/user/login`

- Method：POST

- Request：

  | Params   | Type   | Description | Is Required |
  | -------- | ------ | ----------- | ----------- |
  | email    | string | 邮箱        | true        |
  | password | string | 密码        | true        |

- Response：

  ```json
  {
    "code": 1,
    "data": {
      "email": "string", // 邮箱
      "username": "string", // 用户名
      "login_token": "e84fbfb2ff916ea5442f64ff8eab8172",
      "sex": "number", // 性别
      "uid": "number", // 用户 ID
      "user_avatar": "string", // 头像
    }
  }
  ```

#### 2. 注册 / 修改

- URL：`/user/save`

- Method：POST

- Request：

  | Params      | Type   | Description | Is Required |
  | ----------- | ------ | ----------- | ----------- |
  | email       | string | 用户邮箱    | true        |
  | password    | string | 用户密码    | true        |
  | username    | string | 用户名      | true        |
  | sex         | number | 用户性别    | true        |
  | user_avatar | string | 用户头像    | true        |

- Response：

  ```json
  {
    "code": 1,
    "data": {
      "status": 1,
    }
  }
  ```

#### 3. 获取用户列表

- URL：`/user/list`

- Method：GET

- Request：

  | Params | Type | Description | Is Required |
  | ------ | ---- | ----------- | ----------- |
  | null   | null | null        | false       |

- Response：

  ```json
  {
    "code": 1,
    "data": {
      "list": [{
        "email": "string", // 邮箱
        "username": "string", // 用户名
        "sex": "number", // 性别
        "uid": "number", // 用户 ID
        "user_avatar": "string", // 头像
      }]
    }
  }
  ```

#### 4. 获取用户详细信息

- URL：`/user/detail`

- Method：GET

- Request：

  | Params | Type   | Description | Is Required |
  | ------ | ------ | ----------- | ----------- |
  | uid    | number | 用户ID      | true        |

- Response：

  ```json
  {
    "code": 1,
    "data": {
      "email": "string", // 邮箱
      "username": "string", // 用户名
      "sex": "number", // 性别
      "uid": "number", // 用户 ID
      "user_avatar": "string", // 头像
      "model_num": "number", // 用户的模型数
      "tag_num": "number", // 用户的标签数
      "create_time": "string", // 创建账号时间
    }
  }
  ```

#### 5. 获取用户的协作者

- URL：`/user/relative_creator`

- Method：GET

- Request：

  | Params | Type   | Description | Is Required |
  | ------ | ------ | ----------- | ----------- |
  | uid    | number | 用户ID      | true        |

- Response：

  ```json
  {
    "code": 1,
    "data": {
      "list": [{
        "uid": "number", 
        "username": "string", 
        "user_avatar": "string", 
        "email": "string"
      }]
    }
  }
  ```

#### 6. 获取用户记录

- URL：`/user/record`

- Method：GET

- Request：

  | Params | Type   | Description | Is Required |
  | ------ | ------ | ----------- | ----------- |
  | uid    | number | 用户ID      | true        |
  | year   | number | 年份        | true        |

- Response：

  ```json
  {
    "code": 1,
    "data": {
      "commit": [{
        "uid": "number", // 操作者ID
        "username": "string", // 操作者用户名
        "mid": "number", // 被操作模型ID
        "model_name": "string", // 被操作模型名
        "date": "string", // 被操作时间
        "year": "string", // 被操作年
        "type": "number", // 操作类型「1: 创建」「2: 修改」
      }]
    }
  }
  ```

#### 7. 点赞

- URL：`/user/goods_to`

- Method：GET

- Request：

  | Params | Type   | Description | Is Required |
  | ------ | ------ | ----------- | ----------- |
  | uid    | number | 点赞者ID    | true        |
  | mid    | number | 点赞模型ID  | true        |

- Response：

  ```json
  {
    "code": 1,
    "data": {
      "status": 1,
    }
  }
  ```

#### 8. 获取用户模型协作者聚类图

- URL：`/user/analyze/graph`

- Method：GET

- Request：

  | Params | Type   | Description | Is Required |
  | ------ | ------ | ----------- | ----------- |
  | uid    | number | 用户ID      | true        |

- Response：

  ```typescript
  export enum EntityType {
    User = 1,
    Tag = 2,
    Model = 3,
  }
  ```

  ```json
  {
    "code": 1,
    "data": {
      "nodes": [{
        "type": EntityType, // 实体类型
        "name": "string", // 实体名称
        "id": "string", // 实体ID
      }],
      "links": [{
        source: "string", // 起点节点ID
        target: "string", // 终点节点ID
        is_owner: "boolean" // User -> Model 的关系是『所有者』还是『协作者』
      }],
    }
  }
  ```

#### 9. 获取用户数据分析

- URL：`/user/analyze/detail`

- Request：

  | Params | Type   | Description | Is Required |
  | ------ | ------ | ----------- | ----------- |
  | uid    | number | 用户ID      | true        |

- Response：

  ```json
  {
    "code": 1,
    "data": {
      "tag_analyze": [{ // 所创建模型的标签分析
        label: "string",
        value: "number"
      }],
      "power_analyze": [{ // 能力分析
        label: "string",
        value: "number"
      }]
    }
  }
  ```



### /analyze

#### 1. 模型类型分析

- URL：`/analyze/model_type`

- Method：GET

- Request：NULL

- Response：

  ```json
  {
    "code": 1,
    "data": {
      "list": [{
        "name": "string",
        "value": "number"
      }]
    }
  }
  ```

#### 2. 模型访问情况分析

- URL：`/analyze/model_visit`

- Method：GET

- Request：NULL

- Response：

  ```json
  {
    "code": 1,
    "data": {
      "model_visit": [{ // 模型访问统计
        "name": "string",
        "value": "number"
      }],
      "daily_visit": [{ // 每日访问变化
        "name": "string",
        "value": "number"
      }],
      "popular_model": { // 最受欢迎模型
        "mid": "number", // 模型ID
        "model_name": "string", // 模型名
        "goods": "number", // 获赞数
      }
    }
  }
  ```

#### 3. 标签热度分析

- URL：`/analyze/tag_popularity`

- Method：GET

- Request：NULL

- Response：

  ```json
  {
    "code": 1,
    "data": {
      "list": [{
        "name": "string",
        "value": "number"
      }]
    }
  }
  ```

#### 4. 综合分析

- URL：`/analyze/comprehensive_analyze`

- Method：GET

- Request：NULL

- Response：

  ```json
  {
    "code": 1,
    "data": {
      "model_cnt": "number", // 模型数
      "tag_cnt": "number", // 标签数
      "popular_model": { // 最受欢迎模型
        "mid": "number", // 模型ID
        "model_name": "string", // 模型名
        "goods": "number", // 获赞数
      }
    }
  }
  ```

  
