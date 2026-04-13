export default function LibraryPage() {
  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-5 pt-14">
      <h1 className="text-2xl font-bold tracking-tight text-[#1a1a1a]">
        Beta Library
      </h1>
      <p className="mt-2 text-sm text-[#1a1a1a]/65">
        Your climbing sessions in one place.
      </p>

      <div className="mt-16 flex flex-1 flex-col items-center justify-center rounded-[4px] border-2 border-[#1a1a1a] bg-white px-6 py-14 text-center">
        <p className="text-base font-medium text-[#1a1a1a]/70">
          No sessions yet
        </p>
      </div>
    </main>
  );
}
