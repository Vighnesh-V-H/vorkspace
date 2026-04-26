import { cn } from "@/lib/utils";
import type { AppSidebarConfig } from "@/lib/types/sidebar";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarOptionsProps = {
  config: AppSidebarConfig;
  currentOrgId?: string;
};

export function SidebarOptions({ config, currentOrgId }: SidebarOptionsProps) {
  const pathname = usePathname();

  function resolveUrl(url: string) {
    if (currentOrgId) {
      return url.replace(":orgId", currentOrgId);
    }
    return url;
  }

  return (
    <>
      {config.sections.map((section, index) => (
        <SidebarGroup
          key={section.title}
          className={cn("space-y-2", index > 0 && "mt-8")}
        >
          <SidebarGroupLabel className="text-[10px] font-medium text-sidebar-foreground/60 uppercase tracking-[0.12em] mb-2 px-3 group-data-[collapsible=icon]:hidden">
            {section.title}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {section.items.map((item) => {
                const resolvedUrl = resolveUrl(item.url);
                const isActive =
                  resolvedUrl === "/"
                    ? pathname === "/"
                    : pathname === resolvedUrl ||
                      pathname.startsWith(`${resolvedUrl}/`);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={isActive}
                      className={cn(
                        isActive &&
                          "bg-sidebar-accent text-sidebar-accent-foreground font-medium",
                      )}
                    >
                      <Link href={resolvedUrl}>
                        <item.icon className="h-5 w-5 shrink-0" />
                        <span className="group-data-[collapsible=icon]:hidden">
                          {item.title}
                        </span>
                        {item.badge && (
                          <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
}
