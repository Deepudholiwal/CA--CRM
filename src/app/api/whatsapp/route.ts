import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { toMobile, messageTemplate, templateParameters } = await request.json();

    if (!toMobile || !messageTemplate) {
      return NextResponse.json({ error: "Mobile number and template are required." }, { status: 400 });
    }

    // PRODUCTION IMPLEMENTATION (Meta WhatsApp Cloud API):
    // const response = await fetch(
    //   `https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
    //   {
    //     method: "POST",
    //     headers: {
    //       Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       messaging_product: "whatsapp",
    //       to: toMobile,
    //       type: "template",
    //       template: {
    //         name: messageTemplate,
    //         language: { code: "en" },
    //         components: [
    //           {
    //             type: "body",
    //             parameters: templateParameters // e.g. [{ type: "text", text: "Acme Tech" }]
    //           }
    //         ]
    //       }
    //     })
    //   }
    // );
    // const result = await response.json();

    return NextResponse.json({
      success: true,
      whatsappMessageId: `wamid.HBgLOTEyMzQ1Njc4MEAVJQ1FNDc3OEU3REVDNTNBAA==`,
      status: "SENT",
      sentTo: toMobile,
      timestamp: new Date().toISOString()
    });

  } catch (err: any) {
    return NextResponse.json(
      { error: "Internal Server Error", details: err.message },
      { status: 500 }
    );
  }
}
