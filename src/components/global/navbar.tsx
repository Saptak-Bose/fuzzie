import Image from "next/image";
import Link from "next/link";
import { MenuIcon } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

type Props = {};

export default async function Navbar({}: Props) {
  const user = await currentUser();

  return (
    <header className="fixed right-0 left-0 top-0 py-4 px-4 bg-black/40 backdrop-blur-lg z-[100] flex items-center border-b border-neutral-900 justify-between">
      <Link href="/">
        <aside className="flex items-center gap-0.5">
          <p className="text-3xl font-bold">Fu</p>
          <Image
            className="shadow-sm"
            src="/fuzzieLogo.png"
            width={15}
            height={15}
            alt="fuzzie-logo"
          />
          <p className="text-3xl font-bold">zie</p>
        </aside>
      </Link>
      <nav className="absolute left-[50%] top-[50%] transform translate-x-[-50%] translate-y-[-50%] hidden md:block">
        <ul className="flex items-center gap-4 list-none">
          <li>
            <Link href="#products">Products</Link>
          </li>
          <li>
            <Link href="#pricing">Pricing</Link>
          </li>
          <li>
            <Link href="#clients">Clients</Link>
          </li>
          <li>
            <Link href="#resources">Resources</Link>
          </li>
          <li>
            <Link href="/docs">Documentation</Link>
          </li>
          <li>
            <Link href="#enterprise">Enterprise</Link>
          </li>
        </ul>
      </nav>
      <aside className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="relative inline-flex h-10 overflow-hidden rounded-full p-0.5 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
        >
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
            {user ? "Dashboard" : "Get Started"}
          </span>
        </Link>
        {user ? <UserButton afterSignOutUrl="/" /> : null}
        <MenuIcon className="md:hidden" />
      </aside>
    </header>
  );
}
