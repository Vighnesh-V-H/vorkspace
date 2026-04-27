"use client";

import { useState } from "react";

import {
  ChevronLeft,
  Check,
  Plus,
  Building2,
  ChevronDown,
  MessageSquare,
  Trash2,
} from "lucide-react";
import { SidebarOptions } from "@/components/sidebar/sidebar-option";
import { NavUser } from "@/components/nav-user";
import type * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { AppSidebarConfig } from "@/lib/types/sidebar";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { useOrganizationsQuery } from "@/lib/queries/client/organization";
import { InviteMemberDialog } from "../invitationform";
import {
  useChatSessionsQuery,
  useDeleteChatSession,
} from "@/lib/queries/client/chat";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

type OrganizationOption = {
  id: string;
  name: string;
};

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  config: AppSidebarConfig;
  name: string;
  currentOrgId?: string;
  organizations?: OrganizationOption[];
};

export function AppSidebar({
  config,
  name,
  currentOrgId,
  ...props
}: AppSidebarProps) {
  const { toggleSidebar, setOpen, open } = useSidebar();
  const router = useRouter();
  const pathName = usePathname();

  const [inviteOrgId, setInviteOrgId] = useState<string | null>(null);

  function handleSidebarClick(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    if (!open) {
      setOpen(true);
    }
  }

  const { data: organizations = [] } = useOrganizationsQuery();
  console.log("orgn\n", organizations);
  const hasOrganizations = organizations.length > 0;

  const selectedOrganization =
    organizations.find((org) => org.id === currentOrgId) ?? null;

  const selectedOrganizationName =
    selectedOrganization?.name || name || "Organization";

  const selectedInitial =
    selectedOrganizationName.charAt(0).toUpperCase() || "O";

  function handleOrganizationSelect(orgId: string) {
    if (!orgId || orgId === currentOrgId) return;
    router.push(`/organization/${orgId}`);
  }

  return (
    <>
      <Sidebar
        collapsible="icon"
        variant="floating"
        onClick={handleSidebarClick}
        className={cn(
          !open ? "cursor-e-resize" : "",
          "m-1 overflow-hidden rounded-2xl text-sidebar-foreground",
          "transition-all duration-300 ease-in-out",
          "shadow-sm",
        )}
        {...props}
      >
        <SidebarHeader className="pb-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "h-auto w-full justify-start gap-3 rounded-lg px-2 py-2",
                      "hover:bg-sidebar-accent",
                    )}
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-sidebar-accent shrink-0">
                      <span className="text-lg font-medium text-sidebar-foreground">
                        {selectedInitial}
                      </span>
                    </div>

                    <div className="min-w-0 text-left">
                      <p className="truncate text-sm font-semibold text-sidebar-foreground">
                        {selectedOrganizationName}
                      </p>
                      <p className="truncate text-xs text-sidebar-foreground/60">
                        Switch organization
                      </p>
                    </div>

                    <ChevronDown className="ml-auto h-4 w-4 shrink-0 text-sidebar-foreground/70" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="start"
                  side="bottom"
                  sideOffset={6}
                  className="w-72"
                >
                  <DropdownMenuLabel className="text-[11px] uppercase tracking-wide text-muted-foreground">
                    Organizations
                  </DropdownMenuLabel>
                  {hasOrganizations ? (
                    organizations.map((org) => {
                      const isActive = org.id === currentOrgId;
                      return (
                        <DropdownMenuItem
                          key={org.id}
                          onClick={() => handleOrganizationSelect(org.id)}
                          className="py-2 cursor-pointer"
                        >
                          <Building2 className="h-4 w-4" />
                          <span className="truncate flex-1">{org.name}</span>
                          <Button
                            variant={"secondary"}
                            className="hover:bg-[#111]"
                            onClick={(e) => {
                              e.stopPropagation();
                              setInviteOrgId(org.id);
                            }}
                          >
                            Invite members
                          </Button>
                          {isActive ? (
                            <Check className="h-4 w-4 text-primary" />
                          ) : null}
                        </DropdownMenuItem>
                      );
                    })
                  ) : (
                    <DropdownMenuItem disabled className="py-2">
                      <span className="text-muted-foreground">
                        No organizations found
                      </span>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem asChild className="py-2 cursor-pointer">
                    <Link href="/create-organization">
                      <Plus className="h-4 w-4" />
                      <span>Create organization</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="group-data-[collapsible=icon]:mx-auto">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className={cn(
                  "h-8 w-8 rounded-lg transition-all duration-200 ease-in-out hover:bg-sidebar-accent",
                  open ? "" : "rotate-180",
                )}
                aria-label="Toggle sidebar"
              >
                <ChevronLeft className="h-4 w-4 text-sidebar-foreground/90" />
              </Button>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="py-2 space-y-2">
          <SidebarOptions config={config} currentOrgId={currentOrgId} />
          {currentOrgId && (
            <ChatHistorySection orgId={currentOrgId} />
          )}
        </SidebarContent>

        <SidebarFooter className="mt-auto px-3 py-3 space-y-3">
          {pathName.split("/")[1] != "dashboard" ? (
            <Link href={"/dashboard"}>
              <Button className="w-full  dark-bg-[#181818] dark-text-white justify-start">
                Back to personal Space
              </Button>
            </Link>
          ) : (
            <></>
          )}

          <div className="flex items-center gap-3">
            <NavUser />
          </div>
        </SidebarFooter>
      </Sidebar>

      {/* Render dialog at root level, controlled by state */}
      {inviteOrgId && (
        <InviteMemberDialog
          open={!!inviteOrgId}
          onOpenChange={(open) => !open && setInviteOrgId(null)}
          organizationId={inviteOrgId}
        />
      )}
    </>
  );
}

function ChatHistorySection({ orgId }: { orgId: string }) {
  const { data: sessions = [] } = useChatSessionsQuery(orgId);
  const deleteSession = useDeleteChatSession(orgId);
  const pathname = usePathname();
  const recentSessions = sessions.slice(0, 10);

  if (recentSessions.length === 0) return null;

  return (
    <SidebarGroup className="mt-4 group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="text-[10px] font-medium text-sidebar-foreground/60 uppercase tracking-[0.12em] mb-2 px-3">
        Recent Chats
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="space-y-0.5">
          {recentSessions.map((s) => {
            const url = `/organization/${orgId}/chat/${s.id}`;
            const isActive = pathname === url;
            return (
              <SidebarMenuItem key={s.id}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className={cn(
                    "group/chat-item",
                    isActive &&
                      "bg-sidebar-accent text-sidebar-accent-foreground font-medium",
                  )}
                >
                  <Link href={url}>
                    <MessageSquare className="h-4 w-4 shrink-0" />
                    <span className="truncate flex-1 text-xs">
                      {s.title}
                    </span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        deleteSession.mutate(s.id);
                      }}
                      className="opacity-0 group-hover/chat-item:opacity-100 transition-opacity shrink-0 p-0.5 rounded hover:bg-destructive/10"
                    >
                      <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                    </button>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
