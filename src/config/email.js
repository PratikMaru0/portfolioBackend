import nodemailer from "nodemailer";

async function sendEmail(emailId, link) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    port: 465,
    auth: {
      user: process.env.FORGOT_EMAIL_SENDER,
      pass: process.env.FORGOT_EMAIL_SECRET,
    },
  });

  const mailOptions = {
    from: process.env.FORGOT_EMAIL_SENDER,
    to: emailId,
    subject: "Password reset - pratikmaru.com",
    text: `Password reset link :- ${link}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    throw new Error("Email sending failed!");
  }
}

export default sendEmail;
