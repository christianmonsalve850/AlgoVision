import { createClient } from "@/lib/supabase/server";

import { ProblemPageShell } from "@/features/practice/problem-page/problem-page-shell";
import type { Language } from "@/features/practice/problem-page/code-editor/types";
import type { ProblemRecord, ProblemExample  } from "@/features/practice/problem-page/problem/types";

type ProblemPageProps = {
    params: Promise<{ id: string }>;
}

export default async function ProblemPage({ params } : ProblemPageProps) {
    const { id } = await params;
    
    const supabase = await createClient();

    const { data: problem, error: problemError } = await supabase
        .from("problems")
        .select()
        .eq('id', id)
        .single();

        if (problemError) {
        console.log(problemError);
    }

    const typedProblem = problem as ProblemRecord | null;

    if (!typedProblem) {
        return null;
    }

    const { data: examples, error: exampleError } = await supabase
        .from("problem_examples")
        .select()
        .eq("problem_id", id)
        .order("example_number", { ascending: true });

    if (exampleError) {
        console.log(exampleError);
    }

    const { data: starterCode, error: starterCodeError } = await supabase
        .from("problem_starter_code")
        .select("language, starter_code")
        .eq("problem_id", id);

    if (starterCodeError) {
        console.log(starterCodeError)
    }

    const starterCodeMap = Object.fromEntries(
        (starterCode ?? []).map((row) => [
            row.language,
            row.starter_code.replace(/\\n/g, "\n"),
        ])
    ) as Partial<Record<Language, string>>;

    return (
        <ProblemPageShell
            problem={problem as ProblemRecord} 
            examples={(examples ?? []) as ProblemExample[]} 
            starterCodeMap={starterCodeMap}
        />
    )
}
