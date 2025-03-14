// app/api/visitor/route.js (or similar location)
import { NextResponse } from "next/server";
import VisitorCard from "../../../../models/VisitorCard";
import dbConnect from "../../../../lib/dbConnect";
import { sendWhatsAppMessageStatic } from "../../../../lib/sendWhatsAppMessageStatic";

export async function POST(req) {
  await dbConnect();

  try {
    const { name, mobileNumber } = await req.json();
    console.log(name, mobileNumber, "s34567");
    const assignTo = "qrAdmin";

    if (!name || !mobileNumber) {
      return NextResponse.json(
        { success: false, message: "Please provide name and WhatsApp" },
        { status: 400 }
      );
    }

    const newForm = new VisitorCard({ name, qrmobile: mobileNumber, assignTo });
    await newForm.save();

    // Send WhatsApp message asynchronously without delaying the response
    setTimeout(() => {
      sendWhatsAppMessageStatic(name, mobileNumber);
    }, 0);

    const pdfPath = "/public/wibro-convergence-brochure.pdf";
    return NextResponse.json({
      success: true,
      message: "Form submitted successfully",
      pdfUrl: pdfPath,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred" },
      { status: 500 }
    );
  }
}





















// import { NextResponse } from "next/server";
// import VisitorCard from "../../../../models/VisitorCard";
// import dbConnect from "../../../../lib/dbConnect";

// export async function POST(req) {
     
//     await dbConnect();

//     try {
      
//         const { name, mobileNumber } = await req.json();
//         console.log( name, mobileNumber,"s34567")
//         const assignTo="qrAdmin"

//         if (!name || !mobileNumber) {
//             return NextResponse.json({ success: false, message: "Please provide name and WhatsApp" }, { status: 400 });
//         }

//         const newForm = new VisitorCard({ name : name, qrmobile : mobileNumber,assignTo });
//         await newForm.save();

//         const pdfPath = "/public/wibro-convergence-brochure.pdf";
//         return NextResponse.json({ success: true, message: "Form submitted successfully", pdfUrl: pdfPath });
//     } catch (error) {
//         console.error("Error:", error);
//         return NextResponse.json({ success: false, error: "An error occurred" }, { status: 500 });
//     }
// }
