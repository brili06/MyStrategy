#!/bin/bash
# Initialize arrays for different file types
css_files=()
ts_files=()
js_files=()
supabase_functions_files=()

# Sort files into appropriate arrays
for arg in "$@"; do
  # Skip files with .json, no extensions, .lockb or .cjs extensions
  if [[ $arg == *.json || $arg == *.lockb || $arg == *.cjs || $arg != *.* ]]; then
    continue
  elif [[ $arg == supabase/functions* ]]; then
    supabase_functions_files+=("$arg")
  elif [[ $arg == *.css ]]; then
    css_files+=("$arg")
  elif [[ $arg == *.ts || $arg == *.tsx ]]; then
    ts_files+=("$arg")
  else
    js_files+=("$arg")
  fi
done

# Function to handle error output formatting
format_error() {
  local error_msg="$1"
  local file_name="$2"
  echo "<<<<<< CODE_ERROR_START $file_name"
  echo "$error_msg"
  echo "CODE_ERROR_END >>>>>>"
}

# Run Deno lint on supabase/functions files if there are any
if [ ${#supabase_functions_files[@]} -gt 0 ]; then
  for file in "${supabase_functions_files[@]}"; do
    deno_output=$(deno lint --compact "$file" 2>&1)
    exit_status=$?
    if [ $exit_status -ne 0 ]; then
      deno_error=$exit_status
      deno_output="Deno lint errors for $file:
${deno_output}"
      # Accumulate all deno errors
      all_deno_output="${all_deno_output:-}${deno_output}
===========================================
"
    else
      echo "✓ Successfully linted with Deno: $file"
    fi
  done

  # Only output deno errors if any exist
  if [ -n "$all_deno_output" ]; then
    error_file="${supabase_functions_files[0]}"
    format_error "$all_deno_output" "$error_file"
    exit ${deno_error:-1}
  fi

  # If we only processed supabase functions files, exit here
  if [ ${#css_files[@]} -eq 0 ] && [ ${#ts_files[@]} -eq 0 ] && [ ${#js_files[@]} -eq 0 ]; then
    exit 0
  fi
fi

# Run TypeScript check if there are any TS files
if [ ${#ts_files[@]} -gt 0 ]; then
  # Run tsc with project flag to use tsconfig.json
  output=$(npx tsc --noEmit --project tsconfig.json 2>&1)
  exit_status=$?
  if [ $exit_status -ne 0 ]; then
    ts_output="Detected TypeScript errors:
${output}"
    ts_error=$exit_status
  else
    echo "✓ Successfully type checked TypeScript files"
  fi
fi

# Run ESLint on all non-CSS files if there are any
if [ ${#js_files[@]} -gt 0 ] || [ ${#ts_files[@]} -gt 0 ]; then
  all_js_files=("${js_files[@]}" "${ts_files[@]}")
  # Properly handle files with special characters by using -- to separate options from filenames
  eslint_output=$(npx eslint --format unix -- "${all_js_files[@]}" 2>&1)
  exit_status=$?
  if [ $exit_status -ne 0 ]; then
    eslint_error=$exit_status
    eslint_output="ESLint errors:
${eslint_output}"
  fi
fi

# Run Stylelint on CSS files if there are any
if [ ${#css_files[@]} -gt 0 ]; then
  # Properly handle files with special characters by using -- to separate options from filenames
  stylelint_output=$(npx stylelint -- "${css_files[@]}" 2>&1)
  exit_status=$?
  if [ $exit_status -ne 0 ]; then
    stylelint_error=$exit_status
    stylelint_output="Stylelint errors:
${stylelint_output}"
  fi
  
  # Run Tailwind check
  if [ -n "${css_files[0]}" ]; then
    current_file="${css_files[0]}"
    output=$(npx tailwindcss -i "$current_file" 2>&1)
    exit_status=$?
    if [ $exit_status -ne 0 ]; then
      tailwind_error=$exit_status
      tailwind_output="Tailwind errors:
${output}"
    else
      echo "✓ Successfully processed Tailwind CSS for: $current_file"
    fi
  fi
fi

# Combine and output all errors if any exist
if [ -n "$ts_output" ] || [ -n "$eslint_output" ] || [ -n "$stylelint_output" ] || [ -n "$tailwind_output" ]; then
  error_message=""
  [ -n "$ts_output" ] && error_message+="${ts_output}
===========================================
"
  [ -n "$eslint_output" ] && error_message+="${eslint_output}
===========================================
"
  [ -n "$stylelint_output" ] && error_message+="${stylelint_output}
===========================================
"
  [ -n "$tailwind_output" ] && error_message+="${tailwind_output}"
  # Use the first available filename for the error message
  error_file="${ts_files[0]:-${js_files[0]:-${css_files[0]}}}"
  format_error "$error_message" "$error_file"
  # Exit with the first error code we encountered
  exit ${ts_error:-${eslint_error:-${stylelint_error:-${tailwind_error:-1}}}}
fi