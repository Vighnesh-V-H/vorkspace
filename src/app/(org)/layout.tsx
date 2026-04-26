"use client";

import { usePathname, useParams, useRouter } from "next/navigation";
import type React from "react";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/sidebar";
import { Separator } from "@/components/ui/separator";
import { sidebarConfigOrg } from "@/lib/configs/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  useOrganizationByIdQuery,
  useOrganizationsQuery,
} from "@/lib/queries/client/organization";

type ProtectedLayoutProps = {
  children: React.ReactNode;
};

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const pathname = usePathname();
  const params = useParams();
  const orgId = params?.id as string;

  const router = useRouter();

  if (!orgId) {
    router.push("/dashboard");
  }

  const { data: organizations = [] } = useOrganizationsQuery();
  const { data: organization } = useOrganizationByIdQuery(orgId, {
    enabled: Boolean(orgId),
  });

  const orgName =
    organization?.name ||
    organizations.find((org) => org.id === orgId)?.name ||
    "";

  const routeName = pathname.split("/")[1];
  const displayName = routeName;

  return (
    <TooltipProvider>
      <div className="h-screen flex overflow-hidden">
        <SidebarProvider>
          <AppSidebar
            config={sidebarConfigOrg}
            name={orgName}
            currentOrgId={orgId}
          />

          <SidebarInset className="flex flex-col w-full">
            <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border/40 bg-background/60 px-4 backdrop-blur-sm">
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

                <h1 className="text-lg font-semibold">{displayName}</h1>
              </div>
            </header>

            <main className="flex-1 overflow-auto bg-background p-6">
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </TooltipProvider>
  );
}
