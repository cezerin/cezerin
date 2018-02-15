# Product Categories

* [List all categories](#list-all-categories)
* [Retrieve a category](#retrieve-a-category)
* [Create a category](#create-a-category)
* [Update a category](#update-a-category)
* [Delete a category](#delete-a-category)
* [Upload a category image](#upload-a-category-image)
* [Delete a category image](#delete-a-category-image)

## List all categories

```
GET /api/v1/product_categories
```

#### Query parameters

| Name | Type | Description |
| --- | --- | --- |
| `fields` | `string` | Comma-separated list of fields. Example `id,parent_id,name`  |
| `enabled` | `boolean` | Only enabled categories |

## Retrieve a category

```
GET /api/v1/product_categories/{category_id}
```

## Create a category

```
POST /api/v1/product_categories
```

#### Request body

| Name | Type | Description |
| --- | --- | --- |
| `name` | `string` | - |
| `description` | `string` | - |
| `meta_description` | `string` | - |
| `meta_title` | `string` | - |
| `enabled` | `boolean` | - |
| `sort` | `string` | - |
| `parent_id` | `string` | - |
| `position` | `integer` | - |
| `slug` | `string` | - |

## Update a category

```
PUT /api/v1/product_categories/{category_id}
```

#### Request body

| Name | Type | Description |
| --- | --- | --- |
| `name` | `string` | - |
| `description` | `string` | - |
| `meta_description` | `string` | - |
| `meta_title` | `string` | - |
| `enabled` | `boolean` | - |
| `sort` | `string` | - |
| `parent_id` | `string` | - |
| `position` | `integer` | - |
| `slug` | `string` | - |

## Delete a category

```
DELETE /api/v1/product_categories/{category_id}
```

## Upload a category image

```
POST /api/v1/product_categories/{category_id}/image
```

## Delete a category image

```
DELETE /api/v1/product_categories/{category_id}/image
```
