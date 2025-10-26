# Contact Form Setup Documentation

## Overview

The contact form system allows users to submit inquiries through your website. All submissions are saved to MongoDB and emails are sent to both the creator and the user.

## Files Created

### 1. Database Model: `database/contact.model.ts`

Mongoose schema for storing contact form submissions.

**Fields:**

- `name`: User's full name (required, max 100 chars)
- `email`: User's email address (required, validated)
- `reason`: Category of inquiry (required, enum)
- `subject`: Brief subject line (required, max 200 chars)
- `message`: Full message content (required, max 5000 chars)
- `status`: Tracking status (default: "pending")
  - `pending`: New submission
  - `responded`: Already replied to
  - `archived`: Closed/archived
- `createdAt`: Timestamp of submission
- `updatedAt`: Last modified timestamp

**Indexes:**

- Email lookup
- Status + creation date (for admin filtering)
- Reason category
- Creation date (for sorting)

### 2. Server Actions: `lib/actions/contact.action.ts`

#### Main Function: `submitContactForm()`

Handles contact form submissions with the following workflow:

1. Connects to database
2. Validates all required fields
3. Saves submission to MongoDB
4. Sends notification email to creator
5. Sends confirmation email to user

**Parameters:**

```typescript
{
  name: string;
  email: string;
  reason: string;
  subject: string;
  message: string;
}
```

**Return:**

```typescript
{
  success: boolean;
  message: string;
}
```

#### Admin Helper Functions:

**`getAllContacts(params?)`**
Fetches contact submissions with pagination and filtering.

```typescript
// Example usage
const result = await getAllContacts({
  status: "pending",
  limit: 20,
  page: 1,
});
```

**`updateContactStatus(params)`**
Updates the status of a contact submission.

```typescript
// Example usage
await updateContactStatus({
  contactId: "...",
  status: "responded",
});
```

**`deleteContact(contactId)`**
Permanently deletes a contact submission.

```typescript
// Example usage
await deleteContact("contact_id_here");
```

### 3. Component Integration: `components/contact-form.tsx`

Updated to use the real server action instead of simulated API call.

## Email Templates

### Email to Creator

Professional notification email containing:

- Sender's name and email
- Inquiry reason and subject
- Full message content
- "Reply to {name}" button (opens email client)
- Modern design matching your brand

### Confirmation Email to User

Professional acknowledgment email containing:

- Personalized greeting
- Confirmation of receipt
- Message subject summary
- Unique reference number
- "What Happens Next" section
- 24-48 hour response time commitment
- Link to explore DevEvent

Both emails use:

- Your brand colors from `globals.css`
- Open Sans font family
- Responsive design for all devices
- Clean, modern layout

## Database Schema Validation

The model includes:

- Email regex validation
- Character limits on all text fields
- Enum validation for reason field
- Enum validation for status field

## Contact Reasons

The following reasons are available in the form:

- General Inquiry
- Technical Support
- Partnership Opportunity
- Bug Report
- Feature Request
- Other

## Environment Variables

Make sure these are set in your `.env` file:

```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password

# MongoDB (already configured)
MONGODB_URI=your-mongodb-connection-string
```

**Note:** If email credentials are not configured, submissions will still be saved to the database, but no emails will be sent.

## Usage Examples

### Fetching All Pending Contacts

```typescript
import { getAllContacts } from "@/lib/actions/contact.action";

const result = await getAllContacts({
  status: "pending",
  page: 1,
  limit: 20,
});

if (result.success) {
  console.log(result.contacts);
  console.log(result.pagination);
}
```

### Marking Contact as Responded

```typescript
import { updateContactStatus } from "@/lib/actions/contact.action";

await updateContactStatus({
  contactId: "someContactId",
  status: "responded",
});
```

### Building an Admin Dashboard

You can create an admin page to manage contacts:

```typescript
// Example: app/admin/contacts/page.tsx
import { getAllContacts } from "@/lib/actions/contact.action";

export default async function AdminContactsPage() {
  const { contacts, pagination } = await getAllContacts({
    status: "pending",
  });

  return (
    <div>
      <h1>Contact Submissions</h1>
      {contacts.map((contact) => (
        <ContactCard key={contact._id} contact={contact} />
      ))}
    </div>
  );
}
```

## Data Flow

```
User submits form
    ↓
Contact Form Component
    ↓
submitContactForm() server action
    ↓
├─→ Save to MongoDB (Contact model)
├─→ Send email to creator
└─→ Send confirmation to user
    ↓
Return success/error to user
```

## Status Workflow

```
pending → responded → archived
   ↓
   └─→ Can also go directly to archived
```

## Best Practices

1. **Regular Monitoring**: Check pending contacts regularly
2. **Update Status**: Mark contacts as "responded" after replying
3. **Archive Old Ones**: Archive resolved issues to keep dashboard clean
4. **Backup**: Regular database backups to preserve contact history
5. **Security**: Never expose admin functions to public routes

## Future Enhancements

Potential features you could add:

- Admin dashboard UI
- Email templates for common responses
- Priority/urgency field
- Attachment support
- Auto-responder for specific reasons
- Contact analytics and reporting
- Export contacts to CSV
- Search and advanced filtering

## Testing

To test the contact form:

1. Fill out the form at `/contact`
2. Check MongoDB for the new document
3. Check your email for the notification
4. Check user's email for confirmation

## Troubleshooting

**Emails not sending:**

- Verify `EMAIL_USER` and `EMAIL_PASS` are set
- Check Gmail App Password is correct
- Review console logs for error messages

**Database not saving:**

- Verify MongoDB connection string
- Check console logs for validation errors
- Ensure all required fields are provided

**Form validation errors:**

- Ensure email format is valid
- Check character limits aren't exceeded
- Verify reason is from the allowed list

## Security Notes

- All user inputs are validated on the server
- Email addresses are validated with regex
- Character limits prevent abuse
- Status updates should be protected by authentication
- Consider adding rate limiting for production

---

**Created:** October 2025  
**Author:** Aditya Tripathi  
**Project:** DevEvent Platform
