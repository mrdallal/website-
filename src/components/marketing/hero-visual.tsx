/**
 * Editorial hero composition: a black "system panel" showing the attention →
 * business flow, offset by a lime block and a floating lead card. Pure CSS, no
 * stock imagery. Swap in real photography by replacing the panel contents.
 */
const flow = ["Attention", "Website", "Lead capture", "Follow-up", "Conversion", "Business system"];

export function HeroVisual() {
  return (
    <div className="relative mx-auto max-w-[520px] lg:ml-auto lg:mr-0" aria-hidden="true">
      {/* Main panel */}
      <div className="relative border border-bone/15 bg-surface p-6 text-bone shadow-hard-lime sm:p-8">
        <div className="flex items-center justify-between border-b border-bone/15 pb-4">
          <span className="micro-mono text-bone/60">System / Overview</span>
          <span className="micro-mono inline-flex items-center gap-2 text-lime">
            <span className="size-1.5 animate-pulse-soft bg-lime" />
            Live
          </span>
        </div>

        <ol className="mt-6 space-y-0">
          {flow.map((step, i) => {
            const isLast = i === flow.length - 1;
            const isActive = i === 2;
            return (
              <li key={step} className="relative flex items-stretch gap-5">
                <div className="flex w-6 flex-col items-center">
                  <span
                    className={
                      isActive
                        ? "size-2.5 shrink-0 bg-lime"
                        : isLast
                          ? "size-2.5 shrink-0 border border-lime bg-transparent"
                          : "size-2.5 shrink-0 bg-bone/40"
                    }
                  />
                  {!isLast ? <span className="w-px flex-1 bg-bone/15" /> : null}
                </div>
                <div className={isLast ? "pb-0" : "pb-5"}>
                  <div className="flex items-baseline gap-3">
                    <span className="micro-mono text-bone/40">0{i + 1}</span>
                    <span
                      className={
                        isLast
                          ? "text-h4 font-semibold text-lime"
                          : isActive
                            ? "text-h4 font-semibold text-bone"
                            : "text-h4 font-bold text-bone/70"
                      }
                    >
                      {step}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-6 grid grid-cols-3 gap-px border border-bone/15 bg-bone/15">
          {[
            { k: "Leads", v: "→ OS" },
            { k: "Follow-up", v: "Auto" },
            { k: "Visibility", v: "100%" },
          ].map((cell) => (
            <div key={cell.k} className="bg-ink px-3 py-3">
              <p className="micro-mono text-bone/40">{cell.k}</p>
              <p className="mt-1 font-mono text-sm text-bone">{cell.v}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Offset lime block */}
      <div className="absolute -bottom-6 -left-4 hidden w-40 bg-lime p-4 text-ink sm:block lg:-left-10">
        <p className="micro-mono">Attention</p>
        <p className="mt-1 text-h4 font-semibold leading-none">↓ Business</p>
      </div>

      {/* Floating lead card */}
      <div className="absolute -right-3 top-10 hidden w-56 border border-bone/15 bg-surface p-4 text-bone shadow-panel sm:block lg:-right-8">
        <div className="flex items-center justify-between">
          <span className="micro-mono text-mute">Lead</span>
          <span className="micro-mono bg-lime px-1.5 py-1 text-ink">New</span>
        </div>
        <p className="mt-3 text-sm font-bold">Captured · Qualified · Routed</p>
        <p className="mt-1 text-xs text-mute">Reply sent in seconds. Task created. Pipeline updated.</p>
      </div>
    </div>
  );
}
