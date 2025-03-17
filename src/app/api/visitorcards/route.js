import dbConnect from "../../../lib/dbConnect";
import VisitorCard from "../../../models/VisitorCard";
import { promises as fs } from "fs";
import path from "path";
import { sendWhatsAppMessageDynamic } from "../../../../src/lib/sendWhatsAppMessageDynamic";
import User from "../../../models/User";
 
export async function POST(request) {
  await dbConnect();
  try {
    // Get the form data
    const formData = await request.formData();

    // Get visitor name and sanitize it
    const visitorName = formData.get("name") || "default";
    const sanitizedVisitorName = visitorName
      .toString()
      .replace(/[^a-zA-Z0-9]/g, "_")
      .toLowerCase();

    // Get assignTo and sanitize it
    const assignTo = formData.get("assignTo") || "default";
    const assignToFolder = assignTo.toString().replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();

    // Define the dynamic upload directory: uploads/<assignToFolder>
    const uploadDir = path.join(process.cwd(), "uploads", assignToFolder);
    await fs.mkdir(uploadDir, { recursive: true });

    // Process visitor card front image file
    let visitorCardFrontPath = "";
    const frontFile = formData.get("visitorCardFront");
    if (frontFile && typeof frontFile !== "string") {
      const fileBuffer = Buffer.from(await frontFile.arrayBuffer());
      const filename = `${Date.now()}-${frontFile.name}`;
      const filePath = path.join(uploadDir, filename);
      await fs.writeFile(filePath, fileBuffer);
      visitorCardFrontPath = `/api/uploads/${assignToFolder}/${filename}`;
    }

    // Process visitor card back image file
    let visitorCardBackPath = "";
    const backFile = formData.get("visitorCardBack");
    if (backFile && typeof backFile !== "string") {
      const fileBuffer = Buffer.from(await backFile.arrayBuffer());
      const filename = `${Date.now()}-${backFile.name}`;
      const filePath = path.join(uploadDir, filename);
      await fs.writeFile(filePath, fileBuffer);
      visitorCardBackPath = `/api/uploads/${assignToFolder}/${filename}`;
    }

    // Build visitor card data
    const visitorCardData = {
      name: formData.get("name"),
      sedulertime: new Date(formData.get("sedulertime")),
      contactNumber: formData.get("contactNumber"),
      note: formData.get("note"),
      assignTo: formData.get("assignTo"),
      visitorCardFront: visitorCardFrontPath,
      visitorCardBack: visitorCardBackPath,
    };

    const newVisitorCard = await VisitorCard.create(visitorCardData);

    // Only call external API if a valid contact number is provided
    const contactNumber = formData.get("contactNumber");
    const nameField = formData.get("name");

    let dynamicNumber = "9695215220"; // default number
    if (assignTo) {
      const user = await User.findOne({ userName: assignTo });
      if (user && user.mobile) {
        dynamicNumber = user.mobile;
      } else {
        console.log(
          `User not found or no mobile for assignTo ${assignTo}, using default number.`
        );
      }
    }

    // Send WhatsApp message asynchronously without delaying the response
    setTimeout(() => {
      sendWhatsAppMessageDynamic(nameField, contactNumber, dynamicNumber);
    }, 0);

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
 
// GET: Fetch all visitor cards
export async function GET(request) {
  await dbConnect();
  try {
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
 
// PATCH: Update a visitor card's field (supports updating multiple fields)
export async function PATCH(request) {
  await dbConnect();
  try {
   
    const body = await request.json();
    const { id } = body;
    if (!id) {
      return new Response(
        JSON.stringify({ error: "Invalid input" }),
        { status: 400 }
      );
    }
    let update = {};
    if (body.fields && typeof body.fields === "object") {
      update = body.fields;
    } else if (body.field) {
      update[body.field] = body.value;
    } else {
      return new Response(
        JSON.stringify({ error: "No fields provided" }),
        { status: 400 }
      );
    }
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
 
// DELETE: Delete a visitor card and remove associated images
export async function DELETE(request) {
  await dbConnect();
  try {
    const body = await request.json();
    const { id } = body;
    if (!id) {
      return new Response(
        JSON.stringify({ error: "Invalid input" }),
        { status: 400 }
      );
    }
    // Delete the visitor card document
    const deletedCard = await VisitorCard.findByIdAndDelete(id);
    if (!deletedCard) {
      return new Response(
        JSON.stringify({ error: "Visitor card not found" }),
        { status: 404 }
      );
    }
    
    // Delete images from the uploads folder if they exist
    if (deletedCard.visitorCardFront) {
      const frontFilePath = path.join(
        process.cwd(),
        deletedCard.visitorCardFront.replace("/api", "")
      );
      try {
        await fs.unlink(frontFilePath);
      } catch (err) {
        console.error("Error deleting front image file:", err);
      }
    }
    if (deletedCard.visitorCardBack) {
      const backFilePath = path.join(
        process.cwd(),
        deletedCard.visitorCardBack.replace("/api", "")
      );
      try {
        await fs.unlink(backFilePath);
      } catch (err) {
        console.error("Error deleting back image file:", err);
      }
    }
    
    return new Response(
      JSON.stringify({ message: "Visitor card deleted", visitorCard: deletedCard }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting visitor card:", error);
    return new Response(
      JSON.stringify({ error: "Failed to delete visitor card" }),
      { status: 500 }
    );
  }
}
