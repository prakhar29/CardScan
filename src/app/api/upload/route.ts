import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { google } from "googleapis";
import { JWT } from "google-auth-library";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

async function getGoogleSheetClient() {
  // Try to get credentials from environment variable first (for Vercel deployment)
  let credentials;
  
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
  } else {
    // Fallback to file for local development
    const path = await import("path");
    const fs = await import("fs/promises");
    const credentialsPath = path.join(process.cwd(), "credentials.json");
    const content = await fs.readFile(credentialsPath, "utf8");
    credentials = JSON.parse(content);
  }

  const client = new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth: client });
}

async function fileToGenerativePart(file: File) {
  const base64EncodedData = await file.arrayBuffer().then((buffer) =>
    Buffer.from(buffer).toString("base64")
  );
  return {
    inlineData: {
      data: base64EncodedData,
      mimeType: file.type,
    },
  };
}

export async function POST(req: NextRequest) {
  console.log("Attempting to use Gemini API Key:", process.env.GEMINI_API_KEY ? "Set" : "Not Set");
  try {
    // Check if API key is set
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file found" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt =
      'Extract the following information from this business card image: Company Name, Personal Name, Designation, up to three Phone numbers, Email, Website, and Address. Return the result as a JSON object with keys "companyName", "personalName", "designation", "phone1", "phone2", "phone3", "email", "website", and "address". If a value is not found for any field, return an empty string for that key.';
    const imagePart = await fileToGenerativePart(file);

    const result = await model.generateContent([prompt, imagePart]);
    const responseText = result.response.text();

    // Clean up the response from Gemini
    const cleanedJson = responseText
      .replace(/```json\n/g, "")
      .replace(/```/g, "");
    const extractedData = JSON.parse(cleanedJson);

    const {
      companyName,
      personalName,
      designation,
      phone1,
      phone2,
      phone3,
      email,
      website,
      address,
    } = extractedData;

    // Save to Google Sheets
    const spreadsheetId = process.env.GOOGLE_SHEET_ID || "1vxWp5SrA8DauLNHZasgZqn0EUiEvvYaXA2IO-rpb00k";
    const sheetName = process.env.GOOGLE_SHEET_NAME || "Sheet1";

    const sheets = await getGoogleSheetClient();

    // Check for headers and write them if the sheet is empty
    const headerRange = `${sheetName}!A1:I1`;
    try {
      const getResult = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: headerRange,
      });

      const headers = getResult.data.values;
      if (!headers || headers.length === 0) {
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: headerRange,
          valueInputOption: "USER_ENTERED",
          requestBody: {
            values: [
              [
                "Company Name",
                "Personal Name",
                "Designation",
                "Phone 1",
                "Phone 2",
                "Phone 3",
                "Email",
                "Website",
                "Address",
              ],
            ],
          },
        });
      }
    } catch (err) {
      // Ignore error if the sheet doesn't exist yet, it will be created by append
      console.log("Could not read sheet, probably empty. That's OK.");
    }

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A:I`,
      valueInputOption: "RAW",
      requestBody: {
        values: [
          [
            companyName,
            personalName,
            designation,
            phone1,
            phone2,
            phone3,
            email,
            website,
            address,
          ],
        ],
      },
    });

    return NextResponse.json({
      message: "Data extracted and saved successfully.",
      data: extractedData,
    });
  } catch (error) {
    console.error("Full error:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 