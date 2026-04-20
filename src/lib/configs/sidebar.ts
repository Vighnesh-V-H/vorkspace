import { SidebarSection } from "../types/sidebar";
import {
  CheckSquare2,
  File,
  FileText,
  LayoutDashboard,
  LogOut,
  Settings,
  TextSelect,
} from "lucide-react";

export const sidebarConfig: SidebarSection[] = [
  {
    title: "MENU",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Tests",
        url: "/tests",
        icon: TextSelect,
      },
      {
        title: "Files",
        url: "/files",
        icon: File,
      },
      {
        title: "Tasks",
        url: "/tasks",
        icon: CheckSquare2,
        badge: "24",
      },
      {
        title: "Reports",
        url: "/reports",
        icon: FileText,
      },
    ],
  },
];
