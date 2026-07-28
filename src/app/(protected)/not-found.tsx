import Link from "next/link";
import { HomeIcon, SearchXIcon } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-6 text-center">

      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <SearchXIcon className="h-10 w-10 text-muted-foreground" />
      </div>


      <div className="space-y-2">

        <h1 className="text-5xl font-bold">
          404
        </h1>

        <h2 className="text-2xl font-semibold">
          Page Not Found
        </h2>

        <p className="max-w-md text-muted-foreground">
          The page you are looking for does not exist or has been moved.
        </p>

      </div>




    </div>
  );
}