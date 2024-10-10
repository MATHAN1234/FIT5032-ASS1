import express from 'express';
import { createTransport } from 'nodemailer';
import cors from 'cors';
import { json } from 'body-parser';

const app = express();
// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(json());

app.post('/send-email', async (req, res) => {
    const { email, subject, message, attachment } = req.body;

    const transporter = createTransport({
        service: 'gmail',
        auth: {
            user: 'your-email@gmail.com',
            pass: 'your-email-password', // Use environment variables for security
        },
    });

    const mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: subject,
        text: message,
        attachments: [
            {
                filename: attachment.name,
                content: attachment.content,
                encoding: 'base64',
            },
        ],
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send('Email sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Error sending email.');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
