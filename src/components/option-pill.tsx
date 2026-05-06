type OptionPillProps<T extends string> = {
  label: T;
  active: boolean;
  onClick: (value: T) => void;
};

export function OptionPill<T extends string>({ label, active, onClick }: OptionPillProps<T>) {
  return (
    <button
      type="button"
      onClick={() => onClick(label)}
      className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
        active
          ? "border-lime bg-lime text-night shadow-glow"
          : "border-white/12 bg-white/[0.06] text-white hover:border-white/30"
      }`}
    >
      {label}
    </button>
  );
}
