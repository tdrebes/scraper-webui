import Image from "next/image";
import Link from "next/link";

const links = [
  { href: "/content", label: "Content" },
  { href: "/urls", label: "URLs" },
];

export default function Header() {
  return (
    <header className="w-full border-b border-neutral-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-semibold tracking-tight text-neutral-900"
        >
          <Image src="/logo.png" alt="Scraper logo" width={28} height={28} priority />
          <span>Scraper</span>
        </Link>
        <nav>
          <ul className="flex items-center gap-6 text-sm font-medium text-neutral-700">
            {links.map((link) => {
              const isAnchor = link.href.startsWith("#");
              if (isAnchor) {
                return (
                  <li key={link.href}>
                    <a className="transition hover:text-neutral-950" href={link.href}>
                      {link.label}
                    </a>
                  </li>
                );
              }

              return (
                <li key={link.href}>
                  <Link
                    className="transition hover:text-neutral-950"
                    href={link.href}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
