import { NextRequest, NextResponse } from "next/server";
// In production: import { OpenAI } from "openai";

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const { noticeText } = await request.json();

    if (!noticeText) {
      return NextResponse.json({ error: "Notice text is required for analysis." }, { status: 400 });
    }

    // PRODUCTION IMPLEMENTATION:
    // const response = await openai.chat.completions.create({
    //   model: "gpt-4o",
    //   response_format: { type: "json_object" },
    //   messages: [
    //     {
    //       role: "system",
    //       content: "You are an expert Indian Chartered Accountant and corporate lawyer. Analyze the following notice text and return a JSON structure with keys: issuingAuthority, noticeSection, noticeNumber, discrepancyAmount, discrepancyDetails, dueDate, riskLevel (HIGH/MEDIUM/LOW), aiSopSuggestions (array of strings), and draftResponse (formatted email/letter reply)."
    //     },
    //     { role: "user", content: noticeText }
    //   ]
    // });
    // const result = JSON.parse(response.choices[0].message.content || "{}");

    return NextResponse.json({
      success: true,
      data: {
        issuingAuthority: "INCOME TAX DEPARTMENT",
        noticeSection: "Section 143(1)",
        noticeNumber: "IT-SEC143-2026-9023",
        discrepancyAmount: 12450,
        discrepancyDetails: "Interest Income from Fixed Deposits has not been disclosed in the income schedules.",
        dueDate: "2026-07-15",
        riskLevel: "MEDIUM",
        aiSopSuggestions: [
          "Cross-verify bank reconciliation interest certificates with TDS certificates (Form 16A).",
          "File revised return under Section 139(5) declaring the omitted interest income to avoid further scrutiny."
        ],
        draftResponse: "Dear Sir/Madam, we have accepted the discrepancy and paid the tax sum of ₹12,450. Copy of Challan is attached..."
      }
    });

  } catch (err: any) {
    return NextResponse.json(
      { error: "Internal Server Error", details: err.message },
      { status: 500 }
    );
  }
}
