import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import Redis from "ioredis";

const createSubscriber = () => new Redis(process.env.REDIS_URL!);

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const userId = session.user.id;
  const subscriber = createSubscriber();

  const stream = new ReadableStream({
    start(controller) {
      subscriber.subscribe(`notifications:${userId}`, (err) => {
        if (err) {
          console.error("Failed to subscribe to redis channel:", err);
          controller.error(err);
        }
      });

      subscriber.on("message", (channel, message) => {
        if (channel === `notifications:${userId}`) {
          controller.enqueue(new TextEncoder().encode(`data: ${message}\n\n`));
        }
      });

      controller.enqueue(new TextEncoder().encode(`: heartbeat\n\n`));
      
      const interval = setInterval(() => {
        try {
          controller.enqueue(new TextEncoder().encode(`: heartbeat\n\n`));
        } catch (e) {
          clearInterval(interval);
        }
      }, 30000);

      req.signal.addEventListener("abort", () => {
        clearInterval(interval);
        subscriber.quit();
      });
    },
    cancel() {
      subscriber.quit();
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
