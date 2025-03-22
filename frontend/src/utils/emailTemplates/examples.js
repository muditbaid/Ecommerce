// Example usage of email templates
import {
  generateVerificationEmail,
  generateVerificationEmailText,
  generatePasswordResetEmail,
  generatePasswordResetEmailText
} from './index';

/**
 * Example of generating verification emails
 * This would typically be called in your authentication service
 * after a user registers
 */
export const generateVerificationEmails = (userName, token) => {
  // Generate the full verification link using your frontend URL and token
  const verificationLink = `${process.env.REACT_APP_FRONTEND_URL}/verify/${token}`;

  // Generate both HTML and plain text versions
  const htmlEmail = generateVerificationEmail({
    name: userName,
    verificationLink
  });

  const textEmail = generateVerificationEmailText({
    name: userName,
    verificationLink
  });

  return {
    html: htmlEmail,
    text: textEmail
  };
};

/**
 * Example of generating password reset emails
 * This would typically be called in your authentication service
 * when a user requests a password reset
 */
export const generatePasswordResetEmails = (userName, token) => {
  // Generate the full reset link using your frontend URL and token
  const resetLink = `${process.env.REACT_APP_FRONTEND_URL}/reset-password/${token}`;

  // Generate both HTML and plain text versions
  const htmlEmail = generatePasswordResetEmail({
    name: userName,
    resetLink
  });

  const textEmail = generatePasswordResetEmailText({
    name: userName,
    resetLink
  });

  return {
    html: htmlEmail,
    text: textEmail
  };
};

// Example usage in your authentication service:
/*
import { generateVerificationEmails, generatePasswordResetEmails } from './emailTemplates/examples';

// When a user registers:
const { html, text } = generateVerificationEmails('John Doe', 'verification-token-123');
await sendEmail({
  to: userEmail,
  subject: 'Verify Your Email - Mishri Boutique',
  html,
  text
});

// When a user requests password reset:
const { html, text } = generatePasswordResetEmails('John Doe', 'reset-token-456');
await sendEmail({
  to: userEmail,
  subject: 'Reset Your Password - Mishri Boutique',
  html,
  text
});
*/ 