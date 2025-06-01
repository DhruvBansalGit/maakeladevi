import { NotificationData, EnquiryNote } from '@/types';
import { formatCurrency, formatDate } from '@/utils/helpers';
import nodemailer from 'nodemailer';
// Email service configuration
interface EmailConfig {
  service: string;
  apiKey: string;
  from: string;
  replyTo: string;
}

const emailConfig: EmailConfig = {
  service: process.env.EMAIL_SERVICE || 'sendgrid', // 'sendgrid', 'nodemailer', etc.
  apiKey: process.env.EMAIL_API_KEY || '',
  from: process.env.EMAIL_FROM || 'noreply@premiumstone.com',
  replyTo: process.env.EMAIL_REPLY_TO || 'sales@premiumstone.com'
};

export async function sendEnquiryEmail(data: NotificationData): Promise<void> {
  try {
    // Send confirmation email to customer
    await sendCustomerConfirmationEmail(data);
    
    // Send notification email to admin
    await sendAdminNotificationEmail(data);
    
    console.log('Enquiry emails sent successfully');
  } catch (error) {
    console.error('Error sending enquiry emails:', error);
    throw error;
  }
}

async function sendCustomerConfirmationEmail(data: NotificationData): Promise<void> {
  const { enquiry, customer, selectedGranites, totalValue } = data;

  const htmlContent = generateCustomerEmailHTML(enquiry.id, customer, selectedGranites, totalValue);
  const textContent = generateCustomerEmailText(enquiry.id, customer, selectedGranites, totalValue);

  const emailData = {
    to: customer.email,
    cc: customer.company ? [emailConfig.replyTo] : [],
    subject: `Enquiry Confirmation - ${enquiry.id} | PremiumStone`,
    html: htmlContent,
    text: textContent,
    replyTo: emailConfig.replyTo
  };

  await sendEmail(emailData);
}

async function sendAdminNotificationEmail(data: NotificationData): Promise<void> {
  const { enquiry, customer, selectedGranites, totalValue, adminEmail } = data;

  const htmlContent = generateAdminEmailHTML(enquiry, customer, selectedGranites, totalValue);
  const textContent = generateAdminEmailText(enquiry, customer, selectedGranites, totalValue);

  const emailData = {
    to: adminEmail,
    subject: `🔔 New Enquiry: ${enquiry.id} - ${customer.name} | PremiumStone`,
    html: htmlContent,
    text: textContent,
    replyTo: customer.email
  };

  await sendEmail(emailData);
}

async function sendEmail(emailData: any): Promise<void> {
  // This is a mock implementation. In a real application, you would integrate with
  // an email service like SendGrid, AWS SES, Nodemailer, etc.
  
  if (emailConfig.service === 'sendgrid') {
    // SendGrid implementation
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(emailConfig.apiKey);
    
    const msg = {
      to: emailData.to,
      from: emailConfig.from,
      subject: emailData.subject,
      text: emailData.text,
      html: emailData.html,
      replyTo: emailData.replyTo
    };
    
    await sgMail.send(msg);
  } else if (emailConfig.service === 'nodemailer') {
    // Nodemailer implementation (for SMTP)
    
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
    
    await transporter.sendMail({
      from: emailConfig.from,
      to: emailData.to,
      subject: emailData.subject,
      text: emailData.text,
      html: emailData.html,
      replyTo: emailData.replyTo
    });
  } else {
    // Mock/Development mode - just log the email
    console.log('📧 Email would be sent:', {
      to: emailData.to,
      subject: emailData.subject,
      preview: emailData.text.substring(0, 100) + '...'
    });
  }
}

