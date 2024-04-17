const categoryModel = require("../models/categoryModel")
const contactModel = require("../models/contactModel")
const fileModel = require("../models/fileModel")
const orderModel = require("../models/orderModel")
const pageModel = require("../models/pageModel")
const productModel = require("../models/productModel")
const userModel = require("../models/userModel")
const shell = require("shelljs")
const bcrypt = require("bcrypt")
const randomName = require("random-name")
const randomEmail = require("random-email")
const randomPhone = require("random-phone")

const fs = require("fs")
const { users, files, contacts, products, pages, categories } = require("./datas")
const { slugify } = require("../helpers/utils")
const profileModel = require("../models/profileModel")
const client_authorizedModel = require("../models/client_authorizedModel")
const videoResolutionModel = require("../models/videoResolutionModel")

const generateName = () => {
    var name = Math.floor(Math.random() * Math.floor(152524521325)).toString();
    name += Math.floor(Math.random() * Math.floor(1552252325)).toString();
    name += Math.floor(Math.random() * Math.floor(85455458652325)).toString();
    name += Math.floor(Math.random() * Math.floor(8544652325)).toString();
    name += Date.now();

    return name

}

const loadData = async () => {
    // console.log({PORT: process.env.PORT});
    // await pageModel.deleteMany({})
    // await orderModel.deleteMany({})
    // await productModel.deleteMany({})
    // await categoryModel.deleteMany({})
    // await userModel.deleteMany({})
    // await client_authorizedModel.deleteMany({})

    if ((await userModel.find({})).length < 200) {
        for (let index = 0; index < 210; index++) {
            const user = new userModel({
                fullName: randomName(),
                email: randomEmail(),
                phone: randomPhone()
            })

            const profile = new profileModel({
                business_name: "",
                function: "",
                description: "",
                address: "",
                hours: [],
                website: "",
                picture: "",
                user: user._id
            })

            bcrypt.hash("123456", 10, async (err, password) => {
                if(err) return;
                user.password = password
                console.log(user);
                user.save()
                profile.save()
            })
            
            
        }
    }

    if (!(await categoryModel.find({})).length) {
        await Promise.all(categories.map(async (category) => {
            delete category?._id
            category.parentCategory = null
            const newCategory = new categoryModel(category)
            console.log(newCategory);
            await newCategory.save()
        }))

    }
    if (!(await videoResolutionModel.find({})).length) {
        const resolutions = [
            {
                name: "SD (Standard Definition)",
                description: "Qualité vidéo de base pour les anciennes vidéos ou les vidéos avec une compression minimale.",
                size: "720x480",
            },
            {
                name: "HD (High Definition)",
                description: "Qualité vidéo supérieure, couramment utilisée pour les vidéos HD.",
                size: "1280x720",
            },
            {
                name: "Full HD (1080p)",
                description: "Qualité vidéo haute définition, adaptée aux écrans larges et aux moniteurs Full HD.",
                size: "1920x1080",
            },
            {
                name: "2K",
                description: "Qualité vidéo supérieure, légèrement supérieure à la Full HD.",
                size: "2048x1080",
            },
            // {
            //     name: "4K (Ultra High Definition)",
            //     description: "Qualité vidéo exceptionnelle, adaptée aux écrans 4K et aux téléviseurs UHD.",
            //     size: "3840x2160",
            // },
            // {
            //     name: "8K",
            //     description: "Qualité vidéo extrêmement élevée, principalement utilisée pour les productions professionnelles et les écrans 8K.",
            //     size: "7680x4320",
            // },
        ];
        await Promise.all(resolutions.map(async (resolution) => {
            const newResolution = new videoResolutionModel(resolution)
            console.log(newResolution);
            await newResolution.save()
        }))

    }
    if (!(await client_authorizedModel.find({})).length) {
        clients = [
            {
                name: "Ouitube",
                link: "https://ouitube.fr",
            },
            {
                name: "Ouitube",
                link: "https://www.ouitube.fr",
            },
            {
                name: "admin",
                link: "https://admin.ouitube.fr",
            },
        ]
        await Promise.all(clients.map(async (client) => { 
            const client_authorized = new client_authorizedModel(client)
            console.log({client_authorized});
            await client_authorized.save()
        }))

    }

    if (!(await productModel.find({})).length) {
        await Promise.all(products.map(async (product) => {
            delete product?._id

            

            
            product.stock = Math.floor(Math.random() * (1200 - 100 + 1)) + 100
            product.solde_price = ((Math.random() * (59.99 - 9.99 + 1)) + 9.99).toFixed(2)
            product.regular_price = ((Math.random() * (299.99 - 199.99 + 1)) + 199.99).toFixed(2)
            product.categories = []
            product.description = "Description du produit : " + product?.name
            product.more_description = product?.description
            product.imageUrls = product.imageUrls?.map((url) => {
                
                const newUrl = "/assets"+url.split("assets")[1]
                return "http://localhost:" + (process.env.PORT || 3000) + newUrl

            })

            product.status = false
            const newPoduct = new productModel(product)
            console.log(newPoduct);


            await newPoduct.save()
        }))
    }

    if (!(await pageModel.find({})).length) {
        await Promise.all(pages.map(async (name) => {
            let slug = slugify(name)

            index = 0
            words = ["shop", "jstore", "category", "mudey", "espero", "akpoli"]

            while (await pageModel.findOne({ slug }) && words[index]) {
                name += " " + words[index]
                slug = slugify(name)
                index++
            }
            const newPage = new pageModel({ name,slug })
            await newPage.save()
        }))
    }
    if (!(await fileModel.find({})).length) {
        await Promise.all(files.map(async (file) => {
            const newFile = new fileModel({ ...file })
            await newFile.save()
        }))
    }
    if (!(await contactModel.find({})).length) {
        await Promise.all(contacts.map(async (contact) => {
            const newContact = new contactModel({ ...contact })
            await newContact.save()
        }))
    }



}

module.exports = {
    loadData
}