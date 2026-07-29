"use client"

import * as React from "react"
import {
  HeartPulseIcon,
  WalletIcon,
  BrainIcon,

} from "lucide-react";
import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { GalleryVerticalEndIcon, FrameIcon, PieChartIcon, MapIcon } from "lucide-react"

// This is sample data.
const data = {

  teams: [
    {
      name: "Human.Next",
      logo: (
        <GalleryVerticalEndIcon
        />
      ),
      plan: "Local",
    },
  
  ],
navMain: [
  {
    title: "Mind",
    url: "/mind",
    icon: <BrainIcon />,
    items: [
      { title: "Dashboard", url: "/mind" },
      { title: "Books", url: "/mind/books" },
      { title: "Habits", url: "/mind/habits" },
    ],
  },
 
  {
    title: "Money",
    url: "/wealth",
    icon: <WalletIcon />,
    items: [
      { title: "Dashboard", url: "/wealth" },
      { title: "Income", url: "/wealth/income" },
      { title: "Expenses", url: "/wealth/expenses" },
      { title: "Budget", url: "/wealth/budget" },
      { title: "Loans & EMI", url: "/wealth/loans" },
      
    ],
  },

 {
    title: "Muscles",
    url: "/health",
    icon: <HeartPulseIcon />,
    items: [
      { title: "Dashboard", url: "/health" },
      { title: "Exercise", url: "/health/exercise" },
      { title: "Diet & Nutrition", url: "/health/diet" },
     
    ],
  },
],
  single: [
    {
      name: "Calendar",
      url: "/calendar",
      icon: (
        <FrameIcon
        />
      ),
    },
    {
      name: "goals",
      url: "/goal",
      icon: (
        <PieChartIcon
        />
      ),
    },
    // {
    //   name: "Travel",
    //   url: "#",
    //   icon: (
    //     <MapIcon
    //     />
    //   ),
    // },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.single} />
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
