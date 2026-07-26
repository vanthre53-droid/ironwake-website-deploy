#!/usr/bin/env bash
set -euo pipefail

root="${1:-}"
if [[ -z "$root" || ! -d "$root" ]]; then
  echo "Usage: $0 /path/to/unzipped-stitch-export" >&2
  exit 2
fi

if ! command -v rg >/dev/null 2>&1; then
  echo "This audit requires ripgrep (rg)." >&2
  exit 2
fi

mapfile -t html_files < <(find "$root" -type f -name 'code.html' -print | sort)
mapfile -t png_files < <(find "$root" -type f -name 'screen.png' -print | sort)
mapfile -t design_files < <(find "$root" -type f -name 'DESIGN.md' -print | sort)

echo "# Stitch Export Audit"
echo
echo "- Root: $root"
echo "- HTML screens: ${#html_files[@]}"
echo "- PNG screens: ${#png_files[@]}"
echo "- DESIGN.md files: ${#design_files[@]}"
echo

if ((${#html_files[@]} == 0)); then
  echo "No code.html files found." >&2
  exit 1
fi

echo "## Global counts"
echo
printf '%s\n' "- HTML files with Tailwind CDN: $(rg -l 'cdn\.tailwindcss\.com' "${html_files[@]}" | wc -l | tr -d ' ')"
printf '%s\n' "- HTML files with inline script: $(rg -l '<script' "${html_files[@]}" | wc -l | tr -d ' ')"
printf '%s\n' "- HTML files with form element: $(rg -l '<form' "${html_files[@]}" | wc -l | tr -d ' ')"
printf '%s\n' "- HTML files with inputs: $(rg -l '<input|<textarea|<select' "${html_files[@]}" | wc -l | tr -d ' ')"
printf '%s\n' "- External URL occurrences: $(rg -o 'https?://[^\"'"'"' )]+' "${html_files[@]}" | wc -l | tr -d ' ')"
printf '%s\n' "- Google aida-public asset occurrences: $(rg -o 'lh3\.googleusercontent\.com/aida-public' "${html_files[@]}" | wc -l | tr -d ' ')"
echo

echo "## Screen inventory"
echo
echo "| Screen | Title | Forms | Inputs | External URLs |"
echo "|---|---|---:|---:|---:|"
for file in "${html_files[@]}"; do
  screen="$(basename "$(dirname "$file")")"
  title="$( (rg -o '<title>[^<]+' "$file" || true) | head -1 | sed 's/<title>//' | tr '|' '/')"
  forms="$( (rg -o '<form' "$file" || true) | wc -l | tr -d ' ')"
  inputs="$( (rg -o '<input|<textarea|<select' "$file" || true) | wc -l | tr -d ' ')"
  urls="$( (rg -o 'https?://[^\"'"'"' )]+' "$file" || true) | wc -l | tr -d ' ')"
  echo "| $screen | ${title:-NO TITLE} | $forms | $inputs | $urls |"
done
echo

echo "## Claim/price quarantine candidates"
echo
echo '```text'
rg -n -i '₹|\$[0-9]|[0-9]+%|guarantee|benchmark|audited [0-9]+|[0-9]+ (clients|locations|platforms|bookings)|testimonial|trusted by|proprietary|live integration|real-time' "${html_files[@]}" || true
echo '```'
echo

echo "## External asset/URL ledger candidates"
echo
echo '```text'
rg -n -o 'https?://[^\"'"'"' )]+' "${html_files[@]}" | sort -u || true
echo '```'
echo
echo "Review every candidate manually. A match is not proof of falsity, and absence of a match is not proof of truth."
