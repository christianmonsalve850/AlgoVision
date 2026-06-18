import { createClient } from "@/lib/supabase/server";

import { ProblemPageShell } from "@/features/practice/problem-page/problem-page-shell";
import type { ProblemExample, ProblemRecord } from "@/features/practice/problem-page/types";

type PostPageProps = {
    params: Promise<{ id: string }>;
}

export default async function ProblemPage({ params } : PostPageProps) {
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

    const typedExamples = (examples ?? []) as ProblemExample[];

    return <ProblemPageShell problem={typedProblem} examples={typedExamples} />;
}
