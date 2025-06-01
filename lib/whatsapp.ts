import { NotificationData } from '@/types';
import { formatCurrency, formatDate } from '@/utils/helpers';
import twilio from 'twilio';


interface WebhookData {
  MessageSid: string;
  MessageStatus: string;
  To: string;
  From: string;
  Body?: string;
  ErrorMessage?: string;
}

// WhatsApp service configuration
interface WhatsAppConfig {
  provider: string;
  accountSid: string;
  authToken: string;
  fromNumber: string;
  apiUrl: string;
}

const whatsappConfig: WhatsAppConfig = {
  provider: process.env.WHATSAPP_PROVIDER || 'twilio', // 'twilio', 'whatsapp-business-api', etc.
  accountSid: process.env.TWILIO_ACCOUNT_SID || '',
  authToken: process.env.TWILIO_AUTH_TOKEN || '',
  fromNumber: process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886',
  apiUrl: 'https://api.twilio.com/2010-04-01/Accounts'
};

export async function sendWhatsAppNotification(data: NotificationData): Promise<void> {
  try {
    // Send confirmation message to customer
    await sendCustomerWhatsAppMessage(data);
    
    // Send notification to admin
    await sendAdminWhatsAppNotification(data);
    
    console.log('WhatsApp notifications sent successfully');
  } catch (error) {
    console.error('Error sending WhatsApp notifications:', error);
    throw error;
  }
}

async function sendCustomerWhatsAppMessage(data: NotificationData): Promise<void> {
  const { enquiry, customer, selectedGranites, totalValue } = data;
  
  // Format customer phone number for WhatsApp
  const customerWhatsApp = formatPhoneForWhatsApp(customer.phone);
  
  const message = generateCustomerWhatsAppMessage(enquiry.id, customer, selectedGranites, totalValue);
  
  await sendWhatsAppMessage(customerWhatsApp, message);
}

async function sendAdminWhatsAppNotification(data: NotificationData): Promise<void> {
  const { enquiry, customer, selectedGranites, totalValue, adminPhone } = data;
  
  // Format admin phone number for WhatsApp
  const adminWhatsApp = formatPhoneForWhatsApp(adminPhone);
  
  const message = generateAdminWhatsAppMessage(enquiry, customer, selectedGranites, totalValue);
  
  await sendWhatsAppMessage(adminWhatsApp, message);
}

async function sendWhatsAppMessage(to: string, message: string): Promise<void> {
  if (whatsappConfig.provider === 'twilio') {
    await sendTwilioWhatsAppMessage(to, message);
  } else {
    // Mock/Development mode - just log the message
    console.log('📱 WhatsApp message would be sent:', {
      to,
      preview: message.substring(0, 100) + '...'
    });
  }
}

async function sendTwilioWhatsAppMessage(to: string, message: string): Promise<void> {
  try {
    const accountSid = whatsappConfig.accountSid;
    const authToken = whatsappConfig.authToken;
    
    if (!accountSid || !authToken) {
      console.log('📱 Twilio credentials not configured, skipping WhatsApp message');
      return;
    }
    const client = twilio(accountSid, authToken);
    
    await client.messages.create({
      body: message,
      from: whatsappConfig.fromNumber,
      to: `whatsapp:${to}`
    });
    
    console.log(`WhatsApp message sent to ${to}`);
  } catch (error) {
    console.error('Error sending Twilio WhatsApp message:', error);
    throw error;
  }
}

function formatPhoneForWhatsApp(phone: string): string {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Add country code if not present
  if (cleaned.length === 10) {
    return '+91' + cleaned;
  } else if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return '+' + cleaned;
  } else if (cleaned.startsWith('+')) {
    return cleaned;
  }
  
  return '+91' + cleaned;
}

