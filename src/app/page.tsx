import Link from "next/link";

export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-repeat opacity-[0.06]"
        style={{
          backgroundImage: "url(/holds.png)",
          backgroundSize: "220px auto",
        }}
      />
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-5 pt-14">
        <h1 className="text-[2.75rem] font-bold leading-none tracking-tight text-[#1a1a1a]">
          No Beta
        </h1>
        <p className="mt-3 text-lg font-medium text-[#1a1a1a]/75">
          find your own way up
        </p>

        <div className="mt-14 flex flex-col gap-4">
          <Link
            href="/analyze"
            className="block rounded-[4px] border-2 border-[#1a1a1a] bg-white p-5 text-[#1a1a1a] transition-colors hover:bg-[#faf9f6]"
          >
            <h2 className="text-lg font-semibold tracking-tight">
              Route Analysis
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#1a1a1a]/70">
              Upload a wall photo, get AI breakdown of holds and movement
            </p>
          </Link>

          <Link
            href="/library"
            className="block rounded-[4px] border-2 border-[#1a1a1a] bg-white p-5 text-[#1a1a1a] transition-colors hover:bg-[#faf9f6]"
          >
            <h2 className="text-lg font-semibold tracking-tight">
              Beta Library
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#1a1a1a]/70">
              Upload and review your climbing session videos
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}
