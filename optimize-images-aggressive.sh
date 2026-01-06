#!/bin/bash

# More aggressive optimization - Max width: 1200px, Quality: 70%

echo "Applying more aggressive optimization..."

find public/dogs -type f \( -iname "*.jpg" -o -iname "*.jpeg" \) | while read -r img; do
    original_size=$(du -h "$img" | cut -f1)
    sips -Z 1200 --setProperty formatOptions 70 "$img" > /dev/null 2>&1
    new_size=$(du -h "$img" | cut -f1)
    echo "Optimized: $(basename "$img") ($original_size → $new_size)"
done

echo ""
echo "Total size:"
du -sh public/dogs/
