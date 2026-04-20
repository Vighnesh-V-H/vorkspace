"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";

import { Bell } from "lucide-react";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { sidebarConfig } from "@/lib/configs/sidebar";

type ProtectedLayoutProps = {
  children: React.ReactNode;
};

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const pathname = usePathname();

  const currentRoute = useMemo(() => {
    return sidebarConfig
      .flatMap((section) => section.items)
      .find(
        (item) => pathname === item.url || pathname.startsWith(item.url + "/"),
      );
  }, [pathname]);

  const routeName = currentRoute?.title || "Dashboard";

  return (
    <TooltipProvider>
      <div className="h-screen flex overflow-hidden">
        <SidebarProvider>
          <AppSidebar />

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
