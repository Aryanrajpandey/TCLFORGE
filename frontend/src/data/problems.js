// ── Problem data ────────────────────────────────────────────────────────────

export const PROBLEMS = [

  /* ── GENERAL ──────────────────────────────────────────────── */
  {
    id: 'g0', num: 1, category: 'General', difficulty: 'Easy',
    title: 'Variables & Arithmetic',
    tags: ['variables', 'expr'],
    description: `Declare three integer variables \`a = 15\`, \`b = 27\`, and \`c = 8\`, then print the following on separate lines:

- Their values in the format \`a=15 b=27 c=8\`
- Sum of all three: \`Sum: 50\`
- Product of \`a\` and \`b\`: \`Product a*b: 405\`
- Integer division \`b / c\`: \`b/c = 3\`
- Modulo \`b % c\`: \`b%c = 3\``,
    examples: [
      {
        output: `a=15 b=27 c=8\nSum: 50\nProduct a*b: 405\nb/c = 3\nb%c = 3`,
        explanation: 'Use set for variables and expr for all arithmetic. Integer division between two integers returns an integer in Tcl.',
      },
    ],
    constraints: [
      'Use set to declare all variables.',
      'Use expr {…} for arithmetic — never bare expressions.',
    ],
    hints: [
      '`set a 15` declares an integer variable.',
      '`expr {$a + $b + $c}` computes the sum.',
      '`expr {$a * $b}` computes the product.',
      '`expr {$b / $c}` gives integer division when both operands are integers.',
      '`expr {$b % $c}` computes the remainder.',
      'Embed expressions in strings: `puts "Sum: [expr {$a+$b+$c}]"`',
    ],
    starterCode: `# Variables & Arithmetic
set a 15
set b 27
set c 8

puts "a=$a b=$b c=$c"
# Print: Sum: 50
# Print: Product a*b: 405
# Print: b/c = 3
# Print: b%c = 3
`,
    expected: ['set', 'puts', 'expr'],
  },

  {
    id: 'g1', num: 2, category: 'General', difficulty: 'Easy',
    title: 'String Operations',
    tags: ['strings'],
    description: `Given the string \`"TCL Scripting for EDA Automation"\`, perform each operation and print the result on a separate line:

1. Its **length**
2. **Uppercase** version
3. **Lowercase** version
4. Characters at indices **4 through 12** (inclusive)
5. Replace **"EDA"** with **"Physical Design"**
6. Print **1** if the string contains \`"TCL"\`, else **0**`,
    examples: [
      {
        output: `Length: 32\nUpper: TCL SCRIPTING FOR EDA AUTOMATION\nLower: tcl scripting for eda automation\nRange: Scripting\nReplaced: TCL Scripting for Physical Design Automation\nContains TCL: 1`,
        explanation: 'Use string sub-commands: length, toupper, tolower, range, map, match.',
      },
    ],
    constraints: [
      'Use only built-in string commands.',
      'No manual character-by-character loops needed.',
    ],
    hints: [
      '`string length $s` — character count.',
      '`string toupper $s` / `string tolower $s`',
      '`string range $s 4 12` — extract slice.',
      '`string map {EDA "Physical Design"} $s` — substring replacement.',
      '`string match *TCL* $s` returns 1 if the pattern matches.',
    ],
    starterCode: `set s "TCL Scripting for EDA Automation"

# 1. Length
puts "Length: [string length $s]"

# 2. Uppercase

# 3. Lowercase

# 4. Range index 4-12

# 5. Replace EDA with Physical Design

# 6. Contains "TCL"? (1 or 0)
`,
    expected: ['string', 'puts'],
  },

  {
    id: 'g2', num: 3, category: 'General', difficulty: 'Easy',
    title: 'List Processor',
    tags: ['lists'],
    description: `Given the list \`{apple banana cherry date elderberry fig}\`, print:

1. Total **length** of the list
2. Element at **index 2**
3. List sorted **alphabetically**
4. List sorted in **reverse** alphabetical order
5. The list after **appending** \`"grape"\`
6. The **index** of \`"date"\` in the original list`,
    examples: [
      {
        output: `Length: 6\nIndex 2: cherry\nSorted: apple banana cherry date elderberry fig\nReverse: fig elderberry date cherry banana apple\nAppended: apple banana cherry date elderberry fig grape\nIndex of date: 3`,
        explanation: 'Use llength, lindex, lsort, lappend, lsearch.',
      },
    ],
    constraints: ['Use built-in list commands — no manual sorting.'],
    hints: [
      '`llength $fruits` — number of elements.',
      '`lindex $fruits 2` — element at position 2.',
      '`lsort $fruits` — ascending sort.',
      '`lsort -decreasing $fruits` — descending sort.',
      '`lappend fruits grape` — appends in place (modifies the variable).',
      '`lsearch $fruits "date"` — returns the index.',
    ],
    starterCode: `set fruits {apple banana cherry date elderberry fig}

# 1. Length

# 2. Element at index 2

# 3. Sorted alphabetically

# 4. Reverse sorted

# 5. After appending "grape"

# 6. Index of "date"
`,
    expected: ['lsort', 'lindex', 'lappend', 'lsearch', 'llength'],
  },

  {
    id: 'g3', num: 4, category: 'General', difficulty: 'Medium',
    title: 'Fibonacci Generator',
    tags: ['recursion', 'proc'],
    description: `Write a TCL procedure named \`fibonacci\` that takes a non-negative integer \`n\` and returns the nth Fibonacci number (0-indexed: fib(0)=0, fib(1)=1).

Then print:
- The **first 10** Fibonacci numbers on one line, space-separated, labelled \`Series:\`
- \`fib(10) = 55\`
- \`fib(15) = 610\``,
    examples: [
      {
        output: `Series: 0 1 1 2 3 5 8 13 21 34\nfib(10) = 55\nfib(15) = 610`,
        explanation: 'Recursive proc: base cases n≤0→0 and n==1→1, recursive case fib(n-1)+fib(n-2).',
      },
    ],
    constraints: [
      'The proc must be named exactly `fibonacci`.',
      'fib(0) = 0, fib(1) = 1.',
    ],
    hints: [
      '`proc fibonacci {n} { ... }` defines the procedure.',
      'Base case: `if {$n <= 0} { return 0 }`',
      'Base case: `if {$n == 1} { return 1 }`',
      'Recursive: `return [expr {[fibonacci [expr {$n-1}]] + [fibonacci [expr {$n-2}]]}]`',
      'Build series: `for {set i 0} {$i < 10} {incr i} { lappend s [fibonacci $i] }`',
      '`join $s " "` converts a list to a space-separated string.',
    ],
    starterCode: `proc fibonacci {n} {
    if {$n <= 0} { return 0 }
    if {$n == 1} { return 1 }
    # Recursive case here
}

# Build first 10 fibonacci numbers
set series {}
for {set i 0} {$i < 10} {incr i} {
    lappend series [fibonacci $i]
}
puts "Series: [join $series " "]"

# Print fib(10) and fib(15)
`,
    expected: ['proc', 'fibonacci', 'return', 'expr'],
  },

  {
    id: 'g4', num: 5, category: 'General', difficulty: 'Medium',
    title: 'Word Frequency Counter',
    tags: ['arrays', 'strings', 'loops'],
    description: `Count the frequency of each word (case-insensitive) in the text below and print each word with its count, sorted **alphabetically**.

**Input text:**
\`the quick brown fox jumps over the lazy dog the fox\`

**Output format:** \`word: count\` (one per line, alphabetically sorted)`,
    examples: [
      {
        output: `brown: 1\ndog: 1\nfox: 2\njumps: 1\nlazy: 1\nover: 1\nquick: 1\nthe: 3`,
        explanation: 'Lowercase → split into words → count with an array → sort array keys → print.',
      },
    ],
    constraints: [
      'Must be case-insensitive.',
      'Output must be alphabetically sorted.',
    ],
    hints: [
      '`string tolower $text` — normalize case.',
      '`split $text` — splits on whitespace into a list.',
      '`foreach word $words { incr freq($word) }` — count with array.',
      '`array names freq` — get all keys.',
      '`lsort [array names freq]` — sort keys alphabetically.',
    ],
    starterCode: `set text "the quick brown fox jumps over the lazy dog the fox"

# Step 1: lowercase and split
set words [split [string tolower $text]]

# Step 2: count with array
# array set freq {}
# foreach word $words { incr freq($word) }

# Step 3: print sorted
# foreach key [lsort [array names freq]] { ... }
`,
    expected: ['split', 'array', 'foreach', 'incr', 'lsort'],
  },

  {
    id: 'g5', num: 6, category: 'General', difficulty: 'Medium',
    title: 'Simple Calculator',
    tags: ['proc', 'switch'],
    description: `Write a procedure \`calculate\` that accepts two numbers and an operator (\`+\`, \`-\`, \`*\`, \`/\`) and returns the result. Division should return a decimal. Division by zero should return the string \`"Error: Division by zero"\`.

Print the result of each test case in the format: \`a op b = result\`

**Test cases:**
- 10 + 5
- 20 - 8
- 6 * 7
- 15 / 4
- 10 / 0`,
    examples: [
      {
        output: `10 + 5 = 15\n20 - 8 = 12\n6 * 7 = 42\n15 / 4 = 3.75\n10 / 0 = Error: Division by zero`,
        explanation: 'Use switch inside the proc for each operator. For division use double() to force decimal output.',
      },
    ],
    constraints: [
      'Proc must be named `calculate`.',
      'Division must return a decimal (not integer).',
      'Division by zero returns a string error message.',
    ],
    hints: [
      '`switch $op { + { return [expr {$a + $b}] } ... }`',
      'For division: `if {$b == 0} { return "Error: Division by zero" }`',
      '`expr {double($a) / $b}` forces floating-point division.',
      'Call with: `puts "10 + 5 = [calculate 10 + 5]"`',
    ],
    starterCode: `proc calculate {a op b} {
    switch $op {
        "+" { return [expr {$a + $b}] }
        "-" { return [expr {$a - $b}] }
        "*" { return [expr {$a * $b}] }
        "/" {
            # Handle division by zero
            # Return decimal result
        }
        default { return "Error: Unknown operator $op" }
    }
}

puts "10 + 5 = [calculate 10 + 5]"
puts "20 - 8 = [calculate 20 - 8]"
puts "6 * 7 = [calculate 6 * 7]"
puts "15 / 4 = [calculate 15 / 4]"
puts "10 / 0 = [calculate 10 / 0]"
`,
    expected: ['proc', 'switch', 'expr', 'return'],
  },

  /* ── PD-BASED ─────────────────────────────────────────────── */
  {
    id: 'p0', num: 1, category: 'PD-Based', difficulty: 'Medium',
    title: 'SDC Clock Extractor',
    tags: ['regexp', 'SDC', 'EDA'],
    description: `Parse the SDC content below and extract every \`create_clock\` definition.

For each clock, print its **name** and **period** in the format:
\`Clock: <name>, Period: <period>ns\``,
    examples: [
      {
        input: 'SDC with three create_clock lines',
        output: `Clock: clk_core, Period: 10.0ns\nClock: clk_io, Period: 20.0ns\nClock: clk_ddr, Period: 3.75ns`,
        explanation: 'Use regexp to extract -name and -period from each create_clock line.',
      },
    ],
    constraints: [
      'Only process create_clock lines.',
      'Handle any number of clock definitions.',
    ],
    hints: [
      '`foreach line [split $sdc "\\n"]` — iterate line by line.',
      '`string match *create_clock* $line` — quick pre-filter.',
      '`regexp {-name\\s+(\\S+)} $line -> _ name` — extract name.',
      '`regexp {-period\\s+([\\d.]+)} $line -> _ period` — extract period.',
    ],
    starterCode: `set sdc {
create_clock -name clk_core -period 10.0 [get_ports clk]
create_clock -name clk_io   -period 20.0 [get_ports io_clk]
create_clock -name clk_ddr  -period 3.75 [get_ports ddr_clk]
set_input_delay  -clock clk_core 2.0 [get_ports data_in]
set_output_delay -clock clk_core 1.5 [get_ports data_out]
}

foreach line [split $sdc "\\n"] {
    if {[string match *create_clock* $line]} {
        # Extract -name and -period with regexp
        # puts "Clock: $name, Period: \${period}ns"
    }
}
`,
    expected: ['regexp', 'foreach', 'split', 'create_clock'],
  },

  {
    id: 'p1', num: 2, category: 'PD-Based', difficulty: 'Medium',
    title: 'Timing Slack Analyzer',
    tags: ['regexp', 'timing', 'EDA'],
    description: `Parse the timing report below. For each path, determine whether it **PASS**es (slack ≥ 0) or **FAIL**s (slack < 0) and print the result.

**Output per path:** \`Path N: PASS (slack=X)\` or \`Path N: FAIL (slack=X)\`

**Final summary line:** \`Total: N | Pass: P | Fail: F\``,
    examples: [
      {
        output: `Path 1: PASS (slack=0.45)\nPath 2: FAIL (slack=-0.12)\nPath 3: PASS (slack=1.20)\nPath 4: FAIL (slack=-0.05)\n---\nTotal: 4 | Pass: 2 | Fail: 2`,
        explanation: 'Extract path number and slack value, then compare slack to 0.',
      },
    ],
    constraints: ['Slack values can be positive or negative decimals.'],
    hints: [
      '`regexp {Path (\\d+).*slack = ([\\-\\d.]+)} $line -> _ pathNum slack`',
      '`if {$slack >= 0}` → PASS, else FAIL.',
      'Use `incr pass` and `incr fail` counters.',
    ],
    starterCode: `set report {
Path 1 (clk->out_a): slack = 0.45
Path 2 (clk->out_b): slack = -0.12
Path 3 (clk->out_c): slack = 1.20
Path 4 (clk->out_d): slack = -0.05
}

set pass 0
set fail 0
set total 0

foreach line [split $report "\\n"] {
    if {[regexp {Path (\\d+).*slack = ([\\-\\d.]+)} $line -> pathNum slack]} {
        incr total
        # Determine PASS or FAIL
        # puts "Path $pathNum: ..."
    }
}

puts "---"
puts "Total: $total | Pass: $pass | Fail: $fail"
`,
    expected: ['regexp', 'foreach', 'incr', 'if'],
  },

  {
    id: 'p2', num: 3, category: 'PD-Based', difficulty: 'Hard',
    title: 'Log Error Summarizer',
    tags: ['regexp', 'parsing', 'EDA'],
    description: `Parse the synthesis log and extract every **ERROR** and **WARNING** line.

For each, print: \`[ERROR] <message>\` or \`[WARNING] <message>\`

At the end print: \`---\` followed by \`Total Errors: N | Total Warnings: M\`

Skip all INFO and blank lines.`,
    examples: [
      {
        output: `[WARNING] Undriven net 'n_1234' in module top\n[ERROR] Cannot resolve reference 'undefined_cell'\n[WARNING] Timing arc missing for cell INV_X4\n[ERROR] Elaboration failed for module alu_core\n---\nTotal Errors: 2 | Total Warnings: 2`,
        explanation: 'Use regexp or string match to detect level, extract the message after the colon.',
      },
    ],
    constraints: [
      'Print errors/warnings in the order they appear.',
      'Skip INFO lines entirely.',
    ],
    hints: [
      '`regexp {^(ERROR|WARNING): (.+)} $line -> _ level msg`',
      'Or: `if {[string match "ERROR:*" $line]}` for simpler detection.',
      '`string trim $line` removes leading/trailing whitespace.',
      'Use `incr errCount` and `incr warnCount`.',
    ],
    starterCode: `set log {
INFO: Starting synthesis...
WARNING: Undriven net 'n_1234' in module top
INFO: Reading liberty file...
ERROR: Cannot resolve reference 'undefined_cell'
WARNING: Timing arc missing for cell INV_X4
ERROR: Elaboration failed for module alu_core
INFO: Done.
}

set errCount  0
set warnCount 0

foreach line [split $log "\\n"] {
    set line [string trim $line]
    if {$line eq ""} { continue }
    # Detect ERROR or WARNING, print, and count
}

puts "---"
puts "Total Errors: $errCount | Total Warnings: $warnCount"
`,
    expected: ['regexp', 'foreach', 'incr', 'string'],
  },

  {
    id: 'p3', num: 4, category: 'PD-Based', difficulty: 'Hard',
    title: 'Liberty Cell Extractor',
    tags: ['regexp', 'liberty', 'EDA'],
    description: `Parse the Liberty (.lib) snippet below and extract every **cell name**.

Print each cell as: \`Cell: <name>\`

Then print the total: \`Total cells: N\``,
    examples: [
      {
        output: `Cell: INV_X1\nCell: BUF_X2\nCell: AND2_X1\nCell: OR2_X1\nCell: NAND2_X1\nCell: NOR2_X1\nCell: DFFS_X1\nTotal cells: 7`,
        explanation: 'Match lines containing cell(NAME) with regexp and capture the cell name inside the parentheses.',
      },
    ],
    constraints: ['Cell names contain only letters, digits, and underscores.'],
    hints: [
      '`regexp {cell\\((\\w+)\\)} $line -> _ cellName`',
      'Collect names: `lappend cells $cellName`',
      '`puts "Total cells: [llength $cells]"`',
    ],
    starterCode: `set lib {
library(my_lib) {
  cell(INV_X1)   { area: 1.0; }
  cell(BUF_X2)   { area: 2.0; }
  cell(AND2_X1)  { area: 1.5; }
  cell(OR2_X1)   { area: 1.5; }
  cell(NAND2_X1) { area: 1.2; }
  cell(NOR2_X1)  { area: 1.2; }
  cell(DFFS_X1)  { area: 5.0; }
}
}

set cells {}

foreach line [split $lib "\\n"] {
    # Match cell(...) and extract the name
}

# Print each cell name
# puts "Total cells: ..."
`,
    expected: ['regexp', 'foreach', 'lappend', 'llength'],
  },

  {
    id: 'p4', num: 5, category: 'PD-Based', difficulty: 'Hard',
    title: 'SDC Constraint Validator',
    tags: ['regexp', 'validation', 'EDA'],
    description: `Validate the SDC below for these three issues:

1. **Duplicate clock names** — same \`-name\` used more than once
2. **Missing clock source** — \`create_clock\` without \`[get_ports ...]\`
3. **Zero or negative period** — period ≤ 0

For each issue print: \`[ERROR] <description>\`

End with: \`---\` and \`Validation complete: N errors found.\`

If no issues are found print \`SDC validation passed.\` before the summary.`,
    examples: [
      {
        output: `[ERROR] Duplicate clock name: clk_core\n[ERROR] Negative/zero period for clock: clk_bad (-1.0)\n[ERROR] Missing clock source (no get_ports): clk_nosrc\n---\nValidation complete: 3 errors found.`,
        explanation: 'Track seen names in an array; check period sign; check for get_ports presence.',
      },
    ],
    constraints: ['Must detect all three error types.', 'Print errors in the order they are detected.'],
    hints: [
      '`array set seen {}` to track clock names seen so far.',
      '`regexp {-name\\s+(\\S+)} $line -> _ name` — extract clock name.',
      '`regexp {-period\\s+([\\-\\d.]+)} $line -> _ period` — extract period.',
      '`if {[info exists seen($name)]}` — duplicate check.',
      '`if {$period <= 0}` — invalid period check.',
      '`if {![string match *get_ports* $line]}` — missing source check.',
    ],
    starterCode: `set sdc {
create_clock -name clk_core -period 10.0 [get_ports clk]
create_clock -name clk_core -period  8.0 [get_ports clk2]
create_clock -name clk_io   -period 20.0 [get_ports io_clk]
create_clock -name clk_bad  -period -1.0 [get_ports bad_clk]
create_clock -name clk_nosrc -period 5.0
}

set errCount 0
array set seen {}

foreach line [split $sdc "\\n"] {
    set line [string trim $line]
    if {![string match "create_clock*" $line]} { continue }
    # 1. Extract name → check duplicate
    # 2. Extract period → check <= 0
    # 3. Check get_ports present
}

puts "---"
puts "Validation complete: $errCount errors found."
`,
    expected: ['regexp', 'array', 'foreach', 'if', 'incr'],
  },
];

