// Email template utilities for Mishri Boutique

/**
 * Generates the HTML template for email verification
 * @param {Object} params
 * @param {string} params.name - User's full name
 * @param {string} params.verificationLink - Email verification link
 * @returns {string} HTML email template
 */
export const generateVerificationEmail = ({ name, verificationLink }) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email - Mishri Boutique</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background-color: #6A1B9A;
      color: white;
      text-align: center;
      padding: 30px;
      border-radius: 8px 8px 0 0;
    }
    .content {
      background-color: #ffffff;
      padding: 30px;
      border: 1px solid #e0e0e0;
      border-radius: 0 0 8px 8px;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #6A1B9A;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      margin-top: 20px;
      color: #666;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to Mishri Boutique!</h1>
    </div>
    <div class="content">
      <h2>Hello ${name},</h2>
      <p>Thank you for creating an account with Mishri Boutique. We're excited to have you join our community of ethnic wear enthusiasts!</p>
      <p>To complete your registration and start exploring our exclusive collection, please verify your email address by clicking the button below:</p>
      <div style="text-align: center;">
        <a href="${verificationLink}" class="button">Verify Email Address</a>
      </div>
      <p>This verification link will expire in 24 hours. If you don't verify your email within this time, you'll need to request a new verification link.</p>
      <p>If you didn't create an account with Mishri Boutique, please ignore this email.</p>
      <p>If you're having trouble clicking the button, copy and paste this link into your browser:</p>
      <p style="word-break: break-all; font-size: 12px; color: #666;">
        ${verificationLink}
      </p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Mishri Boutique. All rights reserved.</p>
      <p>This is an automated email, please do not reply.</p>
    </div>
  </div>
</body>
</html>
`;

/**
 * Generates the HTML template for password reset
 * @param {Object} params
 * @param {string} params.name - User's full name
 * @param {string} params.resetLink - Password reset link
 * @returns {string} HTML email template
 */
export const generatePasswordResetEmail = ({ name, resetLink }) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password - Mishri Boutique</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background-color: #6A1B9A;
      color: white;
      text-align: center;
      padding: 30px;
      border-radius: 8px 8px 0 0;
    }
    .content {
      background-color: #ffffff;
      padding: 30px;
      border: 1px solid #e0e0e0;
      border-radius: 0 0 8px 8px;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #6A1B9A;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      margin-top: 20px;
      color: #666;
      font-size: 12px;
    }
    .security-notice {
      background-color: #f8f8f8;
      border-left: 4px solid #6A1B9A;
      padding: 15px;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Password Reset Request</h1>
    </div>
    <div class="content">
      <h2>Hello ${name},</h2>
      <p>We received a request to reset the password for your Mishri Boutique account. To proceed with the password reset, click the button below:</p>
      <div style="text-align: center;">
        <a href="${resetLink}" class="button">Reset Password</a>
      </div>
      <div class="security-notice">
        <strong>Security Notice:</strong>
        <p>This password reset link will expire in 1 hour for your security. If you don't use it within this time, you'll need to request a new one.</p>
        <p>If you didn't request a password reset, please ignore this email or contact our support team if you believe this is suspicious activity.</p>
      </div>
      <p>If you're having trouble clicking the button, copy and paste this link into your browser:</p>
      <p style="word-break: break-all; font-size: 12px; color: #666;">
        ${resetLink}
      </p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Mishri Boutique. All rights reserved.</p>
      <p>This is an automated email, please do not reply.</p>
    </div>
  </div>
</body>
</html>
`;

/**
 * Generates a plain text version of the verification email
 * For email clients that don't support HTML
 */
export const generateVerificationEmailText = ({ name, verificationLink }) => `
Hello ${name},

Thank you for creating an account with Mishri Boutique. We're excited to have you join our community of ethnic wear enthusiasts!

To complete your registration and start exploring our exclusive collection, please verify your email address by clicking the link below:

${verificationLink}

This verification link will expire in 24 hours. If you don't verify your email within this time, you'll need to request a new verification link.

If you didn't create an account with Mishri Boutique, please ignore this email.

Best regards,
Mishri Boutique Team

© ${new Date().getFullYear()} Mishri Boutique. All rights reserved.
This is an automated email, please do not reply.
`;

/**
 * Generates a plain text version of the password reset email
 * For email clients that don't support HTML
 */
export const generatePasswordResetEmailText = ({ name, resetLink }) => `
Hello ${name},

We received a request to reset the password for your Mishri Boutique account. To proceed with the password reset, please click the link below:

${resetLink}

SECURITY NOTICE:
This password reset link will expire in 1 hour for your security. If you don't use it within this time, you'll need to request a new one.

If you didn't request a password reset, please ignore this email or contact our support team if you believe this is suspicious activity.

Best regards,
Mishri Boutique Team

© ${new Date().getFullYear()} Mishri Boutique. All rights reserved.
This is an automated email, please do not reply.
`; 