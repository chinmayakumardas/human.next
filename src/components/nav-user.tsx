"use client";

import { useEffect, useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import {
  ChevronsUpDownIcon,
  SparklesIcon,
  BadgeCheckIcon,
  CreditCardIcon,
  BellIcon,
  LogOutIcon,
} from "lucide-react";

import { createClient } from "@/lib/client";
import { useRouter } from "next/navigation";
import { useEffect as useSupabaseEffect } from "react";
import { toast } from "sonner";


export function NavUser() {

  const { isMobile } = useSidebar();
  const router = useRouter();

  const supabase = createClient();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);



  useEffect(() => {

    async function getUser() {

      const {
        data: { user },
      } = await supabase.auth.getUser();


      setUser(user);
      setLoading(false);

    }


    getUser();


    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );


    return () => {
      subscription.unsubscribe();
    };


  }, [supabase]);



  const handleLogout = async () => {

    try {

      await supabase.auth.signOut();

      toast.success("Logged out successfully");

      router.push("/auth/login");
      router.refresh();


    } catch (error) {

      toast.error("Failed to log out");

      console.error(error);

    }

  };



  if (loading || !user) {
    return null;
  }



  const displayName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "User";


  const email = user.email || "";


  const photoURL =
    user.user_metadata?.avatar_url || "";



  return (
    <SidebarMenu>
      <SidebarMenuItem>

        <DropdownMenu>

          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="aria-expanded:bg-muted"
              />
            }
          >

            <Avatar className="h-8 w-8">

              <AvatarImage
                src={photoURL}
                alt={displayName}
              />

              <AvatarFallback>
                {displayName.slice(0,2).toUpperCase()}
              </AvatarFallback>

            </Avatar>


            <div className="grid flex-1 text-left text-sm leading-tight">

              <span className="truncate font-medium">
                {displayName}
              </span>

              <span className="truncate text-xs text-muted-foreground">
                {email}
              </span>

            </div>


            <ChevronsUpDownIcon className="ml-auto size-4" />


          </DropdownMenuTrigger>



          <DropdownMenuContent
            className="w-fit"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >

            <DropdownMenuGroup>

              <DropdownMenuLabel className="p-0 font-normal">

                <div className="flex items-center gap-2 px-1 py-1.5">

                  <Avatar className="h-9 w-9">

                    <AvatarImage src={photoURL}/>

                    <AvatarFallback>
                      {displayName.slice(0,2).toUpperCase()}
                    </AvatarFallback>

                  </Avatar>


                  <div className="grid text-sm">

                    <span className="font-medium">
                      {displayName}
                    </span>

                    <span className="text-xs text-muted-foreground">
                      {email}
                    </span>

                  </div>

                </div>

              </DropdownMenuLabel>

            </DropdownMenuGroup>



            <DropdownMenuSeparator />


            <DropdownMenuItem>
              <SparklesIcon className="mr-2 h-4 w-4"/>
              Upgrade to Pro
            </DropdownMenuItem>



            <DropdownMenuSeparator />


            <DropdownMenuItem>
              <BadgeCheckIcon className="mr-2 h-4 w-4"/>
              Account
            </DropdownMenuItem>


            <DropdownMenuItem>
              <CreditCardIcon className="mr-2 h-4 w-4"/>
              Billing
            </DropdownMenuItem>


            <DropdownMenuItem>
              <BellIcon className="mr-2 h-4 w-4"/>
              Notifications
            </DropdownMenuItem>



            <DropdownMenuSeparator />


            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-600 cursor-pointer"
            >

              <LogOutIcon className="mr-2 h-4 w-4"/>

              Log out

            </DropdownMenuItem>


          </DropdownMenuContent>

        </DropdownMenu>

      </SidebarMenuItem>
    </SidebarMenu>
  );
}