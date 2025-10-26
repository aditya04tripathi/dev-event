"use server";

import nodemailer from "nodemailer";
import { CREATOR_INFO } from "../site-constants";
import Contact from "@/database/contact.model";
import connectDB from "../mongodb";

interface SubmitContactParams {
  name: string;
  email: string;
  reason: string;
  subject: string;
  message: string;
}

export async function submitContactForm(params: SubmitContactParams) {
  try {
    console.debug("[submitContactForm] Called with params:", {
      ...params,
      message: params.message.substring(0, 50) + "...",
    });

    await connectDB();
    console.debug("[submitContactForm] Connected to DB");

    const { name, email, reason, subject, message } = params;

    // Validate required fields
    if (!name || !email || !reason || !subject || !message) {
      return {
        success: false,
        message: "All fields are required",
      };
    }

    // Save contact form submission to database
    const contactSubmission = await Contact.create({
      name,
      email,
      reason,
      subject,
      message,
      status: "pending",
    });

    console.debug(
      "[submitContactForm] Contact submission saved:",
      contactSubmission._id
    );

    // Check if email credentials are configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn(
        "[submitContactForm] Email credentials not configured. Submission saved but emails not sent."
      );
      return {
        success: true,
        message: "Message received! We'll get back to you soon.",
      };
    }

    // Send email to creator
    await sendContactEmailToCreator({
      name,
      email,
      reason,
      subject,
      message,
    });

    console.debug("[submitContactForm] Email sent to creator");

    // Send confirmation email to user
    await sendConfirmationEmailToUser({
      name,
      email,
      subject,
    });

    console.debug(
      "[submitContactForm] Confirmation email sent to user:",
      email
    );

    return {
      success: true,
      message: "Message sent successfully! We'll get back to you soon.",
    };
  } catch (error) {
    console.error("[submitContactForm] Error:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to send message. Please try again.",
    };
  }
}

async function sendContactEmailToCreator(params: {
  name: string;
  email: string;
  reason: string;
  subject: string;
  message: string;
}) {
  const { name, email, reason, subject, message } = params;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER!,
      pass: process.env.EMAIL_PASS!,
    },
  });

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact Form Submission</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Open Sans', Arial, sans-serif; background-color: #fafafa;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 40px 20px;">
            <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">
              <!-- Header -->
              <tr>
                <td style="padding: 48px 40px 32px 40px; text-align: center; background: linear-gradient(135deg, #5b5fc7 0%, #6366f1 50%, #7c7fd9 100%); border-radius: 8px 8px 0 0;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: -0.02em;">New Contact Message 📬</h1>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding: 40px;">
                  <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 26px; color: #2c2847;">
                    You have received a new message from <strong style="color: #6366f1; font-weight: 600;">${name}</strong> via the DevEvent contact form.
                  </p>

                  <!-- Contact Details Card -->
                  <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 32px 0; background-color: #f8f9fb; border-radius: 8px; border: 1px solid #e5e7eb;">
                    <tr>
                      <td style="padding: 24px;">
                        <table role="presentation" style="width: 100%; border-collapse: collapse;">
                          <tr>
                            <td style="padding: 0 0 16px 0;">
                              <p style="margin: 0 0 4px 0; font-size: 13px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">From</p>
                              <p style="margin: 0; font-size: 17px; font-weight: 600; color: #1a1633; line-height: 24px;">${name}</p>
                              <p style="margin: 4px 0 0 0; font-size: 15px; color: #6366f1;">${email}</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 0 0 16px 0; border-top: 1px solid #e5e7eb; padding-top: 16px;">
                              <p style="margin: 0 0 4px 0; font-size: 13px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Reason</p>
                              <p style="margin: 0; font-size: 16px; color: #2c2847; line-height: 24px;">${reason}</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 0; border-top: 1px solid #e5e7eb; padding-top: 16px;">
                              <p style="margin: 0 0 4px 0; font-size: 13px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Subject</p>
                              <p style="margin: 0; font-size: 16px; color: #2c2847; line-height: 24px;">${subject}</p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <!-- Message Content -->
                  <table role="presentation" width="100%" style="margin: 32px 0; background: linear-gradient(135deg, rgba(99, 102, 241, 0.04) 0%, rgba(99, 102, 241, 0.08) 100%); border-radius: 8px; border: 2px solid #e5e7eb;">
                    <tr>
                      <td style="padding: 24px;">
                        <p style="margin: 0 0 12px 0; font-size: 13px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Message</p>
                        <p style="margin: 0; font-size: 15px; line-height: 24px; color: #2c2847; white-space: pre-wrap; word-break: break-word;">${message}</p>
                      </td>
                    </tr>
                  </table>

                  <!-- Reply Button -->
                  <table role="presentation" width="100%">
                    <tr>
                      <td align="center" style="padding: 8px 0;">
                        <a href="mailto:${email}?subject=Re: ${encodeURIComponent(
    subject
  )}" 
                           style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #5b5fc7 0%, #6366f1 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; letter-spacing: -0.01em;">
                          Reply to ${name}
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding: 24px 40px; text-align: center; border-top: 1px solid #e5e7eb; background-color: #f8f9fb; border-radius: 0 0 8px 8px;">
                  <p style="margin: 0 0 6px 0; font-size: 15px; font-weight: 700; color: #6366f1; letter-spacing: -0.01em;">DevEvent</p>
                  <p style="margin: 0; font-size: 13px; color: #6b7280; line-height: 18px;">
                    Contact form notification • ${new Date().toLocaleDateString()}
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `"DevEvent Contact Form" <${process.env.EMAIL_USER!}>`,
      to: CREATOR_INFO.email,
      replyTo: email,
      subject: `[DevEvent Contact] ${reason}: ${subject}`,
      html: htmlContent,
    });
    console.info("[sendContactEmailToCreator] Email sent successfully");
  } catch (err) {
    console.error("[sendContactEmailToCreator] Error:", err);
    throw err;
  }
}

