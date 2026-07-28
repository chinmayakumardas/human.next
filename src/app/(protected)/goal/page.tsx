import { createClient } from "@/lib/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();


  // Protected route check
  if (!user) {
    redirect("/auth/login");
  }


  const name =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "User";


  return (
    <div className="flex min-h-screen flex-col gap-6 p-6">

      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome, {name} 👋
        </h1>

        <p className="text-muted-foreground mt-2">
          Your personal Life OS dashboard.
        </p>
      </div>


      <div className="grid gap-4 md:grid-cols-3">

        <div className="rounded-xl border bg-card p-5">
          <h2 className="text-sm text-muted-foreground">
            Goals
          </h2>

          <p className="mt-2 text-3xl font-bold">
            0
          </p>
        </div>


        <div className="rounded-xl border bg-card p-5">
          <h2 className="text-sm text-muted-foreground">
            Completed
          </h2>

          <p className="mt-2 text-3xl font-bold">
            0
          </p>
        </div>


        <div className="rounded-xl border bg-card p-5">
          <h2 className="text-sm text-muted-foreground">
            Streak
          </h2>

          <p className="mt-2 text-3xl font-bold">
            0 days
          </p>
        </div>

      </div>


      <div className="rounded-xl border p-6">

        <h2 className="text-xl font-semibold">
          Today
        </h2>

        <p className="mt-2 text-muted-foreground">
          Start by creating your first goal.
        </p>

      </div>


    </div>
  );
}