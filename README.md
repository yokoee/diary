# API

## POST `/token`

获取token

| 参数 | 说明 |
| :----: | :----: |
| password | 认证不通过返回401 |

## POST `/journals/page/<int>`

获取指定页数日志，每页20条

| 参数 | 说明 |
| :----: | :----: |
| token | 认证不通过返回401 |

## POST `/journal/id/<int>`

获取指定日志

| 参数 | 说明 |
| :----: | :----: |
| token | 认证不通过返回401 |

## POST `/journal/add`

增加日志

| 参数 | 说明 |
| :----: | :----: |
| token | 认证不通过返回401 |
| text | 日志内容 |

## POST `/journal/update`

修改日志内容

| 参数 | 说明 |
| :----: | :----: |
| token | 认证不通过返回401 |
| id | 日志id |
| text | 新的日志内容 |

## POST `/journal/delete`

删除一条日志

| 参数 | 说明 |
| :----: | :----: |
| token | 认证不通过返回401 |
| id | 日志id |