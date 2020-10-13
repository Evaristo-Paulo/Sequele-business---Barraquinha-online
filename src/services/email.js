const sgMail = require('@sendgrid/mail');

sgMail.setApiKey('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');

const msg = {
    to: 'ivarilson-k@hotmail.com',
    from: 'ivarilson909@gmail.com', // Use the email address or domain you verified above
    subject: 'Bem-vindo',
    text: 'Seja bem-vindo',
    html: 'Olá, <strong>usuário teste</strong>, seja bem-vindo ao KicobelasApp',
};
//ES6
sgMail.send(msg).then(() => {}, error => {
        console.error(error);

        if (error.response) {
            console.error(error.response.body)
        }
    });
//ES8
(async () => {
    try {
        await sgMail.send(msg);
    } catch (error) {
        console.error(error);

        if (error.response) {
            console.error(error.response.body)
        }
    }
})();