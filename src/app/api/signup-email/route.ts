import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { email, firstName } = await req.json();

  try {
    const { error } = await resend.emails.send({
      from: "Wallerist <noreply@wallerist.com>",
      to: [email],
      subject: "Welcome to Wallerist 🎉",
      html: `
        <div style="font-family: Arial, sans-serif; color: #111; max-width: 600px; margin: auto; padding: 20px;">
          <h1 style="color: #000;">Welcome to <span style="color:#6b46c1;">Wallerist</span>, ${firstName || "there"}!</h1>
          <p style="font-size: 16px; line-height: 1.6;">
            Thanks for signing up to be among the first to join our art-powered community. You're now officially on our early access list.
          </p>
          <p style="font-size: 16px; line-height: 1.6;">
            We’re crafting something inspiring. Until then, keep an eye on your inbox — we’ll keep you posted.
          </p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
          <p style="font-size: 14px; color: #555;">Warmly,</p>
          <p style="font-size: 14px; font-weight: bold; color: #333;">The Wallerist Team</p>
          <p style="font-size: 12px; color: #999; margin-top: 30px;">Wallerist – Empowering artists, transforming spaces.</p>
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

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
