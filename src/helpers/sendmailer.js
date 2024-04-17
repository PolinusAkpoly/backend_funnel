"use strict";
const nodemailer = require("nodemailer");
const mime = require('mime');
const fs = require('fs');
const email_paramaterModel = require("../models/email_paramaterModel");
const metaModel = require("../models/metaModel");
const { templateModel } = require("./emailTemplate");

// async..await is not allowed in global scope, must use a wrapper
const getMetaData = (name, data) =>{
  const elt = data.filter((item)=> item.name === name)
  if(elt.length){
    return elt[0].value
  }
  return ""
}
module.exports = {
  sendNodeMail: async (user, template, clientData) => {
    try {
      // Generate test SMTP service account from ethereal.email
      // Only needed if you don't have a real mail account for testing
      const emailData = await email_paramaterModel.findOne({})
      const metaData = await metaModel.find({})
      
      // console.log({user, template, clientData});
  
      if (emailData) {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
          host: emailData.output_server,
          port: emailData.port_output_server,
          secure: false, // true for 465, false for other ports
          auth: {
            user: emailData.username, // generated ethereal user
            pass: emailData.password, // generated ethereal password
          },
          tls: {
            rejectUnauthorized: false,
          },
        });
  
        let info
        // send mail with defined transport object
        let htmlstream = template.content
        htmlstream = htmlstream.replace('{fullName}', user?.fullName)
        htmlstream = htmlstream.replace('{email}', user?.email)

        for (let index = 0; index < metaData.length; index++) {
          const meta = metaData[index];
          while (htmlstream.search('{'+meta.name+'}') !== -1) {
            htmlstream = htmlstream.replace('{'+meta.name+'}',meta.value)
          }
        }
  
        Object.keys(clientData).forEach(name => {
          const value = clientData[name];
          while (htmlstream.search('{'+name+'}') !== -1) {
            htmlstream = htmlstream.replace('{'+name+'}',value)
          }
        });
       
        let templateHTML = templateModel.replace('{message}', htmlstream)
        htmlstream = templateHTML.replace('{title}', getMetaData("site_name", metaData) +" - Message ")
  
        
        // console.log({htmlstream});

        if (template.fileUrls?.length) {
  
          let attachments = await Promise.all(template.fileUrls.map((website_file) => {
            const fileUrl = process.cwd()+ "/public/assets"+ website_file.fileUrl.split("/assets")[1]
            let extension = fileUrl.split('.').pop()
            let buff = fs.readFileSync(fileUrl)
            let base64data = buff.toString('base64');
            return {
              "ContentType": mime.getType(fileUrl),
              "filename": website_file.name+"."+extension,
              "content": base64data,
              encoding: 'base64',
          }
          }))
          
          info = await transporter.sendMail({
            from: emailData.username, // sender address
            to: user.email, // list of receivers
            subject: template.subject, // Subject line
            html: htmlstream, // html body
            attachments: attachments
          });
  
        } else {
          info = await transporter.sendMail({
            from: getMetaData("site_name", metaData)+" "+emailData.username, // sender address
            to: user.email, // list of receivers
            subject: template.subject, // Subject line
            html: htmlstream, // html body
          });
        }
        
       
        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  
        // Preview only available when sending through an Ethereal account
        // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  
      }
      
    } catch (error) {
      console.log(error.message);
    }

  }

}

