import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const body = await req.json();

  try {
    const data = await resend.emails.send({
      from: "Wallerist <noreply@wallerist.com>",
      to: body.email,
      subject: "You're on the Wallerist waitlist! 🎉",
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Hey ${body.firstName} 👋</h2>
          <p>Thanks for signing up for the Wallerist prelaunch!</p>
          <p>We’re excited to launch soon. Stay tuned, and follow us on social media for updates.</p>
          <br />
          <p>— The Wallerist Team</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
