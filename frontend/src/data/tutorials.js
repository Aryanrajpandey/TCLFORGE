export const TUTORIALS = [
  /* ══════════════════════════════════════════════════════
     TCL FUNDAMENTALS
  ══════════════════════════════════════════════════════ */
  {
    slug: 'variables-data-types',
    title: 'Variables & Data Types',
    parent: 'TCL Fundamentals',
    prev: null,
    next: 'expressions-operators',
    intro: 'In TCL everything is a string. There are no explicit data types — a value is interpreted as a number, list, or boolean depending on how it is used. Variables are created with the set command.',
    sections: [
      {
        heading: 'Creating Variables',
        body: 'Use the set command to assign a value. Variable names are case-sensitive.',
        code: `set name "TCL Forge"\nset version 2\nset pi 3.14159\n\nputs $name        ;# TCL Forge\nputs $version     ;# 2`,
      },
      {
        heading: 'Variable Substitution',
        body: 'Prefix a variable name with $ to substitute its value. Use curly braces to avoid ambiguity when the variable name is adjacent to other characters.',
        code: `set lang "TCL"\nputs "Language: $lang"\nputs "File: \${lang}_script.tcl"  ;# TCL_script.tcl`,
      },
      {
        heading: 'Integers and Floating Point',
        body: 'TCL treats numbers as strings, but numeric operations are performed correctly through the expr command. You can use hex (0x), octal (0), and binary (0b) literals.',
        code: `set a 10\nset b 3\nputs [expr {$a + $b}]     ;# 13\nputs [expr {$a / $b}]     ;# 3  (integer division)\nputs [expr {$a / 3.0}]    ;# 3.3333...\n\nset hex 0xFF\nputs $hex                  ;# 255`,
      },
      {
        heading: 'Boolean Values',
        body: 'TCL treats 0, "false", "no", and "off" as false; 1, "true", "yes", and "on" as true. These are typically used with if and while commands.',
        code: `set done false\nset count 0\n\nif {!$done} {\n    puts "Still running..."\n}`,
      },
      {
        heading: 'Unsetting Variables',
        body: 'Use unset to delete a variable. Use info exists to check if a variable exists before accessing it.',
        code: `set x 42\nputs [info exists x]   ;# 1\nunset x\nputs [info exists x]   ;# 0`,
      },
    ],
  },
  {
    slug: 'expressions-operators',
    title: 'Expressions & Operators',
    parent: 'TCL Fundamentals',
    prev: 'variables-data-types',
    next: 'control-flow',
    intro: 'TCL uses the expr command to evaluate mathematical and logical expressions. Always enclose expressions in curly braces to avoid double-substitution and improve performance.',
    sections: [
      {
        heading: 'The expr Command',
        body: 'expr evaluates an expression and returns its result. Enclosing the expression in {} is strongly recommended — it avoids a second round of substitution and lets TCL compile the expression.',
        code: `set a 10\nset b 4\n\nputs [expr {$a + $b}]   ;# 14\nputs [expr {$a - $b}]   ;# 6\nputs [expr {$a * $b}]   ;# 40\nputs [expr {$a / $b}]   ;# 2  (integer)\nputs [expr {$a % $b}]   ;# 2  (modulo)\nputs [expr {$a ** 2}]   ;# 100 (power)`,
      },
      {
        heading: 'Comparison Operators',
        body: 'Comparison operators return 1 (true) or 0 (false). Use == for numeric/string equality.',
        code: `set x 5\nputs [expr {$x == 5}]   ;# 1\nputs [expr {$x != 3}]   ;# 1\nputs [expr {$x > 3}]    ;# 1\nputs [expr {$x <= 4}]   ;# 0\n\n# String comparison\nputs [expr {"abc" eq "abc"}]  ;# 1\nputs [expr {"abc" ne "xyz"}]  ;# 1`,
      },
      {
        heading: 'Logical Operators',
        body: 'Use &&, ||, and ! for logical AND, OR, and NOT. Short-circuit evaluation applies.',
        code: `set x 5\nset y 10\n\nputs [expr {$x > 0 && $y > 0}]  ;# 1\nputs [expr {$x < 0 || $y > 0}]  ;# 1\nputs [expr {!($x == $y)}]        ;# 1`,
      },
      {
        heading: 'Math Functions',
        body: 'expr includes built-in math functions: abs, sqrt, ceil, floor, round, sin, cos, log, etc.',
        code: `puts [expr {sqrt(144)}]   ;# 12.0\nputs [expr {abs(-7)}]     ;# 7\nputs [expr {ceil(3.2)}]   ;# 4.0\nputs [expr {round(3.7)}]  ;# 4\nputs [expr {log(1)}]      ;# 0.0`,
      },
      {
        heading: 'Ternary-style with expr',
        body: 'TCL does not have a ternary operator, but you can simulate one with expr and the ? : syntax.',
        code: `set x 7\nset label [expr {$x > 5 ? "big" : "small"}]\nputs $label   ;# big`,
      },
    ],
  },
  {
    slug: 'control-flow',
    title: 'Control Flow (if / while / for)',
    parent: 'TCL Fundamentals',
    prev: 'expressions-operators',
    next: 'subst-quoting',
    intro: 'TCL control flow commands — if, while, for, foreach, switch — work like other languages but use TCL\'s braces to pass code blocks. Always use {} around conditions for performance.',
    sections: [
      {
        heading: 'if / elseif / else',
        body: 'The condition should be wrapped in curly braces so it is not evaluated before being passed to if.',
        code: `set score 85\n\nif {$score >= 90} {\n    puts "A Grade"\n} elseif {$score >= 75} {\n    puts "B Grade"\n} else {\n    puts "Below B"\n}`,
      },
      {
        heading: 'while Loop',
        body: 'Repeats a block while the condition is true. Use break to exit, continue to skip an iteration.',
        code: `set i 0\nwhile {$i < 5} {\n    puts "i = $i"\n    incr i\n}\n\n# incr is the idiomatic way to increment by 1`,
      },
      {
        heading: 'for Loop',
        body: 'The for command takes init, condition, step, and body. The step runs after each iteration.',
        code: `for {set i 0} {$i < 5} {incr i} {\n    puts "index: $i"\n}\n\n# Count down\nfor {set n 10} {$n > 0} {incr n -2} {\n    puts $n\n}`,
      },
      {
        heading: 'foreach Loop',
        body: 'Iterates over a list. You can iterate multiple variables at once.',
        code: `set tools {Genus Innovus Tempus}\nforeach tool $tools {\n    puts "EDA Tool: $tool"\n}\n\n# Two variables at once\nforeach {key val} {a 1 b 2 c 3} {\n    puts "$key -> $val"\n}`,
      },
      {
        heading: 'switch',
        body: 'switch matches a value against patterns. Use default as a fallback.',
        code: `set day "Mon"\nswitch $day {\n    Mon - Tue - Wed - Thu - Fri {\n        puts "Weekday"\n    }\n    Sat - Sun {\n        puts "Weekend"\n    }\n    default {\n        puts "Unknown"\n    }\n}`,
      },
    ],
  },
  {
    slug: 'subst-quoting',
    title: 'Subst & Quoting Rules',
    parent: 'TCL Fundamentals',
    prev: 'control-flow',
    next: 'list-commands',
    intro: 'Understanding TCL\'s substitution and quoting rules is critical. TCL performs three types of substitution: variable ($), command ([]), and backslash (\\). Quoting with "" or {} controls which substitutions happen.',
    sections: [
      {
        heading: 'Double Quotes vs Curly Braces',
        body: 'Inside double quotes, variable and command substitution happens. Inside curly braces, no substitution happens — the string is literal.',
        code: `set x 10\nputs "Value is $x"      ;# Value is 10\nputs {Value is $x}     ;# Value is $x  (literal)\n\nputs "Sum: [expr {2+2}]"  ;# Sum: 4\nputs {Sum: [expr {2+2}]}  ;# Sum: [expr {2+2}]`,
      },
      {
        heading: 'Command Substitution',
        body: 'Square brackets execute a command and substitute its return value.',
        code: `set result [expr {3 * 4}]\nputs $result   ;# 12\n\nset upper [string toupper "hello"]\nputs $upper    ;# HELLO\n\n# Nested command substitution\nputs [string length [string toupper "hello"]]  ;# 5`,
      },
      {
        heading: 'Backslash Substitution',
        body: 'A backslash escapes special characters or inserts special sequences like newline, tab.',
        code: `puts "Line1\\nLine2"    ;# two lines\nputs "Tab\\there"       ;# tab-separated\nputs "Quote: \\"text\\"" ;# Quote: "text"\n\n# Continue long lines with backslash\nset long_string "Part1 "\\\n    "Part2"`,
      },
      {
        heading: 'The subst Command',
        body: 'subst explicitly performs substitution on a string. Useful when you have a string in a variable that should be evaluated.',
        code: `set name "EDA"\nset template {Hello, $name!}\nputs [subst $template]   ;# Hello, EDA!`,
      },
    ],
  },

  /* ══════════════════════════════════════════════════════
     LISTS & ARRAYS
  ══════════════════════════════════════════════════════ */
  {
    slug: 'list-commands',
    title: 'List Commands',
    parent: 'Lists & Arrays',
    prev: 'subst-quoting',
    next: 'array-manipulation',
    intro: 'A TCL list is an ordered collection of elements separated by whitespace. TCL provides a rich set of list manipulation commands: list, lappend, llength, lindex, lrange, linsert, lreplace, and more.',
    sections: [
      {
        heading: 'Creating Lists',
        body: 'Use list to safely create a list, or assign a whitespace-separated string. For elements with spaces, use list command to avoid word-splitting issues.',
        code: `set tools [list Genus Innovus Tempus]\nputs $tools              ;# Genus Innovus Tempus\nputs [llength $tools]    ;# 3\n\n# Element with spaces — use list\nset items [list "Place Route" "Synthesis" "STA"]\nputs [llength $items]    ;# 3`,
      },
      {
        heading: 'Accessing Elements',
        body: 'lindex retrieves an element by 0-based index. Use end for the last element.',
        code: `set tools {Genus Innovus Tempus}\nputs [lindex $tools 0]      ;# Genus\nputs [lindex $tools end]    ;# Tempus\nputs [lindex $tools end-1]  ;# Innovus\n\n# Nested list access\nset nested {{a b} {c d}}\nputs [lindex $nested 0 1]   ;# b`,
      },
      {
        heading: 'Adding and Modifying',
        body: 'lappend adds to the end (in place). linsert inserts at an index. lreplace replaces elements.',
        code: `set lst {a b c}\nlappend lst d e\nputs $lst              ;# a b c d e\n\nset lst [linsert $lst 1 X]\nputs $lst              ;# a X b c d e\n\nset lst [lreplace $lst 0 1 Z]\nputs $lst              ;# Z b c d e`,
      },
      {
        heading: 'Slicing with lrange',
        body: 'lrange returns a sublist from index start to end.',
        code: `set lst {a b c d e f}\nputs [lrange $lst 1 3]     ;# b c d\nputs [lrange $lst 2 end]   ;# c d e f`,
      },
      {
        heading: 'Searching in Lists',
        body: 'lsearch returns the index of the first match, or -1 if not found.',
        code: `set tools {Genus Innovus Tempus Voltus}\nputs [lsearch $tools Tempus]    ;# 2\nputs [lsearch $tools PnR]       ;# -1\n\n# Case-insensitive search\nputs [lsearch -nocase $tools genus]  ;# 0\n\n# All matching indices\nputs [lsearch -all $tools *us]   ;# 0 2 3`,
      },
    ],
  },
  {
    slug: 'array-manipulation',
    title: 'Array Manipulation',
    parent: 'Lists & Arrays',
    prev: 'list-commands',
    next: 'lsort-lsearch',
    intro: 'TCL arrays are associative arrays (hash maps) — they map string keys to string values. Unlike simple variables, array names use parentheses for element access.',
    sections: [
      {
        heading: 'Creating Arrays',
        body: 'Assign elements using array(key) syntax with set, or use array set to initialise from a list.',
        code: `set timing(setup) 0.5\nset timing(hold)  0.1\nset timing(clock) 2.0\n\nputs $timing(setup)   ;# 0.5\n\n# Bulk init with array set\narray set config {tool Genus version 21.1 mode timing}\nputs $config(tool)    ;# Genus`,
      },
      {
        heading: 'Iterating Arrays',
        body: 'array names returns all keys. Use foreach to iterate.',
        code: `array set env {HOST server01 USER admin PORT 22}\n\nforeach key [array names env] {\n    puts "$key = $env($key)"\n}\n\n# Sorted keys\nforeach key [lsort [array names env]] {\n    puts "$key = $env($key)"\n}`,
      },
      {
        heading: 'Checking & Removing',
        body: 'info exists works on array elements too. unset removes a single element or the whole array.',
        code: `set data(x) 10\nputs [info exists data(x)]   ;# 1\nputs [info exists data(y)]   ;# 0\n\nunset data(x)                 ;# remove element\nunset data                    ;# remove whole array`,
      },
      {
        heading: 'Array Size and Export',
        body: 'array size returns the number of elements. array get returns a flat key-value list.',
        code: `array set scores {Alice 90 Bob 85 Carol 92}\nputs [array size scores]    ;# 3\nputs [array get scores]     ;# Alice 90 Bob 85 Carol 92`,
      },
    ],
  },
  {
    slug: 'lsort-lsearch',
    title: 'lsort & lsearch',
    parent: 'Lists & Arrays',
    prev: 'array-manipulation',
    next: 'string-commands',
    intro: 'lsort and lsearch are powerful list commands used heavily in EDA scripting to sort pin/net lists and search for design elements.',
    sections: [
      {
        heading: 'Basic Sorting',
        body: 'lsort defaults to case-sensitive ASCII sort. Use -nocase, -integer, -real, or -dictionary for different sort orders.',
        code: `set nets {CLK DATA_B data_a RESET}\nputs [lsort $nets]             ;# CLK DATA_B RESET data_a\nputs [lsort -nocase $nets]     ;# CLK DATA_B data_a RESET\nputs [lsort -dictionary $nets] ;# CLK DATA_B data_a RESET\n\nset nums {10 2 30 4}\nputs [lsort -integer $nums]    ;# 2 4 10 30`,
      },
      {
        heading: 'Sort Descending and Unique',
        body: 'Use -decreasing to reverse sort order. -unique removes duplicate elements.',
        code: `set vals {5 3 8 3 1 8}\nputs [lsort -integer -decreasing $vals]   ;# 8 8 5 3 3 1\nputs [lsort -integer -unique $vals]       ;# 1 3 5 8`,
      },
      {
        heading: 'Sort by Field (EDA use case)',
        body: 'Use -index to sort a list of sublists by a specific column — useful for sorting timing paths.',
        code: `set paths {\n    {path_A 1.23 MET}\n    {path_C 0.87 MET}\n    {path_B 2.10 VIOLATED}\n}\n# Sort by slack (index 1)\nset sorted [lsort -real -index 1 $paths]\nforeach p $sorted { puts $p }`,
      },
      {
        heading: 'lsearch Patterns',
        body: 'Use -glob for wildcard matching, -regexp for regex patterns. -inline returns values instead of indices.',
        code: `set signals {CLK_IN CLK_OUT DATA_IN DATA_OUT RESET}\n\n# Find all CLK signals\nputs [lsearch -all -glob $signals CLK*]       ;# 0 1\nputs [lsearch -all -inline -glob $signals CLK*]  ;# CLK_IN CLK_OUT\n\n# Regex\nputs [lsearch -all -inline -regexp $signals {DATA_.*}]  ;# DATA_IN DATA_OUT`,
      },
    ],
  },

  /* ══════════════════════════════════════════════════════
     STRING OPERATIONS
  ══════════════════════════════════════════════════════ */
  {
    slug: 'string-commands',
    title: 'string Commands',
    parent: 'String Operations',
    prev: 'lsort-lsearch',
    next: 'split-join',
    intro: 'The string command provides a rich set of sub-commands for manipulating text: length, index, range, compare, match, toupper, tolower, trim, replace, and more.',
    sections: [
      {
        heading: 'Basic String Operations',
        body: 'Common operations: length, index for single character access, range for slicing.',
        code: `set s "Genus Synthesis"\nputs [string length $s]         ;# 16\nputs [string index $s 0]        ;# G\nputs [string index $s end]      ;# s\nputs [string range $s 0 4]      ;# Genus\nputs [string range $s 6 end]    ;# Synthesis`,
      },
      {
        heading: 'Case Conversion',
        body: 'toupper and tolower convert case. totitle capitalises the first character of each word.',
        code: `set cmd "set_max_delay"\nputs [string toupper $cmd]   ;# SET_MAX_DELAY\nputs [string totitle $cmd]   ;# Set_Max_Delay`,
      },
      {
        heading: 'Searching and Matching',
        body: 'string first returns the index of the first occurrence. string match does glob-style pattern matching.',
        code: `set log "Warning: setup violation at path_A"\nputs [string first "Warning" $log]   ;# 0\nputs [string first "Error" $log]     ;# -1\n\n# Glob matching\nputs [string match "Warning:*" $log]  ;# 1\nputs [string match "*violation*" $log] ;# 1`,
      },
      {
        heading: 'Trimming and Replacing',
        body: 'trim removes characters from both ends. replace substitutes part of a string.',
        code: `set s "  hello  "\nputs [string trim $s]          ;# hello\nputs [string trimleft $s]       ;# hello  \nputs [string trimright $s]      ;#   hello\n\nset path "/home/user/design"\nputs [string replace $path 0 4 "/opt"]  ;# /opt/user/design`,
      },
    ],
  },
  {
    slug: 'split-join',
    title: 'split & join',
    parent: 'String Operations',
    prev: 'string-commands',
    next: 'format-scan',
    intro: 'split converts a string into a list by splitting on a delimiter. join is the inverse — it converts a list back into a string. These are used extensively in EDA scripting to parse tool output.',
    sections: [
      {
        heading: 'split',
        body: 'split takes a string and a split character. It returns a TCL list.',
        code: `set path "/usr/local/bin/tclsh"\nset parts [split $path /]\nputs $parts               ;# {} usr local bin tclsh\nputs [lindex $parts end]  ;# tclsh\n\n# Split on comma (CSV parsing)\nset csv "Genus,Innovus,Tempus"\nputs [split $csv ,]       ;# Genus Innovus Tempus`,
      },
      {
        heading: 'split on whitespace',
        body: 'When the split character is empty string or omitted, split splits on any whitespace.',
        code: `set line "  CLK    100MHz   setup  "\nset tokens [split $line]\n# Remove empty elements\nset clean [lsearch -all -inline $tokens ?*]\nputs $clean   ;# CLK 100MHz setup`,
      },
      {
        heading: 'join',
        body: 'join concatenates list elements with a separator string.',
        code: `set parts {usr local lib tcl8.6}\nputs [join $parts /]     ;# usr/local/lib/tcl8.6\n\nset words {Hello World from TCL}\nputs [join $words " "]   ;# Hello World from TCL\nputs [join $words "_"]   ;# Hello_World_from_TCL`,
      },
      {
        heading: 'Practical: parsing a log line',
        body: 'Combine split and lindex to extract fields from EDA tool output.',
        code: `set logline "Path: path_A  Slack: -0.23  Status: VIOLATED"\nset fields [split $logline :]\n\n# Get the slack value\nset slack_field [string trim [lindex $fields 2]]\nset slack [lindex [split $slack_field] 0]\nputs "Slack = $slack"    ;# -0.23`,
      },
    ],
  },
  {
    slug: 'format-scan',
    title: 'format & scan',
    parent: 'String Operations',
    prev: 'split-join',
    next: 'file-open-close',
    intro: 'format works like printf — it builds a formatted string. scan works like scanf — it parses a string according to a format spec. Both are useful for generating reports and parsing EDA tool output.',
    sections: [
      {
        heading: 'format',
        body: 'format uses C-style format specifiers: %s for strings, %d for integers, %f for floats, %e for scientific notation.',
        code: `set name "path_A"\nset slack -0.123\nset status "VIOLATED"\n\nputs [format "%-15s  %8.3f  %s" $name $slack $status]\n;# path_A            -0.123  VIOLATED\n\n# Padding numbers\nputs [format "%05d" 42]     ;# 00042\nputs [format "%.2f" 3.14159] ;# 3.14`,
      },
      {
        heading: 'scan',
        body: 'scan extracts values from a string matching a format. Returns the number of matched items.',
        code: `set line "CLK 125.000 MHz"\nscan $line "%s %f %s" name freq unit\nputs "Name: $name  Freq: $freq $unit"\n;# Name: CLK  Freq: 125.0 MHz\n\n# Parse a slack report line\nset report "setup  path_clk  -0.450"\nscan $report "%s %s %f" type path slack\nputs "Slack: $slack"   ;# -0.450`,
      },
    ],
  },

  /* ══════════════════════════════════════════════════════
     FILE HANDLING
  ══════════════════════════════════════════════════════ */
  {
    slug: 'file-open-close',
    title: 'open / close / gets',
    parent: 'File Handling',
    prev: 'format-scan',
    next: 'file-read-write',
    intro: 'TCL\'s file I/O is channel-based. open returns a channel ID. gets reads one line. close frees the channel. This is the foundation for log parsing and script generation in EDA flows.',
    sections: [
      {
        heading: 'Opening and Closing a File',
        body: 'open takes a filename and mode: r (read), w (write), a (append). Always close the channel when done.',
        code: `# Open for reading\nset fh [open "timing.rpt" r]\n\n# ... read from $fh ...\n\nclose $fh`,
      },
      {
        heading: 'Reading Line by Line with gets',
        body: 'gets reads one line, stripping the newline. Returns the number of characters read, or -1 at EOF.',
        code: `set fh [open "timing.rpt" r]\n\nwhile {[gets $fh line] >= 0} {\n    # $line contains each line of the file\n    if {[string match "*VIOLATED*" $line]} {\n        puts "VIOLATION: $line"\n    }\n}\n\nclose $fh`,
      },
      {
        heading: 'eof check',
        body: 'Alternatively, use eof to test for end-of-file inside a while loop.',
        code: `set fh [open "netlist.v" r]\n\nwhile {![eof $fh]} {\n    set line [gets $fh]\n    puts $line\n}\n\nclose $fh`,
      },
    ],
  },
  {
    slug: 'file-read-write',
    title: 'Read & Write Files',
    parent: 'File Handling',
    prev: 'file-open-close',
    next: 'glob-file-ops',
    intro: 'For full-file operations, read slurps the entire file into a string. puts writes a line. For large files, line-by-line processing with gets is more memory efficient.',
    sections: [
      {
        heading: 'Reading Entire File',
        body: 'read reads the whole file content at once. Split on newlines to get a list of lines.',
        code: `set fh [open "sdc.tcl" r]\nset content [read $fh]\nclose $fh\n\n# Process as list of lines\nforeach line [split $content \\n] {\n    if {[string match "create_clock*" $line]} {\n        puts "Found clock: $line"\n    }\n}`,
      },
      {
        heading: 'Writing to a File',
        body: 'Open with "w" to create/overwrite, "a" to append. puts writes a line with a trailing newline.',
        code: `set fh [open "report.txt" w]\n\nputs $fh "Timing Summary Report"\nputs $fh "=================="\nputs $fh [format "%-20s %8s" "Path" "Slack"]\n\nforeach {path slack} {path_A -0.1 path_B 0.5} {\n    puts $fh [format "%-20s %8.3f" $path $slack]\n}\n\nclose $fh`,
      },
      {
        heading: 'Appending to a File',
        body: 'Use "a" mode to add content without overwriting.',
        code: `set logfile "run.log"\n\nproc log_msg {msg} {\n    global logfile\n    set fh [open $logfile a]\n    puts $fh "[clock format [clock seconds]]: $msg"\n    close $fh\n}\n\nlog_msg "Synthesis started"\nlog_msg "Synthesis complete"`,
      },
    ],
  },
  {
    slug: 'glob-file-ops',
    title: 'glob & file ops',
    parent: 'File Handling',
    prev: 'file-read-write',
    next: 'defining-procs',
    intro: 'glob finds files matching a wildcard pattern. The file command provides utilities for testing, naming, and manipulating files and paths.',
    sections: [
      {
        heading: 'glob',
        body: 'glob returns a list of files matching a pattern. Use -nocomplain to avoid errors when no files match.',
        code: `# All .rpt files in current directory\nset reports [glob *.rpt]\n\n# Recursive search\nset logs [glob -nocomplain reports/**/*.log]\n\nforeach f $reports {\n    puts "Processing: $f"\n}`,
      },
      {
        heading: 'file Command',
        body: 'file provides sub-commands: exists, isfile, isdirectory, size, mtime, copy, delete, rename.',
        code: `set f "timing.rpt"\n\nputs [file exists $f]        ;# 1 or 0\nputs [file size $f]          ;# bytes\nputs [file extension $f]     ;# .rpt\nputs [file tail $f]          ;# timing.rpt\nputs [file dirname $f]       ;# .\n\n# Safe delete\nif {[file exists $f]} {\n    file delete $f\n}`,
      },
      {
        heading: 'Path Manipulation',
        body: 'file join builds paths portably. file normalize resolves .. and symlinks.',
        code: `set dir "/home/user/project"\nset name "synthesis.tcl"\nset path [file join $dir $name]\nputs $path   ;# /home/user/project/synthesis.tcl\n\nputs [file normalize "../other/file.tcl"]`,
      },
    ],
  },

  /* ══════════════════════════════════════════════════════
     PROCEDURES
  ══════════════════════════════════════════════════════ */
  {
    slug: 'defining-procs',
    title: 'Defining Procs',
    parent: 'Procedures',
    prev: 'glob-file-ops',
    next: 'scope-global-upvar',
    intro: 'Procedures are defined with the proc command. They take arguments and return a value with return. TCL procedures are the primary unit of code reuse in EDA scripting.',
    sections: [
      {
        heading: 'Basic Proc',
        body: 'proc takes the procedure name, argument list, and body.',
        code: `proc greet {name} {\n    return "Hello, $name!"\n}\n\nputs [greet "Engineer"]   ;# Hello, Engineer!`,
      },
      {
        heading: 'Default Arguments',
        body: 'An argument with a default value is optional. Defaults are specified as a two-element list {argname default}.',
        code: `proc connect {host {port 22} {user "admin"}} {\n    puts "Connecting to $user@$host:$port"\n}\n\nconnect server01           ;# Connecting to admin@server01:22\nconnect server01 2222      ;# Connecting to admin@server01:2222`,
      },
      {
        heading: 'Variable Arguments (args)',
        body: 'Use args as the last parameter to accept a variable number of arguments.',
        code: `proc sum args {\n    set total 0\n    foreach n $args {\n        set total [expr {$total + $n}]\n    }\n    return $total\n}\n\nputs [sum 1 2 3]       ;# 6\nputs [sum 10 20 30 40] ;# 100`,
      },
      {
        heading: 'Return Values',
        body: 'The return command exits a proc with a value. Without return, the result of the last command is returned.',
        code: `proc clamp {val min max} {\n    if {$val < $min} { return $min }\n    if {$val > $max} { return $max }\n    return $val\n}\n\nputs [clamp 5 0 10]   ;# 5\nputs [clamp -3 0 10]  ;# 0\nputs [clamp 15 0 10]  ;# 10`,
      },
    ],
  },
  {
    slug: 'scope-global-upvar',
    title: 'Scope: global / upvar',
    parent: 'Procedures',
    prev: 'defining-procs',
    next: 'namespace',
    intro: 'Each TCL procedure has its own local scope. Variables in the calling scope are not visible inside a proc unless you use global or upvar.',
    sections: [
      {
        heading: 'global',
        body: 'Declare a variable as global to access or modify it inside a proc.',
        code: `set run_count 0\n\nproc run_step {name} {\n    global run_count\n    incr run_count\n    puts "Step $run_count: $name"\n}\n\nrun_step "Synthesis"\nrun_step "Placement"\nputs "Total steps: $run_count"  ;# 2`,
      },
      {
        heading: 'upvar',
        body: 'upvar creates a local alias for a variable in a calling frame. More flexible than global.',
        code: `proc increment {varname} {\n    upvar $varname v\n    incr v\n}\n\nset counter 0\nincrement counter\nincrement counter\nputs $counter   ;# 2`,
      },
      {
        heading: 'upvar for arrays',
        body: 'upvar also works with arrays, allowing procs to receive arrays by reference.',
        code: `proc print_array {arrname} {\n    upvar $arrname arr\n    foreach key [lsort [array names arr]] {\n        puts "  $key = $arr($key)"\n    }\n}\n\narray set config {tool Genus mode eco}\nprint_array config`,
      },
    ],
  },
  {
    slug: 'namespace',
    title: 'Namespace',
    parent: 'Procedures',
    prev: 'scope-global-upvar',
    next: 'regexp-regsub',
    intro: 'Namespaces let you organise procedures and variables into logical groups, avoiding naming conflicts between scripts and libraries.',
    sections: [
      {
        heading: 'Creating a Namespace',
        body: 'namespace eval creates a namespace and evaluates commands inside it.',
        code: `namespace eval timing {\n    variable slack_threshold -0.1\n\n    proc check_path {slack} {\n        variable slack_threshold\n        if {$slack < $slack_threshold} {\n            return "VIOLATED"\n        }\n        return "MET"\n    }\n}\n\nputs [timing::check_path -0.5]  ;# VIOLATED\nputs [timing::check_path  0.2]  ;# MET`,
      },
      {
        heading: 'Namespace Variables',
        body: 'Use variable inside namespace eval to declare namespace-level variables.',
        code: `namespace eval db {\n    variable cells {}\n    variable nets  {}\n\n    proc add_cell {name} {\n        variable cells\n        lappend cells $name\n    }\n\n    proc get_cells {} {\n        variable cells\n        return $cells\n    }\n}\n\ndb::add_cell AND2_X1\ndb::add_cell OR2_X1\nputs [db::get_cells]   ;# AND2_X1 OR2_X1`,
      },
    ],
  },

  /* ══════════════════════════════════════════════════════
     REGEX & PARSING
  ══════════════════════════════════════════════════════ */
  {
    slug: 'regexp-regsub',
    title: 'regexp & regsub',
    parent: 'Regex & Parsing',
    prev: 'namespace',
    next: 'log-file-parsing',
    intro: 'regexp tests if a string matches a pattern and optionally extracts captured groups. regsub replaces matched substrings. Both are essential for parsing EDA tool output.',
    sections: [
      {
        heading: 'Basic regexp',
        body: 'regexp returns 1 if the pattern matches, 0 otherwise.',
        code: `set line "Warning: setup violation at U123/D"\n\nif {[regexp {Warning} $line]} {\n    puts "Found a warning"\n}\n\n# Case-insensitive\nif {[regexp -nocase {warning} $line]} {\n    puts "Case-insensitive match"\n}`,
      },
      {
        heading: 'Capturing Groups',
        body: 'Variables after the string capture the full match and each parenthesised group.',
        code: `set line "Slack: -0.453 (VIOLATED)"\n\nif {[regexp {Slack:\\s+([\\-\\d.]+)\\s+\\((\\w+)\\)} $line -> slack status]} {\n    puts "Slack:  $slack"   ;# -0.453\n    puts "Status: $status" ;# VIOLATED\n}`,
      },
      {
        heading: 'regexp -all and -inline',
        body: '-all counts all matches. -inline returns the matched strings instead of indices.',
        code: `set report "Error: E001 Error: E002 Warning: W001"\n\n# Count errors\nputs [regexp -all {Error:} $report]   ;# 2\n\n# Extract all error codes\nset codes [regexp -all -inline {E\\d+} $report]\nputs $codes   ;# E001 E002`,
      },
      {
        heading: 'regsub',
        body: 'regsub replaces the first match. Use -all to replace all matches.',
        code: `set path "setup/timing/path_A.rpt"\n\n# Replace extension\nregsub {\\.rpt$} $path ".txt" newpath\nputs $newpath   ;# setup/timing/path_A.txt\n\n# Replace all slashes with underscores\nregsub -all {/} $path "_" flat\nputs $flat   ;# setup_timing_path_A.rpt`,
      },
    ],
  },
  {
    slug: 'log-file-parsing',
    title: 'Log File Parsing',
    parent: 'Regex & Parsing',
    prev: 'regexp-regsub',
    next: null,
    intro: 'Parsing EDA tool log files is one of the most common TCL scripting tasks. You combine file I/O, string commands, split, and regexp to extract timing violations, errors, and warnings.',
    sections: [
      {
        heading: 'Parsing Timing Violations',
        body: 'Read a report file and collect all violated paths with their slack values.',
        code: `proc get_violations {filename} {\n    set violations {}\n    set fh [open $filename r]\n    while {[gets $fh line] >= 0} {\n        if {[regexp {(path_\\w+)\\s+([\\-\\d.]+)\\s+VIOLATED} $line -> path slack]} {\n            lappend violations [list $path $slack]\n        }\n    }\n    close $fh\n    return $violations\n}\n\nset viols [get_violations "timing.rpt"]\nforeach v [lsort -index 1 -real $viols] {\n    puts "[lindex $v 0]: [lindex $v 1]"\n}`,
      },
      {
        heading: 'Counting Errors and Warnings',
        body: 'A common pre- and post-run check in EDA flows.',
        code: `proc count_issues {logfile} {\n    set errors   0\n    set warnings 0\n    set fh [open $logfile r]\n    while {[gets $fh line] >= 0} {\n        if {[regexp -nocase {^\\s*error}   $line]} { incr errors   }\n        if {[regexp -nocase {^\\s*warning} $line]} { incr warnings }\n    }\n    close $fh\n    return [list $errors $warnings]\n}\n\nlassign [count_issues "run.log"] errors warnings\nputs "Errors: $errors  Warnings: $warnings"`,
      },
      {
        heading: 'Extracting SDC Clocks',
        body: 'Find all create_clock definitions in an SDC file.',
        code: `set fh [open "design.sdc" r]\nset clocks {}\n\nwhile {[gets $fh line] >= 0} {\n    if {[regexp {create_clock.*-name\\s+(\\S+).*-period\\s+([\\d.]+)} $line -> name period]} {\n        lappend clocks [list $name $period]\n    }\n}\nclose $fh\n\nforeach c $clocks {\n    puts "Clock [lindex $c 0] : [lindex $c 1] ns"\n}`,
      },
    ],
  },
];

