"use client"

import * as React from "react"
import {
  HeartPulseIcon,
  WalletIcon,
  BrainIcon,
  BriefcaseBusinessIcon,
  UserIcon,
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
    title: "Health",
    url: "/health",
    icon: <HeartPulseIcon />,
    items: [
      { title: "Dashboard", url: "/health" },
      { title: "Fitness", url: "/health/fitness" },
      { title: "Diet & Nutrition", url: "/health/diet" },
      { title: "Sleep", url: "/health/sleep" },
      { title: "Medical Records", url: "/health/medical" },
      { title: "Medications", url: "/health/medications" },
      { title: "Appointments", url: "/health/appointments" },
    ],
  },
  {
    title: "Wealth",
    url: "/wealth",
    icon: <WalletIcon />,
    items: [
      { title: "Dashboard", url: "/wealth" },
      { title: "Income", url: "/wealth/income" },
      { title: "Expenses", url: "/wealth/expenses" },
      { title: "Budget", url: "/wealth/budget" },
      { title: "Savings", url: "/wealth/savings" },
      { title: "Investments", url: "/wealth/investments" },
      { title: "Loans & EMI", url: "/wealth/loans" },
      { title: "Taxes", url: "/wealth/taxes" },
    ],
  },
  {
    title: "Mental",
    url: "/mental",
    icon: <BrainIcon />,
    items: [
      { title: "Dashboard", url: "/mental" },
      { title: "Journal", url: "/mental/journal" },
      { title: "Mood Tracker", url: "/mental/mood" },
      { title: "Meditation", url: "/mental/meditation" },
      { title: "Books", url: "/mental/books" },
      { title: "Learning", url: "/mental/learning" },
      { title: "Habits", url: "/mental/habits" },
    ],
  },
  {
    title: "Career",
    url: "/career",
    icon: <BriefcaseBusinessIcon />,
    items: [
      { title: "Dashboard", url: "/career" },
      { title: "Projects", url: "/career/projects" },
      { title: "Goals", url: "/career/goals" },
      { title: "Skills", url: "/career/skills" },
      { title: "Resume", url: "/career/resume" },
      { title: "Job Applications", url: "/career/jobs" },
    ],
  },
  {
    title: "Personal",
    url: "/personal",
    icon: <UserIcon />,
    items: [
      { title: "Goals", url: "/personal/goals" },
      { title: "Daily Planner", url: "/personal/planner" },
      { title: "Calendar", url: "/personal/calendar" },
      { title: "Notes", url: "/personal/notes" },
      { title: "Documents", url: "/personal/documents" },
    ],
  },
],
  projects: [
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
    {
      name: "Travel",
      url: "#",
      icon: (
        <MapIcon
        />
      ),
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