async function sendConfirmationEmailToUser(params: {
  name: string;
  email: string;
  subject: string;
}) {
  const { name, email, subject } = params;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER!,
      pass: process.env.EMAIL_PASS!,
    },
  });

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Message Received</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Open Sans', Arial, sans-serif; background-color: #fafafa;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 40px 20px;">
            <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">
              <!-- Header -->
              <tr>
                <td style="padding: 48px 40px 32px 40px; text-align: center; background: linear-gradient(135deg, #5b5fc7 0%, #6366f1 50%, #7c7fd9 100%); border-radius: 8px 8px 0 0;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: -0.02em;">Message Received! ✉️</h1>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding: 40px;">
                  <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 24px; color: #2c2847;">
                    Hi <strong style="color: #1a1633;">${name}</strong>,
                  </p>
                  <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 26px; color: #2c2847;">
                    Thank you for reaching out! I've received your message and will get back to you within <strong style="color: #6366f1; font-weight: 600;">24-48 hours</strong>.
                  </p>

                  <!-- Message Summary Card -->
                  <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 32px 0; background-color: #f8f9fb; border-radius: 8px; border: 1px solid #e5e7eb;">
                    <tr>
                      <td style="padding: 24px;">
                        <table role="presentation" style="width: 100%; border-collapse: collapse;">
                          <tr>
                            <td style="padding: 0 0 16px 0;">
                              <p style="margin: 0 0 4px 0; font-size: 13px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Your Message</p>
                              <p style="margin: 0; font-size: 17px; font-weight: 600; color: #1a1633; line-height: 24px;">${subject}</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 0; border-top: 1px solid #e5e7eb; padding-top: 16px;">
                              <p style="margin: 0 0 4px 0; font-size: 13px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Reference Number</p>
                              <p style="margin: 0; font-size: 16px; color: #2c2847; font-family: 'Menlo', monospace; line-height: 24px;">#${Date.now()
                                .toString(36)
                                .toUpperCase()}</p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <!-- What's Next Section -->
                  <table role="presentation" width="100%" style="margin: 32px 0; background: linear-gradient(135deg, rgba(99, 102, 241, 0.04) 0%, rgba(99, 102, 241, 0.08) 100%); border-radius: 8px; border: 2px solid #e5e7eb;">
                    <tr>
                      <td style="padding: 24px;">
                        <p style="margin: 0 0 12px 0; font-size: 18px; font-weight: 700; color: #6366f1; letter-spacing: -0.01em;">
                          What Happens Next?
                        </p>
                        <ul style="margin: 0; padding-left: 20px; color: #2c2847;">
                          <li style="margin-bottom: 8px; font-size: 15px; line-height: 22px;">I'll review your message carefully</li>
                          <li style="margin-bottom: 8px; font-size: 15px; line-height: 22px;">You'll receive a personal response within 24-48 hours</li>
                          <li style="margin-bottom: 0; font-size: 15px; line-height: 22px;">For urgent matters, I'll prioritize accordingly</li>
                        </ul>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 24px 0 0 0; font-size: 14px; line-height: 22px; color: #6b7280; text-align: center; padding: 0 16px;">
                    In the meantime, feel free to explore <a href="https://devevent.com" style="color: #6366f1; text-decoration: none; font-weight: 600;">DevEvent</a> and discover upcoming tech events!
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding: 24px 40px; text-align: center; border-top: 1px solid #e5e7eb; background-color: #f8f9fb; border-radius: 0 0 8px 8px;">
                  <p style="margin: 0 0 6px 0; font-size: 15px; font-weight: 700; color: #6366f1; letter-spacing: -0.01em;">DevEvent</p>
                  <p style="margin: 0; font-size: 13px; color: #6b7280; line-height: 18px;">
                    © ${new Date().getFullYear()} DevEvent. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `"DevEvent" <${process.env.EMAIL_USER!}>`,
      to: email,
      subject: `Message Received: ${subject}`,
      html: htmlContent,
    });
    console.info("[sendConfirmationEmailToUser] Email sent successfully");
  } catch (err) {
    console.error("[sendConfirmationEmailToUser] Error:", err);
    throw err;
  }
}

