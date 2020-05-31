const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// const msg = {
//   to: 'marcel.anis.21@gmail',
//   from: 'marcel.anis.21@gmail.com',
//   subject: 'This is my first creation!',
//   text: 'I hope this one actually gets to you.'
// }

// sgMail.send(msg)
//   .then(res => console.log(res))
//   .catch(e => console.log(e));

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'marcel.anis.21@gmail.com',
    subject: 'Thanks for joining in!',
    text: `Welcome to the app, ${name}. Let me know how you get along with the app`
  })
    // .then(res => console.log(res))
    // .catch(e => console.log(e))
}

const sendCancelationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'marcel.anis.21@gmail.com',
    subject: 'Sorry to see you go!',
    text: `Goodbye, ${name}. I hope to see you back sometime soon`
  })
    // .then(res => console.log(res))
    // .catch(e => console.log(e))
}

module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail
}