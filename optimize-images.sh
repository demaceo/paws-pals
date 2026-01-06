#!/bin/bash

# Optimize all images in public/dogs to reduce file size
# Max width: 1920px, Quality: 80%

echo "Optimizing images in public/dogs..."

# Find all jpg/JPG files and optimize them
find public/dogs -type f \( -iname "*.jpg" -o -iname "*.jpeg" \) | while read -r img; do
    # Get current file size
    original_size=$(du -h "$img" | cut -f1)
    
    # Optimize: resize to max 1920px width, quality 80%
    sips -Z 1920 --setProperty formatOptions 80 "$img" > /dev/null 2>&1
    
    # Get new file size
    new_size=$(du -h "$img" | cut -f1)
    
    echo "Optimized: $img ($original_size → $new_size)"
done

echo "Done! Checking total size..."
du -sh public/dogs/
