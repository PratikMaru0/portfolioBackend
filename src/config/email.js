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
    subject: "Password Reset - pratikmaru.com",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #ddd; padding: 24px; border-radius: 8px;">
        <h2>Password Reset Request</h2>
        <p>Hello,</p>
        <p>We received a request to reset your password for your account at <strong>pratikmaru.com</strong>.</p>
        <p>
          Click the button below to reset your password. This link will expire in 15 minutes for your security.
        </p>
        <p style="text-align: center;">
          <a href="${link}" style="background: #eee; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
        </p>
        <p>If you did not request a password reset, please ignore this email.</p>
        <hr style="margin: 24px 0;">
        <p style="font-size: 12px;">
          If the button above does not work, copy and paste this link into your browser:<br>
          <a href="${link}">${link}</a>
        </p>
        <p style="font-size: 12px;">Thank you,<br>The pratikmaru.com Team</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    throw new Error("Email sending failed!");
  }
}

export async function sendOTPEmail(emailId, otp) {
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
    subject: "Password Reset - pratikmaru.com",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 40px auto; border: 1px solid #222; padding: 32px 24px; border-radius: 8px; background: #fff;">
        <h2 style="margin-top: 0; margin-bottom: 16px; letter-spacing: 1px;">Password Reset Request</h2>
        <p style="margin-bottom: 16px;">Hello,</p>
        <p style="margin-bottom: 16px;">
          We received a request to reset your password for your account at <strong>pratikmaru.com</strong>.
        </p>
        <p style="margin-bottom: 24px;">
          Use the OTP below to reset your password. This code will expire in 15 minutes for your security.
        </p>
        <div style="text-align: center; margin: 32px 0;">
          <span style="display: inline-block; font-size: 2rem; letter-spacing: 8px; font-weight: bold; border: 1px dashed #222; border-radius: 6px; padding: 16px 32px;">
            ${otp}
          </span>
        </div>
        <p style="margin-bottom: 16px;">If you did not request a password reset, please ignore this email.</p>
        <hr style="margin: 32px 0; border: none; border-top: 1px solid #ddd;">
        <p style="font-size: 13px; color: #222; margin-bottom: 0;">
          Thank you,<br>
          The pratikmaru.com Team
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    throw new Error("Email sending failed!");
  }
}

export default sendEmail;
