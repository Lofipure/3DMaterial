# 3D Material Backend API Doc

### /model

#### 1. 保存模型

- URL：`/model/save`
- Method：POST
- Request

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

- Response

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
- Request

| Params     | Type     | Description      | Is Required |
| ---------- | -------- | ---------------- | ----------- |
| creators   | string[] | 创建者ID 列表    | false       |
| is_self    | boolean  | 只获取自己的模型 | false       |
| name       | string   | 模型名称         | false       |
| model_tags | string[] | 模型标签列表     | false       |
| uid        | string   | 当前用户ID       | true        |

- Response

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

#### 4. 删除模型

#### 5. 查看模型详细