function generateCustomerWhatsAppMessage(enquiryId: string, customer: NotificationData['customer'], selectedGranites: NotificationData['selectedGranites'], totalValue: number): string {
  const selectedItems = selectedGranites.map(item => 
    `• ${item.granite.name} - ${item.quantity} slab(s) - ${formatCurrency(item.selectedSize.price * item.quantity)}`
  ).join('\n');

  return `
🏆 *PremiumStone - Enquiry Confirmation*

Hello ${customer.name}! 👋

Thank you for your enquiry! We're excited to help transform your space with premium granite.

📋 *Enquiry Details:*
• ID: ${enquiryId}
• Date: ${formatDate(new Date(), 'short')}
• Status: Under Review ⏳

📦 *Selected Granites:*
${selectedItems}

💰 *Estimated Total: ${formatCurrency(totalValue)}*
_*Final price may vary based on measurements_

🚀 *What's Next?*
1. ⏰ Our team will call you within 2-4 hours
2. 📏 We'll schedule a site visit for measurements
3. 💼 You'll receive a detailed quote within 24 hours
4. 🔧 Professional installation by certified experts

📞 *Need immediate assistance?*
Call us: +91 98765 43210
Email: sales@premiumstone.com

We appreciate your trust in PremiumStone! 🙏

_This is an automated message from PremiumStone_
`.trim();
}

function generateAdminWhatsAppMessage(enquiry: NotificationData['enquiry'], customer: NotificationData['customer'], selectedGranites: NotificationData['selectedGranites'], totalValue: number): string {
  const selectedItems = selectedGranites.map(item => 
    `• ${item.granite.name} (${item.quantity}x) - ${formatCurrency(item.selectedSize.price * item.quantity)}`
  ).join('\n');

  return `
🚨 *NEW ENQUIRY ALERT* 🚨

📋 *Enquiry ID:* ${enquiry.id}
💰 *Value:* ${formatCurrency(totalValue)}
⏰ *Received:* ${formatDate(new Date(), 'short')}

👤 *Customer:*
• Name: ${customer.name}
• Phone: ${customer.phone}
• Email: ${customer.email}
${customer.company ? `• Company: ${customer.company}` : ''}
• Location: ${customer.address.city}, ${customer.address.state}

🏗️ *Project:*
• Type: ${enquiry.projectDetails.projectType}
• Application: ${enquiry.projectDetails.application}
• Timeline: ${enquiry.projectDetails.timeline}
• Budget: ${formatCurrency(enquiry.projectDetails.budget.min)}-${formatCurrency(enquiry.projectDetails.budget.max)}

📦 *Selected Granites:*
${selectedItems}

⚡ *URGENT: Customer expects contact within 2-4 hours!*

🎯 *Quick Actions:*
📞 Call: ${customer.phone}
📧 Email: ${customer.email}
💬 WhatsApp: https://wa.me/${customer.phone.replace(/\D/g, '')}

_PremiumStone Admin Alert System_
`.trim();
}

// Template-based WhatsApp messages for different scenarios
export const whatsappTemplates = {
  enquiryConfirmation: (data: { name: string; enquiryId: string; totalValue: number }) => `
🏆 *PremiumStone*

Hi ${data.name}! Your enquiry ${data.enquiryId} (₹${data.totalValue.toLocaleString()}) has been received. 

Our team will contact you within 2-4 hours! 

📞 Need help? Call +91 98765 43210
  `.trim(),

  adminAlert: (data: { enquiryId: string; customerName: string; phone: string; totalValue: number }) => `
🚨 *NEW ENQUIRY*

ID: ${data.enquiryId}
Customer: ${data.customerName}
Phone: ${data.phone}
Value: ₹${data.totalValue.toLocaleString()}

⚡ Contact within 2-4 hours!
  `.trim(),

  followUp: (data: { name: string; enquiryId: string }) => `
👋 Hi ${data.name}!

Following up on your granite enquiry ${data.enquiryId}. 

Have you had a chance to review our quote? We're here to help with any questions!

📞 +91 98765 43210
  `.trim(),

  quoteReady: (data: { name: string; enquiryId: string; quoteUrl: string }) => `
🎉 Great news ${data.name}!

Your detailed quote for enquiry ${data.enquiryId} is ready!

📄 View quote: ${data.quoteUrl}

Questions? Call us at +91 98765 43210
  `.trim(),

  installationScheduled: (data: { name: string; date: string; time: string }) => `
✅ Installation Scheduled!

Hi ${data.name}, your granite installation is confirmed for:

📅 Date: ${data.date}
⏰ Time: ${data.time}

Our team will contact you 1 day before. 

📞 Questions? +91 98765 43210
  `.trim()
};

