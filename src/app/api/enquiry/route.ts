import { NextResponse } from "next/server";

type EnquiryPayload = {
  purpose?: string;
  type?: string;
  location?: string;
  budget?: string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  consent?: boolean;
};

/**
 * Enquiry endpoint. Validates the payload and hands it to the CRM.
 * Replace `forwardToCrm` with your integration (HubSpot, Salesforce,
 * Supabase insert, email service, etc.).
 */
export async function POST(request: Request) {
  let body: EnquiryPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim().slice(0, 120);
  const email = String(body.email ?? "").trim().slice(0, 200);
  if (!name || !/^\S+@\S+\.\S+$/.test(email) || body.consent !== true) {
    return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 422 });
  }

  await forwardToCrm({
    ...body,
    name,
    email,
    phone: String(body.phone ?? "").slice(0, 40),
    message: String(body.message ?? "").slice(0, 2000),
  });

  return NextResponse.json({ ok: true });
}

async function forwardToCrm(enquiry: EnquiryPayload) {
  if (process.env.NODE_ENV !== "production") {
    console.info("[enquiry]", { ...enquiry, email: "<redacted>", phone: enquiry.phone ? "<redacted>" : "" });
  }
}