// Admin helper functions for managing contact submissions

export async function getAllContacts(params?: {
  status?: "pending" | "responded" | "archived";
  limit?: number;
  page?: number;
}) {
  try {
    await connectDB();

    const { status, limit = 20, page = 1 } = params || {};
    const skip = (page - 1) * limit;

    const query = status ? { status } : {};

    const [contacts, total] = await Promise.all([
      Contact.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Contact.countDocuments(query),
    ]);

    return {
      success: true,
      contacts: JSON.parse(JSON.stringify(contacts)),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("[getAllContacts] Error:", error);
    return {
      success: false,
      message: "Failed to fetch contacts",
    };
  }
}

export async function updateContactStatus(params: {
  contactId: string;
  status: "pending" | "responded" | "archived";
}) {
  try {
    await connectDB();

    const { contactId, status } = params;

    const contact = await Contact.findByIdAndUpdate(
      contactId,
      { status },
      { new: true }
    );

    if (!contact) {
      return {
        success: false,
        message: "Contact not found",
      };
    }

    return {
      success: true,
      contact: JSON.parse(JSON.stringify(contact)),
    };
  } catch (error) {
    console.error("[updateContactStatus] Error:", error);
    return {
      success: false,
      message: "Failed to update contact status",
    };
  }
}

export async function deleteContact(contactId: string) {
  try {
    await connectDB();

    const contact = await Contact.findByIdAndDelete(contactId);

    if (!contact) {
      return {
        success: false,
        message: "Contact not found",
      };
    }

    return {
      success: true,
      message: "Contact deleted successfully",
    };
  } catch (error) {
    console.error("[deleteContact] Error:", error);
    return {
      success: false,
      message: "Failed to delete contact",
    };
  }
}
