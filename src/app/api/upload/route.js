// app/api/upload/route.js
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    console.log("LOG: Received upload request");

    const data = await req.formData();
    const file = data.get("file");

    if (!file) {
      console.log("LOG: Error: No file uploaded");
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const filename = `${Date.now()}-${file.name}`;
    console.log("LOG: Generated filename:", filename);

    const uploadDir = path.resolve("./public/uploads");
    const filepath = path.join(uploadDir, filename);
    console.log("LOG: Resolved file path:", filepath);

    // Ensure the uploads directory exists
    if (!fs.existsSync(uploadDir)) {
      console.log("LOG: Uploads directory does not exist, creating it...");
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log("LOG: Uploads directory created.");
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    console.log("LOG: Buffer created from file arrayBuffer");

    fs.writeFileSync(filepath, buffer);
    console.log("LOG: File written to disk successfully");

    console.log("LOG: returned response:", { filepath });
    return NextResponse.json({ filepath });
  } catch (error) {
    console.log("LOG: Error caught during file upload:", error.message);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
