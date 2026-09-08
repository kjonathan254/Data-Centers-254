"use client";

import { useState, useMemo, useCallback } from "react";
import { RotateCcw, Check, X, ChevronRight, Trophy } from "lucide-react";
import type { KiswahiliTerm } from "@/lib/glossary-kiswahili";

interface QuizQuestion {
  sw: string;
  en: string;
  def?: string;
  options: string[];
}

const ROUND_SIZE = 8;

function sampleRound(pool: KiswahiliTerm[]): QuizQuestion[] {
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const picked = shuffled.slice(0, Math.min(ROUND_SIZE, pool.length));
  return picked.map((t) => {
    const distractors = pool
      .filter((o) => o.en !== t.en)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((o) => o.en);
    return {
      sw: t.sw,
      en: t.en,
      def: t.def,
      options: [t.en, ...distractors].sort(() => Math.random() - 0.5),
    };
  });
}

export default function KiswahiliQuiz({ terms }: { terms: KiswahiliTerm[] }) {
  const [phase, setPhase] = useState<"idle" | "playing" | "done">("idle");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const start = useCallback(() => {
    setQuestions(sampleRound(terms));
    setIndex(0);
    setSelected(null);
    setScore(0);
    setPhase("playing");
  }, [terms]);

  const q = questions[index];
  const progress = useMemo(
    () => (phase === "playing" && questions.length ? ((index + (selected ? 1 : 0)) / questions.length) * 100 : 0),
    [phase, questions.length, index, selected]
  );

  const choose = (option: string) => {
    if (selected) return;
    setSelected(option);
    if (option === q.en) setScore((s) => s + 1);
  };

  const next = () => {
    if (index + 1 >= questions.length) setPhase("done");
    else {
      setIndex((i) => i + 1);
      setSelected(null);
    }
  };

  return (
    <section className="mt-14 glass-card rounded-2xl border border-cyan/20 p-6 sm:p-8">
      <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-1">
        Jaribio — test your vocabulary
      </h2>
      <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-2xl">
        Soma Kiswahili, jibu kwa Kiingereza. Maswali {ROUND_SIZE} kila raundi,
        huchaguliwa nasibu kutoka kwenye kamusi — read the Kiswahili term, choose the
        English meaning. Fresh eight questions every round.
      </p>

      {phase === "idle" && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <button
            onClick={start}
            className="inline-flex items-center gap-2 glow-cyan bg-cyan text-background rounded-lg px-5 h-10 text-sm font-semibold hover:bg-cyan/90 transition-all"
          >
            Anza — start the quiz <ChevronRight className="size-4" />
          </button>
          <span className="text-xs text-muted-foreground">{terms.length} terms in the pool</span>
        </div>
      )}

      {phase === "playing" && q && (
        <div>
          <div className="h-1.5 rounded-full bg-border/50 overflow-hidden mb-6">
            <div className="h-full bg-cyan rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>

          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">
            Swali {index + 1} / {questions.length}
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-foreground mb-1">{q.sw}</p>
          <p className="text-xs text-muted-foreground mb-6">Ni nini kwa Kiingereza? — what is it in English?</p>

          <div className="grid sm:grid-cols-2 gap-2.5">
            {q.options.map((option) => {
              const isCorrect = option === q.en;
              const isPicked = option === selected;
              let cls = "border-border text-foreground hover:border-cyan/40 hover:bg-cyan/5";
              if (selected) {
                if (isCorrect) cls = "border-neon/50 bg-neon/10 text-neon";
                else if (isPicked) cls = "border-red-400/50 bg-red-400/10 text-red-400";
                else cls = "border-border/50 text-muted-foreground/60";
              }
              return (
                <button
                  key={option}
                  onClick={() => choose(option)}
                  disabled={!!selected}
                  className={`text-left rounded-xl border px-4 py-3 text-sm font-medium transition-all ${cls}`}
                >
                  <span className="inline-flex items-center gap-2">
                    {selected && isCorrect && <Check className="size-4 shrink-0" />}
                    {selected && isPicked && !isCorrect && <X className="size-4 shrink-0" />}
                    {option}
                  </span>
                </button>
              );
            })}
          </div>

          {selected && (
            <div className="mt-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
                {selected === q.en ? "Sahihi! Correct. " : `Si sahihi — jibu ni "${q.en}". `}
                {q.def ? q.def : ""}
              </p>
              <button
                onClick={next}
                className="inline-flex items-center gap-1.5 bg-foreground text-background rounded-lg px-4 h-9 text-sm font-semibold hover:bg-foreground/90 transition-all shrink-0"
              >
                {index + 1 >= questions.length ? "Matokeo — results" : "Endelea"} <ChevronRight className="size-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {phase === "done" && (
        <div className="text-center py-4">
          <Trophy className={`size-10 mx-auto mb-3 ${score >= questions.length * 0.75 ? "text-amber-400" : "text-muted-foreground"}`} />
          <p className="text-3xl font-bold text-foreground mb-1 tabular-nums">
            {score} / {questions.length}
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            {score === questions.length
              ? "Kamili! Flawless — you are ready for any Kenyan NOC."
              : score >= questions.length * 0.75
                ? "Vizuri sana! Solid grasp of the vocabulary."
                : score >= questions.length / 2
                  ? "Nzuri — decent base. Scroll up and skim the definitions."
                  : "Keep practising — the glossary above is the answer key."}
          </p>
          <button
            onClick={start}
            className="inline-flex items-center gap-2 bg-cyan text-background rounded-lg px-5 h-10 text-sm font-semibold hover:bg-cyan/90 transition-all"
          >
            <RotateCcw className="size-4" /> Cheza tena — play again
          </button>
        </div>
      )}
    </section>
  );
}
