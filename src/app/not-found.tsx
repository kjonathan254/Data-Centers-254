import Link from "next/link";
import { Server, Home, Search, ArrowLeft } from "lucide-react";

export default function Custom404() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="relative flex-1 flex items-center justify-center">
        <div className="absolute inset-0 grid-bg opacity-30" aria-hidden="true" />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_40%,oklch(0.78_0.14_195/3%),transparent_70%)]"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto max-w-lg px-4 text-center">
          {/* 404 Number */}
          <div className="mb-8">
            <span className="text-8xl sm:text-9xl font-bold tracking-tighter text-cyan/20 select-none">
              404
            </span>
          </div>

          {/* Message */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <Server className="h-5 w-5 text-cyan" />
            <span className="font-mono text-xs tracking-widest text-cyan uppercase">
              Page Not Found
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
            This server rack does not exist
          </h1>

          <p className="text-muted-foreground leading-relaxed mb-8 max-w-md mx-auto">
            The page you are looking for has been moved, deleted, or was never deployed.
            Try one of these links to get back on track.
          </p>

          {/* Navigation Options */}
          <div className="grid sm:grid-cols-2 gap-3 text-left">
            <Link
              href="/"
              className="glass-card glass-card-hover rounded-xl p-4 border border-border/50 hover:border-cyan/30 transition-all group flex items-center gap-3"
            >
              <Home className="h-5 w-5 text-muted-foreground group-hover:text-cyan transition-colors shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground group-hover:text-cyan transition-colors">
                  Go Home
                </p>
                <p className="text-xs text-muted-foreground">Back to the homepage</p>
              </div>
            </Link>

            <Link
              href="/directory"
              className="glass-card glass-card-hover rounded-xl p-4 border border-border/50 hover:border-cyan/30 transition-all group flex items-center gap-3"
            >
              <Search className="h-5 w-5 text-muted-foreground group-hover:text-cyan transition-colors shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground group-hover:text-cyan transition-colors">
                  DC Directory
                </p>
                <p className="text-xs text-muted-foreground">Browse Kenya's data centres</p>
              </div>
            </Link>

            <Link
              href="/beginners"
              className="glass-card glass-card-hover rounded-xl p-4 border border-border/50 hover:border-cyan/30 transition-all group flex items-center gap-3"
            >
              <ArrowLeft className="h-5 w-5 text-muted-foreground group-hover:text-cyan transition-colors shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground group-hover:text-cyan transition-colors">
                  Beginner Guides
                </p>
                <p className="text-xs text-muted-foreground">Start learning here</p>
              </div>
            </Link>

            <Link
              href="/about"
              className="glass-card glass-card-hover rounded-xl p-4 border border-border/50 hover:border-cyan/30 transition-all group flex items-center gap-3"
            >
              <Server className="h-5 w-5 text-muted-foreground group-hover:text-cyan transition-colors shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground group-hover:text-cyan transition-colors">
                  About
                </p>
                <p className="text-xs text-muted-foreground">Who we are and why</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
