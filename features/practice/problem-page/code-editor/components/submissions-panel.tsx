import { useState } from "react";
import type { SubmissionsPanelProps } from "@/features/practice/problem-page/problem/types";

export function SubmissionsPanel({
    submissions,
}: SubmissionsPanelProps) {
    const [selectedSubmissionId, setSelectedSubmissionId] = useState(
        submissions[0]?.id,
    );

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

    const selectedSubmission =
        submissions.find((submission) => submission.id === selectedSubmissionId) ??
        submissions[0];

    return (
        <div className="flex h-full flex-col gap-4 overflow-y-auto p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Submission History ({submissions.length})
            </h3>
            <div className="flex flex-col gap-2">
                {submissions.map((sub) => {
                    const isAccepted = sub.verdict === 'Accepted';
                    const isSelected = sub.id === selectedSubmission.id;
                    
                    return (
                        <button
                            type="button"
                            key={sub.id}
                            onClick={() => setSelectedSubmissionId(sub.id)}
                            aria-pressed={isSelected}
                            className={`flex items-center justify-between rounded-lg border p-3 text-left transition-colors ${
                                isSelected
                                    ? "border-accent-foreground/20 bg-accent text-accent-foreground"
                                    : "border-border bg-background text-foreground hover:bg-muted"
                            }`}
                        >
                            <div className="flex items-center space-x-3">
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
                            <span className="text-xs font-medium text-emerald-600">
                                {isSelected ? "Selected" : "View Code"}
                            </span>
                        </button>
                    );
                })}
            </div>
            <div className="min-h-0 flex-1 overflow-auto rounded-md border border-border bg-accent">
                <pre className="h-full overflow-auto p-4 text-xs text-foreground">
                    <code>{selectedSubmission.source_code}</code>
                </pre>
            </div>
        </div>
    );
}