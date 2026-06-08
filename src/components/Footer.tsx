import { Instagram, Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-12 border-t border-border bg-card/40">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:justify-between">
          <div className="flex items-start gap-3">
            <a
              href="https://www.instagram.com/autoendri.al/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="grid h-11 w-11 place-items-center rounded-full bg-secondary text-foreground transition hover:bg-primary hover:text-primary-foreground"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=100092035143966"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="grid h-11 w-11 place-items-center rounded-full bg-secondary text-foreground transition hover:bg-primary hover:text-primary-foreground"
            >
              <Facebook className="h-5 w-5" />
            </a>
          </div>

          <div className="text-sm leading-relaxed sm:text-right">
            <p className="font-bold text-foreground">Autoendri.al</p>
            <p className="text-muted-foreground">
              Shërbime Online për individë dhe tregëtarë.
            </p>
            <p className="text-muted-foreground">Tiranë, Shqipëria — Albania</p>
            <p className="mt-1">
              <a href="tel:+355684349039" className="text-foreground hover:text-primary">
                +355 68 434 9039
              </a>{" "}
              |{" "}
              <a href="mailto:auto.endri10@gmail.com" className="text-foreground hover:text-primary">
                auto.endri10@gmail.com
              </a>
            </p>
          </div>
        </div>

        <p className="mt-6 border-t border-border pt-4 text-center text-xs text-muted-foreground">
          © 2026 Autoendri.al. Të gjitha të drejtat janë rezervuara.
        </p>
      </div>
    </footer>
  );
}