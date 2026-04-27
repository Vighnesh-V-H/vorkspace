import { inviteMemberSchema } from "@/lib/zod/tools/invite";
import { tool } from "ai";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const inviteMemberTool = tool({
  description: "Invite a user to an organization by email",

  inputSchema: inviteMemberSchema,

  execute: async ({ organizationId, email, role }) => {
    const res = await fetch(
      `${BASE_URL}/api/organization/${organizationId}/invite`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, role }),
      },
    );

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to send invite");
    }

    return await res.json();
  },
});
