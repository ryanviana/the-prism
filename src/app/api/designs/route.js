import { NextResponse } from "next/server";
import axios from "axios";
import FormData from "form-data";

const baseUrl = "https://api.stability.ai/v2beta/stable-image/control";
const apiKey = "YOUR_STABILITY_AI_API_KEY"; // Replace with your StabilityAI API key

// Handler for GET request to fetch designs (optional, if you want to fetch existing designs)
export async function GET() {
  return NextResponse.json({ message: "Fetching designs is not implemented." });
}

// Handler for POST request to create a new design
export async function POST(request) {
  try {
    const contentType = request.headers.get("content-type");
    let prompt, sketch, response;

    if (contentType.includes("application/json")) {
      // Handle text prompt
      ({ prompt } = await request.json());
      response = await axios.post(
        `${baseUrl}/text`,
        { prompt, num_images: 1 },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );
    } else if (contentType.includes("multipart/form-data")) {
      // Handle sketch upload
      const formData = new FormData();
      formData.append("sketch", request.body);
      formData.append("control_strength", 0.6);
      formData.append("output_format", "webp");

      response = await axios.postForm(`${baseUrl}/sketch`, formData, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: "image/*",
        },
      });
    } else {
      throw new Error("Unsupported content type");
    }

    if (response.status !== 200) {
      throw new Error(`Failed to create design: ${response.status}`);
    }

    const data = await response.data;
    const image = data.images ? data.images[0].data : response.data;
    const designId = Math.floor(Math.random() * 10000);
    const design = {
      _id: designId.toString(),
      image: { type: "image/webp", data: image },
      designId,
      prompt,
    };

    return NextResponse.json(design, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Handler for DELETE request to remove a design (if needed)
export async function DELETE(request) {
  // Implement logic to delete a design from your storage if needed
  return NextResponse.json({ message: "Delete design is not implemented." });
}
