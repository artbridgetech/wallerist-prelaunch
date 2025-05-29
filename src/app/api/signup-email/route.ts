import { NextResponse } from "next/server";
import { Resend } from "resend";
import fs from "fs";
import path from "path";


const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { email, firstName } = await req.json();

  try {
    const data = await resend.emails.send({
      from: 'Wallerist <noreply@wallerist.com>',
      to: email,
      subject: '🎉 Welcome to Wallerist!',
      html: `
        <div style="font-family:sans-serif; max-width:600px; margin:auto;">
          <h1 style="color:#111;">Hi ${firstName || 'there'},</h1>
          <p>Thanks for joining the Wallerist prelaunch list!</p>
          <p>We're excited to have you on board. Stay tuned for exclusive access and exciting updates.</p>
          <p>Meanwhile, you can read more about our vision in the attached PDF.</p>
          <p>— The Wallerist Team</p>
        </div>
      `,
      headers: {
        "X-Entity-Ref-ID": "wallerist-prelaunch"
      },
      tags: [
        { name: "type", value: "welcome" },
        { name: "campaign", value: "prelaunch" }
      ],
      attachments: [
        {
          filename: "Welcome.pdf",
          content: await getWelcomePdfBase64(), // defined below
        }
      ]
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Email send failed:", error);
    return NextResponse.json({ success: false, error });
  }
}

// Helper function to get base64 content of your PDF
async function getWelcomePdfBase64() {
  const fs = require("fs/promises");
  const path = require("path");
  const pdfPath = path.resolve(process.cwd(), "public", "Welcome.pdf");
  const buffer = await fs.readFile(pdfPath);
  return buffer.toString("base64");
}