function generateCustomerEmailHTML(enquiryId: string, customer: NotificationData['customer'], selectedGranites: NotificationData['selectedGranites'], totalValue: number): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Enquiry Confirmation - PremiumStone</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f59e0b, #ea580c); color: white; text-align: center; padding: 30px 20px; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; color: #6b7280; }
        .highlight { background: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0; }
        .granite-item { border: 1px solid #e5e7eb; border-radius: 6px; padding: 15px; margin: 10px 0; }
        .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
        .total { background: #f0fdf4; padding: 15px; border-radius: 6px; border-left: 4px solid #22c55e; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏆 PremiumStone</h1>
          <h2>Enquiry Confirmation</h2>
        </div>
        
        <div class="content">
          <p>Dear ${customer.name},</p>
          
          <p>Thank you for your enquiry! We have received your request for premium granite and our team is excited to help you bring your vision to life.</p>
          
          <div class="highlight">
            <strong>📋 Enquiry Details:</strong><br>
            <strong>Enquiry ID:</strong> ${enquiryId}<br>
            <strong>Date:</strong> ${formatDate(new Date(), 'long')}<br>
            <strong>Status:</strong> Under Review
          </div>
          
          <h3>📦 Selected Granites:</h3>
          ${selectedGranites.map(item => `
            <div class="granite-item">
              <strong>${item.granite.name}</strong><br>
              <small>Size: ${item.selectedSize.length} × ${item.selectedSize.width} × ${item.selectedThickness}mm</small><br>
              <small>Finish: ${item.selectedFinish}</small><br>
              <small>Quantity: ${item.quantity} slab(s)</small><br>
              <strong>Price: ${formatCurrency(item.selectedSize.price * item.quantity)}</strong>
            </div>
          `).join('')}
          
          <div class="total">
            <h3>💰 Estimated Total: ${formatCurrency(totalValue)}</h3>
            <small>*Final price may vary based on site measurements and installation requirements</small>
          </div>
          
          <h3>🚀 What's Next?</h3>
          <ol>
            <li><strong>Review (2-4 hours):</strong> Our team will review your requirements</li>
            <li><strong>Contact:</strong> We'll call you to discuss details and schedule a site visit</li>
            <li><strong>Quote:</strong> You'll receive a detailed quote within 24 hours</li>
            <li><strong>Installation:</strong> Professional installation by our certified team</li>
          </ol>
          
          <p style="text-align: center;">
            <a href="tel:+919876543210" class="button">📞 Call Us: +91 98765 43210</a>
          </p>
          
          <h3>📞 Contact Information:</h3>
          <ul>
            <li><strong>Phone:</strong> +91 98765 43210</li>
            <li><strong>WhatsApp:</strong> +91 98765 43210</li>
            <li><strong>Email:</strong> sales@premiumstone.com</li>
            <li><strong>Hours:</strong> Mon-Sat, 9 AM - 7 PM</li>
          </ul>
          
          <p>We appreciate your trust in PremiumStone and look forward to transforming your space with our premium granite!</p>
          
          <p>Best regards,<br>
          <strong>The PremiumStone Team</strong></p>
        </div>
        
        <div class="footer">
          <p>© 2025 PremiumStone. All rights reserved.</p>
          <p>123 Stone Avenue, Sector 14, Gurugram, Haryana 122001</p>
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateCustomerEmailText(enquiryId: string, customer: NotificationData['customer'], selectedGranites: NotificationData['selectedGranites'], totalValue: number): string {
  return `
Dear ${customer.name},

Thank you for your enquiry! We have received your request for premium granite.

ENQUIRY DETAILS:
- Enquiry ID: ${enquiryId}
- Date: ${formatDate(new Date(), 'long')}
- Status: Under Review

SELECTED GRANITES:
${selectedGranites.map(item => `
- ${item.granite.name}
  Size: ${item.selectedSize.length} × ${item.selectedSize.width} × ${item.selectedThickness}mm
  Finish: ${item.selectedFinish}
  Quantity: ${item.quantity} slab(s)
  Price: ${formatCurrency(item.selectedSize.price * item.quantity)}
`).join('')}

ESTIMATED TOTAL: ${formatCurrency(totalValue)}
*Final price may vary based on site measurements and installation requirements

WHAT'S NEXT?
1. Review (2-4 hours): Our team will review your requirements
2. Contact: We'll call you to discuss details and schedule a site visit
3. Quote: You'll receive a detailed quote within 24 hours
4. Installation: Professional installation by our certified team

CONTACT INFORMATION:
- Phone: +91 98765 43210
- WhatsApp: +91 98765 43210
- Email: sales@premiumstone.com
- Hours: Mon-Sat, 9 AM - 7 PM

We appreciate your trust in PremiumStone and look forward to transforming your space!

Best regards,
The PremiumStone Team

---
© 2025 PremiumStone. All rights reserved.
123 Stone Avenue, Sector 14, Gurugram, Haryana 122001
  `;
}

function generateAdminEmailHTML(enquiry: NotificationData['enquiry'], customer: NotificationData['customer'], selectedGranites: NotificationData['selectedGranites'], totalValue: number): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Enquiry - PremiumStone Admin</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 700px; margin: 0 auto; padding: 20px; }
        .header { background: #dc2626; color: white; text-align: center; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
        .footer { background: #f9fafb; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; color: #6b7280; }
        .urgent { background: #fef2f2; border: 1px solid #fca5a5; border-radius: 6px; padding: 15px; margin: 15px 0; }
        .customer-info { background: #f0f9ff; border-radius: 6px; padding: 20px; margin: 15px 0; }
        .granite-item { border: 1px solid #e5e7eb; border-radius: 6px; padding: 15px; margin: 10px 0; background: #fafafa; }
        .total { background: #f0fdf4; padding: 15px; border-radius: 6px; border-left: 4px solid #22c55e; font-size: 18px; }
        .action-buttons { text-align: center; margin: 20px 0; }
        .button { display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 5px; }
        .button-secondary { background: #6b7280; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚨 NEW ENQUIRY ALERT</h1>
          <h2>PremiumStone Admin Panel</h2>
        </div>
        
        <div class="content">
          <div class="urgent">
            <h3>⚡ Immediate Action Required</h3>
            <p><strong>New enquiry received!</strong> Customer expects contact within 2-4 hours.</p>
            <p><strong>Enquiry ID:</strong> ${enquiry.id}</p>
            <p><strong>Received:</strong> ${formatDate(new Date(), 'long')}</p>
            <p><strong>Estimated Value:</strong> ${formatCurrency(totalValue)}</p>
          </div>
          
          <div class="customer-info">
            <h3>👤 Customer Information:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td><strong>Name:</strong></td><td>${customer.name}</td></tr>
              <tr><td><strong>Email:</strong></td><td><a href="mailto:${customer.email}">${customer.email}</a></td></tr>
              <tr><td><strong>Phone:</strong></td><td><a href="tel:${customer.phone}">${customer.phone}</a></td></tr>
              ${customer.alternatePhone ? `<tr><td><strong>Alt Phone:</strong></td><td><a href="tel:${customer.alternatePhone}">${customer.alternatePhone}</a></td></tr>` : ''}
              ${customer.company ? `<tr><td><strong>Company:</strong></td><td>${customer.company}</td></tr>` : ''}
              <tr><td><strong>Address:</strong></td><td>${customer.address.street}, ${customer.address.city}, ${customer.address.state} ${customer.address.pincode}</td></tr>
            </table>
          </div>
          
          <h3>🏗️ Project Details:</h3>
          <ul>
            <li><strong>Type:</strong> ${enquiry.projectDetails.projectType}</li>
            <li><strong>Application:</strong> ${enquiry.projectDetails.application}</li>
            <li><strong>Timeline:</strong> ${enquiry.projectDetails.timeline}</li>
            <li><strong>Budget:</strong> ${formatCurrency(enquiry.projectDetails.budget.min)} - ${formatCurrency(enquiry.projectDetails.budget.max)}</li>
            <li><strong>Installation Required:</strong> ${enquiry.projectDetails.installationRequired ? '✅ Yes' : '❌ No'}</li>
            <li><strong>Design Consultation:</strong> ${enquiry.projectDetails.designConsultationRequired ? '✅ Yes' : '❌ No'}</li>
            <li><strong>Measurement Required:</strong> ${enquiry.projectDetails.measurementRequired ? '✅ Yes' : '❌ No'}</li>
          </ul>
          
          ${enquiry.projectDetails.description ? `
            <h4>📝 Project Description:</h4>
            <p style="background: #f9fafb; padding: 15px; border-radius: 6px; border-left: 3px solid #6b7280;">${enquiry.projectDetails.description}</p>
          ` : ''}
          
          <h3>📦 Selected Granites:</h3>
          ${selectedGranites.map(item => `
            <div class="granite-item">
              <h4>${item.granite.name}</h4>
              <p><strong>Origin:</strong> ${item.granite.origin} | <strong>Category:</strong> ${item.granite.category}</p>
              <p><strong>Size:</strong> ${item.selectedSize.length} × ${item.selectedSize.width} × ${item.selectedThickness}mm</p>
              <p><strong>Finish:</strong> ${item.selectedFinish} | <strong>Quantity:</strong> ${item.quantity} slab(s)</p>
              <p><strong>Unit Price:</strong> ${formatCurrency(item.selectedSize.price)} | <strong>Total:</strong> ${formatCurrency(item.selectedSize.price * item.quantity)}</p>
              <p><strong>Stock Available:</strong> ${item.selectedSize.stock} slabs</p>
            </div>
          `).join('')}
          
          <div class="total">
            <h3>💰 TOTAL ENQUIRY VALUE: ${formatCurrency(totalValue)}</h3>
          </div>
          
          ${enquiry.notes && enquiry.notes.length > 0 ? `
            <h3>📝 Additional Notes:</h3>
            ${enquiry.notes.map((note: EnquiryNote) => `
              <p style="background: #fffbeb; padding: 15px; border-radius: 6px; border-left: 3px solid #f59e0b;">${note.content}</p>
            `).join('')}
          ` : ''}
          
          <div class="action-buttons">
            <a href="tel:${customer.phone}" class="button">📞 Call Customer</a>
            <a href="mailto:${customer.email}" class="button button-secondary">📧 Send Email</a>
            <a href="https://wa.me/${customer.phone.replace(/\D/g, '')}" class="button button-secondary">💬 WhatsApp</a>
          </div>
          
          <p><strong>⏰ Next Steps:</strong></p>
          <ol>
            <li>Contact customer within 2-4 hours</li>
            <li>Schedule site visit for measurements</li>
            <li>Prepare detailed quote</li>
            <li>Follow up within 24 hours</li>
          </ol>
        </div>
        
        <div class="footer">
          <p>PremiumStone Admin Panel - Enquiry Management System</p>
          <p>Auto-generated on ${formatDate(new Date(), 'long')}</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateAdminEmailText(enquiry: NotificationData['enquiry'], customer: NotificationData['customer'], selectedGranites: NotificationData['selectedGranites'], totalValue: number): string {
  return `
🚨 NEW ENQUIRY ALERT - PremiumStone

URGENT: Customer expects contact within 2-4 hours!

ENQUIRY DETAILS:
- ID: ${enquiry.id}
- Received: ${formatDate(new Date(), 'long')}
- Estimated Value: ${formatCurrency(totalValue)}

CUSTOMER INFORMATION:
- Name: ${customer.name}
- Email: ${customer.email}
- Phone: ${customer.phone}
${customer.alternatePhone ? `- Alt Phone: ${customer.alternatePhone}` : ''}
${customer.company ? `- Company: ${customer.company}` : ''}
- Address: ${customer.address.street}, ${customer.address.city}, ${customer.address.state} ${customer.address.pincode}

PROJECT DETAILS:
- Type: ${enquiry.projectDetails.projectType}
- Application: ${enquiry.projectDetails.application}
- Timeline: ${enquiry.projectDetails.timeline}
- Budget: ${formatCurrency(enquiry.projectDetails.budget.min)} - ${formatCurrency(enquiry.projectDetails.budget.max)}
- Installation Required: ${enquiry.projectDetails.installationRequired ? 'Yes' : 'No'}
- Design Consultation: ${enquiry.projectDetails.designConsultationRequired ? 'Yes' : 'No'}
- Measurement Required: ${enquiry.projectDetails.measurementRequired ? 'Yes' : 'No'}

${enquiry.projectDetails.description ? `PROJECT DESCRIPTION:\n${enquiry.projectDetails.description}\n` : ''}

SELECTED GRANITES:
${selectedGranites.map(item => `
- ${item.granite.name} (${item.granite.origin})
  Size: ${item.selectedSize.length} × ${item.selectedSize.width} × ${item.selectedThickness}mm
  Finish: ${item.selectedFinish}
  Quantity: ${item.quantity} slab(s)
  Unit Price: ${formatCurrency(item.selectedSize.price)}
  Total: ${formatCurrency(item.selectedSize.price * item.quantity)}
  Stock: ${item.selectedSize.stock} slabs available
`).join('')}

TOTAL ENQUIRY VALUE: ${formatCurrency(totalValue)}

${enquiry.notes && enquiry.notes.length > 0 ? `ADDITIONAL NOTES:\n${enquiry.notes.map((note: EnquiryNote) => note.content).join('\n')}\n` : ''}

NEXT STEPS:
1. Contact customer within 2-4 hours
2. Schedule site visit for measurements  
3. Prepare detailed quote
4. Follow up within 24 hours

QUICK ACTIONS:
- Call: ${customer.phone}
- Email: ${customer.email}
- WhatsApp: https://wa.me/${customer.phone.replace(/\D/g, '')}

---
PremiumStone Admin Panel
Auto-generated on ${formatDate(new Date(), 'long')}
  `;
}