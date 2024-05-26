import sgMail from "@sendgrid/mail";

export const sendEmail = async (emailAddress, message) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: emailAddress,
    from: process.env.SENDGRID_SENDER,
    subject: "Verification email",
    text: "Please follow the link below",
    html: `<a href=${message.link}>Verify Email</a>`,
  };
  await sgMail.send(msg);
};
