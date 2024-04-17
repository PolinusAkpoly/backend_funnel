const { sendNodeMail } = require("./sendmailer");
const templates = require("./templates/templates");


var self = module.exports = {
    esperosoftmailer: {
        post: (action = {}, options = {}) => {
            console.log("POST");
            console.log(action);
            console.log(options);
            return self.esperosoftmailer
        },
        request: (options) => {
            const messages = options["Messages"]

            messages.forEach(message => {
                const title = message["Variables"].title || 'Plateforme Mudey'
                const fullName = message["Variables"].fullName
                const subject = message["Subject"]
                let attachments = message["Attachments"] || false
                const messageHtml = message["Variables"].message
                const from = message["From"]["Name"] + " " + message["From"]["Email"]
                let htmlstream = templates.business
                htmlstream = htmlstream.replace('{{var:title:"Plateforme Mudey"}}', title)
                htmlstream = htmlstream.replace('{{var:fullName:""}}', fullName)
                htmlstream = htmlstream.replace('{{var:message:""}}', messageHtml)
                
                if(attachments){
                    attachments = attachments.map(a =>{
                        return   {
                            "ContentType": a["ContentType"],
                            "filename": a["Filename"],
                            "content": a["Base64Content"],
                            encoding: 'base64',
                        }
                    })
                }

                message["To"].forEach(item =>{
                    const to = item["Name"] + " " + item["Email"]
                    sendNodeMail(
                        from,
                        to,
                        title,
                        subject,
                        htmlstream,
                        attachments
                    )
                        .then(value => console.log(value))
                        .catch(err => console.log(err))
                });
                console.log("REQUEST");

                })
            return self.esperosoftmailer
        },
    }
}