/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 03/05/2023, 21:49:49
 */
const moment = require('moment')
const ContactModel = require('../models/contactModel.js');

/**
 * contactController.js
 *
 * @description :: Server-side logic for managing contacts.
 */
module.exports = {

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * contactController.getContacts()
     */
    getContactsByPage: async (req, res) => {
        try {
            let pageNumber = req.query?.pageNumber ? parseInt(req.query?.pageNumber) : 1
            let pageLimit = req.query?.pageLimit ? parseInt(req.query?.pageLimit) : 5

            let allCount = await ContactModel.find({}).count()

            if(pageNumber >  Math.ceil(allCount/pageLimit)){
                pageNumber = Math.ceil(allCount/pageLimit)
            }

            let contacts = await ContactModel.find({})
                // .populate("name")
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            contacts = contacts.map((item) => {
                item.created_formatted_with_time_since = moment(item?.created_at).fromNow()
                return item
            })

            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                allCount: allCount,
                resultCount: contacts.length,
                current: pageNumber,
                next: allCount > (pageNumber*pageLimit) ? pageNumber + 1 : null,
                previous: pageNumber - 1 > 0 ? pageNumber - 1 : null,
                results: contacts.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            })
            

    } catch(error) {

        console.log(error);

        return res.status(500).json({
            isSuccess: false,
            statusCode: 500,
            message: 'Error when getting contact.',
            error: error,
            request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
        });
    }
},
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * contactController.getContacts()
     */
    getContacts: async (req, res) => {
        try {
            const contacts = await ContactModel.find({})

            return res.json({
                isSuccess: true,
                statusCode: 200,
                resultCount: contacts.length,
                results: contacts,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

    } catch(error) {

        console.log(error);

        return res.status(500).json({
            isSuccess: false,
            statusCode: 500,
            message: 'Error when getting contact.',
            error: error,
            request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
        });
    }
},

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * contactController.showContactById()
     */
    searchContactByTag: async (req, res) => {
        try {

            let filter = {}
            const pageNumber = req.query?.pageNumber ? parseInt(req.query?.pageNumber) : 1
            const pageLimit = req.query?.pageLimit ? parseInt(req.query?.pageLimit) : 5

            const email = req.query?.email ? new RegExp(req.query.email, 'i') : null
            const subject = req.query?.subject ? new RegExp(req.query.subject, 'i') : null
            const name = req.query?.name ? new RegExp(req.query.name, 'i') : null
            const content = req.query?.content ? new RegExp(req.query.content, 'i') : null
            const description = req.query?.description ? new RegExp(req.query.content, 'i') : null
            const startDate = req.query?.startDate ? new Date(req.query?.startDate) : null
            const endDate = req.query?.endDate ? new Date(req.query?.endDate) : null

            if(email){
                filter.email = email
            }
            if(name){
                filter.name = name
            }
            if(subject){
                filter.subject = subject
            }
            if(content){
                filter.content = content
            }
            if(description){
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

            let allCount = await ContactModel.find(filter).count()
                // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
                // .sort('-created_at')
                // .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            let contacts = await ContactModel.find(filter)
                // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
                .sort('-created_at')
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            contacts = contacts.map((item) => {
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
                next: allCount > (pageNumber*pageLimit) ? pageNumber + 1 : null,
                previous: pageNumber - 1 > 0 ? pageNumber - 1 : null,
                results: contacts.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            isSuccess: false,
            statusCode: 500,
            message: 'Error when getting contact.',
            error: error,
            request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
        });

    }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * contactController.showContactById()
     */
    showContactById: async (req, res) => {
        try {
            const id = req.params.id;
            const contact = await ContactModel.findOne({ _id: id })

            if (!contact) {
                return res.status(404).json({
                    isSuccess: false,
                    statusCode: 404,
                    message: 'No such contact',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                result: contact,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            isSuccess: false,
            statusCode: 500,
            message: 'Error when getting contact.',
            error: error,
            request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
        });

    }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * contactController.createContact()
     */
    createContact: async (req, res) => {
    try {

        let {contact} = req.body

        if(!contact){
            return res.status(500).json({
                isSuccess: false,
                statusCode: 422,
                message: 'Missing params of contact.',
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }

        if(!Object.keys(contact).length){
            return res.status(500).json({
                isSuccess: false,
                statusCode: 422,
                message: 'Empty contact !',
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }

        contact = new ContactModel({ ...contact })

        contact.created_at = contact?.created_at ? contact.created_at : new Date()

        await contact.save()

        return res.status(201).json({
            isSuccess: true,
            statusCode: 201,
            message: "contact is saved !",
                contact,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when creating contact.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * contactController. updateContactById()
     */
    updateContactById: async (req, res) => {
    try {
        const id = req.params.id;
        let {contact} = req.body

        if(!contact){
            return res.status(500).json({
                isSuccess: false,
                statusCode: 422,
                message: 'Missing params of contact.',
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
        if(!Object.keys(contact).length){
            return res.status(422).json({
                isSuccess: false,
                statusCode: 422,
                message: 'Empty contact !',
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }

        contact.updated_at = contact?.updated_at ? contact.updated_at : new Date()

        delete contact?._id
        await ContactModel.updateOne({ _id: id }, { ...contact })

        return res.status(200).json({
            isSuccess: true,
            statusCode: 200,
            message: "contact is updated !",
                contact,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            isSuccess: false,
            statusCode: 500,
            message: 'Error when updating contact.',
            error: error,
            request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
        });
    }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * contactController.sortContactByPosition
     */
    sortContactByPosition: (req, res) => {
    try {

        const { datas } = req.body

        datas.forEach(async (elt) => {
            await ContactModel.updateOne({ _id: elt._id }, {
                $set: { position: elt.position }
            })
        });


        return res.status(200).json({
            statusCode: 200,
            isSuccess: true,
            message: "contact sorted !",
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
     * contactController.removeContactById()
     */
    removeContactById: async (req, res) => {
        try {
            var id = req.params.id;

            await ContactModel.deleteOne({ _id: id })


            return res.status(204).json({
                // 204 No Content
                // isSuccess: true,
                // statusCode: 204,
                // message: 'Data deleted ! .',
            });

        } catch (error) {
            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when deleting contact.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    }
};
