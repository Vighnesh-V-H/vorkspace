import { ChevronLeft, Crown } from "lucide-react";
import { SidebarOptions } from "@/components/sidebar/sidebar-option";
import { NavUser } from "@/components/nav-user";
import type * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { toggleSidebar, setOpen, open } = useSidebar();

  function handleSidebarClick(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    if (!open) {
      setOpen(true);
    }
  }

  return (
    <Sidebar
      collapsible="icon"
      variant="floating"
      onClick={handleSidebarClick}
      className={cn(
        !open ? "cursor-e-resize" : "",
        "overflow-hidden m-1 rounded-2xl border border-white/6 bg-black text-white",
        "transition-all duration-300 ease-in-out",
        "shadow-[0_10px_30px_rgba(0,0,0,.6)]",
      )}
      {...props}
    >
      <SidebarHeader className=" pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-white/5">
              <svg
                className="h-5 w-5 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M3 12h18"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="font-semibold text-lg group-data-[collapsible=icon]:hidden text-white transition-opacity duration-200 ease-in-out">
              VorkSpace
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className={cn(
              "h-8 w-8 rounded-lg transition-all duration-200 ease-in-out hover:bg-white/6",
              open ? "" : "rotate-180",
            )}
          >
            <ChevronLeft className="h-4 w-4 text-white/90" />
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent className="py-2 space-y-2">
        <SidebarOptions />
      </SidebarContent>

      <SidebarFooter className="mt-auto px-3 py-3 space-y-3">
        <Button>
          <Crown className="mr-2 h-4 w-4" />
          Upgrade to Pro
        </Button>

        <div className="flex items-center gap-3">
          <NavUser />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
