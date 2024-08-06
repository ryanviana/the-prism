import { NextResponse } from "next/server";

const baseUrl = "https://api.stability.ai/v1/generate"; // Example StabilityAI API endpoint
const apiKey = "YOUR_STABILITY_AI_API_KEY"; // Replace with your StabilityAI API key

// Handler for GET request to fetch designs (optional, if you want to fetch existing designs)
export async function GET() {
  // You can implement logic to fetch and return designs if you have a storage solution
  return NextResponse.json({ message: "Fetching designs is not implemented." });
}

// Handler for POST request to create a new design
export async function POST(request) {
  try {
    const { prompt } = await request.json();

    // Call the StabilityAI API to generate an image
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ prompt, num_images: 1 }),
    });

    if (!response.ok) {
      throw new Error("Failed to create design");
    }

    const data = await response.json();
    const image = data.images[0].data; // Assuming the response includes an image data array

    // Generate a random design ID (replace this with your ID generation logic)
    const designId = Math.floor(Math.random() * 10000);
    const design = {
      _id: designId.toString(),
      image: { type: "image/jpeg", data: image },
      image_hash: "", // Optionally, calculate a hash for the image
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
