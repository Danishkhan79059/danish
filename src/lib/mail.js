import nodemailer from "nodemailer";

const emailUser = process.env.EMAIL;
const emailPass = process.env.EMAIL_PASS;

let transporter = null;

if (emailUser && emailPass) {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });
}

/**
 * Send an email notification to the site owner when someone contacts through the form
 */
export async function sendContactNotification({ name, email, phone, company, subject, message }) {
  if (!transporter || !emailUser) {
    console.warn("Mail transporter not configured: EMAIL or EMAIL_PASS missing");
    return { success: false, reason: "Transporter not configured" };
  }

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px; background-color: #ffffff;">
      <div style="background: linear-gradient(135deg, #7928CA, #0070F3); padding: 16px; border-radius: 8px; text-align: center; color: white;">
        <h2 style="margin: 0; font-size: 20px;">New Portfolio Inquiry Received</h2>
      </div>

      <div style="padding: 20px 0;">
        <p style="font-size: 15px; color: #334155; margin-bottom: 16px;">
          You have received a new contact inquiry from your portfolio website:
        </p>

        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; font-weight: bold; color: #64748b; width: 120px;">Name:</td>
            <td style="padding: 10px 0; color: #0f172a; font-weight: 600;">${name}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; font-weight: bold; color: #64748b;">Email:</td>
            <td style="padding: 10px 0; color: #0070F3;"><a href="mailto:${email}" style="color: #0070F3; text-decoration: none;">${email}</a></td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; font-weight: bold; color: #64748b;">Phone:</td>
            <td style="padding: 10px 0; color: #0f172a;">${phone || "Not provided"}</td>
          </tr>
          ${company ? `
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; font-weight: bold; color: #64748b;">Company:</td>
            <td style="padding: 10px 0; color: #0f172a;">${company}</td>
          </tr>
          ` : ""}
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; font-weight: bold; color: #64748b;">Subject:</td>
            <td style="padding: 10px 0; color: #0f172a; font-weight: 600;">${subject}</td>
          </tr>
        </table>

        <div style="margin-top: 20px; padding: 16px; background-color: #f8fafc; border-left: 4px solid #7928CA; border-radius: 6px;">
          <h4 style="margin: 0 0 8px 0; color: #475569; font-size: 13px; text-transform: uppercase;">Message:</h4>
          <p style="margin: 0; color: #1e293b; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
        </div>
      </div>

      <div style="border-top: 1px solid #e2e8f0; padding-top: 14px; text-align: center; font-size: 12px; color: #94a3b8;">
        Submitted via Danish Khan Portfolio Contact Form • Saved in PostgreSQL Database
      </div>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"Portfolio Contact Form" <${emailUser}>`,
      to: emailUser,
      replyTo: email,
      subject: `New Portfolio Message: ${subject} from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || "N/A"}\nCompany: ${company || "N/A"}\nSubject: ${subject}\n\nMessage:\n${message}`,
      html: htmlContent,
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending notification email:", error);
    return { success: false, error: error.message };
  }
}
