import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(req, { params }) {
  const { imageName } = params;

  if (!imageName) {
    return NextResponse.json(
      { error: "Image name is required." },
      { status: 400 }
    );
  }

  const imagePath = path.resolve(`./public/out/${imageName}`);

  if (!fs.existsSync(imagePath)) {
    return NextResponse.json({ error: "Image not found." }, { status: 404 });
  }

  const imageBuffer = fs.readFileSync(imagePath);
  return new NextResponse(imageBuffer, {
    headers: { "Content-Type": "image/png" },
  });
}
