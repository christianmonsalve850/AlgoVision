// languages/python/harness/analyzer.py.ts

export const ANALYZER_PYTHON_SCRIPT = `

class ExpressionCollector(ast.NodeVisitor):
    STATEMENT_TYPES = (ast.stmt, ast.ClassDef, ast.FunctionDef)

    def __init__(self, user_code):
        self.user_code = user_code
        self.expression_map = {
            index + 1: line.strip()
            for index, line in enumerate(user_code.splitlines())
        }
        self.line_types = {}

    def _collect_expression_text(self, node):
        if not isinstance(node, self.STATEMENT_TYPES) or not hasattr(node, "lineno"):
            return

        segment = ast.get_source_segment(self.user_code, node)
        if not segment:
            return

        first_line_of_segment = segment.splitlines()[0]
        self.expression_map[node.lineno] = first_line_of_segment

    def generic_visit(self, node):
        """
        Intercepts statements to populate the text expression map
        without breaking tree traversal.
        """
        self._collect_expression_text(node)
        super().generic_visit(node)

    def _resolve_target_name(self, node):
        if not node.targets:
            return None

        first_target = node.targets[0]
        if isinstance(first_target, ast.Name):
            return first_target.id

        if isinstance(first_target, ast.Subscript) and isinstance(first_target.value, ast.Name):
            return first_target.value.id

        return None

    def _record_line_type(self, lineno, line_type, target_name=None):
        metadata = {"type": line_type}
        if target_name is not None:
            metadata["target"] = target_name
        self.line_types[lineno] = metadata

    def visit_Assign(self, node):
        target_name = self._resolve_target_name(node)
        uses_subscript = any(isinstance(target, ast.Subscript) for target in node.targets)
        line_type = "mutation" if uses_subscript else "assignment"

        self._record_line_type(node.lineno, line_type, target_name)
        self.generic_visit(node)

    def visit_AugAssign(self, node):
        target_name = node.target.id if isinstance(node.target, ast.Name) else None
        self._record_line_type(node.lineno, "assignment", target_name)
        self.generic_visit(node)

    def visit_Return(self, node):
        self._record_line_type(node.lineno, "return")
        self.generic_visit(node)

    def visit_For(self, node):
        self._record_line_type(node.lineno, "loop")
        self.generic_visit(node)

    def visit_While(self, node):
        self._record_line_type(node.lineno, "loop")
        self.generic_visit(node)


class StaticAnalyzer:
    """
    Coordinator layer parsed internally by the Pyodide harness
    prior to starting runtime tracing passes.
    """
    @staticmethod
    def analyze(user_code: str):
        tree = ast.parse(user_code)
        collector = ExpressionCollector(user_code)
        collector.visit(tree)

        return {
            "expression_map": collector.expression_map,
            "line_metadata": collector.line_types
        }
`;