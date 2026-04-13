export default function AnalyzePage() {
  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-5 pt-14">
      <h1 className="text-2xl font-bold tracking-tight text-[#1a1a1a]">
        Route Analysis
      </h1>
      <p className="mt-2 text-sm text-[#1a1a1a]/65">
        Upload a wall photo to get started.
      </p>

      <div
        className="mt-10 flex min-h-[200px] flex-col items-center justify-center rounded-[4px] border-2 border-dashed border-[#1a1a1a]/45 bg-white px-6 py-12 text-center"
        role="region"
        aria-label="Photo upload"
      >
        <p className="text-sm font-medium text-[#1a1a1a]/55">
          Drop a wall photo here
        </p>
        <p className="mt-1 text-xs text-[#1a1a1a]/45">Upload coming soon</p>
      </div>
    </main>
  );
}
