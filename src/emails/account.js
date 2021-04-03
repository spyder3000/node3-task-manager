const sgMail = require('@sendgrid/mail')

// ch 131 
// const sendgridAPIKey = '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'; 
// sgMail.setApiKey(sendgridAPIKey); 

sgMail.setApiKey(process.env.SENDGRID_API_KEY)   // ch 133 - key found in .env file;  tells sendgrid which API key to use 

// ch 132 -- Welcome & Cancel Emails 
const sendWelcomeEmail = (email, name) => {
    // allows us to send an email;  object includes all relevant data for email
    sgMail.send({   // .send returns a Promise, so we can use async/await, but no need to wait for email to be sent
        to: email, 
        from: 'jvardy3000@gmail.com',   // will eventually want to get a custom domain email instead of this
        subject: 'Welcome to the App', 
        text: `Welcome to the app, ${name}.  Please let us know how you are enjoying the app.`
        //html: ''   // to include an image or more styling along with text;  
    })
}

const sendCancelEmail = (email, name) => {
    sgMail.send({   // .send returns a Promise, so we can use async/await
        to: email, 
        from: 'jvardy3000@gmail.com',   // will eventually want to get a custom domain email instead of this
        subject: 'Cancellation Request', 
        text: `${name}, we're sorry to see that you're leaving.  Please let us know why you are cancelling your subscription. `
        //html: ''   // to include an image or more styling;  
    })
}

// ch 131 -- SEndGrid 
/*sgMail.send({
    to: 'jvardy3000@gmail.com', 
    from: 'jvardy3000@gmail.com', 
    subject: 'Email Subject', 
    text: 'Text of email -- lorem ipsum and so on..'
}).then(() => {
    console.log('Message sent')
}).catch((error) => {
    console.log(error.response.body)
});*/

module.exports = {
    sendWelcomeEmail,    // e.g. sendWelcomeEmail: sendWelcomeEmail
    sendCancelEmail
}
