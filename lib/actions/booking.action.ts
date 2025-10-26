"use server";

import Booking from "@/database/booking.model";
import Event from "@/database/event.model";
import connectDB from "../mongodb";
import QRCode from "qrcode";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { encryptData } from "../utils";

interface CreateBookingParams {
  eventId: string;
  name: string;
  email: string;
}

export async function createBooking(params: CreateBookingParams) {
  try {
    console.debug("[createBooking] Called with params:", params);
    await connectDB();
    console.debug("[createBooking] Connected to DB");

    const { eventId, name, email } = params;

    const event = await Event.findById(eventId);
    console.debug("[createBooking] Event lookup result:", event);
    if (!event) {
      console.warn("[createBooking] Event not found:", eventId);
      return {
        success: false,
        message: "Event not found",
      };
    }

    const existingBooking = await Booking.findOne({ eventId, email });
    console.debug(
      "[createBooking] Existing booking lookup result:",
      existingBooking
    );
    if (existingBooking) {
      console.warn(
        "[createBooking] Duplicate booking for eventId/email:",
        eventId,
        email
      );
      return {
        success: false,
        message: "You have already booked this event",
      };
    }

    const booking = await Booking.create({
      eventId,
      name,
      email,
    });
    console.debug("[createBooking] Booking created:", booking);

    const qrData = JSON.stringify({
      bookingId: booking._id.toString(),
      eventId: event._id.toString(),
      eventTitle: event.title,
      name,
      email,
      timestamp: booking.createdAt.toISOString(),
    });

    console.debug("[createBooking] QR data to encode:", qrData);

    const encryptedData = encryptData(qrData);
    console.debug(
      "[createBooking] Data encrypted, length:",
      encryptedData.length
    );

    const qrCodeBase64 = await QRCode.toDataURL(encryptedData, {
      errorCorrectionLevel: "H",
      type: "image/png",
      width: 300,
      margin: 2,
    });

    console.debug(
      "[createBooking] QR code generated (base64 size):",
      qrCodeBase64.length
    );

    await sendBookingEmail({
      to: email,
      name,
      eventTitle: event.title,
      eventDate: event.date,
      eventTime: event.time,
      eventLocation: event.location,
      qrCodeBase64,
    });

    console.debug("[createBooking] Email sent to:", email);

    return {
      success: true,
      message: "Booking confirmed! Check your email for the QR code.",
      booking: JSON.parse(JSON.stringify(booking)),
    };
  } catch (error) {
    console.error("Error creating booking:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to create booking",
    };
  }
}

