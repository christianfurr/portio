type CueLabelProps = {
  cue: string;
  label: string;
};

export function CueLabel({ cue, label }: CueLabelProps) {
  return (
    <p className="mb-4 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-accent">
      <span className="h-px w-8 bg-accent/50" aria-hidden />
      <span>
        Cue {cue} · {label}
      </span>
    </p>
  );
}
