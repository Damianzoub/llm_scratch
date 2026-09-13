#!/bin/bash
set -euo pipefail

# ============================================================================
# D2 Setup & Build Script
# Installs D2 + Graphviz (if missing), then renders every .d2 file found
# under architecture_design/ into a matching .svg next to it.
# ============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "=== Step 1: Checking dependencies ==="

if ! command -v d2 &> /dev/null; then
    echo "d2 not found, installing..."
    brew install d2
else
    echo "✓ d2 already installed ($(d2 --version))"
fi

if ! command -v dot &> /dev/null; then
    echo "graphviz not found, installing..."
    brew install graphviz
else
    echo "✓ graphviz already installed ($(dot -V 2>&1))"
fi

echo ""
echo "=== Step 2: Rendering all .d2 files under $SCRIPT_DIR ==="

count=0
while IFS= read -r -d '' d2_file; do
    svg_file="${d2_file%.d2}.svg"
    echo "Rendering: $d2_file -> $svg_file"
    d2 "$d2_file" "$svg_file"
    count=$((count + 1))
done < <(find "$SCRIPT_DIR" -type f -name "*.d2" -print0)

echo ""
echo "=== Done: rendered $count diagram(s) ==="
