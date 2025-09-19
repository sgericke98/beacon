import Image from "next/image";
import type { HTMLAttributes } from "react";

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  initials?: string;
}

export function Avatar({ className = "", src, alt, initials = "" }: AvatarProps) {
  return (
    <div
      className={`relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-border bg-muted text-sm font-semibold ${className}`}
      aria-label={alt}
    >
      {src ? <Image src={src} alt={alt ?? ""} fill sizes="40px" className="object-cover" /> : initials || <span aria-hidden>?</span>}
    </div>
  );
}
