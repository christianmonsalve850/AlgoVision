import { MasteryCard } from "./mastery-card"
import { BookOpen, Code2, Video, Bot } from "lucide-react"

export function Mastery() {
    return (
        <section 
            className="w-screen max-w-7xl flex flex-col items-center justify-center px-6 mb-12"        
        >
            <h2 className="max-w-4xl text-3xl font-bold tracking-tight md:text-4xl mb-12">
                Everything You Need to Master Algorithms
            </h2>


            <div className="w-full max-w-6xl rounded-xl grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
                <MasteryCard 
                    icon={BookOpen} 
                    title="Lessons" 
                    description="Guided tutorials on algorithmic patterns with step-by-step visualizations and explanations."
                />
                <MasteryCard 
                    icon={Code2} 
                    title="Practice Problems" 
                    description="Hands-on coding challenges with instant visual feedback and pattern recognition hints."
                />
                <MasteryCard 
                    icon={Video} 
                    title="Interview Mode" 
                    description="Realistic mock interviews with time constraints and performance analytics."
                />
                <MasteryCard 
                    icon={Bot} 
                    title="AI Assistance" 
                    description="Get personalized hints, explanations, and guidance tailored to your learning style."
                />
            </div>
        </section>
    )
}