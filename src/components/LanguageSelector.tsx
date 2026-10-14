import type { ChangeEvent } from "react";

export type Language =
  | "TypeScript"
  | "JavaScript"
  | "Python"
  | "Java"
  | "C"
  | "C++";

const LANGUAGE_OPTIONS: { name: Language; symbol: string }[] = [
  { name: "TypeScript", symbol: "🔷" },
  { name: "JavaScript", symbol: "🟨" },
  { name: "Python", symbol: "🐍" },
  { name: "Java", symbol: "☕" },
  { name: "C", symbol: "🔵" },
  { name: "C++", symbol: "⚙️" },
];

interface LanguageSelectorProps {
  value: Language;
  onChange: (language: Language) => void;
  className?: string;
}

export default function LanguageSelector({
  value,
  onChange,
  className = "",
}: LanguageSelectorProps) {
  const selected = LANGUAGE_OPTIONS.find((option) => option.name === value);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedLanguage = LANGUAGE_OPTIONS.find(
      (option) => option.name === event.target.value,
    );
    if (selectedLanguage) onChange(selectedLanguage.name);
  };

  return (
    <label className={`flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5 ${className}`}>
      <span aria-hidden="true" className="text-xs">{selected?.symbol}</span>
      <select
        aria-label="Select programming language"
        value={value}
        onChange={handleChange}
        className="max-w-32 cursor-pointer bg-transparent text-[10px] font-semibold text-slate-200 outline-none"
      >
        {LANGUAGE_OPTIONS.map((option) => (
          <option key={option.name} value={option.name} className="bg-slate-950 text-white">
            {option.symbol} {option.name}
          </option>
        ))}
      </select>
    </label>
  );
}
