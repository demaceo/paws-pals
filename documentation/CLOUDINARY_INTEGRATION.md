# Cloudinary Integration Documentation

## Overview

This project uses **Cloudinary** as the cloud-based image storage and delivery solution. All dog photos (primary images and gallery images) uploaded through the admin dashboard are stored on Cloudinary's CDN with automatic optimization.

## Why Cloudinary?

- **Automatic image optimization**: Compresses and converts images to modern formats (WebP)
- **Global CDN delivery**: Fast loading times for users worldwide
- **No repository bloat**: Images don't inflate the Git repository size
- **Generous free tier**: 25GB storage + 25GB bandwidth per month
- **On-the-fly transformations**: Resize, crop, and optimize images dynamically
- **Secure**: Signed uploads with API credentials

---

## Architecture

### Image Upload Flow

```
User uploads image → Next.js API → Cloudinary CDN → Database (stores URL)
     (Admin)          (/api/upload)      (Cloud)        (PostgreSQL)
```

### Image Retrieval Flow

```
Page request → Database (get URL) → Cloudinary CDN → User's browser
   (User)          (PostgreSQL)         (delivers)      (displays)
```

---

## Configuration

### Environment Variables

Located in `.env`:

```env
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### Next.js Configuration

File: [next.config.ts](next.config.ts)

```typescript
images: {
  remotePatterns: [
    { protocol: "https", hostname: "res.cloudinary.com" }, // Cloudinary CDN
  ],
}
```

This allows Next.js Image component to load and optimize images from Cloudinary.

---

## Implementation Details

### 1. Upload API Route

**File**: [app/api/upload/route.ts](app/api/upload/route.ts)

**Features**:

- Authentication check (admin only)
- File validation (type, size)
- Buffer conversion for stream upload
- Automatic image transformations
- Organized folder structure

**Transformations Applied**:

```javascript
{
  width: 1200, 
  height: 1200, 
  crop: "limit",           // Maintains aspect ratio
  quality: "auto",         // Cloudinary optimizes quality
  fetch_format: "auto"     // Serves WebP when supported
}
```

**Folder Organization**:

```
paws-pals/
  └── dogs/
      ├── Fitz/
      │   ├── abc123.jpg
      │   └── def456.jpg
      ├── Mila/
      │   └── ghi789.jpg
      └── Tony/
          └── jkl012.jpg
```

### 2. Delete API Route

**File**: [app/api/dogs/[id]/route.ts](app/api/dogs/[id]/route.ts)

**Features**:

- Deletes database record
- Automatically deletes all associated images from Cloudinary
- Handles both primary and gallery images
- Extracts public_id from Cloudinary URLs
- Graceful error handling

**Flow**:

1. Fetch dog record to get image URLs
2. Delete dog from database
3. Parse gallery images from JSON
4. Extract public_id from each Cloudinary URL
5. Delete images from Cloudinary using SDK
6. Return success (doesn't fail if Cloudinary delete fails)

### 3. Update API Route (PATCH)

**File**: [app/api/dogs/[id]/route.ts](app/api/dogs/[id]/route.ts)

**Automatic Cleanup Feature**:

- Compares old vs new image URLs
- Identifies replaced or removed images
- Automatically deletes orphaned images from Cloudinary
- Prevents storage waste from image replacements

**Example Scenario**:

```
Old primary image: cloudinary.com/.../old-image.jpg
New primary image: cloudinary.com/.../new-image.jpg
Result: old-image.jpg automatically deleted ✓
```

### 4. Image Display

**Files**:

- [app/components/DogCard.tsx](app/components/DogCard.tsx)
- [app/dogs/[id]/page.tsx](app/dogs/[id]/page.tsx)
- [app/admin/components/DogForm.tsx](app/admin/components/DogForm.tsx)

**Next.js Image Component**:

```typescript
<Image
  src={dog.image} // Cloudinary URL
  alt={dog.name}
  width={400}
  height={400}
  className="rounded-lg"
