import renderMjml from '../utils/renderMjml';
import mailLayout from './mailLayout';

export const renderResetPassword = (data) => {
  const subject = 'p5.js Web Editor Password Reset';
  const templateOptions = {
    domain: data.body.domain,
    headingText: 'Reset your password',
    greetingText: 'Hello,',
    messageText: 'We received a request to reset the password for your account. To reset your password, click on the button below:', // eslint-disable-line max-len
    link: data.body.link,
    buttonText: 'Reset password',
    directLinkText: 'Or copy and paste the URL into your browser:',
    noteText: 'If you did not request this, please ignore this email and your password will remain unchanged. Thanks for using the p5.js Web Editor!', // eslint-disable-line max-len
    meta: {
      keywords: 'p5.js, p5.js web editor, web editor, processing, code editor',
      description: 'O editor de códigos da InventorBox!'
    }
  };

  // Return MJML string
  const template = mailLayout(templateOptions);

  // Render MJML to HTML string
  const html = renderMjml(template);

  // Return options to send mail
  return Object.assign(
    {},
    data,
    { html, subject },
  );
};

export const renderEmailConfirmation = (data) => {
  const subject = 'p5.js Email Verification';
  const templateOptions = {
    domain: data.body.domain,
    headingText: 'Email Verification',
    greetingText: 'Hello,',
    messageText: 'To verify your email, click on the button below:',
    link: data.body.link,
    buttonText: 'Verify Email',
    directLinkText: 'Or copy and paste the URL into your browser:',
    noteText: 'This link is only valid for the next 24 hours. Thanks for using the p5.js Web Editor!',
    meta: {
      keywords: 'p5.js, p5.js web editor, web editor, processing, code editor',
      description: 'O editor de códigos da InventorBox!'
    }
  };

  // Return MJML string
  const template = mailLayout(templateOptions);

  // Render MJML to HTML string
  const html = renderMjml(template);

  // Return options to send mail
  return Object.assign(
    {},
    data,
    { html, subject },
  );
};
