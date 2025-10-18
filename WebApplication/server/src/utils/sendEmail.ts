import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email: string, token: string) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const verifyUrl = `http://localhost:5000/api/auth/verify?token=${token}`;

  await transporter.sendMail({
    from: '"MyApp" <no-reply@myapp.com>',
    to: email,
    subject: "Verify your email",
    html: `
      <h3>Welcome!</h3>
      <p>Click below to verify your account:</p>
      <a href="${verifyUrl}" target="_blank">Verify my account</a>
      <p>This link will expire in 1 hour.</p>
    `,
  });
};
