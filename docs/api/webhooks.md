# Webhooks

* [List all webhooks](#list-all-webhooks)
* [Retrieve a webhook](#retrieve-a-webhook)
* [Create a webhook](#create-a-webhook)
* [Update a webhook](#update-a-webhook)
* [Delete a webhook](#delete-a-webhook)

## List all webhooks

```
GET /api/v1/webhooks
```

## Retrieve a webhook

```
GET /api/v1/webhooks/{webhook_id}
```

## Create a webhook

```
POST /api/v1/webhooks
```

#### Request body

| Name | Type | Description |
| --- | --- | --- |
| `url` | `string` | The URL that is configured to listen for incoming POST notification messages that contain event information. Example: `https://app.com/notifications` |
| `events` | `array` of `string` | An array of events to which to subscribe your webhook. Example: `["order.created", "order.updated", "order.paid"]` |
| `enabled` | `boolean` | Set to `true` to deliver the webhook payload when one of the events is triggered. |
| `secret` | `string` | Optional. Used to compute the SHA256 HMAC signature of the webhook body. |
| `description` | `string` | Optional. Any description for this webhook. |

## Update a webhook

```
PUT /api/v1/webhooks/{webhook_id}
```

#### Request body

Same as create.

## Delete a webhook

```
DELETE /api/v1/webhooks/{webhook_id}
```
