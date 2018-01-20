# API

## POST `/token`

获取token

| 参数 | 说明 |
| :----: | :----: |
| password | 认证不通过返回401 |

## POST `/diaries/page/<int>`

获取指定页数日志，每页20条

| 参数 | 说明 |
| :----: | :----: |
| token | 认证不通过返回401 |

## POST `/diary/id/<int>`

获取指定日志

| 参数 | 说明 |
| :----: | :----: |
| token | 认证不通过返回401 |

## POST `/diary/add`

增加日志

| 参数 | 说明 |
| :----: | :----: |
| token | 认证不通过返回401 |
| text | 日志内容 |

## POST `/diary/update`

修改日志内容

| 参数 | 说明 |
| :----: | :----: |
| token | 认证不通过返回401 |
| id | 日志id |
| text | 新的日志内容 |

## POST `/diary/delete`

删除一条日志

| 参数 | 说明 |
| :----: | :----: |
| token | 认证不通过返回401 |
| id | 日志id |