// ── Quizzes ──────────────────────────────────────────────────────────────────
export const QUIZZES = [
  { q: 'Which command reads a line from an open file handle?',     a: 'gets' },
  { q: 'Which command prints output to the console in TCL?',       a: 'puts' },
  { q: 'How do you concatenate two lists in TCL?',                 a: 'concat' },
  { q: "What does `info vars` return?",                            a: 'list of variables' },
  { q: 'Which keyword defines a reusable procedure in TCL?',       a: 'proc' },
  { q: 'How do you get the current Unix timestamp?',               a: 'clock seconds' },
  { q: 'Which command sorts a Tcl list alphabetically?',           a: 'lsort' },
  { q: 'How do you check numeric equality inside expr?',           a: '==' },
  { q: 'Which command removes a variable from scope?',             a: 'unset' },
  { q: 'How do you access command-line arguments in TCL?',         a: 'argv' },
  { q: "What does `create_clock` define in an SDC file?",          a: 'clock constraint' },
  { q: 'Which file format defines standard cell timing data?',     a: 'liberty' },
  { q: 'Which TCL command matches patterns in strings?',           a: 'regexp' },
  { q: "What does `set_input_delay` do in an SDC context?",        a: 'defines input delay constraint' },
  { q: 'Which file format stores a gate-level netlist?',           a: 'verilog' },
  { q: 'What TCL command increments an integer variable by 1?',    a: 'incr' },
  { q: 'Which command appends an element to a TCL list variable?', a: 'lappend' },
  { q: 'How do you iterate over a list in TCL?',                   a: 'foreach' },
  { q: 'Which file format holds placement/routing constraints?',   a: 'sdc' },
  { q: 'How do you get the number of elements in a TCL list?',     a: 'llength' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
export function getProblemById(id) {
  return PROBLEMS.find((p) => p.id === id) ?? null;
}

export function isUnlocked(/* problem */) {
  return true; // all problems open — scoring still works for XP
}

export function getScore(id) {
  return parseInt(localStorage.getItem(`score-${id}`) || '0');
}

export function saveScore(id, score) {
  localStorage.setItem(`score-${id}`, score);
}

export function unlockNext(currentId) {
  const match = currentId.match(/^([a-z]+)(\d+)$/);
  if (!match) return;
  const [, prefix, numStr] = match;
  const next = `${prefix}${parseInt(numStr) + 1}`;
  localStorage.setItem(`unlocked-${next}`, 'true');
}

// miniTclOutput is the string returned by MiniTclEnv.eval()
export function computeScore(code, miniTclOutput, problem) {
  let score = 0;
  // 1. Expected keywords present (up to 40 pts)
  const kwPts = 40 / Math.max(problem.expected.length, 1);
  problem.expected.forEach((k) => { if (code.includes(k)) score += kwPts; });
  // 2. No errors in output (20 pts)
  if (miniTclOutput && !miniTclOutput.trimStart().startsWith('Error:')) score += 20;
  // 3. Produces some output (20 pts)
  if (miniTclOutput?.trim()) score += 20;
  // 4. Complexity bonuses (up to 20 pts)
  if (/proc\s+\w+/.test(code))             score += 5;
  if (/if\s*\{/.test(code))                score += 4;
  if (/while|foreach|for\s*\{/.test(code)) score += 4;
  if (/regexp/.test(code))                 score += 4;
  if (code.length > 100)                   score += 3;
  return Math.min(100, Math.round(score));
}
