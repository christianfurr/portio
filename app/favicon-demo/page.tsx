import type { Metadata } from "next";
import Link from "next/link";
import {
  Cinzel,
  Cinzel_Decorative,
  IM_Fell_English,
  UnifrakturMaguntia,
  Crimson_Pro,
  Great_Vibes,
  Allura,
  Dancing_Script,
  Sacramento,
} from "next/font/google";

const cinzel = Cinzel({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-cinzel",
});

const cinzelDecorative = Cinzel_Decorative({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-cinzel-decorative",
});

const imFellEnglish = IM_Fell_English({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-im-fell",
});

const unifraktur = UnifrakturMaguntia({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-unifraktur",
});

const crimsonPro = Crimson_Pro({
  weight: ["400", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-crimson",
});

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-great-vibes",
});

const allura = Allura({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-allura",
});

const dancingScript = Dancing_Script({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-dancing",
});

const sacramento = Sacramento({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-sacramento",
});

const OPTIONS = [
  { id: "cinzel", name: "Cinzel", font: cinzel, desc: "Roman / classical" },
  {
    id: "cinzel-decorative",
    name: "Cinzel Decorative",
    font: cinzelDecorative,
    desc: "Ornate caps",
  },
  {
    id: "im-fell",
    name: "IM Fell English",
    font: imFellEnglish,
    desc: "Old print",
    variant: "normal" as const,
  },
  {
    id: "im-fell-italic",
    name: "IM Fell English (italic)",
    font: imFellEnglish,
    desc: "Old print italic",
    variant: "italic" as const,
  },
  {
    id: "unifraktur",
    name: "UnifrakturMaguntia",
    font: unifraktur,
    desc: "Blackletter / medieval",
  },
  {
    id: "crimson",
    name: "Crimson Pro",
    font: crimsonPro,
    desc: "Elegant serif",
    variant: "normal" as const,
  },
  {
    id: "crimson-italic",
    name: "Crimson Pro (italic)",
    font: crimsonPro,
    desc: "Elegant italic",
    variant: "italic" as const,
  },
  {
    id: "great-vibes",
    name: "Great Vibes",
    font: greatVibes,
    desc: "Flowing script, letters connect",
  },
  {
    id: "allura",
    name: "Allura",
    font: allura,
    desc: "Elegant cursive, flows together",
  },
  {
    id: "dancing-script",
    name: "Dancing Script",
    font: dancingScript,
    desc: "Casual connected script",
  },
  {
    id: "sacramento",
    name: "Sacramento",
    font: sacramento,
    desc: "Rounded flowing script",
  },
] as const;

const SIZES = [
  { px: 16, label: "16×16 (tab)" },
  { px: 32, label: "32×32 (favicon)" },
  { px: 180, label: "180×180 (Apple)" },
] as const;

const COLORS = [
  { id: "accent", label: "Accent", value: "#0a84ff" },
  { id: "foreground", label: "Foreground", value: "#f5f5f7" },
] as const;

export const metadata: Metadata = {
  title: "Favicon options — Christian Furr",
  description: "Pick a favicon style for CF",
};

export default function FaviconDemoPage() {
  return (
    <div
      className={`min-h-screen bg-background p-8 ${cinzel.variable} ${cinzelDecorative.variable} ${imFellEnglish.variable} ${unifraktur.variable} ${crimsonPro.variable} ${greatVibes.variable} ${allura.variable} ${dancingScript.variable} ${sacramento.variable}`}
      style={{
        fontFamily: "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
      }}
    >
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="text-foreground-muted hover:text-foreground mb-8 inline-block text-sm underline"
        >
          ← Back home
        </Link>
        <h1 className="mb-2 text-2xl font-semibold text-foreground">
          Favicon options — CF
        </h1>
        <p className="mb-10 text-foreground-muted">
          Medieval, cursive, and serif options. Script fonts flow into each
          other. Pick one for the real favicon.
        </p>

        <div className="space-y-14">
          {OPTIONS.map((opt) => (
            <section
              key={opt.id}
              className="rounded-xl border border-border bg-background-alt/50 p-6"
            >
              <h2 className="mb-1 text-lg font-medium text-foreground">
                {opt.name}
              </h2>
              <p className="mb-6 text-sm text-foreground-muted">{opt.desc}</p>
              <div className="grid gap-10 sm:grid-cols-2">
                {COLORS.map((color) => (
                  <div key={color.id}>
                    <p className="mb-4 text-sm text-foreground-muted">
                      {color.label} ({color.value})
                    </p>
                    <div className="flex flex-wrap items-end gap-8">
                      {SIZES.map((size) => (
                        <div
                          key={size.px}
                          className="flex flex-col items-center gap-2"
                        >
                          <span className="text-xs text-foreground-muted">
                            {size.label}
                          </span>
                          {/* Preview box: show at a visible scale; small sizes are scaled up for visibility */}
                          <div
                            className="flex items-center justify-center rounded border border-border bg-background"
                            style={{
                              width: Math.min(size.px * 2, 360),
                              height: Math.min(size.px * 2, 360),
                            }}
                          >
                            <span
                              className={`flex items-center justify-center font-semibold antialiased ${opt.font.className}`}
                              style={{
                                fontFeatureSettings: '"liga" 1, "dlig" 1',
                                fontSize: Math.min(size.px * 1.2, size.px * 2),
                                color: color.value,
                                fontStyle: "variant" in opt && opt.variant === "italic" ? "italic" : undefined,
                              }}
                            >
                              CF
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-14 rounded-xl border border-border bg-background-alt/50 p-6">
          <h2 className="mb-4 text-lg font-medium text-foreground">
            “Actual size” preview (32×32)
          </h2>
          <p className="mb-6 text-sm text-foreground-muted">
            Same 32×32 favicon size, not scaled — how it’ll look in the tab.
          </p>
          <div className="flex flex-wrap gap-6">
            {OPTIONS.map((opt) => (
              <div
                key={opt.id}
                className="flex flex-col items-center gap-2"
              >
                <span className="text-xs text-foreground-muted">
                  {opt.name}
                </span>
                <div className="flex gap-4">
                  <div
                    className="flex items-center justify-center rounded border border-border bg-background"
                    style={{ width: 32, height: 32 }}
                    title={`${opt.name} — accent`}
                  >
                    <span
                      className={`flex items-center justify-center ${opt.font.className}`}
                      style={{
                        fontFeatureSettings: '"liga" 1, "dlig" 1',
                        fontSize: 18,
                        color: "#0a84ff",
                        fontStyle: "variant" in opt && opt.variant === "italic" ? "italic" : undefined,
                      }}
                    >
                      CF
                    </span>
                  </div>
                  <div
                    className="flex items-center justify-center rounded border border-border bg-background"
                    style={{ width: 32, height: 32 }}
                    title={`${opt.name} — foreground`}
                  >
                    <span
                      className={`flex items-center justify-center ${opt.font.className}`}
                      style={{
                        fontFeatureSettings: '"liga" 1, "dlig" 1',
                        fontSize: 18,
                        color: "#f5f5f7",
                        fontStyle: "variant" in opt && opt.variant === "italic" ? "italic" : undefined,
                      }}
                    >
                      CF
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
