import { LucideIcon } from "lucide-react";

export type SidebarIconName =
  | "layoutDashboard"
  | "building2"
  | "ticketCheck"
  | "messageSquare"
  | "checkSquare2"
  | "fileText";

export interface SidebarItem {
  title: string;
  url: string;
  icon: LucideIcon;
  badge?: string;
}

export interface SidebarSerializedItem {
  title: string;
  url: string;
  icon: SidebarIconName;
  badge?: string;
}

export interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

export interface SidebarSerializedSection {
  title: string;
  items: SidebarSerializedItem[];
}

export interface AppSidebarConfig {
  sections: SidebarSection[];
}

export interface SerializedSidebarConfig {
  heading: string;
  sections: SidebarSerializedSection[];
}
