import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { email, firstName } = await req.json();

  try {
    const data = await resend.emails.send({
      from: 'Wallerist <noreply@wallerist.com>',
      to: email,
      subject: 'Welcome to Wallerist!',
      html: `
        <div style="font-family:sans-serif; max-width:600px; margin:auto; padding:20px;">
          <h1 style="color:#111;">Hi ${firstName || 'there'},</h1>
          <p>Thanks for joining the Wallerist prelaunch list!</p>
          <p>You're officially on our early access list. We’ll keep you updated with all the latest news and let you know as soon as we launch.</p>
          <br/>
          <p style="margin-top:40px;">Warmly,</p>
          <p style="font-weight:bold; color:#333;">The Wallerist Team</p>
        </div>
      `,
      headers: {
        "X-Entity-Ref-ID": "wallerist-prelaunch"
      },
      tags: [
        { name: "type", value: "welcome" },
        { name: "campaign", value: "prelaunch" }
      ]
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Email send failed:", error);
    return NextResponse.json({ success: false, error });
  }
}
