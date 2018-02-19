# Products

Products
* [List all products](#list-all-products)
* [Create a product](#create-a-product)
* [Retrieve a product](#retrieve-a-product)
* [Update a product](#update-a-product)
* [Delete a product](#delete-a-product)

Images of the product
* [List all images of the product](#list-all-images-of-the-product)
* [Upload images to the product](#upload-images-to-the-product)
* [Update an image](#update-an-image)
* [Delete an image](#delete-an-image)

Product options
* [List all product options](#list-all-product-options)
* [Retrieve an option](#retrieve-an-option)
* [Create an option](#create-an-option)
* [Update an option](#update-an-option)
* [Delete an option](#delete-an-option)

Option values
* [List all values of the product option](#list-all-values-of-the-product-option)
* [Retrieve a value](#retrieve-a-value)
* [Create a value](#create-a-value)
* [Update a value](#update-a-value)
* [Delete a value](#delete-a-value)

Product variants
* [List all product variants](#list-all-product-variants)
* [Create a variant](#create-a-variant)
* [Update a variant](#update-a-variant)
* [Delete a variant](#delete-a-variant)
* [Set an option value to the product variant](#set-an-option-value-to-the-product-variant)

## List all products
```
GET /api/v1/products
```

#### Query parameters

| Name | Type | Description |
| --- | --- | --- |
| `limit` | `integer` | Default: `1000` |
| `offset` | `integer` | Default: `0` |
| `category_id` | `string` | - |
| `ids` | `string` | Comma-separated list of product ids |
| `sku` | `string` | Comma-separated list of product SKU |
| `on_sale` | `boolean` | - |
| `stock_status` | `string` | `available`, `out_of_stock`, `preorder`, `backorder`, `discontinued` |
| `price_from` | `float` | - |
| `price_to` | `float` | - |
| `tags` | `string` | Comma-separated list of product tags |
| `attributes.<name>` | `string` | Example: `attributes.color=white` |
| `enabled` | `boolean` | - |
| `discontinued` | `boolean` | - |
| `fields` | `string` | Comma-separated list of fields. Example `id,parent_id,name`  |

## Create a product
```
POST /api/v1/products
```

#### Request body

| Name | Type | Description |
| --- | --- | --- |
| `name` | `string` | - |
| `description` | `string` | - |
| `meta_description` | `string` | - |
| `meta_title` | `string` | - |
| `tags` | `array` of `string` | - |
| `attributes` | `array` of `object` | - |
| `enabled` | `boolean` | - |
| `discontinued` | `boolean` | - |
| `slug` | `string` | - |
| `sku` | `string` | - |
| `code` | `string` | - |
| `tax_class` | `string` | - |
| `related_product_ids` | `array` of `string` | - |
| `prices` | `array` | - |
| `cost_price` | `float` | - |
| `regular_price` | `float` | - |
| `sale_price` | `float` | - |
| `quantity_inc` | `integer` | - |
| `quantity_min` | `integer` | - |
| `weight` | `float` | - |
| `stock_quantity` | `integer` | - |
| `position` | `integer` | - |
| `date_stock_expected` | `date` | - |
| `date_sale_from` | `date` | - |
| `date_sale_to` | `date` | - |
| `stock_tracking` | `boolean` | - |
| `stock_preorder` | `boolean` | - |
| `stock_backorder` | `boolean` | - |
| `category_id` | `string` | - |
| `dimensions` | `object` | Properties: `'length', 'width', 'height'` |

## Retrieve a product
```
GET /api/v1/products/{product_id}
```

## Update a product
```
PUT /api/v1/products/{product_id}
```

## Delete a product
```
DELETE /api/v1/products/{product_id}
```

## List all images of the product
```
GET /api/v1/products/{product_id}/images
```

## Upload images to the product
```
POST /api/v1/products/{product_id}/images
```

## Update an image
```
PUT /api/v1/products/{product_id}/images/{image_id}
```

## Delete an image
```
DELETE /api/v1/products/{product_id}/images/{image_id}
```

## List all product options
```
GET /api/v1/products/{product_id}/options
```

## Retrieve an option
```
GET /api/v1/products/{product_id}/options/{option_id}
```

## Create an option
```
POST /api/v1/products/{product_id}/options
```

## Update an option
```
PUT /api/v1/products/{product_id}/options/{option_id}
```

## Delete an option
```
DELETE /api/v1/products/{product_id}/options/{option_id}
```

## List all values of the product option
```
GET /api/v1/products/{product_id}/options/{option_id}/values
```

## Retrieve a value
```
GET /api/v1/products/{product_id}/options/{option_id}/values/{value_id}
```

## Create a value
```
POST /api/v1/products/{product_id}/options/{option_id}/values
```

## Update a value
```
PUT /api/v1/products/{product_id}/options/{option_id}/values/{value_id}
```

## Delete a value
```
DELETE /api/v1/products/{product_id}/options/{option_id}/values/{value_id}
```

## List all product variants
```
GET /api/v1/products/{product_id}/variants
```

## Create a variant
```
POST /api/v1/products/{product_id}/variants
```

## Update a variant
```
PUT /api/v1/products/{product_id}/variants/{variant_id}
```

## Delete a variant
```
DELETE /api/v1/products/{product_id}/variants/{variant_id}
```

## Set an option value to the product variant
```
PUT /api/v1/products/{product_id}/variants/{variant_id}/options
```
