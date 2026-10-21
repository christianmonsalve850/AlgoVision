import { useRouter } from 'next/navigation';

export function HeroActions() {
  const router = useRouter();
  return (
    <div className="mt-8 flex gap-3">
      <button 
        className="h-12 w-50 rounded-lg bg-foreground text-background"
        onClick={() => router.push('/practice')}
      >
        Solve a Problem
      </button>
      <button 
        className="h-12 w-50 rounded-lg border border-border bg-background text-foreground"
        onClick={() => router.push('/learn')}
      >
        Explore Lessons
      </button>
    </div>
  );
}
