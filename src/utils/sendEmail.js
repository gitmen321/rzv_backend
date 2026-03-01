const nodemailer = require('nodemailer');
const structuredLogger = require('../utils/structured-logger');

const sendEmail = async ({ to, subject, html }) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }

        });

        await transporter.sendMail({
            from: `"RZV Support" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html
        });
    } catch (err) {
        structuredLogger.error("error:", err);
        throw err;
    }
};

module.exports = sendEmail;