async function sendBookingEmail(params: {
  to: string;
  name: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  qrCodeBase64: string;
}) {
  const {
    to,
    name,
    eventTitle,
    eventDate,
    eventTime,
    eventLocation,
    qrCodeBase64,
  } = params;

  console.debug("[sendBookingEmail] Params:", params);

  // Check if email credentials are configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("Email credentials not configured. Skipping email send.");
    return;
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER!,
      pass: process.env.EMAIL_PASS!,
    },
  });

  // To maximize compatibility, place the QR Code as an inline embedded image
  // And refer to it via cid in the <img> tag for trustworthy rendering in all email clients

  // Extract the base64 data from the dataURL
  let qrBase64 = qrCodeBase64;
  let matches = qrCodeBase64.match(/^data:image\/png;base64,(.*)$/);
  if (matches && matches[1]) {
    qrBase64 = matches[1];
  }

  // NOTE: Center aligning the QR code in all mail clients is best done using a table with align="center"
  // Use a table for the QR code section instead of just a div

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Event Booking Confirmation</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Open Sans', Arial, sans-serif; background-color: #fafafa;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 40px 20px;">
            <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">
              <!-- Header -->
              <tr>
                <td style="padding: 48px 40px 32px 40px; text-align: center; background: linear-gradient(135deg, #5b5fc7 0%, #6366f1 50%, #7c7fd9 100%); border-radius: 8px 8px 0 0;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: -0.02em;">Booking Confirmed! 🎉</h1>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding: 40px;">
                  <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 24px; color: #2c2847;">
                    Hi <strong style="color: #1a1633;">${name}</strong>,
                  </p>
                  <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 26px; color: #2c2847;">
                    Thank you for booking your spot! Your registration for <strong style="color: #6366f1; font-weight: 600;">${eventTitle}</strong> has been successfully confirmed.
                  </p>

                  <!-- Event Details Card -->
                  <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 32px 0; background-color: #f8f9fb; border-radius: 8px; border: 1px solid #e5e7eb;">
                    <tr>
                      <td style="padding: 24px;">
                        <table role="presentation" style="width: 100%; border-collapse: collapse;">
                          <tr>
                            <td style="padding: 0 0 16px 0;">
                              <p style="margin: 0 0 4px 0; font-size: 13px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Event</p>
                              <p style="margin: 0; font-size: 17px; font-weight: 600; color: #1a1633; line-height: 24px;">${eventTitle}</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 0 0 16px 0; border-top: 1px solid #e5e7eb; padding-top: 16px;">
                              <p style="margin: 0 0 4px 0; font-size: 13px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Date</p>
                              <p style="margin: 0; font-size: 16px; color: #2c2847; line-height: 24px;">${eventDate}</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 0 0 16px 0; border-top: 1px solid #e5e7eb; padding-top: 16px;">
                              <p style="margin: 0 0 4px 0; font-size: 13px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Time</p>
                              <p style="margin: 0; font-size: 16px; color: #2c2847; line-height: 24px;">${eventTime}</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 0; border-top: 1px solid #e5e7eb; padding-top: 16px;">
                              <p style="margin: 0 0 4px 0; font-size: 13px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Location</p>
                              <p style="margin: 0; font-size: 16px; color: #2c2847; line-height: 24px;">${eventLocation}</p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <!-- QR Code Section -->
                  <table role="presentation" width="100%" style="margin: 32px 0; background: linear-gradient(135deg, rgba(99, 102, 241, 0.04) 0%, rgba(99, 102, 241, 0.08) 100%); border-radius: 8px; border: 2px solid #e5e7eb;">
                    <tr>
                      <td align="center" style="padding: 32px 24px;">
                        <p style="margin: 0 0 8px 0; font-size: 18px; font-weight: 700; color: #6366f1; letter-spacing: -0.01em;">
                          Your Event QR Code
                        </p>
                        <p style="margin: 0 0 24px 0; font-size: 14px; color: #6b7280; line-height: 20px;">
                          Present this QR code at the event entrance for quick check-in
                        </p>
                        <table role="presentation" width="100%">
                          <tr>
                            <td align="center">
                              <img src="cid:qr-image"
                                   alt="Event QR Code"
                                   style="display: block; width: 280px; max-width: 100%; height: auto; border: 3px solid #6366f1; border-radius: 8px; padding: 12px; background-color: #ffffff; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15);" />
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 24px 0 0 0; font-size: 14px; line-height: 22px; color: #6b7280; text-align: center; padding: 0 16px;">
                    We're excited to see you at the event! If you have any questions, feel free to reach out to us.
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
    console.debug("[sendBookingEmail] Attempting to send mail to:", to);
    await transporter.sendMail({
      from: `"DevEvent" <${process.env.EMAIL_USER!}>`,
      to,
      subject: `Booking Confirmation: ${eventTitle}`,
      html: htmlContent,
      attachments: [
        {
          filename: "event-qr.png",
          content: qrBase64,
          encoding: "base64",
          cid: "qr-image", // Same as referenced in cid: above
        },
      ],
    });
    console.info("[sendBookingEmail] Email successfully sent to:", to);
  } catch (err) {
    console.error("[sendBookingEmail] Error sending email to:", to, err);
    throw err;
  }

  console.log("SENT");
}
