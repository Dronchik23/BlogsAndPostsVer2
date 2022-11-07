import nodemailer from 'nodemailer'

export const emailAdapter = {
    async sendEmail(email: string, subject: string, message: string) {
        let transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'bonjorim@gmail.com',
                pass: 'blhsntnuzncvxwyb',
            },
        });

        let info = await transport.sendMail({
            from: 'Drone <bonjorim@gmail.com>',
            to: email,
            subject: subject,
            html: message
        })
        return info
    }
}



