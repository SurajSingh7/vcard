import dbConnect from "../../../lib/dbConnect";
import VisitorCard from "../../../models/VisitorCard";

// GET: Fetch all visitor cards
export async function GET(request) {
    await dbConnect();
    try {
      // Sort by _id in descending order to get the reverse order
      const visitorCards = await VisitorCard.find({}).sort({ _id: -1 });
      return new Response(JSON.stringify({ visitorCards }), { status: 200 });
    } catch (error) {
      console.error("Error fetching visitor cards:", error);
      return new Response(
        JSON.stringify({ error: "Failed to fetch visitor cards" }),
        { status: 500 }
      );
    }
  }
  

// POST: Create a new visitor card
export async function POST(request) {
  await dbConnect();
  try {
    // Expecting a form submission (as FormData)
    const formData = await request.formData();
    const visitorCardData = {
      name: formData.get("name"),
      sedulertime: formData.get("sedulertime"),
      contactNumber: formData.get("contactNumber"),
      note: formData.get("note"),
      assignTo: formData.get("assignTo"),
      visitorCardFront: formData.get("visitorCardFront"),
      visitorCardBack: formData.get("visitorCardBack"),
    };

    const newVisitorCard = await VisitorCard.create(visitorCardData);

    return new Response(
      JSON.stringify({
        message: "Visitor Card Created",
        visitorCard: newVisitorCard,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating visitor card:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create visitor card" }),
      { status: 500 }
    );
  }
}


// PATCH: Update a visitor card's field (e.g., pin)
export async function PATCH(request) {
  await dbConnect();
  try {
    const { id, field, value } = await request.json();
    if (!id || !field) {
      return new Response(
        JSON.stringify({ error: "Invalid input" }),
        { status: 400 }
      );
    }
    const update = {};
    update[field] = value;
    const updatedCard = await VisitorCard.findByIdAndUpdate(id, update, { new: true });
    return new Response(
      JSON.stringify({ message: "Visitor card updated", visitorCard: updatedCard }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating visitor card:", error);
    return new Response(
      JSON.stringify({ error: "Failed to update visitor card" }),
      { status: 500 }
    );
  }
}

// export async function POST(request) {
//   await dbConnect();
//   try {
//     // Parse the incoming form data
//     const formData = await request.formData();
//     const visitorCardData = {
//       name: formData.get("name"),
//       sedulertime: formData.get("sedulertime"),
//       contactNumber: formData.get("contactNumber"),
//       note: formData.get("note"),
//       assignTo: formData.get("assignTo"),
//       visitorCardFront: formData.get("visitorCardFront"),
//       visitorCardBack: formData.get("visitorCardBack"),
//     };

//     // Create the visitor card in your database
//     const newVisitorCard = await VisitorCard.create(visitorCardData);

//     // Build the API request body with updated destination and API key from .env
//     const apiBody = {
//       apiKey: process.env.API_KEY, // The API key from .env file
//       campaignName: "Convergence_F",
//       destination: formData.get("contactNumber"), // Use the contact number from the form
//       userName: "user",
//       templateParams: [],
//       media: {
//         url: "https://whatsapp-media-library.s3.ap-south-1.amazonaws.com/FILE/6600405a0dee457cf7835ca1/5841109_WibroBrochurecompressed.pdf",
//         filename: "Wibro Brochure"
//       }
//     };

//     // Call the external API using fetch
//     const apiResponse = await fetch("https://backend.api-wa.co/campaign/go2market/api", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify(apiBody)
//     });

//     // Optionally, process the response from the external API
//     const apiResponseData = await apiResponse.json();

//     return new Response(
//       JSON.stringify({
//         message: "Visitor Card Created and API called successfully",
//         visitorCard: newVisitorCard,
//         apiResponse: apiResponseData
//       }),
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Error creating visitor card or calling API:", error);
//     return new Response(
//       JSON.stringify({ error: "Failed to create visitor card or call API" }),
//       { status: 500 }
//     );
//   }
// }
