/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 05/05/2023 20:22:46
 */
const moment = require('moment')
const fs = require('fs')
const ProductModel = require('../models/productModel.js')
const { slugify } = require('../helpers/utils.js');

/**
 * productController.js
 *
 * @description :: Server-side logic for managing products.
 */
module.exports = {

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * productController.getProducts()
     */
    getProductsByPage: async (req, res) => {
        try {
            let pageNumber = req.query?.pageNumber ? parseInt(req.query?.pageNumber) : 1
            let pageLimit = req.query?.pageLimit ? parseInt(req.query?.pageLimit) : 5

            let allCount = await ProductModel.find({}).count()

            if (pageNumber > Math.ceil(allCount / pageLimit)) {
                const value = Math.ceil(allCount / pageLimit)
                pageNumber = value > 0 ? value : 1
            }

            let products = await ProductModel.find({})
                // .populate("name")
                .sort('-created_at')
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            products = products.map((item) => {
                item.created_formatted_with_time_since = moment(item?.created_at).fromNow()
                return item
            })

            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                allCount: allCount,
                resultCount: products.length,
                current: pageNumber,
                next: allCount > (pageNumber * pageLimit) ? pageNumber + 1 : null,
                previous: pageNumber - 1 > 0 ? pageNumber - 1 : null,
                results: products.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            })


        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting product.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * productController.getProducts()
     */
    getProducts: async (req, res) => {
        try {
            const products = await ProductModel.find({})
           
            return res.json({
                isSuccess: true,
                statusCode: 200,
                resultCount: products.length,
                results: products,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting product.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * productController.showProductById()
     */
    searchProductByTag: async (req, res) => {
        try {

            let filter = {}
            let pageNumber = req.query?.pageNumber ? parseInt(req.query?.pageNumber) : 1
            let pageLimit = req.query?.pageLimit ? parseInt(req.query?.pageLimit) : 5



            const email = req.query?.email ? new RegExp(req.query.email, 'i') : null

            const isNewArrival = req.query?.isNewArrival ? req.query?.isNewArrival : null
            const isFeatured = req.query?.isFeatured ? req.query?.isFeatured : null
            const isSpecialOffer = req.query?.isSpecialOffer ? req.query?.isSpecialOffer : null
            const isBestSeller = req.query?.isNewArrival ? req.query?.isBestSeller : null

            const name = req.query?.name ? new RegExp(req.query.name, 'i') : null
            const content = req.query?.content ? new RegExp(req.query.content, 'i') : null
            const description = req.query?.description ? new RegExp(req.query.content, 'i') : null
            const startDate = req.query?.startDate ? new Date(req.query?.startDate) : null
            const endDate = req.query?.endDate ? new Date(req.query?.endDate) : null

            if (email) {
                filter.email = email
            }
            if (isBestSeller) {
                filter.isBestSeller = isBestSeller
            }
            if (isFeatured) {
                filter.isFeatured = isFeatured
            }
            if (isSpecialOffer) {
                filter.isSpecialOffer = isSpecialOffer
            }
            if (isNewArrival) {
                filter.isNewArrival = isNewArrival
            }
            if (name) {
                filter.name = name
            }
            if (content) {
                filter.content = content
            }
            if (description) {
                filter.description = description
            }
            if (startDate) {
                filter.created_at = { $gt: startDate }
            }

            if (endDate) {
                if (filter.created_at) {
                    filter.created_at = { ...filter.created_at, $lt: endDate }
                } else {
                    filter.created_at = { $lt: endDate }
                }
            }

            let allCount = await ProductModel.find(filter).count()

            if (pageNumber > Math.ceil(allCount / pageLimit)) {
                const value = Math.ceil(allCount / pageLimit)
                pageNumber = value > 0 ? value : 1
            }
            // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
            // .sort('-created_at')
            // .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            let products = await ProductModel.find(filter)
                // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
                .sort('-created_at')
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            products = products.map((item) => {
                item.created_formatted_with_time_since = moment(item?.created_at).fromNow()
                return item
            })

            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                filter: req.query,
                resultCount: allCount,
                allCount: allCount,
                current: pageNumber,
                next: allCount > (pageNumber * pageLimit) ? pageNumber + 1 : null,
                previous: pageNumber - 1 > 0 ? pageNumber - 1 : null,
                results: products.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting product.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * productController.showProductById()
     */
    showProductById: async (req, res) => {
        try {
            const id = req.params.id;
            const product = await ProductModel.findOne({ _id: id })

            if (!product) {
                return res.status(404).json({
                    isSuccess: false,
                    statusCode: 404,
                    message: 'No such product',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                result: product,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting product.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * productController.showProductBySlug()
     */
    showProductBySlug: async (req, res) => {
        try {
            const slug = req.params.slug;
            const product = await ProductModel.findOne({ slug: slug })
                            .populate("categories")
                            .populate("relatedProducts")

            if (!product) {
                return res.status(404).json({
                    isSuccess: false,
                    statusCode: 404,
                    message: 'No such product',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                result: product,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting product.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * productController.createProduct()
     */
    createProduct: async (req, res) => {

        try {

            if (req?.files?.lenth) {
                var product = JSON.parse(req.body.product)
            } else {
                var { product } = req.body
            }

            product = typeof (product) === "string" ? JSON.parse(product) : product

            console.log(product)

            let name = product.name
            let slug = slugify(name)

            index = 0
            words = ["shop", "jstore", "category", "mudey", "espero", "akpoli"]

            while (await ProductModel.findOne({ slug }) && words[index]) {
                name += " " + words[index]
                slug = slugify(name)
                index++
            }

            product.slug = slug
            console.log(product);


            if (!product) {
                return res.status(422).json({
                    isSuccess: false,
                    statusCode: 422,
                    message: 'Missing params of product.',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            if (!Object.keys(product).length) {
                return res.status(422).json({
                    isSuccess: false,
                    statusCode: 422,
                    message: 'Empty product !',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            if (req?.files?.length) {
                product.imageUrls = []
                req.files.forEach(file => {
                    product.imageUrls.push(`${req.protocol}://${req.get('host')}/assets/files/${file.filename}`)
                })
            }



            product = new ProductModel({ ...product })

            product.created_at = product?.created_at ? product.created_at : new Date()

            await product.save()

            return res.status(201).json({
                isSuccess: true,
                statusCode: 201,
                message: "product is saved !",
                result: product,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when creating product.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * productController. updateProductById()
     */
    updateProductById: async (req, res) => {
        try {
            const id = req.params.id;
            if (req?.files?.length) {
                var product = JSON.parse(req.body.product)
            } else {
                var { product } = req.body
            }
            try {
                var deleteFiles = JSON.parse(req.body?.deleteFiles)

            } catch (error) {
                var deleteFiles = []

            }
            product = typeof (product) == "string" ? JSON.parse(product) : product
            console.log(product)



            if (!product) {
                return res.status(422).json({
                    isSuccess: false,
                    statusCode: 422,
                    message: 'Missing params of product.',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }
            if (!Object.keys(product).length) {
                return res.status(500).json({
                    isSuccess: false,
                    statusCode: 422,
                    message: 'Empty product !',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            if (req?.files?.length) {
                req.files.forEach(file => {
                    product.imageUrls.push(`${req.protocol}://${req.get('host')}/assets/files/${file.filename}`)
                })
            }
            if (deleteFiles?.length) {
                deleteFiles.forEach(currentFileUrl => {
                    product.imageUrls = product.imageUrls.filter(fileUrl => fileUrl !== currentFileUrl)
                    const filename = "public/assets/" + currentFileUrl.split('/assets/')[1];
                    console.log({ filename });
                    fs.unlink(filename, (err) => {
                        if (err) {
                            console.log(err.message);
                        }
                    });

                })
            }

            product.updated_at = product?.updated_at ? product.updated_at : new Date()

            delete product?._id
            await ProductModel.updateOne({ _id: id }, { ...product })

            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                message: "product is updated !",
                result: product,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {
            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when updating product.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * productController.sortProductByPosition
     */
    sortProductByPosition: (req, res) => {
        try {

            const { datas } = req.body

            datas.forEach(async (elt) => {
                await ProductModel.updateOne({ _id: elt._id }, {
                    $set: { position: elt.position }
                })
            });


            return res.status(200).json({
                statusCode: 200,
                isSuccess: true,
                message: "product sorted !",
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                statusCode: 500,
                isSuccess: false,
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            })

        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * productController.removeProductById()
     */
    removeProductById: async (req, res) => {
        try {
            var id = req.params.id;


            const product = await ProductModel.findOne({ _id: id }, { imageUrls: true })
            console.log(product)
            if (product) {
                // const old_image = product.imageUrls
                // if (old_image) {
                //     const filename = "public/assets/" + old_image.split('/assets/')[1];
                //     console.log({ filename });
                //     fs.unlink(filename, (err) => {
                //         if (err) {
                //             console.log(err.message);
                //         }
                //     });
                // }
                await ProductModel.deleteOne({ _id: id })


                return res.status(204).json({
                    // 204 No Content
                    // isSuccess: true,
                    // statusCode: 204,
                    // message: 'Data deleted ! .',
                });

            }
            return res.status(404).json({
                isSuccess: false,
                statusCode: 404,
                message: "Product not found !",
            });

        } catch (error) {
            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when deleting product.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    }
};
