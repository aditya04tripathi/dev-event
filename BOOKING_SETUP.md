# Booking System Setup Guide

This guide will help you set up the event booking system with email notifications and QR codes.

## 1. Install Required Packages

Run the following command to install the necessary dependencies:

```bash
pnpm add qrcode nodemailer
pnpm add -D @types/qrcode @types/nodemailer
```

## 2. Configure Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# Email Configuration (Required for booking emails)

# For Gmail:
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password

# For other email providers, adjust accordingly
```

## 3. Setting Up Gmail for Email Sending

If you're using Gmail:

1. Go to your Google Account settings
2. Navigate to Security
3. Enable 2-Factor Authentication
4. Generate an App Password:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Copy the generated password
   - Use this as your `EMAIL_PASS` in `.env.local`

## 4. Alternative: Using Other Email Services

### SendGrid

```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=apikey
EMAIL_PASS=your_sendgrid_api_key
```

### Mailgun

```env
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_mailgun_user
EMAIL_PASS=your_mailgun_password
```

### AWS SES

```env
EMAIL_HOST=email-smtp.us-east-1.amazonaws.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_aws_access_key
EMAIL_PASS=your_aws_secret_key
```

## 5. Features Implemented

✅ **User Name Collection** - Now collects user's full name during booking
✅ **Email Field** - Collects user's email address
✅ **QR Code Generation** - Generates unique QR code with booking details
✅ **Email Notifications** - Sends professional HTML email with:

- Event details (title, date, time, location)
- Unique QR code for event entry
- Beautiful email template
  ✅ **Database Storage** - Saves bookings with:
- Event ID
- User name
- User email
- Timestamp
  ✅ **Duplicate Prevention** - Prevents users from booking the same event twice
  ✅ **Error Handling** - Proper error messages and loading states

## 6. QR Code Data Structure

The QR code contains the following information (JSON encoded):

```json
{
  "bookingId": "unique_booking_id",
  "eventId": "event_id",
  "eventTitle": "Event Name",
  "name": "User Name",
  "email": "user@example.com",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 7. Testing the Booking System

1. Start your development server: `pnpm dev`
2. Navigate to any event details page
3. Fill in the booking form with:
   - Full Name
   - Email Address
4. Click "Book Now"
5. Check your email inbox for the confirmation email with QR code

## 8. Email Template Preview

The email includes:

- 🎉 Confirmation header with gradient background
- 📋 Event details in a clean table format
- 🔲 QR code image (300x300px)
- 💌 Professional branding and footer

## 9. Database Schema

### Booking Model

```typescript
{
  eventId: ObjectId (ref: Event),
  name: String (required),
  email: String (required, unique per event),
  createdAt: Date,
  updatedAt: Date
}
```

### Indexes

- `eventId` - For quick event lookups
- `email` - For user lookup
- `(eventId, email)` - Unique constraint to prevent duplicate bookings

## 10. Security Considerations

- ✅ Email validation with regex
- ✅ Duplicate booking prevention
- ✅ Event existence verification
- ✅ Secure email credentials (use app passwords, not main password)
- ✅ Environment variables for sensitive data

## 11. Troubleshooting

### Email not sending

- Check if EMAIL_HOST, EMAIL_USER, and EMAIL_PASS are correctly set
- Verify your email provider allows SMTP connections
- For Gmail, ensure you're using an App Password, not your regular password
- Check your spam/junk folder

### QR Code not generating

- Ensure `qrcode` package is installed
- Check browser console for errors

### Booking not saving

- Verify MongoDB connection is working
- Check that the event exists
- Look for duplicate booking errors

## 12. Future Enhancements

Potential improvements you could add:

- SMS notifications (using Twilio)
- Calendar invite attachments (.ics files)
- Booking cancellation functionality
- QR code scanner for event check-in
- Booking analytics dashboard
- Reminder emails before the event
- Waitlist functionality when event is full
