const axios = require('axios');

const BREVO_URL = 'https://api.brevo.com/v3/smtp/email';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

function getSeverityColor(severity) {
  const map = { Critical: '#dc2626', High: '#ea580c', Moderate: '#d97706', Low: '#16a34a' };
  return map[severity] || '#6b7280';
}

async function sendEmail(to, toName, subject, htmlContent) {
  await axios.post(BREVO_URL, {
    sender: { email: process.env.BREVO_FROM_EMAIL, name: 'Afya Shield' },
    to: [{ email: to, name: toName }],
    subject,
    htmlContent
  }, {
    headers: {
      'api-key': process.env.BREVO_API_KEY,
      'Content-Type': 'application/json'
    }
  });
}

async function sendVerificationEmail(email, name, token) {
  const verifyUrl = `${FRONTEND_URL}/verify-email?token=${token}`;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f0fdf4;font-family:Inter,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:linear-gradient(135deg,#065f46,#047857);padding:40px 40px 32px;text-align:center;">
            <div style="width:64px;height:64px;background:rgba(255,255,255,0.15);border-radius:16px;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <h1 style="color:#ffffff;font-size:26px;font-weight:700;margin:0 0 8px;font-family:Arial,sans-serif;">Afya Shield</h1>
            <p style="color:#a7f3d0;font-size:14px;margin:0;">Protecting Lives Through Data</p>
          </td>
        </tr>
        <tr>
          <td style="padding:40px;">
            <h2 style="color:#065f46;font-size:20px;margin:0 0 12px;font-family:Arial,sans-serif;">Verify your email address</h2>
            <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 8px;">
              Hi <strong>${name}</strong>,
            </p>
            <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 28px;">
              Thank you for creating your Afya Shield account. Please verify your email address to activate your account and start using the cholera outbreak prediction system.
            </p>
            <div style="text-align:center;margin-bottom:28px;">
              <a href="${verifyUrl}" style="display:inline-block;background:linear-gradient(135deg,#059669,#047857);color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:14px 36px;border-radius:10px;font-family:Arial,sans-serif;">
                Verify Email Address
              </a>
            </div>
            <p style="color:#6b7280;font-size:13px;line-height:1.6;margin:0 0 8px;">
              If the button does not work, copy and paste this link into your browser:
            </p>
            <p style="color:#059669;font-size:12px;word-break:break-all;margin:0 0 24px;background:#f0fdf4;padding:10px 14px;border-radius:8px;border:1px solid #d1fae5;">
              ${verifyUrl}
            </p>
            <div style="background:#f9fafb;border-radius:8px;padding:14px 16px;border:1px solid #f3f4f6;">
              <p style="color:#9ca3af;font-size:12px;margin:0;line-height:1.5;">
                This link expires in 24 hours. If you did not create an account with Afya Shield, you can safely ignore this email.
              </p>
            </div>
          </td>
        </tr>
        <tr>
          <td style="background:#f9fafb;padding:20px 40px;text-align:center;border-top:1px solid #e5e7eb;">
            <p style="color:#9ca3af;font-size:12px;margin:0;">© 2026 Afya Shield · Protecting South Sudan from Cholera</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  await sendEmail(email, name, 'Verify your Afya Shield account', html);
}

async function sendWelcomeEmail(email, name) {
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f0fdf4;font-family:Inter,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:linear-gradient(135deg,#065f46,#047857);padding:40px 40px 32px;text-align:center;">
            <div style="width:64px;height:64px;background:rgba(255,255,255,0.15);border-radius:16px;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
            </div>
            <h1 style="color:#ffffff;font-size:26px;font-weight:700;margin:0 0 8px;font-family:Arial,sans-serif;">Account Verified</h1>
            <p style="color:#a7f3d0;font-size:14px;margin:0;">Afya Shield · Protecting Lives Through Data</p>
          </td>
        </tr>
        <tr>
          <td style="padding:40px;">
            <h2 style="color:#065f46;font-size:20px;margin:0 0 16px;font-family:Arial,sans-serif;">Welcome to Afya Shield, ${name}!</h2>
            <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 20px;">
              Your account is fully verified and active. You can now use Afya Shield to analyze cholera outbreak data and generate AI-powered action plans for your team.
            </p>
            <div style="background:#ecfdf5;border-left:4px solid #059669;border-radius:8px;padding:20px;margin:0 0 24px;">
              <p style="color:#065f46;font-size:14px;font-weight:600;margin:0 0 12px;">What you can do with Afya Shield:</p>
              <ul style="color:#374151;font-size:14px;line-height:1.8;margin:0;padding-left:20px;">
                <li>Input real-time cholera outbreak surveillance data</li>
                <li>Get AI-powered severity assessments (Low / Moderate / High / Critical)</li>
                <li>Receive specific NGO action plans aligned to WHO protocols</li>
                <li>Predict outbreak trends for 7, 14, and 30 days</li>
                <li>Generate resource requirement and budget reports</li>
              </ul>
            </div>
            <p style="color:#6b7280;font-size:13px;margin:0;text-align:center;">
              Questions? Contact us at ${process.env.BREVO_FROM_EMAIL}
            </p>
          </td>
        </tr>
        <tr>
          <td style="background:#f9fafb;padding:20px 40px;text-align:center;border-top:1px solid #e5e7eb;">
            <p style="color:#9ca3af;font-size:12px;margin:0;">© 2026 Afya Shield · Protecting South Sudan from Cholera</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  await sendEmail(email, name, 'Your Afya Shield account is verified', html);
}

async function sendPredictionReport(email, name, inputData, prediction) {
  const severityColor = getSeverityColor(prediction.severity);
  const actionsHtml = (arr) => arr.map(a => `<li style="color:#374151;font-size:14px;line-height:1.8;">${a}</li>`).join('');

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f0fdf4;font-family:Inter,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:linear-gradient(135deg,#065f46,#047857);padding:32px 40px;text-align:center;">
            <h1 style="color:#ffffff;font-size:22px;font-weight:700;margin:0 0 4px;font-family:Arial,sans-serif;">Afya Shield Prediction Report</h1>
            <p style="color:#a7f3d0;font-size:13px;margin:0;">${new Date().toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}</p>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 40px;">
            <p style="color:#374151;font-size:15px;margin:0 0 24px;">Hello <strong>${name}</strong>, here is your AI-generated outbreak analysis report.</p>

            <div style="background:#f9fafb;border-radius:12px;padding:20px;margin-bottom:24px;">
              <p style="color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 12px;">Input Data</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="color:#374151;font-size:14px;padding:4px 0;width:50%;">Active Cases: <strong>${inputData.cases}</strong></td>
                  <td style="color:#374151;font-size:14px;padding:4px 0;">Deaths: <strong>${inputData.deaths}</strong></td>
                </tr>
                <tr>
                  <td style="color:#374151;font-size:14px;padding:4px 0;">Region: <strong>${inputData.region}</strong></td>
                  <td style="color:#374151;font-size:14px;padding:4px 0;">CFR: <strong>${inputData.cfr}%</strong></td>
                </tr>
              </table>
            </div>

            <div style="text-align:center;margin-bottom:24px;">
              <span style="background:${severityColor};color:#fff;font-size:18px;font-weight:700;padding:10px 32px;border-radius:50px;display:inline-block;">
                ${prediction.severity} RISK — Score: ${prediction.severity_score}/100
              </span>
            </div>

            <p style="color:#374151;font-size:14px;line-height:1.7;background:#ecfdf5;border-radius:8px;padding:16px;margin:0 0 24px;">
              ${prediction.summary}
            </p>

            <h3 style="color:#065f46;font-size:16px;margin:0 0 12px;font-family:Arial,sans-serif;">Case Projections</h3>
            <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse:collapse;margin-bottom:24px;">
              <tr style="background:#065f46;color:#fff;">
                <th style="text-align:left;font-size:13px;padding:10px 16px;">Timeframe</th>
                <th style="text-align:center;font-size:13px;padding:10px 16px;">Min</th>
                <th style="text-align:center;font-size:13px;padding:10px 16px;">Likely</th>
                <th style="text-align:center;font-size:13px;padding:10px 16px;">Max</th>
              </tr>
              <tr style="background:#f9fafb;">
                <td style="font-size:14px;color:#374151;padding:10px 16px;">7 Days</td>
                <td style="font-size:14px;color:#374151;text-align:center;padding:10px 16px;">${prediction.predictions.day_7.min}</td>
                <td style="font-size:14px;color:#065f46;font-weight:700;text-align:center;padding:10px 16px;">${prediction.predictions.day_7.likely}</td>
                <td style="font-size:14px;color:#374151;text-align:center;padding:10px 16px;">${prediction.predictions.day_7.max}</td>
              </tr>
              <tr>
                <td style="font-size:14px;color:#374151;padding:10px 16px;">14 Days</td>
                <td style="font-size:14px;color:#374151;text-align:center;padding:10px 16px;">${prediction.predictions.day_14.min}</td>
                <td style="font-size:14px;color:#065f46;font-weight:700;text-align:center;padding:10px 16px;">${prediction.predictions.day_14.likely}</td>
                <td style="font-size:14px;color:#374151;text-align:center;padding:10px 16px;">${prediction.predictions.day_14.max}</td>
              </tr>
              <tr style="background:#f9fafb;">
                <td style="font-size:14px;color:#374151;padding:10px 16px;">30 Days</td>
                <td style="font-size:14px;color:#374151;text-align:center;padding:10px 16px;">${prediction.predictions.day_30.min}</td>
                <td style="font-size:14px;color:#065f46;font-weight:700;text-align:center;padding:10px 16px;">${prediction.predictions.day_30.likely}</td>
                <td style="font-size:14px;color:#374151;text-align:center;padding:10px 16px;">${prediction.predictions.day_30.max}</td>
              </tr>
            </table>

            <h3 style="color:#065f46;font-size:16px;margin:0 0 12px;font-family:Arial,sans-serif;">Immediate Actions (48h)</h3>
            <ul style="margin:0 0 20px;padding-left:20px;">${actionsHtml(prediction.ngo_actions.immediate_48h)}</ul>

            <h3 style="color:#065f46;font-size:16px;margin:0 0 12px;font-family:Arial,sans-serif;">WASH Interventions</h3>
            <ul style="margin:0 0 20px;padding-left:20px;">${actionsHtml(prediction.ngo_actions.wash_interventions)}</ul>

            <h3 style="color:#065f46;font-size:16px;margin:0 0 12px;font-family:Arial,sans-serif;">Community Engagement</h3>
            <ul style="margin:0 0 20px;padding-left:20px;">${actionsHtml(prediction.ngo_actions.community_engagement)}</ul>

            <div style="background:#fef3c7;border-left:4px solid #f59e0b;border-radius:8px;padding:16px;margin-bottom:8px;">
              <p style="color:#92400e;font-size:14px;font-weight:600;margin:0 0 4px;">Estimated Budget Required</p>
              <p style="color:#78350f;font-size:24px;font-weight:700;margin:0;">$${prediction.resources_needed.estimated_budget_usd.toLocaleString()} USD</p>
            </div>
          </td>
        </tr>
        <tr>
          <td style="background:#f9fafb;padding:20px 40px;text-align:center;border-top:1px solid #e5e7eb;">
            <p style="color:#9ca3af;font-size:12px;margin:0;">© 2026 Afya Shield · This report is AI-generated. Validate with field data before deployment.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  await sendEmail(email, name, `Afya Shield Report — ${prediction.severity} Risk Alert (${inputData.region})`, html);
}

module.exports = { sendVerificationEmail, sendWelcomeEmail, sendPredictionReport };
