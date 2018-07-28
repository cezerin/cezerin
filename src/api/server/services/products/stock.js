import { ObjectID } from 'mongodb';
import { db } from '../../lib/mongo';
import ProductsService from './products';
import ProductVariantsService from './variants';

class ProductStockService {
	async handleOrderCheckout(orderId) {
		const order = await this.getOrder(orderId);
		if (order && order.items.length > 0) {
			for (const item of order.items) {
				await this.decrementStockQuantity(
					item.product_id,
					item.variant_id,
					item.quantity
				);
			}
		}
	}

	async handleCancelOrder(orderId) {
		const order = await this.getOrder(orderId);
		if (order && order.items.length > 0) {
			for (const item of order.items) {
				await this.incrementStockQuantity(
					item.product_id,
					item.variant_id,
					item.quantity
				);
			}
		}
	}

	async handleAddOrderItem(orderId, itemId) {
		const item = await this.getOrderItem(orderId, itemId);
		if (item) {
			await this.decrementStockQuantity(
				item.product_id,
				item.variant_id,
				item.quantity
			);
		}
	}

	async handleDeleteOrderItem(orderId, itemId) {
		const item = await this.getOrderItem(orderId, itemId);
		if (item) {
			await this.incrementStockQuantity(
				item.product_id,
				item.variant_id,
				item.quantity
			);
		}
	}

	async incrementStockQuantity(productId, variantId, quantity) {
		await this.changeStockQuantity(productId, variantId, quantity);
	}

	async decrementStockQuantity(productId, variantId, quantity) {
		await this.changeStockQuantity(productId, variantId, quantity * -1);
	}

	async changeStockQuantity(productId, variantId, quantity) {
		const product = await ProductsService.getSingleProduct(productId);
		if (product && this.isStockTrackingEnabled(product)) {
			// change product stock quantity
			const productQuantity = product.stock_quantity || 0;
			const newProductQuantity = productQuantity + quantity;
			await ProductsService.updateProduct(productId, {
				stock_quantity: newProductQuantity
			});

			if (this.isVariant(variantId)) {
				// change variant stock quantity
				const variantQuantity = this.getVariantQuantityFromProduct(
					product,
					variantId
				);
				const newVariantQuantity = variantQuantity + quantity;
				await ProductVariantsService.updateVariant(productId, variantId, {
					stock_quantity: newVariantQuantity
				});
			}
		}
	}

	getVariantQuantityFromProduct(product, variantId) {
		const variants = product.variants;
		if (variants && variants.length > 0) {
			const variant = variants.find(
				v => v.id.toString() === variantId.toString()
			);
			if (variant) {
				return variant.stock_quantity || 0;
			}
		}

		return 0;
	}

	isStockTrackingEnabled(product) {
		return product.stock_tracking === true;
	}

	isVariant(variantId) {
		return variantId && variantId !== '';
	}

	async getOrder(orderId) {
		const filter = {
			_id: new ObjectID(orderId),
			draft: false
		};

		const order = await db.collection('orders').findOne(filter);
		return order;
	}

	async getOrderItem(orderId, itemId) {
		const order = await this.getOrder(orderId);
		if (order && order.items.length > 0) {
			return order.items.find(item => item.id.toString() === itemId.toString());
		} else {
			return null;
		}
	}
}

export default new ProductStockService();