// Bulk WhatsApp messaging for promotional campaigns
export async function sendBulkWhatsAppMessage(
  phoneNumbers: string[], 
  template: string, 
  variables: Array<Record<string, string | number | boolean>>
): Promise<void> {
  try {
    const messages = phoneNumbers.map((phone, index) => {
      const vars = variables[index] || {};
      let message = template;
      
      // Replace variables in template
      Object.keys(vars).forEach(key => {
        message = message.replace(new RegExp(`{{${key}}}`, 'g'), String(vars[key]));
      });
      
      return {
        to: formatPhoneForWhatsApp(phone),
        message
      };
    });

    // Send messages with delay to avoid rate limiting
    for (const msg of messages) {
      await sendWhatsAppMessage(msg.to, msg.message);
      // Add delay between messages to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log(`Bulk WhatsApp messages sent to ${phoneNumbers.length} recipients`);
  } catch (error) {
    console.error('Error sending bulk WhatsApp messages:', error);
    throw error;
  }
}

// WhatsApp message status tracking
export interface WhatsAppMessageStatus {
  messageId: string;
  to: string;
  status: 'queued' | 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: Date;
  errorMessage?: string;
}

export async function getWhatsAppMessageStatus(messageId: string): Promise<WhatsAppMessageStatus | null> {
  try {
    if (whatsappConfig.provider === 'twilio') {
      const client = require('twilio')(whatsappConfig.accountSid, whatsappConfig.authToken);
      const message = await client.messages(messageId).fetch();
      
      return {
        messageId: message.sid,
        to: message.to,
        status: message.status,
        timestamp: new Date(message.dateCreated),
        errorMessage: message.errorMessage
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching WhatsApp message status:', error);
    return null;
  }
}

// WhatsApp webhook handler for delivery status updates
export async function handleWhatsAppWebhook(webhookData: WebhookData): Promise<void> {
  try {
    const { MessageSid, MessageStatus, To, From, ErrorMessage } = webhookData;
    
    console.log('WhatsApp webhook received:', {
      messageId: MessageSid,
      status: MessageStatus,
      to: To,
      from: From,
      error: ErrorMessage
    });
    
    // In a real application, you would update the message status in your database
    // and possibly trigger other actions based on the status
    
    if (MessageStatus === 'failed') {
      console.error('WhatsApp message failed:', ErrorMessage);
      // Handle failed message - maybe retry or alert admin
    } else if (MessageStatus === 'delivered') {
      console.log('WhatsApp message delivered successfully');
      // Update delivery status in database
    }
    
  } catch (error) {
    console.error('Error handling WhatsApp webhook:', error);
  }
}

// Utility function to validate phone numbers for WhatsApp
export function isValidWhatsAppNumber(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  
  // Check if it's a valid Indian mobile number (10 digits) or international format
  return (
    (cleaned.length === 10 && /^[6-9]/.test(cleaned)) || // Indian mobile
    (cleaned.length === 12 && cleaned.startsWith('91') && /^91[6-9]/.test(cleaned)) || // +91 format
    (cleaned.length >= 10 && cleaned.length <= 15) // International format
  );
}

// WhatsApp opt-in/opt-out management
export async function handleWhatsAppOptIn(phone: string): Promise<void> {
  const formattedPhone = formatPhoneForWhatsApp(phone);
  
  const welcomeMessage = `
🎉 Welcome to PremiumStone WhatsApp updates!

You'll now receive:
• Order updates
• Exclusive offers
• Installation reminders
• Product notifications

Reply STOP anytime to unsubscribe.

Visit us: premiumstone.com
📞 +91 98765 43210
  `.trim();
  
  await sendWhatsAppMessage(formattedPhone, welcomeMessage);
  
  // In a real application, you would store the opt-in status in your database
  console.log(`WhatsApp opt-in recorded for ${formattedPhone}`);
}

export async function handleWhatsAppOptOut(phone: string): Promise<void> {
  const formattedPhone = formatPhoneForWhatsApp(phone);
  
  const goodbyeMessage = `
👋 You've been unsubscribed from PremiumStone WhatsApp updates.

You can still:
📞 Call us: +91 98765 43210
📧 Email: sales@premiumstone.com
🌐 Visit: premiumstone.com

Thank you for choosing PremiumStone!
  `.trim();
  
  await sendWhatsAppMessage(formattedPhone, goodbyeMessage);
  
  // In a real application, you would update the opt-out status in your database
  console.log(`WhatsApp opt-out recorded for ${formattedPhone}`);
}

// Automated WhatsApp campaigns
export async function sendPromotionalCampaign(
  targetAudience: 'all' | 'recent-customers' | 'high-value' | 'inactive',
  campaignData: {
    title: string;
    message: string;
    offerCode?: string;
    validUntil?: Date;
    imageUrl?: string;
  }
): Promise<void> {
  try {
    // In a real application, you would fetch phone numbers from your database
    // based on the target audience criteria
    const phoneNumbers = await getPhoneNumbersForAudience(targetAudience);
    
    let message = campaignData.message;
    
    if (campaignData.offerCode) {
      message += `\n\n🎁 Use code: ${campaignData.offerCode}`;
    }
    
    if (campaignData.validUntil) {
      message += `\n⏰ Valid until: ${formatDate(campaignData.validUntil, 'short')}`;
    }
    
    message += '\n\n📞 +91 98765 43210 | premiumstone.com';
    
    await sendBulkWhatsAppMessage(phoneNumbers, message);
    
    console.log(`Promotional campaign "${campaignData.title}" sent to ${phoneNumbers.length} recipients`);
  } catch (error) {
    console.error('Error sending promotional campaign:', error);
    throw error;
  }
}

async function getPhoneNumbersForAudience(_audience: string): Promise<string[]> {
  // Mock implementation - in a real app, this would query your database
  const mockPhoneNumbers = [
    '+91 98765 43210',
    '+91 87654 32109',
    '+91 76543 21098'
  ];
  
  return mockPhoneNumbers;
}

// WhatsApp chatbot responses for common queries
export const chatbotResponses = {
  greeting: `
👋 Hello! Welcome to PremiumStone WhatsApp support!

How can we help you today?

1️⃣ View granite collection
2️⃣ Get price quote
3️⃣ Schedule site visit
4️⃣ Track my order
5️⃣ Speak to an expert

Just reply with a number or describe what you need!
  `.trim(),

  priceInquiry: `
💰 For accurate pricing, we'll need some details:

• Granite type preference
• Approximate area (sq ft)
• Application (kitchen/bathroom/flooring)
• Location for installation

Our expert will call you with a personalized quote within 2 hours!

📞 Or call directly: +91 98765 43210
  `.trim(),

  siteVisit: `
🏠 We'd love to visit your site for accurate measurements!

Our site visit includes:
✅ Free measurement
✅ Design consultation  
✅ Granite samples
✅ Detailed quote

Available slots:
📅 Monday to Saturday
⏰ 10 AM - 6 PM

Share your preferred date and time, we'll confirm!
  `.trim(),

  orderTracking: `
📦 To track your order, please share:

• Order number or
• Phone number used for order

Our team will provide you with the latest status update immediately!

📞 For urgent queries: +91 98765 43210
  `.trim(),

  contactExpert: `
👨‍💼 Connect with our granite expert right away!

📞 Call now: +91 98765 43210
📧 Email: expert@premiumstone.com

💬 Or continue chatting here - our team typically responds within 10 minutes during business hours (9 AM - 7 PM, Mon-Sat)

What specific questions do you have about granite?
  `.trim()
};

export default {
  sendWhatsAppNotification,
  sendBulkWhatsAppMessage,
  whatsappTemplates,
  isValidWhatsAppNumber,
  handleWhatsAppOptIn,
  handleWhatsAppOptOut,
  sendPromotionalCampaign,
  chatbotResponses
};