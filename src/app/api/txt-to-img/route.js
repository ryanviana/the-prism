import { NextResponse } from "next/server";
import fetch from "node-fetch";

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
    const {
      prompt,
      engine = process.env.DEFAULT_ENGINE,
      width = process.env.DEFAULT_WIDTH,
      height = process.env.DEFAULT_HEIGHT,
      cfg_scale = process.env.DEFAULT_CFG_SCALE,
      samples = process.env.DEFAULT_SAMPLES,
      steps = process.env.DEFAULT_STEPS,
    } = await req.json();

    console.log("LOG: Received request with parameters:", {
      prompt,
      engine,
      width,
      height,
      cfg_scale,
      samples,
      steps,
    });

    if (!prompt) {
      console.log("LOG: Error: Prompt is required.");
      return NextResponse.json(
        { error: "Prompt is required." },
        { status: 400 }
      );
    }

    const requestBody = {
      text_prompts: [{ text: prompt }],
      cfg_scale: parseFloat(cfg_scale),
      samples: parseInt(samples),
      steps: parseInt(steps),
      width: parseInt(width),
      height: parseInt(height),
    };

    console.log("LOG: Request body being sent:", JSON.stringify(requestBody));

    const endpoint = `${apiHost}/v1/generation/${engine}/text-to-image`;
    console.log("LOG: Endpoint:", endpoint);

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
