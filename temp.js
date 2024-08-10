import { NextResponse } from "next/server";
import axios from "axios";
import FormData from "form-data";
import fs from "node:fs";
import path from "path";

const apiHost = process.env.API_HOST;
const apiKey = process.env.STABILITY_API_KEY;

export async function POST(req) {
  try {
    console.log("LOG: Received request at /api/sketch-to-img");

    const rawBody = await req.text();

    let parsedBody;
    try {
      parsedBody = JSON.parse(rawBody);
    } catch (parseError) {
      console.log("LOG: Error parsing JSON:", parseError.message);
      return NextResponse.json(
        { error: "Invalid JSON input." },
        { status: 400 }
      );
    }

    const {
      prompt,
      sketchPath,
      control_strength = 0.6,
      output_format = "webp",
    } = parsedBody;

    console.log("LOG: Parsed request parameters:", {
      prompt,
      sketchPath,
      control_strength,
      output_format,
    });

    if (!prompt) {
      console.log("LOG: Error: Prompt is required.");
      return NextResponse.json(
        { error: "Prompt is required." },
        { status: 400 }
      );
    }

    if (!sketchPath) {
      console.log("LOG: Error: Sketch path is required.");
      return NextResponse.json(
        { error: "Sketch path is required." },
        { status: 400 }
      );
    }

    if (!fs.existsSync(sketchPath)) {
      console.log("LOG: Error: Sketch file does not exist at", sketchPath);
      return NextResponse.json(
        { error: "Sketch file does not exist." },
        { status: 400 }
      );
    }

    const formData = new FormData();
    formData.append("image", fs.createReadStream(sketchPath));
    formData.append("prompt", prompt);
    formData.append("control_strength", control_strength);
    formData.append("output_format", output_format);

    console.log("LOG: Payload prepared:", {
      prompt,
      control_strength,
      output_format,
      sketchPath,
    });

    const response = await axios.post(
      `${apiHost}/v2beta/stable-image/control/sketch`,
      formData,
      {
        validateStatus: undefined,
        responseType: "arraybuffer",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          ...formData.getHeaders(),
        },
      }
    );

    console.log("LOG: Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log("LOG: Error response text:", errorText);
      return NextResponse.json(
        { error: errorText },
        { status: response.status }
      );
    }

    const responseJSON = await response.json();
    console.log("LOG: Response JSON:", responseJSON);

    return NextResponse.json({ artifacts: responseJSON.artifacts });
  } catch (error) {
    console.log("LOG: Error caught:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
