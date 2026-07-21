"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
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
import { Sheet, SheetContent } from "@/components/ui/sheet";
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

function HamburgerToggle({
  open,
  onClick,
}: {
  open: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={open ? "Close menu" : "Open menu"}
      className="relative flex size-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-muted md:hidden"
    >
      <span className="relative flex h-3.5 w-4 flex-col justify-between">
        <span
          className={cn(
            "ease-fluid h-px w-full origin-center bg-foreground transition-transform duration-500",
            open && "translate-y-[6.5px] rotate-45"
          )}
        />
        <span
          className={cn(
            "ease-fluid h-px w-full bg-foreground transition-opacity duration-300",
            open && "opacity-0"
          )}
        />
        <span
          className={cn(
            "ease-fluid h-px w-full origin-center bg-foreground transition-transform duration-500",
            open && "-translate-y-[6.5px] -rotate-45"
          )}
        />
      </span>
    </button>
  );
}

export function SiteHeader({ user }: { user: NavUser }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const initials = user?.displayName
    ?.split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const allLinks =
    user?.role === "CELEBRANT"
      ? [...navLinks, { href: "/dashboard", label: "Dashboard" }]
      : navLinks;

  return (
    <div className="sticky top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
      <header className="from-jewel-rose/8 via-background/85 to-jewel-gold/8 mx-auto flex h-14 max-w-6xl items-center justify-between rounded-full border border-border/50 bg-gradient-to-r px-4 shadow-lg shadow-black/[0.04] backdrop-blur-xl sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-heading text-lg text-primary"
        >
          <Heart className="size-4.5 fill-primary text-primary" />
          The General
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {allLinks.map((link) => (
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

        <HamburgerToggle open={open} onClick={() => setOpen((o) => !o)} />

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent
            side="right"
            showCloseButton={false}
            className="bg-background/95 h-full w-full border-l-0 sm:max-w-none"
          >
            <AnimatePresence>
              {open && (
                <nav className="flex h-full flex-col justify-center gap-2 px-8">
                  {allLinks.map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, y: 48 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.6,
                        delay: 0.08 + index * 0.05,
                        ease: [0.32, 0.72, 0, 1],
                      }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "font-heading block text-3xl text-muted-foreground transition-colors",
                          pathname === link.href && "text-foreground"
                        )}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}

                  <motion.div
                    initial={{ opacity: 0, y: 48 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.08 + allLinks.length * 0.05,
                      ease: [0.32, 0.72, 0, 1],
                    }}
                    className="mt-6 flex flex-col gap-3"
                  >
                    <Button
                      render={<Link href="/wishes/new" />}
                      nativeButton={false}
                      size="lg"
                      onClick={() => setOpen(false)}
                    >
                      Post a wish
                    </Button>
                    {user ? (
                      <>
                        <Link
                          href="/profile"
                          onClick={() => setOpen(false)}
                          className="text-sm font-medium text-muted-foreground hover:text-foreground"
                        >
                          Profile
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            setOpen(false);
                            logoutAction();
                          }}
                          className="text-left text-sm font-medium text-muted-foreground hover:text-foreground"
                        >
                          Log out
                        </button>
                      </>
                    ) : (
                      <div className="flex gap-3">
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
                  </motion.div>
                </nav>
              )}
            </AnimatePresence>
          </SheetContent>
        </Sheet>
      </header>
    </div>
  );
}
