const { EventEmitter } = require('events');
const { sendNodeMail } = require('../helpers/sendmailer');
const email_templateModel = require('../models/email_templateModel');
const requestIp = require('request-ip');
const moment = require('moment');
const emailEventModel = require('../models/emailEventModel');



const eventEmitter = new EventEmitter()

const getClientData = async (req) => {
    let headers = req.headers["user-agent"]
    start = headers.indexOf("(") + 1;
    end = headers.indexOf(")", start);
    system = headers.substr(start, end - start);
    headers = headers.split(" ")
    let navigator = headers[headers.length - 2] + " " + headers[headers.length - 1]
    const ip = requestIp.getClientIp(req)



    return {
        code: req?.code || "",
        link: req.headers.origin,
        signin: req.headers.origin + "/signin",
        signup: req.headers.origin + "/signup",
        forgot: req.headers.origin + "/forgot",
        navigator: navigator,
        system_exploitation: system,
        IP: ip,
        date: moment(new Date()).format("DD/MM/YYYY H:mm:ss")
    }
}

eventEmitter.on("authenticate", async (user, req) => {
    let emailEvent = await emailEventModel.findOne({
        name: { $regex: 'authenticate', $options: 'i' }
    })
    if(emailEvent){
        let template = await email_templateModel.findOne({ code: emailEvent.template })
            .populate("fileUrls")
        const clientData = await getClientData(req)
        sendNodeMail(user, template, clientData)
    }
})
eventEmitter.on("verifyEmail", async (user, req) => {
    let emailEvent = await emailEventModel.findOne({
        name: { $regex: 'verifyEmail', $options: 'i' }
    })
    if(emailEvent){
        let template = await email_templateModel.findOne({ code: emailEvent.template })
            .populate("fileUrls")
        const clientData = await getClientData(req)
        sendNodeMail(user, template, clientData)
    }
})

eventEmitter.on("signin", async (user, req) => {
    let emailEvent = await emailEventModel.findOne({
        name: { $regex: 'signin', $options: 'i' }
    })
    if(emailEvent){
        let template = await email_templateModel.findOne({ code: emailEvent.template })
            .populate("fileUrls")
        const clientData = await getClientData(req)
        sendNodeMail(user, template, clientData)
    }
})


eventEmitter.on("signup", async (user, req) => {
    let emailEvent = await emailEventModel.findOne({
        name: { $regex: 'signup', $options: 'i' }
    })
    if(emailEvent){
        let template = await email_templateModel.findOne({ code: emailEvent.template })
            .populate("fileUrls")
        const clientData = await getClientData(req)
        sendNodeMail(user, template, clientData)
    }
})
eventEmitter.on("ConfirmPassword", async (user, req) => {
    let emailEvent = await emailEventModel.findOne({
        name: { $regex: 'ConfirmPassword', $options: 'i' }
    })
    if(emailEvent){
        let template = await email_templateModel.findOne({ code: emailEvent.template })
            .populate("fileUrls")
        const clientData = await getClientData(req)
        sendNodeMail(user, template, clientData)
    }
})

module.exports = {
    eventEmitter
}