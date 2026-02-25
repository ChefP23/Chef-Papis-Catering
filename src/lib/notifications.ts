import { Resend } from 'resend'
import * as twilioLib from 'twilio'
const twilio = (twilioLib as any).default || twilioLib

// Lazy init to avoid build-time errors
function getResend() { return new Resend(process.env.RESEND_API_KEY!) }
function getTwilio() { return twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!) }

interface OrderNotificationParams {
  customerName: string
  customerEmail: string
  customerPhone?: string
  orderItems: { name: string; quantity: number; price: number }[]
  school: string
  deliveryDate: string
  orderId: string
  total: number
}

export async function sendOrderConfirmation(params: OrderNotificationParams) {
  const { customerName, customerEmail, customerPhone, orderItems, school, deliveryDate, orderId, total } = params

  const itemsList = orderItems.map(i => `${i.quantity}x ${i.name} — $${(i.price * i.quantity).toFixed(2)}`).join('\n')
  const itemsHtml = orderItems.map(i => `
    <tr>
      <td style="padding: 10px 0; border-bottom: 1px solid #f0e8d8; color: #333;">${i.quantity}x ${i.name}</td>
      <td style="padding: 10px 0; border-bottom: 1px solid #f0e8d8; color: #333; text-align: right; font-weight: 700;">$${(i.price * i.quantity).toFixed(2)}</td>
    </tr>`).join('')

  // Send email
  try {
    await getResend().emails.send({
      from: 'Chef Papi\'s Catering <orders@chefpapiscatering.com>',
      to: customerEmail,
      subject: `✅ Order Confirmed – Chef Papi's Foodie Friday`,
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f0e8;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        
        <!-- HEADER -->
        <tr><td style="background:#1a0a00;border-radius:16px 16px 0 0;padding:32px;text-align:center;">
          <div style="width:56px;height:56px;background:#C41E1E;border:2px solid #D4A017;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:20px;font-weight:900;color:#D4A017;margin-bottom:12px;line-height:56px;">CP</div>
          <h1 style="color:#D4A017;margin:0;font-size:24px;font-weight:700;">Chef Papi's Catering</h1>
          <p style="color:rgba(255,255,255,0.6);margin:8px 0 0;font-size:14px;">Your order is confirmed! 🎉</p>
        </td></tr>

        <!-- BODY -->
        <tr><td style="background:#fff;padding:32px;">
          <h2 style="color:#1a0a00;margin:0 0 8px;font-size:20px;">Hey ${customerName}! 👋</h2>
          <p style="color:#555;margin:0 0 24px;line-height:1.6;">Your Foodie Friday order has been confirmed and paid. We'll have it hot and ready for you on delivery day!</p>

          <!-- ORDER DETAILS -->
          <div style="background:#fdf8f0;border:1px solid #f0e8d8;border-radius:12px;padding:20px;margin-bottom:24px;">
            <h3 style="color:#1a0a00;margin:0 0 16px;font-size:16px;font-weight:700;">📋 Order Summary</h3>
            <table width="100%" cellpadding="0" cellspacing="0">
              ${itemsHtml}
              <tr>
                <td style="padding:12px 0 0;font-weight:700;color:#1a0a00;font-size:16px;">Total</td>
                <td style="padding:12px 0 0;font-weight:700;color:#C41E1E;font-size:18px;text-align:right;">$${total.toFixed(2)}</td>
              </tr>
            </table>
          </div>

          <!-- DELIVERY INFO -->
          <div style="background:#1a0a00;border-radius:12px;padding:20px;margin-bottom:24px;">
            <h3 style="color:#D4A017;margin:0 0 12px;font-size:15px;">📅 Delivery Details</h3>
            <p style="color:rgba(255,255,255,0.8);margin:4px 0;font-size:14px;">📍 <strong style="color:#fff;">School:</strong> ${school}</p>
            <p style="color:rgba(255,255,255,0.8);margin:4px 0;font-size:14px;">🗓 <strong style="color:#fff;">Delivery Date:</strong> ${deliveryDate}</p>
            <p style="color:rgba(255,255,255,0.8);margin:4px 0;font-size:14px;">⏰ <strong style="color:#fff;">Time:</strong> 10AM – 1PM</p>
            <p style="color:rgba(255,255,255,0.8);margin:4px 0;font-size:14px;">🏫 <strong style="color:#fff;">Drop-off:</strong> Main Office</p>
          </div>

          <p style="color:#888;font-size:13px;margin:0;">Questions? Reply to this email or reach us at <a href="mailto:hello@chefpapiscatering.com" style="color:#C41E1E;">hello@chefpapiscatering.com</a></p>
        </td></tr>

        <!-- FOOTER -->
        <tr><td style="background:#f5f0e8;border-radius:0 0 16px 16px;padding:20px;text-align:center;">
          <p style="color:#aaa;font-size:12px;margin:0;">© 2026 Chef Papi's Catering · Brunswick, MD</p>
          <p style="color:#aaa;font-size:11px;margin:4px 0 0;">Order #${orderId.slice(0, 8).toUpperCase()}</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
    })
    console.log('✅ Confirmation email sent to', customerEmail)
  } catch (err) {
    console.error('❌ Email send error:', err)
  }

  // Send SMS if phone provided
  if (customerPhone) {
    try {
      const smsBody = `✅ Chef Papi's Order Confirmed!\n\n${itemsList}\n\nTotal: $${total.toFixed(2)}\nDelivery: ${deliveryDate} · ${school} Main Office\n\nQuestions? hello@chefpapiscatering.com`
      await getTwilio().messages.create({
        body: smsBody,
        from: process.env.TWILIO_PHONE_NUMBER!,
        to: customerPhone,
      })
      console.log('✅ Confirmation SMS sent to', customerPhone)
    } catch (err) {
      console.error('❌ SMS send error:', err)
    }
  }
}