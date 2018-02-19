# Apps

Client-side apps on the dashboard.

* [Retrieve settings](#retrieve-settings)
* [Update settings](#update-settings)

## Retrieve settings

```
GET /api/v1/apps/{app_key}/settings
```

#### Response body

```js
{
  "_id": "5a2fafb31aaff82bc574b4ad",
  "key": "{app_key}",
  "property-1": "String data",
  "property-2": "String data"
}
```

## Update settings

```
PUT /api/v1/apps/{app_key}/settings
```

#### Request body

```js
{
  "property-1": "String data",
  "property-2": "String data"
}
```
