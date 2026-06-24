import sys
import copy
import pprint
import linecache

# 1. This list will be our final "timeline" bucket
timeline = []

# stepNumber: number;
# line: number;
# functionName: string; // e.g., "floodFill" or "class Solution"
# expression: string;   // e.g., "class Solution:" or "if not image:"
# variables: Record<string, any>;

# 2. This is the tracer function that Python will trigger on EVERY line
# code_to_run = """
# nums = [10, 20]
# total = 0
# for x in nums:
#     total += x
# """

code_to_run = """
def two_sum(nums, target):
    seen = { }

    for i, num in enumerate(nums):
        complement = target - num

        if complement in seen:
            return [seen[complement], i]

        seen[num] = i

two_sum([2, 7, 11, 15], 9)
"""
source_lines = code_to_run.splitlines()

def mini_tracer(frame, event, arg):
    if event == "line":
        # Take a snapshot of the current local variables
        # Convert to dict first (Python 3.13 compatibility - frame.f_locals is FrameLocalsProxy)
        variable_snapshot = dict(frame.f_locals)
        variable_snapshot.pop('__builtins__', None)
        # Save the step to our timeline list
        line_number = frame.f_lineno
        step_number = len(timeline) + 1
        current_function = frame.f_code.co_name
        current_expression = source_lines[line_number - 1].strip()

        step_data = {
            "stepNumber": step_number,
            "line": line_number,
            "functionName": current_function,
            "expression": current_expression,
            "variables": variable_snapshot,
        }
        timeline.append(step_data)
            
            
    return mini_tracer

# 3. Here is a simple block of code we want to trace

print("--- Running the Code and Tracing ---")

# 4. Turn the monitor ON
sys.settrace(mini_tracer)

# 5. Execute the code string inside a clean dictionary scope
exec(code_to_run, {})

# 6. Turn the monitor OFF completely
sys.settrace(None)

print("\n--- The Resulting Timeline Array ---")
pprint.pprint(timeline)