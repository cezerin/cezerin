# Redirects

Redirects
* [List all redirects](#list-all-redirects)
* [Create a redirect](#create-a-redirect)
* [Retrieve a redirect](#retrieve-a-redirect)
* [Update a redirect](#update-a-redirect)
* [Delete a redirect](#delete-a-redirect)

## List all redirects
```
GET /api/v1/redirects
```

## Create a redirect
```
POST /api/v1/redirects
```

#### Request body

| Name | Type | Description |
| --- | --- | --- |
| `from` | `string` | Path to redirect from (e.g. /old/path) |
| `to` | `string` | Path to redirect to (e.g. /new/path) |


## Retrieve a redirect
```
GET /api/v1/redirects/{redirect_id}
```

## Update a redirect
```
PUT /api/v1/redirects/{redirect_id}
```

## Delete a redirect
```
DELETE /api/v1/redirects/{redirect_id}
```