export function getTutorial(slug) {
  return TUTORIALS.find(t => t.slug === slug) || null;
}

export const TOPIC_TREE = [
  {
    key: 'basics', label: 'TCL Fundamentals',
    items: [
      { label: 'Variables & Data Types',      slug: 'variables-data-types' },
      { label: 'Expressions & Operators',     slug: 'expressions-operators' },
      { label: 'Control Flow (if/while/for)', slug: 'control-flow' },
      { label: 'Subst & Quoting Rules',       slug: 'subst-quoting' },
    ],
  },
  {
    key: 'lists', label: 'Lists & Arrays',
    items: [
      { label: 'List Commands',     slug: 'list-commands' },
      { label: 'Array Manipulation', slug: 'array-manipulation' },
      { label: 'lsort & lsearch',   slug: 'lsort-lsearch' },
    ],
  },
  {
    key: 'strings', label: 'String Operations',
    items: [
      { label: 'string Commands', slug: 'string-commands' },
      { label: 'split & join',    slug: 'split-join' },
      { label: 'format & scan',   slug: 'format-scan' },
    ],
  },
  {
    key: 'fileio', label: 'File Handling',
    items: [
      { label: 'open / close / gets', slug: 'file-open-close' },
      { label: 'Read & Write Files',  slug: 'file-read-write' },
      { label: 'glob & file ops',     slug: 'glob-file-ops' },
    ],
  },
  {
    key: 'procs', label: 'Procedures',
    items: [
      { label: 'Defining Procs',       slug: 'defining-procs' },
      { label: 'Scope: global / upvar', slug: 'scope-global-upvar' },
      { label: 'Namespace',            slug: 'namespace' },
    ],
  },
  {
    key: 'regex', label: 'Regex & Parsing',
    items: [
      { label: 'regexp & regsub',  slug: 'regexp-regsub' },
      { label: 'Log File Parsing', slug: 'log-file-parsing' },
    ],
  },
  {
    key: 'eda', label: 'EDA Scripting',
    items: [
      { label: 'Genus — Synthesis', slug: null, to: '/interview' },
      { label: 'Innovus — P&R',     slug: null, to: '/interview' },
      { label: 'Tempus — STA',      slug: null, to: '/interview' },
    ],
  },
];
