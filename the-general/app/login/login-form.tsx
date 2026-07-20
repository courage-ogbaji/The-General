"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction, loginWithGoogleAction, type LoginState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({ googleEnabled }: { googleEnabled: boolean }) {
  const [state, formAction, isPending] = useActionState<LoginState, FormData>(
    loginAction,
    undefined
  );

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-4 py-12">
      <h1 className="font-heading text-3xl mb-2">Welcome back</h1>
      <p className="text-muted-foreground mb-8">Log in to leave your wish.</p>
      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required />
        </div>
        {state?.error && (
          <p className="text-sm text-destructive">{state.error}</p>
        )}
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Logging in…" : "Log in"}
        </Button>
      </form>
      {googleEnabled && (
        <>
          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" />
            or
            <div className="h-px flex-1 bg-border" />
          </div>
          <form action={loginWithGoogleAction}>
            <Button type="submit" variant="outline" className="w-full">
              Continue with Google
            </Button>
          </form>
        </>
      )}
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-primary underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
