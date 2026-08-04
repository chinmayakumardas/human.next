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