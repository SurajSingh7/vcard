import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { v4 as uuidv4 } from "uuid";
import dbConnect from "../../../../lib/dbConnect";
import QrScanData from "../../../../models/QrCodeScan"; 


export async function POST(req) {
    await dbConnect();

    try {
        const { location } = await req.json();
        if (!location) {
            return NextResponse.json({ success: false, error: "Location is required" }, { status: 400 });
        }

        const qrId = uuidv4();
        const frontendUrl = "https://vcards.gtel.in";

        if (!frontendUrl) {
            console.error("FRONTEND_URL is not defined in .env");
            return NextResponse.json({ success: false, error: "Server configuration error" }, { status: 500 });
        }

        const url = `${frontendUrl}/convergence-form?qrId=${qrId}`;
        const qrDataUrl = await QRCode.toDataURL(url);

        await QrScanData.create({ qrId, location, qrDataUrl });

        return NextResponse.json({ success: true, qrId, qrDataUrl });
    } catch (error) {
        console.error("Error generating QR code:", error);
        return NextResponse.json({ success: false, message: "An error occurred", error: error.message }, { status: 500 });
    }
}
