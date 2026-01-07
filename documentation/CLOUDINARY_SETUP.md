# Cloudinary Setup Guide

This project uses Cloudinary for cloud-based image storage and optimization.

## Why Cloudinary?

- ✅ **Automatic optimization**: Images are automatically compressed and converted to modern formats (WebP)
- ✅ **CDN delivery**: Fast image loading from global CDN
- ✅ **No repo bloat**: Images don't inflate your Git repository
- ✅ **Generous free tier**: 25GB storage + 25GB bandwidth/month
- ✅ **Built-in transformations**: Resize, crop, and optimize on-the-fly

## Setup Instructions

### 1. Create a Cloudinary Account

1. Go to [cloudinary.com](https://cloudinary.com)
2. Click "Sign Up" and create a free account
3. You'll be redirected to your dashboard

### 2. Get Your Credentials

From your Cloudinary dashboard, you'll see:

- **Cloud Name**: e.g., `dpq123abc`
- **API Key**: e.g., `123456789012345`
- **API Secret**: e.g., `abcdefghijklmnopqrstuvwxyz`

### 3. Configure Environment Variables

Add these to your `.env` file (never commit this file!):

```env
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### 4. Verify Setup

1. Start your development server: `pnpm dev`
2. Log in to the admin dashboard: `http://localhost:3000/admin`
3. Try uploading a dog with an image
4. Check your Cloudinary dashboard - you should see the image under "Media Library" in the `paws-pals/dogs/` folder

## Image Organization

Images are automatically organized in Cloudinary by dog name:

```
paws-pals/
  └── dogs/
      ├── Fitz/
      │   ├── image1.jpg
      │   └── image2.jpg
      ├── Mila/
      │   └── image1.jpg
      └── Tony/
          └── image1.jpg
```

## Features

### Automatic Optimizations

All uploaded images are automatically:

- Resized to max 1200x1200px (maintains aspect ratio)
- Compressed with automatic quality optimization
- Converted to WebP format (when browser supports it)
- Cached on Cloudinary's global CDN

### Image Deletion

When you delete a dog from the admin dashboard, all associated images (primary + gallery) are automatically deleted from Cloudinary.

## Migration from Local Storage

If you have existing dogs with local images (in `/public/dogs/`):

1. The new uploads will automatically go to Cloudinary
2. Existing dogs will continue to work with local images until migrated
3. Run the migration script to upload local images and update the database
4. After verifying Cloudinary URLs, you can remove `/public/dogs/`

Migration script:

```bash
# Preview changes
pnpm migrate:cloudinary -- --dry-run

# Run migration
pnpm migrate:cloudinary
```

## Troubleshooting

### "Unauthorized" error when uploading

- Check that your environment variables are set correctly
- Restart your development server after adding env vars

### Images not appearing

- Verify your Cloudinary credentials
- Check the browser console for errors
- Check server logs for upload errors

### Free tier limits

- **Storage**: 25GB
- **Bandwidth**: 25GB/month
- **Transformations**: 25,000/month

If you exceed these, you'll need to upgrade or optimize your usage.

## Additional Resources

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Pricing](https://cloudinary.com/pricing)
- [Next.js Integration Guide](https://cloudinary.com/documentation/nextjs_integration)
