import { NextResponse } from "next/server";
import FormData from "form-data";
import fs from "fs";

const apiHost = process.env.API_HOST;
const apiKey = process.env.STABILITY_API_KEY;

console.log("LOG: engine:", process.env.DEFAULT_ENGINE);
console.log("LOG: apiHost:", apiHost);
console.log("LOG: apiKey:", apiKey ? "API key is set" : "API key is missing");

if (!apiKey) {
  throw new Error("Missing Stability API key.");
}

export async function POST(req) {
  try {
    const { prompt, sketchPath, control_strength = 0.6 } = await req.json();

    console.log("LOG: Received request with parameters:", {
      prompt,
      sketchPath,
      control_strength,
    });

    if (!prompt) {
      console.log("LOG: Error: Prompt is required.");
      return NextResponse.json(
        { error: "Prompt is required." },
        { status: 400 }
      );
    }

    if (!sketchPath || !fs.existsSync(sketchPath)) {
      console.log("LOG: Error: Sketch file is required and must exist.");
      return NextResponse.json(
        { error: "Sketch file is required and must exist." },
        { status: 400 }
      );
    }

    // Create a FormData object to handle the file upload and parameters
    const formData = new FormData();
    formData.append("prompt", prompt);
    formData.append("control_strength", control_strength.toString());
    // formData.append("image", fs.createReadStream(sketchPath));
    formData.append("image", `@/${sketchPath}`);
    console.log("LOG: FormData prepared for request.");

    const endpoint = `${apiHost}/v2beta/stable-image/control/sketch`;
    console.log("LOG: Endpoint:", endpoint);

    const requestBody = {
      prompt: prompt,
      control_strength: parseFloat(control_strength),
      image: sketchPath,
    };

    console.log("LOG: Request body being sent:", requestBody);

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

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
