import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { getCachedNotificationsByUserId } from "@/lib/redis";
import { markAllNotificationsRead, markNotificationRead } from "@/lib/queries/notification";

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const notifications = await getCachedNotificationsByUserId(session.user.id);

    return NextResponse.json({ notifications }, { status: 200 });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    
    if (body.action === "mark_all_read") {
      await markAllNotificationsRead(session.user.id);
      
      return NextResponse.json({ success: true }, { status: 200 });
    } else if (body.notificationId) {
      await markNotificationRead(session.user.id, body.notificationId);
        
      return NextResponse.json({ success: true }, { status: 200 });
    }
    
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error updating notifications:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
