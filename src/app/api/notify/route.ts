import { Resend } from "resend";
import { NextResponse } from "next/server";

// You should use environment variables for this
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
          <h1 style="color: #000;">Welcome to <span style="color:#6b46c1;">Wallerist</span>, ${firstName}!</h1>
          <p>Thanks for signing up to be among the first to join our art-powered community.</p>
          <p>We’re crafting something inspiring. Until then, follow us for updates, and we’ll keep you posted.</p>
          <hr style="margin: 30px 0;" />
          <p style="font-size: 0.85em; color: #666;">Wallerist – Empowering artists, transforming spaces.</p>
        </div>
      `,
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
