import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Globe, Award, Bot } from "lucide-react";
import { Link } from "react-router-dom";

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

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <span className="text-xl font-bold tracking-tight text-foreground">
            Lumora
          </span>
          <Link to="/auth">
            <Button variant="ghost" size="sm">
              Sign in
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-44 md:pb-32">
        <div className="container max-w-3xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.1] animate-fade-in-up">
            More than your degree.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-up [animation-delay:150ms] opacity-0">
            Build your profile once. Get purpose-built CVs, a personal website,
            a digital business card, and an AI assistant to help you stand out
            — instantly.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up [animation-delay:300ms] opacity-0">
            <Link to="/auth">
              <Button size="lg" className="px-8 text-base">
                Get Started
              </Button>
            </Link>
            <Link to="/demo">
              <Button variant="outline" size="lg" className="px-8 text-base">
                See Example
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="pb-24 md:pb-32">
        <div className="container max-w-5xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <Card
                key={feature.title}
                className="border border-border bg-card hover:shadow-md transition-shadow duration-300 animate-fade-in-up opacity-0"
                style={{ animationDelay: `${400 + i * 100}ms` }}
              >
                <CardContent className="pt-6">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
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
            ))}
          </div>
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
