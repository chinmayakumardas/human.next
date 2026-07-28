import { NextResponse } from "next/server";

// Reserved for route protection when authentication is introduced in Sprint 3.
export function proxy() {
  return NextResponse.next();
}