/>
```

Next.js automatically optimizes these images further at the edge.

---

## API Reference

### Upload Endpoint

**POST** `/api/upload`

**Authentication**: Required (admin session)

**Request**:

```typescript
FormData {
  file: File,        // Image file (JPEG, PNG, WebP)
  dogName: string    // Dog name (for folder organization)
}
```

**Response**:

```typescript
{
  path: string,      // Cloudinary secure URL
  publicId: string   // Cloudinary public_id
}
```

**Validations**:

- File types: JPEG, PNG, WebP only
- Max size: 5MB
- Dog name required

---

## Database Storage

### Dog Model (Prisma Schema)

```prisma
model Dog {
  image   String   // Cloudinary URL (primary image)
  gallery String?  // JSON array of Cloudinary URLs
}
```

**Example stored values**:

```json
{
  "image": "https://res.cloudinary.com/demo/image/upload/v123/paws-pals/dogs/Fitz/abc.jpg",
  "gallery": "[\"https://res.cloudinary.com/.../img1.jpg\", \"https://res.cloudinary.com/.../img2.jpg\"]"
}
```

---

## Helper Functions

### extractPublicIdFromUrl()

**File**: [app/api/dogs/[id]/route.ts](app/api/dogs/[id]/route.ts)

Extracts the public_id from a Cloudinary URL for deletion.

**Input**:

```
https://res.cloudinary.com/cloud/image/upload/w_1200,h_1200,c_limit/v123/paws-pals/dogs/Fitz/abc123.jpg
```

**Output**:

```
paws-pals/dogs/Fitz/abc123
```

**Handles**:

- Transformation parameters
- Version numbers
- Nested folder structures
- File extensions

---

## Migration Strategy

### Existing Local Images

The system gracefully handles mixed environments:

| Scenario | Behavior |
|----------|----------|
| New dog uploads | → Cloudinary |
| Existing dogs with local images (`/dogs/Fitz/image.jpg`) | → Continue working |
| Edit existing dog + new images | → New images use Cloudinary |
| Delete old dogs | → Won't fail (checks for `cloudinary.com` in URL) |

### Migrating Existing Dogs

To migrate existing dogs with local images:

1. Go to admin dashboard
2. Edit the dog
3. Upload new images
4. Save
5. Old local images remain (manual cleanup needed)

**Manual cleanup**:

```bash
# After all dogs migrated to Cloudinary
rm -rf public/dogs/*
```

---

## Cost Management

### Free Tier Limits

- **Storage**: 25GB
- **Bandwidth**: 25GB/month
- **Transformations**: 25,000/month

### Optimization Tips

1. **Image compression**: Already handled automatically
2. **Lazy loading**: Implemented on public pages
3. **Responsive images**: Next.js Image component handles this
4. **Delete unused images**: Automatic on dog deletion/update

### Monitoring Usage

1. Go to [Cloudinary Dashboard](https://console.cloudinary.com/)
2. View "Media Library" for all images
3. Check "Analytics" for bandwidth usage
4. Set up email alerts for quota warnings

---

## Troubleshooting

### Images Not Uploading

**Error**: "Failed to upload file"

**Solutions**:

1. Verify `.env` credentials are correct
2. Restart dev server: `pnpm dev`
3. Check Cloudinary dashboard for API errors
4. Verify file size < 5MB
5. Check file type (JPEG, PNG, WebP only)

### Images Not Displaying

**Error**: Images show broken icon

**Solutions**:

1. Check `next.config.ts` has `res.cloudinary.com` in `remotePatterns`
2. Restart dev server after config changes
3. Check browser console for CORS errors
4. Verify image URL is valid in browser

### Deletion Not Working

**Error**: Images remain in Cloudinary after dog deletion

**Solutions**:

1. Check server logs for Cloudinary errors
2. Verify API credentials have delete permissions
3. Test URL parsing with `extractPublicIdFromUrl()`
4. Manually delete from Cloudinary dashboard

### Quota Exceeded

**Error**: "Quota exceeded" from Cloudinary

**Solutions**:

1. Delete unused images from Media Library
2. Review transformation usage in Analytics
3. Upgrade to paid plan if needed
4. Optimize image sizes before upload

---

## Security

### API Credentials

- ✅ Stored in `.env` (gitignored)
- ✅ Never exposed to client-side code
- ✅ Used only in server-side API routes
- ✅ Authenticated uploads (admin only)

### Image Access

- ✅ Public URLs (necessary for CDN delivery)
- ✅ No sensitive information in images
- ✅ Folder structure doesn't expose user data
- ✅ Can configure signed URLs if needed (advanced)

---

## Advanced Features (Future Enhancements)

### Potential Improvements

1. **Signed URLs**: Restrict image access to authenticated users
2. **Responsive images**: Multiple sizes for different devices
3. **Image analysis**: AI-powered tagging and categorization
4. **Video support**: Add video profiles for dogs
5. **Bulk operations**: Upload/delete multiple images at once
6. **Image editing**: Crop, rotate, filters in admin dashboard
7. **Backup**: Automatic backup to another storage provider

---

## Resources

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Cloudinary Node.js SDK](https://cloudinary.com/documentation/node_integration)
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Cloudinary Pricing](https://cloudinary.com/pricing)
- [Transformation Reference](https://cloudinary.com/documentation/transformation_reference)

---

## Support

For Cloudinary-specific issues:

- [Cloudinary Support](https://support.cloudinary.com/)
- [Community Forum](https://community.cloudinary.com/)
- [Status Page](https://status.cloudinary.com/)
