import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="text-6xl font-bold">WORKFLO</div>
        <ol className="list-inside list-decimal text-base text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">Smart Workflow Automations.</li>
          <li>Customizable Workflow Views.</li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link
            className=" dark:bg-black  dark:hover:bg-neutral-950 rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-1 hover:bg-[#383838]  text-sm sm:text-base h-10 sm:h-10 px-4 sm:px-5"
            href="/login"
          >
            Log in
          </Link>
          <a
            className="rounded-full cursor-pointer border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-10 px- sm:px-5 sm:min-w-32"
            target="_blank"
            rel="noopener noreferrer"
          >
            Request a demo
          </a>
        </div>
      </main>
    </div>
  );
}
