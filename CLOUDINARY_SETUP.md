# Photography Portfolio with Cloudinary

This is a guide to setting up your photography portfolio with Cloudinary to solve the Vercel serverless function size limit issue.

## Step 1: Set Up Cloudinary Account

1. **Create a Cloudinary account** at [cloudinary.com](https://cloudinary.com) (they have a free tier)
2. **Find your credentials**:
   - Go to your Dashboard
   - Note your **Cloud Name**, **API Key**, and **API Secret**

## Step 2: Configure Your Environment

1. Create a `.env` file in the project root with:
   ```
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

## Step 3: Upload Your Images to Cloudinary

### Option 1: Manual Upload (Easiest)

1. Log in to Cloudinary dashboard
2. Create a folder named `photography-portfolio`
3. Upload your images through their web interface

### Option 2: Use Our Upload Script

1. Install dependencies with `npm install`
2. Run `npm run upload-images` (this uses the script in `scripts/upload-to-cloudinary.js`)

## Step 4: Test Your Cloudinary Connection

1. Visit `/cloudinary-diagnostics` in your app to test URL formats
2. Try different URL patterns to see which one works for your Cloudinary setup

## Step 5: Find the Correct URL Format

Looking at your Cloudinary Media Explorer screenshot, it appears your Public IDs follow this format:

```
photography-portfolio/street_select_2025/L1009491_og_2025
```

This suggests your Cloudinary URLs should be structured like:

```
https://res.cloudinary.com/dkyvp47ua/image/upload/photography-portfolio/street_select_2025/L1009491_og_2025.jpg
```

## Step 6: Upload + Generate Manifest (Recommended)

Once you've found the correct URL format, run the combined upload + manifest script:

```
npm run upload-and-manifest
```

This will:

- Upload images to Cloudinary using folder-based public IDs
- Generate `content/photos.manifest.json` with URLs and dimensions

## Step 7: Update Your Code

The app reads the manifest directly, so no manual search-and-replace is needed.

## Cloudinary URL Formats Reference

Cloudinary URLs follow this pattern:

```
https://res.cloudinary.com/[cloud_name]/image/upload/[optional_transformations]/[public_id].[extension]
```

Examples:

- Basic: `https://res.cloudinary.com/demo/image/upload/sample.jpg`
- With transformations: `https://res.cloudinary.com/demo/image/upload/w_500,c_scale/sample.jpg`
- With folders: `https://res.cloudinary.com/demo/image/upload/folder/subfolder/sample.jpg`

## Common Transformations

Add these before the image ID to transform images on-the-fly:

- Resize to width: `w_800/`
- Auto format and quality: `f_auto,q_auto/`
- Crop and scale: `c_fill,g_auto,w_800,h_600/`
- Combined: `f_auto,q_auto,w_800,c_limit/`

## Troubleshooting

If images aren't loading:

1. Check your cloud name
2. Verify the image exists in your Cloudinary account
3. Confirm the Public ID format
4. Try different URL structures in the `/cloudinary-diagnostics` page
5. Check browser console for specific errors

## Common Issues

- **404 errors**: Image not found at that URL. Check your Public ID structure.
- **Transformations failing**: Your plan might not allow certain transformations.
- **CORS issues**: Ensure your Cloudinary account allows your domain.

## Contact Support

If you continue having issues, visit [Cloudinary Support](https://support.cloudinary.com/) or refer to the [Cloudinary documentation](https://cloudinary.com/documentation/image_transformations).
