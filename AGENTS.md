# RULE 1: strict_reference_mode rule

## Purpose

Extend the project **without changing its existing coding style, structure, or architecture**.

## Reference Rule

If a reference file or module is provided, treat it as the **source of truth**.

Your task is to **replicate its structure and style**, not redesign it.

## Allowed Changes

* entity names
* variable names
* business logic values
* type definitions

## Forbidden Changes

* architecture changes
* new patterns or abstractions
* import reordering
* converting functions ↔ classes
* changing async or error handling style
* introducing new dependencies

## Style Lock

Match the reference exactly:

* same file structure
* same naming conventions
* same code patterns
* same formatting and indentation

Never mix styles.

## Output Requirement

Generated code must look like it was written by the **same developer who wrote the reference**.

Do not refactor, optimize, or improve the code.


# RULE 2: deep_analysis_before_implementation

## Principle

Do not start implementation until the relevant codebase has been fully analyzed.

## Analysis Requirement

Before writing any code:

1. Identify all files related to the task.
2. Read those files completely.
3. Understand their structure, dependencies, and data flow.
4. Determine how the new change fits into the existing architecture.

## Implementation Rule

Only begin coding **after a clear understanding of the system is formed**.

Do not guess or assume behavior.

## Consistency Requirement

Ensure the implementation follows:

* existing architecture
* existing patterns
* existing module relationships

## Important

If the analysis is incomplete, **do not implement yet**.
Continue reading and analyzing the relevant files first.

# RULE 3: minimal_change_rule

Modify only what is required to complete the task.

Do not change unrelated code.

Do not:

* reformat code
* rename variables
* reorder imports
* move functions
* restructure files

Preserve the existing code exactly unless the task explicitly requires a change.

# RULE 4: rule_trace

At the end of every response, list the rules that were applied.

Format:

Rules applied:

* rule_name_1
* rule_name_2
* rule_name_3

Only list rule names. Do not add explanations.

# RULE 5: clarification_before_implementation

## Principle

If the task is ambiguous, incomplete, or open to multiple interpretations, do not proceed with implementation immediately.

## Clarification Requirement

Before implementation, evaluate the task:

If the task is:

* clear
* well-defined
* consistent with existing patterns

→ proceed immediately without questions.

If the task is:

* ambiguous
* incomplete
* open to multiple interpretations

→ ask clarifying questions FIRST.

## Question Guidelines

Questions must be:

* specific and minimal (no unnecessary questions)
* directly related to implementation
* focused on removing ambiguity

## Implementation Rule

Only start implementation AFTER:

* all critical ambiguities are resolved
* expected behavior is clearly defined
## Important

Do NOT:

* assume missing details
* invent requirements
* proceed with “best guess” implementation


# RULE 6: prefer_library_over_custom_logic

## Principle

When working with external libraries, prefer using existing library methods and utilities over writing custom logic.

## When to Apply

This rule should be applied when:

a library already provides a built-in solution
the project is structured around specific libraries (e.g. UI frameworks, utility toolkits)
using the library improves consistency and readability

## Examples

Use built-in UI components and utilities from the chosen UI library instead of recreating them manually
Use utility functions provided by toolkits instead of native implementations when equivalents exist

## Exceptions

Custom logic is allowed ONLY when:

the library does not provide the required functionality
the existing solution is clearly insufficient or incompatible

## Important

Do NOT:

reimplement existing library features
mix native and library utilities inconsistently
ignore established library patterns used in the project

## Goal

Ensure:

consistency across the codebase
better maintainability
alignment with existing project dependencies



# RULE 7: task_difficulty_evaluation

## Purpose

Provide a quick assessment of task complexity after implementation.

## Requirement

At the end of the response, classify the task into one of the following levels:

junior
middle
senior

## Evaluation Criteria
junior
* straightforward implementation
* no architectural decisions
* minimal dependencies
* clear and isolated logic
middle
* involves multiple files or modules
* requires understanding of existing architecture
* moderate business logic
* some edge cases or integration involved
senior
* complex architecture involvement
* cross-module or system-wide impact
* requires careful design decisions
* high risk of breaking existing logic
* ambiguity or trade-offs involved

## Important

Do NOT:

* overestimate difficulty
* label everything as “senior”
* ignore actual complexity

## Output Format

At the end of the response, add:

Task difficulty: <junior | middle | senior>



# RULE 8: rule_priority_and_conflict_resolution

## Purpose

Define how to behave when multiple rules conflict.

## Priority Order (High → Low)
1. strict_reference_mode
2. deep_analysis_before_implementation
3. clarification_before_implementation
4. minimal_change_rule
5. prefer_library_over_custom_logic
6. rule_trace
7. task_difficulty_evaluation