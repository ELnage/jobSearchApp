import nodemailer from "nodemailer";

export const sendEmailService = async (
{  to ,
  subject = "jop search app",
  textMessage = "",
  htmlMessage = "",
  attachments = []} = {}
) => {
  // configuration Email
  const transporter = nodemailer.createTransport({
    host: process.env.EMAILHOST, 
    port: process.env.EMAILPORT,
    secure: true,
    auth: {
      user: process.env.SENDEMAIL,
      pass: process.env.PASSEMAIL,
    },
  });
  // message information to send 
  const info = await transporter.sendMail({
    from: `jop search app <${process.env.SENDEMAIL}>`,
    to,
    subject,
    text: textMessage,
    html: htmlMessage,
    attachments,
  });
  return info
};