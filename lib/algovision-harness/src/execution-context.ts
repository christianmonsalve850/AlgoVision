export const EXECUTION_CONTEXT_SCRIPT = `
class ExecutionContext:
    """
    Natively tracks the chronological state of the runner timeline
    without relying on unstable global pollution hooks.
    """
    def __init__(self):
        self.trace = []
        self.first_line = None
        self.execution_namespace = {}
        self.step_count = 0
        self.call_depth = 0
        self.last_emitted_step = None
        self.instruction_maps = {}

        
context = ExecutionContext()
`