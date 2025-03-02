import { Brain, Code, History, MessageSquare, Sparkles, Zap } from "lucide-react"

export function FeatureSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Features</div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Everything you need to master DSA</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our platform provides the tools and guidance you need to understand and solve complex algorithmic
              problems.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-primary/10 p-3">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Guided Learning</h3>
            <p className="text-center text-muted-foreground">
              Our AI assistant uses the Socratic method to guide you through problems without giving away solutions.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-primary/10 p-3">
              <Code className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Code Assistance</h3>
            <p className="text-center text-muted-foreground">
              Get help with code structure and algorithm implementation with syntax highlighting.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-primary/10 p-3">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Interactive Chat</h3>
            <p className="text-center text-muted-foreground">
              Engage in natural conversations about DSA problems and concepts.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-primary/10 p-3">
              <History className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Session History</h3>
            <p className="text-center text-muted-foreground">
              Review your past learning sessions to reinforce your understanding.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-primary/10 p-3">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">LeetCode Integration</h3>
            <p className="text-center text-muted-foreground">
              Easily share LeetCode problem URLs for targeted assistance.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-primary/10 p-3">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Personalized Guidance</h3>
            <p className="text-center text-muted-foreground">
              Get help tailored to your knowledge level and specific difficulties.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

