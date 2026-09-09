import { FacebookIcon, InstagramIcon, LinkedinIcon, WhatsappIcon } from "@/components/icons/social-icons"

const REDES = [
  { label: "Facebook", href: "https://facebook.com", Icon: FacebookIcon },
  { label: "Instagram", href: "https://instagram.com", Icon: InstagramIcon },
  { label: "LinkedIn", href: "https://linkedin.com", Icon: LinkedinIcon },
  { label: "WhatsApp", href: "https://wa.me/", Icon: WhatsappIcon },
]

export function Redes() {
  return (
    <div className="flex items-center gap-3">
      {REDES.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="flex size-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
        >
          <Icon className="size-4" />
        </a>
      ))}
    </div>
  )
}
