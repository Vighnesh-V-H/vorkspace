import { AppSidebarConfig } from "../types/sidebar";
import {
  Building2Icon,
  CheckSquare2,
  FileText,
  LayoutDashboard,
  TicketCheck,
} from "lucide-react";

export const sidebarConfigPersonal: AppSidebarConfig = {
  sections: [
    {
      title: "MENU",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "Organizations",
          url: "/organizations",
          icon: Building2Icon,
        },
        {
          title: "Tickets",
          url: "/tickets",
          icon: TicketCheck,
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
  ],
};

export const sidebarConfigOrg: AppSidebarConfig = {
  sections: [
    {
      title: "MENU",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "Organizations",
          url: "/organizations",
          icon: Building2Icon,
        },
        {
          title: "Tickets",
          url: "/tickets",
          icon: TicketCheck,
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
  ],
};
