#!/bin/sh
# Concatenates the sources into one self-contained index.html
cd "$(dirname "$0")"
{ cat src/head.html; cat src/assets_iso.js; echo; cat src/sim.js; echo; cat src/iso.js; echo; cat src/tut.js; echo; cat src/ui.js; echo '</script></body></html>'; } > index.html
echo "built index.html ($(wc -c < index.html) bytes)"
