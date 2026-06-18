import { PracticeShell } from "@/features/practice/components/practice-shell";
import { createClient } from "@/lib/supabase/server";

export default async function Learn() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser()

    const { data: progress } = await supabase
    .from("user_problem_progress")
    .select("problem_id, solved")
    .eq("user_id", user?.id)
        
    const { data: problems, error: problemError } = await supabase
        .from("problems")
        .select("id, title, difficulty, pattern")
        .order("title", { ascending: true });

    if (problemError) {
        console.log(problemError);
    }

    const progressMap = new Map(
        (progress ?? []).map((row) => [row.problem_id, row.solved])
    )

    const typedProblems = (problems ?? []).map((problem) => ({
        ...problem,
        solved: progressMap.get(problem.id) ?? false,
    }))
    
    return <PracticeShell problems={typedProblems} />
}
