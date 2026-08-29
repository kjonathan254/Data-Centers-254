import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const roles = [
  {
    title: "Electrical engineer",
    reveal:
      "Ensures megawatts of power from the grid — much of it geothermal from the Rift Valley — reach every server without a single flicker.",
  },
  {
    title: "Network engineer",
    reveal:
      "Keeps the fibre links between Mombasa's cable landing stations and Nairobi's data centres running at the speed of light.",
  },
  {
    title: "Cybersecurity analyst",
    reveal:
      "Protects the servers that process Kenya's mobile money, banking transactions and government data — 24 hours a day.",
  },
];

/**
 * Careers — the people behind the infrastructure. Photograph + role list.
 * Server component.
 */
export default function CareersSection() {
  return (
    <section id="careers-section" className="section-y section-surface border-y border-border/40">
      <div className="container-site">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Content */}
          <div>
            <p className="eyebrow">Careers</p>
            <h2 className="h-display-sm mt-3 max-w-lg text-foreground">
              Behind every transaction are people you will never meet.
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">
              A data centre needs engineers, technicians, analysts and
              managers — all working in shifts, around the clock, in buildings
              most Kenyans will never enter.
            </p>

            <ul className="mt-8">
              {roles.map((role) => (
                <li
                  key={role.title}
                  className="border-b border-border/40 py-5 first:pt-0 last:border-b-0"
                >
                  <h3 className="font-mono text-xs uppercase tracking-widest text-cyan">
                    {role.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-foreground/85">
                    {role.reveal}
                  </p>
                </li>
              ))}
            </ul>

            <Link
              href="/careers"
              className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-cyan transition-all hover:gap-2.5"
            >
              Explore data centre careers
              <ArrowRight className="size-4" />
            </Link>
          </div>

          {/* Photograph */}
          <div>
            <div className="img-frame">
              <div className="relative aspect-[4/3]">
                <Image
                  src="/images/dc-careers-tech.png"
                  alt="Data centre technician checking connections at a server rack"
                  fill
                  sizes="(max-width: 1024px) 100vw, 560px"
                  className="object-cover"
                />
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Inside the white space: precision, discipline and shift work —
              the human layer of Kenya&apos;s digital economy.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
