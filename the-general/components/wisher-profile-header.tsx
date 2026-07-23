import { MapPin, Phone } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollReveal } from "@/components/scroll-reveal";

export function WisherProfileHeader({
  displayName,
  profilePhotoUrl,
  bio,
  location,
  phone,
  action,
}: {
  displayName: string;
  profilePhotoUrl: string | null;
  bio: string | null;
  location: string | null;
  phone: string | null;
  action?: React.ReactNode;
}) {
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <ScrollReveal className="mb-14 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
        <div className="bezel-shell shrink-0">
          <Avatar className="bezel-core size-24">
            <AvatarImage src={profilePhotoUrl ?? undefined} alt={displayName} />
            <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
          </Avatar>
        </div>
        <div>
          <h1 className="font-heading text-3xl sm:text-4xl">{displayName}</h1>
          {bio && (
            <p className="mt-2 max-w-md text-muted-foreground">{bio}</p>
          )}
          {(location || phone) && (
            <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-muted-foreground sm:justify-start">
              {location && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-3.5" />
                  {location}
                </span>
              )}
              {phone && (
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="size-3.5" />
                  {phone}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      {action}
    </ScrollReveal>
  );
}
