import { useState } from "react";
import type { SubmissionsPanelProps } from "@/features/practice/problem-page/problem/types";

export function SubmissionsPanel({
    submissions,
    onLoadSubmission,
}: SubmissionsPanelProps) {
    const [status, setStatus] = useState("");

    if (!submissions || submissions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                <p className="text-sm">No submissions yet.</p>
                <p className="text-xs text-gray-500 mt-1">
                    Hit the Submit button to record your first attempt!
                </p>
            </div>
        );
    }

    const handleCopy = async (sourceCode: string) => {
        try {
            await navigator.clipboard.writeText(sourceCode);
            setStatus("Code copied to clipboard.");
        } catch (error) {
            console.error("Failed to copy submission code:", error);
            setStatus("Could not copy code. Check clipboard permissions.");
        }
    };

    return (
        <div className="flex h-full min-h-0 flex-col gap-3 overflow-y-auto p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Submission History ({submissions.length})
            </h3>
            {status && (
                <p role="status" className="text-xs text-muted-foreground">
                    {status}
                </p>
            )}
            <div className="flex flex-col gap-2">
                {submissions.map((sub) => {
                    const isAccepted = sub.verdict === 'accepted';
                    
                    return (
                        <div
                            key={sub.id}
                            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-background p-3"
                        >
                            <div className="flex min-w-0 items-center gap-3">
                                <span
                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                        isAccepted
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}
                                >
                                    {sub.verdict}
                                </span>
                                <span className="font-mono text-xs text-muted-foreground">
                                    {new Date(sub.submitted_at).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit',
                                    })}
                                    {' '}—{' '}
                                    {new Date(sub.submitted_at).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="flex shrink-0 items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => void handleCopy(sub.source_code)}
                                    className="rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
                                >
                                    Copy code
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onLoadSubmission(sub)}
                                    className="rounded-md bg-emerald-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-emerald-500"
                                >
                                    Load in editor
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}