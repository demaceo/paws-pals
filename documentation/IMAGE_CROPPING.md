# 🖼️ Image Cropping & Resizing Feature

## Overview

The admin dashboard includes a built-in image cropping and resizing tool that allows administrators to edit dog photos before uploading them to Cloudinary. This ensures all images are properly sized and framed for optimal display on the public site.

## User Experience Flow

### Primary Image Upload

1. **Select Image**: Admin clicks "Choose File" for primary image
2. **Enter Dog Name**: Must enter dog name first (required for Cloudinary folder structure)
3. **Crop Modal Opens**: Full-screen modal displays selected image with editing controls
4. **Edit Image**: Admin can:
   - Zoom in/out (1x to 3x)
   - Rotate (0° to 360°)
   - Adjust crop area (4:3 aspect ratio)
   - Set max width (200px to 3000px, default 1200px)
   - Set quality (60% to 100%, default 90%)
5. **Confirm or Cancel**:
   - "Crop & Upload" → Processes image and uploads to Cloudinary
   - "Cancel" → Closes modal without uploading
6. **Preview**: Cropped image displays in form

### Gallery Images Upload

1. **Select Multiple Files**: Admin selects one or more gallery images
2. **Sequential Cropping**: Images are cropped one at a time
3. **First Image**: Crop modal opens for first selected file
4. **Subsequent Images**: After confirming first crop, modal automatically shows next image
5. **Completion**: All cropped images appear in gallery preview

## Technical Implementation

### Components

#### ImageCropModal.tsx

Location: `app/admin/components/ImageCropModal.tsx`

**Props:**

- `imageSrc`: Data URL of image to crop
- `onComplete`: Callback with cropped blob
- `onCancel`: Cancel handler
- `aspectRatio`: Crop aspect ratio (default 1:1, set to 4:3 for dogs)
- `title`: Modal title

**Features:**

- Uses `react-easy-crop` library for interactive cropping
- Real-time preview of crop area
- Smooth zoom/rotation controls with range sliders
- Responsive design (works on mobile/tablet/desktop)
- Dark mode support

#### Image Utilities

Location: `lib/image-utils.ts`

**Key Functions:**

```typescript
// Main cropping function
getCroppedImg(
  imageSrc: string,
  pixelCrop: CroppedArea,
  rotation: number,
  flip: { horizontal: boolean, vertical: boolean },
  resizeOptions: ResizeOptions
): Promise<Blob>

// Read file as data URL
readFile(file: File): Promise<string>

// Convert blob to File object
blobToFile(blob: Blob, fileName: string): File
```

**Processing Steps:**

1. Load image into canvas
2. Apply rotation/flip transformations
3. Extract cropped area
4. Resize if specified (maintains aspect ratio)
5. Convert to JPEG blob with quality setting
6. Return blob for upload

### DogForm Integration

Location: `app/admin/components/DogForm.tsx`

**State Management:**

```typescript
const [cropModalOpen, setCropModalOpen] = useState(false);
const [imageToCrop, setImageToCrop] = useState<string | null>(null);
const [cropType, setCropType] = useState<"primary" | "gallery">("primary");
const [pendingFiles, setPendingFiles] = useState<File[]>([]);
```

**Workflow:**

1. File input `onChange` → Read file as data URL
2. Show crop modal with image data URL
3. User edits and confirms → Receive cropped blob
4. Convert blob to File → Upload to `/api/upload`
5. Update form state with Cloudinary URL

## Configuration Options

### Default Settings

```typescript
// Crop aspect ratio (4:3 for landscape dog photos)
aspectRatio: 4 / 3

// Max width (preserves aspect ratio)
maxWidth: 1200px

// JPEG quality (0.0 to 1.0)
quality: 0.90 (90%)

// Zoom range
min: 1x
max: 3x

// Rotation range
min: 0°
max: 360°
```

### Customization

To change defaults, edit `ImageCropModal.tsx`:

```typescript
// Change initial max width
const [maxWidth, setMaxWidth] = useState(1200);

// Change initial quality
const [quality, setQuality] = useState(90);

// Change aspect ratio in DogForm.tsx
<ImageCropModal aspectRatio={16 / 9} /> // For widescreen
```

## Image Quality Guidelines

### Recommended Settings

| Use Case | Max Width | Quality | Notes |
|----------|-----------|---------|-------|
| **Primary Image** | 1200px | 90% | Balanced size/quality |
| **Gallery Images** | 1200px | 85% | Slightly compressed for performance |
| **High Detail** | 1800px | 95% | For dogs with unique markings |
| **Web Optimized** | 800px | 80% | Faster page loads |

### File Size Estimates

| Resolution | Quality | Approx. Size |
|------------|---------|--------------|
| 800x600 | 80% | ~80-120 KB |
| 1200x900 | 90% | ~200-300 KB |
| 1800x1350 | 95% | ~400-600 KB |

