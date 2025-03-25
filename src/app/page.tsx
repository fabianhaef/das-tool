import { Button } from "@/components/ui/button"
import Link from "next/link"

interface FeatureCardProps {
  title: string
  description: string
}

function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <div className="p-6 bg-card rounded-lg border">
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-2rem)] p-8">
      <div className="max-w-3xl text-center space-y-8">
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome to Das Tool
        </h1>
        <p className="text-xl text-muted-foreground">
          Your comprehensive development environment for modern software development
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link href="/prompting">Get Started</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/architecture">View Architecture</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
          <FeatureCard
            title="Prompt Editor"
            description="Define system goals and constraints with multi-modal input methods"
          />
          <FeatureCard
            title="Architecture Dashboard"
            description="Visualize and analyze system structure and performance"
          />
          <FeatureCard
            title="Time Travel Debugger"
            description="Debug and analyze code execution history with detailed audit trails"
          />
          <FeatureCard
            title="Feedback Loop"
            description="Train and improve model behavior based on real application scenarios"
          />
        </div>
      </div>
    </div>
  )
}
