"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/client";

import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";


interface AppShellProps {
  children: ReactNode;
}


export default function AppShell({ children }: AppShellProps) {

  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);


  // Challenge Timer
  const startDate = new Date("2026-07-23T00:00:00");

  const endDate = useMemo(() => {
    const end = new Date(startDate);
    end.setDate(end.getDate() + 70);
    return end;
  }, []);


  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
  });



  // Supabase Auth Protection
  useEffect(() => {

    async function checkUser() {

      const {
        data: { user },
      } = await supabase.auth.getUser();


      if (!user) {
        router.replace("/auth/login");
        return;
      }


      setLoading(false);
    }


    checkUser();

  }, [router, supabase]);




  // Countdown Timer
  useEffect(() => {

    const interval = setInterval(() => {

      const distance = endDate.getTime() - new Date().getTime();


      if (distance <= 0) {

        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
        });

        clearInterval(interval);
        return;
      }


      const days = Math.floor(
        distance / (1000 * 60 * 60 * 24)
      );


      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) /
        (1000 * 60 * 60)
      );


      const minutes = Math.floor(
        (distance % (1000 * 60 * 60)) /
        (1000 * 60)
      );


      setTimeLeft({
        days,
        hours,
        minutes,
      });


    }, 1000);


    return () => clearInterval(interval);


  }, [endDate]);







  return (

    <SidebarProvider>

      <AppSidebar />


      <SidebarInset>

        <header className="flex h-14 shrink-0 items-center border-b bg-background">

          <div className="flex items-center justify-between w-full px-4">


            <div className="flex items-center gap-2">

              <SidebarTrigger className="-ml-1" />

              <Separator
                orientation="vertical"
                className="mr-2 data-vertical:h-4"
              />


              <div className="text-sm font-medium">
                70-Day Challenge{" "}
                {startDate.toLocaleDateString()} -{" "}
                {endDate.toLocaleDateString()}
              </div>

            </div>



            <div className="flex items-center gap-3 font-mono text-sm">


              <div>
                <span className="font-semibold tabular-nums">
                  {timeLeft.days}
                </span>
                <span className="text-xs text-muted-foreground ml-1">
                  d
                </span>
              </div>


              <span>:</span>


              <div>
                <span className="font-semibold tabular-nums">
                  {String(timeLeft.hours).padStart(2,"0")}
                </span>

                <span className="text-xs text-muted-foreground ml-1">
                  h
                </span>
              </div>


              <span>:</span>


              <div>
                <span className="font-semibold tabular-nums">
                  {String(timeLeft.minutes).padStart(2,"0")}
                </span>

                <span className="text-xs text-muted-foreground ml-1">
                  m
                </span>
              </div>


            </div>


          </div>

        </header>



        <main className="flex flex-1 flex-col gap-4 p-4 pt-0 rounded-xl">
          {children}
        </main>


      </SidebarInset>


    </SidebarProvider>

  );
}