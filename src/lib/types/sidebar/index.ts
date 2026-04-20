import { LucideIcon } from "lucide-react";

export interface SidebarItem {
  title: string;
  url: string;
  icon: LucideIcon;
  badge?: string;
}
export interface SidebarSection {
  title: string;
  items: SidebarItem[];
}
