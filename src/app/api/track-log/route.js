import { NextResponse } from "next/server";
import dbConnect from "../../../lib/dbConnect";
import TrackLog from "../../../models/TrackLog";

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    console.log(body, "fghjkl");

    // Map incoming field names to expected ones:
    const vcid = body.vcid || body.cardId;
    const oldScheduledDate = body.oldScheduledDate || body.oldDate;
    const newScheduledDate = body.newScheduledDate || body.newDate;
    const reason = body.reason;
    const newtrack=body.track + 1;
    console.log(newtrack);

    // Validate required fields
    if (!oldScheduledDate || !newScheduledDate || !reason || !vcid) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const externalapidata = {
      id: vcid,
      fields: {
        sedulertime: newScheduledDate,
        whatsapp: false,
        track: newtrack
      },
    };

    // Send PATCH request to external API (/api/visitorcards) with externalapidata
    const externalRes = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/visitorcards`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(externalapidata),
    });

    // If the external API call fails, return an error and do not save the track log
    if (!externalRes.ok) {
      return NextResponse.json(
        { success: false, error: "External API failed" },
        { status: 500 }
      );
    }

    // Create and save new track log only if external API call was successful
    const newTrackLog = new TrackLog({
      track: body.track || null, // Optional track
      oldScheduledDate: new Date(oldScheduledDate),
      newScheduledDate: new Date(newScheduledDate),
      reason: reason,
      privateIp: body.privateIp || "Unknown",
      publicIp: body.publicIp || "Unknown",
      vcid: vcid, // Storing visitorCard _id
    });

    await newTrackLog.save();

    return NextResponse.json(
      { success: true, message: "Track log saved successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}


export async function GET(req) {
    console.log("ertyuikl");
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const vcid = searchParams.get("vcid");

    let trackLogs;
    if (vcid) {
      trackLogs = await TrackLog.find({ vcid }).sort({ createdAt: -1 });
    } else {
      trackLogs = await TrackLog.find({}).sort({ createdAt: -1 });
    }
    return NextResponse.json({ success: true, trackLogs }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
