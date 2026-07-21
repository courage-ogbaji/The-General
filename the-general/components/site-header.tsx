"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Heart } from "lucide-react";
import { logoutAction } from "@/app/logout/actions";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type NavUser = {
  displayName: string;
  profilePhotoUrl: string | null;
  role: "WISHER" | "CELEBRANT";
} | null;

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/biography", label: "Her Story" },
  { href: "/achievements", label: "Achievements" },
  { href: "/gallery", label: "Gallery" },
  { href: "/wishes", label: "Wishes" },
  { href: "/gift", label: "Gift" },
];

export function SiteHeader({ user }: { user: NavUser }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const initials = user?.displayName
    ?.split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="from-jewel-rose/8 via-background/90 to-jewel-gold/8 sticky top-0 z-50 border-b border-border/60 bg-gradient-to-r backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-heading text-xl text-primary"
        >
          <Heart className="size-5 fill-primary text-primary" />
          The General
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                pathname === link.href && "text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
          {user?.role === "CELEBRANT" && (
            <Link
              href="/dashboard"
              className={cn(
                "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                pathname === "/dashboard" && "text-foreground"
              )}
            >
              Dashboard
            </Link>
          )}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button render={<Link href="/wishes/new" />} nativeButton={false} size="sm">
            Post a wish
          </Button>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button className="rounded-full ring-offset-2 transition hover:ring-2 hover:ring-ring" />
                }
              >
                <Avatar>
                  <AvatarImage
                    src={user.profilePhotoUrl ?? undefined}
                    alt={user.displayName}
                  />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem render={<Link href="/profile" />}>
                  Profile
                </DropdownMenuItem>
                {user.role === "CELEBRANT" && (
                  <DropdownMenuItem render={<Link href="/dashboard" />}>
                    Dashboard
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logoutAction()}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                render={<Link href="/login" />}
                nativeButton={false}
                variant="ghost"
                size="sm"
              >
                Log in
              </Button>
              <Button
                render={<Link href="/signup" />}
                nativeButton={false}
                variant="outline"
                size="sm"
              >
                Sign up
              </Button>
            </>
          )}
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open menu"
              />
            }
          >
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetHeader>
              <SheetTitle className="font-heading text-lg">
                The General
              </SheetTitle>
            </SheetHeader>
            <nav className="mt-4 flex flex-col gap-1 px-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                    pathname === link.href && "bg-muted text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              {user?.role === "CELEBRANT" && (
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  Dashboard
                </Link>
              )}
              <div className="my-2 h-px bg-border" />
              <Button
                render={<Link href="/wishes/new" />}
                nativeButton={false}
                onClick={() => setOpen(false)}
              >
                Post a wish
              </Button>
              {user ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setOpen(false)}
                    className="mt-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    Profile
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      logoutAction();
                    }}
                    className="mt-1 w-full rounded-md px-3 py-2 text-left text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <div className="mt-2 flex gap-2">
                  <Button
                    render={<Link href="/login" />}
                    nativeButton={false}
                    variant="outline"
                    className="flex-1"
                    onClick={() => setOpen(false)}
                  >
                    Log in
                  </Button>
                  <Button
                    render={<Link href="/signup" />}
                    nativeButton={false}
                    className="flex-1"
                    onClick={() => setOpen(false)}
                  >
                    Sign up
                  </Button>
                </div>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
