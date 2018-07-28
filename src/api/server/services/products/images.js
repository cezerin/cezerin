import { ObjectID } from 'mongodb';
import path from 'path';
import url from 'url';
import formidable from 'formidable';
import fse from 'fs-extra';
import settings from '../../lib/settings';
import { db } from '../../lib/mongo';
import utils from '../../lib/utils';
import parse from '../../lib/parse';
import SettingsService from '../settings/settings';

class ProductImagesService {
	constructor() {}

	getErrorMessage(err) {
		return { error: true, message: err.toString() };
	}

	getImages(productId) {
		if (!ObjectID.isValid(productId)) {
			return Promise.reject('Invalid identifier');
		}
		let productObjectID = new ObjectID(productId);

		return SettingsService.getSettings().then(generalSettings =>
			db
				.collection('products')
				.findOne({ _id: productObjectID }, { fields: { images: 1 } })
				.then(product => {
					if (product && product.images && product.images.length > 0) {
						let images = product.images.map(image => {
							image.url = url.resolve(
								generalSettings.domain,
								settings.productsUploadUrl +
									'/' +
									product._id +
									'/' +
									image.filename
							);
							return image;
						});

						images = images.sort((a, b) => a.position - b.position);
						return images;
					} else {
						return [];
					}
				})
		);
	}

	deleteImage(productId, imageId) {
		if (!ObjectID.isValid(productId) || !ObjectID.isValid(imageId)) {
			return Promise.reject('Invalid identifier');
		}
		let productObjectID = new ObjectID(productId);
		let imageObjectID = new ObjectID(imageId);

		return this.getImages(productId)
			.then(images => {
				if (images && images.length > 0) {
					let imageData = images.find(
						i => i.id.toString() === imageId.toString()
					);
					if (imageData) {
						let filename = imageData.filename;
						let filepath = path.resolve(
							settings.productsUploadPath + '/' + productId + '/' + filename
						);
						fse.removeSync(filepath);
						return db
							.collection('products')
							.updateOne(
								{ _id: productObjectID },
								{ $pull: { images: { id: imageObjectID } } }
							);
					} else {
						return true;
					}
				} else {
					return true;
				}
			})
			.then(() => true);
	}

	async addImage(req, res) {
		const productId = req.params.productId;
		if (!ObjectID.isValid(productId)) {
			res.status(500).send(this.getErrorMessage('Invalid identifier'));
			return;
		}

		let uploadedFiles = [];
		const productObjectID = new ObjectID(productId);
		const uploadDir = path.resolve(
			settings.productsUploadPath + '/' + productId
		);
		fse.ensureDirSync(uploadDir);

		let form = new formidable.IncomingForm();
		form.uploadDir = uploadDir;

		form
			.on('fileBegin', (name, file) => {
				// Emitted whenever a field / value pair has been received.
				file.name = utils.getCorrectFileName(file.name);
				file.path = uploadDir + '/' + file.name;
			})
			.on('file', async (field, file) => {
				// every time a file has been uploaded successfully,
				if (file.name) {
					const imageData = {
						id: new ObjectID(),
						alt: '',
						position: 99,
						filename: file.name
					};

					uploadedFiles.push(imageData);

					await db.collection('products').updateOne(
						{
							_id: productObjectID
						},
						{
							$push: { images: imageData }
						}
					);
				}
			})
			.on('error', err => {
				res.status(500).send(this.getErrorMessage(err));
			})
			.on('end', () => {
				res.send(uploadedFiles);
			});

		form.parse(req);
	}

	updateImage(productId, imageId, data) {
		if (!ObjectID.isValid(productId) || !ObjectID.isValid(imageId)) {
			return Promise.reject('Invalid identifier');
		}
		let productObjectID = new ObjectID(productId);
		let imageObjectID = new ObjectID(imageId);

		const imageData = this.getValidDocumentForUpdate(data);

		return db.collection('products').updateOne(
			{
				_id: productObjectID,
				'images.id': imageObjectID
			},
			{ $set: imageData }
		);
	}

	getValidDocumentForUpdate(data) {
		if (Object.keys(data).length === 0) {
			return new Error('Required fields are missing');
		}

		let image = {};

		if (data.alt !== undefined) {
			image['images.$.alt'] = parse.getString(data.alt);
		}

		if (data.position !== undefined) {
			image['images.$.position'] =
				parse.getNumberIfPositive(data.position) || 0;
		}

		return image;
	}
}

export default new ProductImagesService();
