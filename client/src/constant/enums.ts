export enum routes {
  model = "/model",
  analyze = "/analyze",
  mine = "/mine",
  property = "/property",
  home = "/",
}

export enum ResponseCode {
  OK = 200,
  MULTIPLE_CHOICE = 300,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  NOT_ACCEPTABLE = 406,
  INTERVAL_SERVER_ERROR = 500,
  OTHER = 600,
}

export enum UploadFileKey {
  USER_AVATAR = "user_avatar",
  MODEL_COVER = "model_cover",
  MODEL_URL = "model_url",
}
