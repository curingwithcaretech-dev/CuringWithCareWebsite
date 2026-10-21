import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import Button from "./Button";
import Icon from "./Icon";
import { navItems, site } from "../site";

const socials = [
  { label: "Instagram", href: site.instagram, icon: "instagram" },
  { label: "LinkedIn", href: site.linkedin, icon: "linkedin" },
  { label: "Facebook", href: site.facebook, icon: "facebook" },
];

/** Two bars that turn into an X. */
function MenuIcon({ open }) {
  const bar = "absolute left-0 h-[2px] w-[22px] rounded-full bg-current transition-transform duration-300 ease-[var(--ease-soft)]";
  return (
    <span aria-hidden="true" className="relative block h-[14px] w-[22px]">
      <span className={`${bar} top-[2px] ${open ? "translate-y-[4px] rotate-45" : ""}`} />
      <span className={`${bar} bottom-[2px] ${open ? "-translate-y-[4px] -rotate-45" : ""}`} />
    </span>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const panelRef = useRef(null);
  const toggleRef = useRef(null);
  const openedByKeyboard = useRef(false);

  // Shadow once the page has scrolled.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    const frame = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Close the menu on navigation, and when the window grows to the desktop layout.
  useEffect(() => {
    const close = () => setOpen(false);
    router.events.on("routeChangeStart", close);
    const desktop = window.matchMedia("(min-width: 1024px)");
    desktop.addEventListener("change", close);
    return () => {
      router.events.off("routeChangeStart", close);
      desktop.removeEventListener("change", close);
    };
  }, [router.events]);

  // Escape closes; lock page scroll while open; move focus into the panel.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    // Only a keyboard user needs focus moved into the sheet; after a tap it would just draw a focus ring.
    if (openedByKeyboard.current) panelRef.current?.querySelector("a")?.focus({ preventScroll: true });
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const isActive = (href) => router.pathname === href || router.pathname.startsWith(`${href}/`);
  const links = [...navItems, ...(site.blogEnabled ? [{ label: "Blog", href: site.blogUrl, external: true }] : [])];

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-[background-color,box-shadow] duration-300 ${
          open ? "bg-white" : "bg-white/95 backdrop-blur-sm"
        } ${
          scrolled && !open ? "shadow-[0_1px_0_0_var(--color-line),0_6px_20px_-12px_rgb(23_26_20/0.25)]" : "shadow-[0_1px_0_0_var(--color-line)]"
        }`}
      >
        <nav aria-label="Main" className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 sm:px-8 lg:h-[4.5rem]">
          <Link href="/" className="flex min-h-11 items-center gap-3 rounded-md" onClick={() => setOpen(false)}>
            <Image src="/logo.png" alt="" width={40} height={40} priority fetchPriority="high" decoding="sync" className="h-10 w-10 rounded-md" />
            <span className="font-display text-xl font-semibold tracking-tight text-care-900">{site.wordmark}</span>
            <span className="sr-only">Home</span>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`whitespace-nowrap rounded-full px-3.5 py-2 text-[0.9375rem] font-medium transition-colors ${
                  isActive(item.href) ? "bg-care-50 text-care-800" : "text-ink-2 hover:bg-paper-2 hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            ))}
            {site.blogEnabled && (
              <a href={site.blogUrl} className="rounded-full px-3.5 py-2 text-[0.9375rem] font-medium text-ink-2 hover:bg-paper-2 hover:text-ink">
                Blog
              </a>
            )}
            <Button href="/start-a-branch" className="ml-3 whitespace-nowrap">
              Start a Branch
            </Button>
          </div>

          <button
            ref={toggleRef}
            type="button"
            className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-paper-2 active:bg-paper-2 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={(e) => {
              // detail is 0 when the button is pressed with Enter or Space rather than tapped or clicked.
              openedByKeyboard.current = e.detail === 0;
              setOpen((v) => !v);
            }}
          >
            <MenuIcon open={open} />
          </button>
        </nav>
      </header>

      {/* Mobile menu: a full-screen sheet under the bar that fades and settles in, links following
          one after another. It stays mounted so it can animate out; `inert` keeps it out of reach
          while closed. Outside the header because the header's blur would trap a fixed child. */}
      <div
        id="mobile-menu"
        ref={panelRef}
        inert={!open}
        className={`fixed inset-x-0 bottom-0 top-16 z-[45] flex flex-col overflow-y-auto overscroll-contain bg-white lg:hidden ${
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-3 opacity-0"
        }`}
        // Visible at once on open (so focus can land), and only hidden after the fade-out ends.
        style={{
          transition: `opacity 300ms var(--ease-soft), transform 300ms var(--ease-soft), visibility 0s linear ${open ? "0s" : "300ms"}`,
        }}
      >
        <ul className="px-5 pt-4 sm:px-8">
          {links.map((item, i) => {
            const active = !item.external && isActive(item.href);
            const className = `group flex min-h-16 items-center justify-between border-b border-line font-display text-[1.75rem] font-semibold tracking-tight ${
              active ? "text-care-700" : "text-ink active:text-care-700"
            }`;
            const content = (
              <>
                <span className="flex items-center gap-3">
                  {item.label}
                  {active && <span className="h-2 w-2 rounded-full bg-care-400" aria-hidden="true" />}
                </span>
                <Icon name="arrow-right" size={22} className="text-care-700 transition-transform duration-200 group-active:translate-x-1" />
              </>
            );
            return (
              <li
                key={item.href}
                className={`transition-[opacity,transform] duration-500 ease-[var(--ease-soft)] ${open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}
                style={{ transitionDelay: open ? `${80 + i * 40}ms` : "0ms" }}
              >
                {item.external ? (
                  <a href={item.href} className={className}>
                    {content}
                  </a>
                ) : (
                  <Link href={item.href} aria-current={active ? "page" : undefined} className={className} onClick={() => setOpen(false)}>
                    {content}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>

        <div
          className={`mt-auto px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-8 transition-opacity duration-500 sm:px-8 ${open ? "opacity-100" : "opacity-0"}`}
          style={{ transitionDelay: open ? `${120 + links.length * 40}ms` : "0ms" }}
        >
          <div className="grid grid-cols-2 gap-3">
            <Button href="/start-a-branch" size="lg" onClick={() => setOpen(false)}>
              Start a Branch
            </Button>
            <Button href={site.donateUrl} variant="secondary" size="lg">
              Donate
            </Button>
          </div>
          <div className="mt-6 flex items-center justify-between gap-4 border-t border-line pt-5">
            <a href={`mailto:${site.email}`} className="min-w-0 truncate text-[0.9375rem] font-medium text-ink-2">
              {site.email}
            </a>
            <div className="flex shrink-0 gap-1">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink-2 hover:bg-paper-2 active:bg-paper-2"
                >
                  <Icon name={s.icon} size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
