import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Globe, Award, Bot, ArrowRight, CheckCircle2, TrendingUp, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const features = [
  {
    icon: FileText,
    title: "Smart CV Builder",
    description: "Generate tailored CVs for any purpose",
  },
  {
    icon: Globe,
    title: "Personal Website",
    description: "A portfolio page you'd be proud to share",
  },
  {
    icon: Award,
    title: "Badge Wall & Card",
    description: "Showcase achievements, share your card",
  },
  {
    icon: Bot,
    title: "AI Assistant",
    description: "Get help writing and improving your profile",
  },
];

/* ---------- Product Mockup ---------- */
const ScoreMockup = () => {
  const feedbackItems = [
    { label: "Experience Match", score: 95, color: "hsl(152, 60%, 45%)" },
    { label: "Skill Alignment", score: 88, color: "hsl(213, 52%, 44%)" },
    { label: "Education Fit", score: 90, color: "hsl(152, 60%, 45%)" },
    { label: "Keyword Coverage", score: 85, color: "hsl(213, 52%, 44%)" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateY: -8 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
      className="relative"
      style={{ perspective: "1200px" }}
    >
      {/* Glow effect */}
      <div className="absolute -inset-4 bg-gradient-to-br from-[hsl(213,52%,24%,0.15)] to-[hsl(213,52%,44%,0.08)] rounded-3xl blur-2xl" />
      
      <div className="relative bg-white rounded-2xl shadow-2xl border border-[hsl(220,13%,91%)] overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-1.5 px-4 py-3 bg-[hsl(220,13%,97%)] border-b border-[hsl(220,13%,91%)]">
          <div className="w-2.5 h-2.5 rounded-full bg-[hsl(0,80%,65%)]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[hsl(45,90%,55%)]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[hsl(130,50%,55%)]" />
          <span className="ml-3 text-[10px] font-medium text-[hsl(0,0%,50%)]">CV Score — Google SWE Intern</span>
        </div>

        <div className="p-6">
          {/* Score Circle */}
          <div className="flex items-center gap-5 mb-5">
            <div className="relative w-20 h-20 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(220,13%,93%)" strokeWidth="7" />
                <motion.circle
                  cx="50" cy="50" r="40" fill="none"
                  stroke="hsl(152, 60%, 45%)"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 40}
                  initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - 0.92) }}
                  transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.0 }}
                  className="text-xl font-bold text-[hsl(0,0%,10%)]"
                >92</motion.span>
                <span className="text-[8px] text-[hsl(0,0%,50%)] -mt-0.5">/100</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-[hsl(0,0%,10%)]">Excellent Match</p>
              <p className="text-[11px] text-[hsl(0,0%,50%)] mt-0.5">Your CV is highly aligned with this role</p>
            </div>
          </div>

          {/* Feedback cards */}
          <div className="grid grid-cols-2 gap-2.5">
            {feedbackItems.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 + i * 0.12, duration: 0.4 }}
                className="rounded-lg border border-[hsl(220,13%,91%)] p-3"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-medium text-[hsl(0,0%,35%)]">{item.label}</span>
                  <span className="text-[11px] font-bold" style={{ color: item.color }}>{item.score}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-[hsl(220,13%,93%)] overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: item.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.score}%` }}
                    transition={{ delay: 1.2 + i * 0.12, duration: 0.6, ease: "easeOut" }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Matched skills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
            className="mt-4 flex flex-wrap gap-1.5"
          >
            {["React", "TypeScript", "Node.js", "Python", "SQL", "Docker"].map((s) => (
              <span key={s} className="text-[9px] px-2 py-0.5 rounded-full bg-[hsl(213,52%,24%)] text-white font-medium">
                {s}
              </span>
            ))}
            <span className="text-[9px] px-2 py-0.5 rounded-full border border-[hsl(220,13%,91%)] text-[hsl(0,0%,50%)] font-medium">
              +4 more
            </span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[hsl(213,52%,14%,0.85)] backdrop-blur-md border-b border-white/10">
        <div className="container flex items-center justify-between h-16">
          <span className="text-xl font-bold tracking-tight text-white">
            Lumora
          </span>
          <Link to="/auth">
            <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10">
              Sign in
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section
        className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden"
        style={{
          background: "linear-gradient(165deg, hsl(213, 52%, 12%) 0%, hsl(213, 52%, 20%) 40%, hsl(213, 48%, 28%) 70%, hsl(220, 30%, 35%) 100%)",
        }}
      >
        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        {/* Glow orbs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-[hsl(213,60%,40%,0.15)] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-[hsl(36,40%,50%,0.08)] rounded-full blur-[100px]" />

        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — Copy */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[hsl(36,80%,70%)] bg-[hsl(36,80%,70%,0.1)] border border-[hsl(36,80%,70%,0.2)] rounded-full px-3 py-1 mb-6">
                  <Zap className="w-3 h-3" />
                  Built for university students
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight text-white leading-[1.08]"
              >
                More than
                <br />
                your degree.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-5 text-lg text-white/60 max-w-lg leading-relaxed"
              >
                Build your profile once. Get purpose-built CVs, a personal website,
                a digital business card, and an AI assistant — instantly.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="mt-8 flex flex-col sm:flex-row items-start gap-3"
              >
                <Link to="/auth">
                  <Button
                    size="lg"
                    className="px-8 text-base h-12 bg-white text-[hsl(213,52%,18%)] hover:bg-white/90 shadow-lg shadow-black/20 font-semibold"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/u/demotozero">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="px-6 text-base h-12 text-white/70 hover:text-white hover:bg-white/10"
                  >
                    See Example
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="mt-8 flex items-center gap-5 text-white/40 text-xs"
              >
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-[hsl(152,60%,55%)]" /> Free to start</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-[hsl(152,60%,55%)]" /> No credit card</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-[hsl(152,60%,55%)]" /> PDF export</span>
              </motion.div>
            </div>

            {/* Right — Product Mockup */}
            <div className="hidden lg:block">
              <ScoreMockup />
            </div>
          </div>
        </div>

        {/* Bottom fade to white */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Features */}
      <section className="py-20 md:py-28">
        <div className="container max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Everything you need to stand out</h2>
            <p className="text-muted-foreground mt-2 max-w-lg mx-auto">One profile powers your entire professional presence.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              >
                <Card className="border border-border bg-card hover:shadow-lg hover:border-primary/20 transition-all duration-300 h-full">
                  <CardContent className="pt-6">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-border py-12 bg-muted/30">
        <div className="container max-w-4xl">
          <div className="grid grid-cols-3 gap-8 text-center">
            {[
              { value: "3", label: "CV templates" },
              { value: "92%", label: "Avg match score" },
              { value: "< 2min", label: "To generate a CV" },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                <p className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28">
        <div className="container max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <TrendingUp className="w-8 h-8 text-primary mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Ready to stand out?</h2>
            <p className="text-muted-foreground mt-3 max-w-md mx-auto">
              Join students building smarter profiles. It takes less than 2 minutes.
            </p>
            <Link to="/auth">
              <Button size="lg" className="mt-8 px-10 text-base h-12">
                Create your Lumora
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>Built at Hackathon · Lumora © 2026</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