## Performance Considerations

### Client-Side Processing

- All cropping happens in browser (no server load)
- Uses HTML5 Canvas API (no external dependencies beyond react-easy-crop)
- Processing time: < 1 second for typical images
- Memory usage: ~20-40 MB during crop operation

### Upload Optimization

1. **Before Crop**: Original file (potentially 5-10 MB)
2. **After Crop**: Optimized JPEG (~200-300 KB at default settings)
3. **Result**: 95%+ file size reduction in typical cases

### Cloudinary Integration

- Cropped images upload faster due to smaller size
- Cloudinary applies additional optimizations:
  - Automatic format selection (WebP for supported browsers)
  - Quality optimization
  - Responsive image delivery

## Browser Compatibility

### Supported Browsers

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile Safari (iOS 14+)
- ✅ Chrome Mobile (Android)

### Required APIs

- HTML5 Canvas
- FileReader API
- Blob/File API
- Promises (async/await)

## Accessibility

### Keyboard Navigation

- Tab: Move between controls
- Arrow keys: Adjust zoom/rotation sliders
- Enter: Confirm crop
- Escape: Cancel (can be added)

### Screen Reader Support

- ARIA labels on all controls
- Clear button text
- Status messages during processing

## Troubleshooting

### Common Issues

**Issue**: "Failed to read image file"

- **Cause**: File is corrupted or invalid format
- **Solution**: Try different file or convert to JPEG/PNG

**Issue**: Modal doesn't open

- **Cause**: Dog name not entered
- **Solution**: Enter dog name before selecting image

**Issue**: Cropped image looks pixelated

- **Cause**: Max width too small or quality too low
- **Solution**: Increase max width to 1200px+ and quality to 90%+

**Issue**: Processing takes too long

- **Cause**: Very large original image (10+ MB)
- **Solution**: Pre-compress image before upload or increase browser timeout

**Issue**: Image appears rotated incorrectly

- **Cause**: EXIF orientation data not preserved
- **Solution**: Manually rotate using rotation slider before cropping

## Future Enhancements

### Planned Features

- [ ] Flip horizontal/vertical
- [ ] Brightness/contrast adjustments
- [ ] Filters (grayscale, sepia, etc.)
- [ ] Multiple aspect ratio presets (1:1, 16:9, 4:3)
- [ ] Batch crop with same settings
- [ ] Save crop presets per dog
- [ ] Undo/redo crop operations
- [ ] Before/after comparison view

### Technical Improvements

- [ ] Add Web Workers for background processing
- [ ] Implement progressive loading for large images
- [ ] Add image compression preview (file size estimate)
- [ ] Support for PNG transparency preservation
- [ ] Add HEIC/HEIF format support
- [ ] Implement intelligent auto-crop (face detection)

## Related Documentation

- [Admin Setup Guide](./ADMIN_SETUP.md) - Full admin dashboard setup
- [Cloudinary Integration](./CLOUDINARY_INTEGRATION.md) - Image storage details
- [Testing Checklist](./TESTING_CHECKLIST.md) - Image upload testing
- [Architecture Overview](./ARCHITECTURE.md) - System design

## Dependencies

```json
{
  "react-easy-crop": "^5.5.6",  // Cropping UI
  "sharp": "^0.34.5"            // Server-side image processing (future)
}
```

## Code Examples

### Basic Crop Modal Usage

```typescript
import ImageCropModal from "./ImageCropModal";

function MyComponent() {
  const [showCrop, setShowCrop] = useState(false);
  const [imageSrc, setImageSrc] = useState("");

  async function handleFileSelect(file: File) {
    const dataUrl = await readFile(file);
    setImageSrc(dataUrl);
    setShowCrop(true);
  }

  async function handleCropComplete(blob: Blob) {
    // Upload blob to server
    const formData = new FormData();
    formData.append("file", blob, "cropped.jpg");
    await fetch("/api/upload", { method: "POST", body: formData });
    setShowCrop(false);
  }

  return (
    <>
      <input type="file" onChange={(e) => handleFileSelect(e.target.files[0])} />
      {showCrop && (
        <ImageCropModal
          imageSrc={imageSrc}
          onComplete={handleCropComplete}
          onCancel={() => setShowCrop(false)}
          aspectRatio={4 / 3}
        />
      )}
    </>
  );
}
```

### Custom Crop Processing

```typescript
import { getCroppedImg } from "@/lib/image-utils";

async function customCrop(imageSrc: string, cropArea: Area) {
  const blob = await getCroppedImg(
    imageSrc,
    cropArea,
    90, // rotation
    { horizontal: false, vertical: false },
    { maxWidth: 2000, quality: 0.95 }
  );
  return blob;
}
```

---

**Last Updated**: January 19, 2026  
**Feature Status**: ✅ Production Ready  
**Maintained By**: Development Team
