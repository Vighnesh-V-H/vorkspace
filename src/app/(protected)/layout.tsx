"use client";

import { usePathname } from "next/navigation";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/sidebar";
import { Separator } from "@/components/ui/separator";
import { sidebarConfigPersonal } from "@/lib/configs/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { Bell } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Notification } from "@/db/schema/notification";

type ProtectedLayoutProps = {
  children: React.ReactNode;
};

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const pathname = usePathname();

  const routeName = pathname.split("/")[1];

  const { data } = useQuery<{ notifications: Notification[] }>({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await fetch("/api/notifications");
      if (!res.ok) throw new Error("Failed to fetch notifications");
      return res.json();
    },
  });

  const unreadCount = data?.notifications?.filter((n) => !n.isRead).length || 0;

  return (
    <TooltipProvider>
      <div className="h-screen flex overflow-hidden">
        <SidebarProvider>
          <AppSidebar name="vorkspace" config={sidebarConfigPersonal} />

          <SidebarInset className="flex flex-col w-full">
            <header className="flex h-16 bg-[#1e1e1e4e] shrink-0 border-b border-border/40 justify-between items-center gap-2 px-4">
              <div className="flex items-center gap-2 px-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarTrigger className="-ml-1 md:hidden" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Toggle sidebar</p>
                  </TooltipContent>
                </Tooltip>

                <Separator
                  orientation="vertical"
                  className="mr-2 bg-border h-4"
                />

                <h1 className="text-lg font-semibold">{routeName}</h1>
              </div>
              <Link href={"/notifications"} className="relative mr-4">
                <Bell />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Link>
            </header>

            <main className="flex-1 overflow-auto p-6 dark:bg-background">
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </TooltipProvider>
  );
}
