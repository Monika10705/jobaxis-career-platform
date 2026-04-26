const Mailjet = require("node-mailjet");

const mailjet = new Mailjet.Client({
  apiKey: process.env.MAILJET_API_KEY,
  apiSecret: process.env.MAILJET_SECRET_KEY,
  config: { version: "v3.1", output: "json" },
});

const FROM_EMAIL = process.env.MAILJET_FROM_EMAIL || "noreply@jobaxis.com";
const FROM_NAME = "JobAxis";

/**
 * Core send helper
 */
const sendEmail = async ({ toEmail, toName, subject, htmlContent, textContent }) => {
  try {
    const response = await mailjet.post("send").request({
      Messages: [
        {
          From: { Email: FROM_EMAIL, Name: FROM_NAME },
          To: [{ Email: toEmail, Name: toName || toEmail }],
          Subject: subject,
          TextPart: textContent || "",
          HTMLPart: htmlContent,
        },
      ],
    });
    console.log("Email sent successfully");
  } catch (err) {
    const detail = err?.response?.body || err?.response?.data || err.message;
    console.error("Mailjet error:", JSON.stringify(detail, null, 2));
    throw new Error("Failed to send email: " + JSON.stringify(detail));
  }
};

/**
 * Welcome email after registration
 */
const sendWelcomeEmail = (user) =>
  sendEmail({
    toEmail: user.email,
    toName: user.name,
    subject: "Welcome to JobAxis 🎉",
    htmlContent: `
      <div style="font-family:sans-serif;max-width:600px;margin:auto">
        <h2 style="color:#2563eb">Welcome to JobAxis, ${user.name}!</h2>
        <p>Your account has been created successfully as a <strong>${user.role === "employer" ? "Employer" : "Job Seeker"}</strong>.</p>
        ${
          user.role === "jobseeker"
            ? `<p>Start exploring thousands of job opportunities tailored for you.</p>`
            : `<p>Start posting jobs and finding the best talent for your company.</p>`
        }
        <a href="${process.env.CLIENT_URL || "http://localhost:5173"}" 
           style="display:inline-block;margin-top:16px;padding:12px 24px;background:#2563eb;color:#fff;border-radius:8px;text-decoration:none">
          Go to JobAxis
        </a>
        <p style="margin-top:32px;color:#6b7280;font-size:13px">— The JobAxis Team</p>
      </div>`,
  });

/**
 * Confirmation email to jobseeker when they apply
 */
const sendApplicationConfirmationEmail = (applicant, job) =>
  sendEmail({
    toEmail: applicant.email,
    toName: applicant.name,
    subject: `Application Submitted – ${job.title}`,
    htmlContent: `
      <div style="font-family:sans-serif;max-width:600px;margin:auto">
        <h2 style="color:#2563eb">Application Received!</h2>
        <p>Hi <strong>${applicant.name}</strong>,</p>
        <p>Your application for <strong>${job.title}</strong> at <strong>${job.companyName || "the company"}</strong> has been submitted successfully.</p>
        <p>We'll notify you when the employer reviews your application.</p>
        <a href="${process.env.CLIENT_URL || "http://localhost:5173"}/find-jobs"
           style="display:inline-block;margin-top:16px;padding:12px 24px;background:#2563eb;color:#fff;border-radius:8px;text-decoration:none">
          View My Applications
        </a>
        <p style="margin-top:32px;color:#6b7280;font-size:13px">— The JobAxis Team</p>
      </div>`,
  });

/**
 * Status update email to jobseeker when employer changes status
 */
const sendStatusUpdateEmail = (applicant, job, status) => {
  const statusConfig = {
    reviewed: { label: "Under Review", color: "#f59e0b" },
    shortlisted: { label: "Shortlisted 🎉", color: "#10b981" },
    rejected: { label: "Not Selected", color: "#ef4444" },
    hired: { label: "Hired 🎊", color: "#2563eb" },
  };

  const { label, color } = statusConfig[status] || { label: status, color: "#6b7280" };

  return sendEmail({
    toEmail: applicant.email,
    toName: applicant.name,
    subject: `Application Update – ${job.title}`,
    htmlContent: `
      <div style="font-family:sans-serif;max-width:600px;margin:auto">
        <h2 style="color:#2563eb">Application Status Update</h2>
        <p>Hi <strong>${applicant.name}</strong>,</p>
        <p>Your application for <strong>${job.title}</strong> has been updated:</p>
        <p style="display:inline-block;padding:8px 20px;background:${color};color:#fff;border-radius:6px;font-weight:600">
          ${label}
        </p>
        ${
          status === "hired"
            ? `<p>Congratulations! The employer will be in touch with you shortly.</p>`
            : status === "rejected"
            ? `<p>Don't be discouraged — keep applying and the right opportunity will come.</p>`
            : `<p>Keep an eye on your email for further updates.</p>`
        }
        <a href="${process.env.CLIENT_URL || "http://localhost:5173"}/find-jobs"
           style="display:inline-block;margin-top:16px;padding:12px 24px;background:#2563eb;color:#fff;border-radius:8px;text-decoration:none">
          View Applications
        </a>
        <p style="margin-top:32px;color:#6b7280;font-size:13px">— The JobAxis Team</p>
      </div>`,
  });
};

/**
 * OTP email — used for forgot password, change email, verify email
 */
const sendOtpEmail = (user, otp, purpose) => {
  const purposeConfig = {
    "reset-password": { subject: "Reset Your Password – JobAxis", action: "reset your password" },
    "change-email":   { subject: "Confirm Your New Email – JobAxis", action: "confirm your new email address" },
    "verify-email":   { subject: "Verify Your Email – JobAxis", action: "verify your email address" },
  };

  const { subject, action } = purposeConfig[purpose] || { subject: "Your OTP – JobAxis", action: "complete your request" };

  return sendEmail({
    toEmail: user.email,
    toName: user.name,
    subject,
    htmlContent: `
      <div style="font-family:sans-serif;max-width:600px;margin:auto">
        <h2 style="color:#2563eb">JobAxis – One-Time Password</h2>
        <p>Hi <strong>${user.name}</strong>,</p>
        <p>Use the OTP below to ${action}. It expires in <strong>10 minutes</strong>.</p>
        <div style="margin:24px 0;text-align:center">
          <span style="display:inline-block;padding:16px 40px;background:#f1f5f9;border-radius:12px;font-size:32px;font-weight:700;letter-spacing:8px;color:#1e293b">
            ${otp}
          </span>
        </div>
        <p style="color:#ef4444;font-size:13px">If you didn't request this, please ignore this email.</p>
        <p style="margin-top:32px;color:#6b7280;font-size:13px">— The JobAxis Team</p>
      </div>`,
  });
};

module.exports = {
  sendWelcomeEmail,
  sendApplicationConfirmationEmail,
  sendStatusUpdateEmail,
  sendOtpEmail,
};
