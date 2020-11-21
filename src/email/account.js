const sgMail = require('@sendgrid/mail') 

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail =(email,name)=>{
    console.log(email,name)
sgMail.send({
    to:email,
    from:'bhawnainaniya05@mailinator.com',
    subject:'test purpuse',
    text:`hello,${name} how are you doing`
})
}

module.exports= {
    sendWelcomeEmail
}