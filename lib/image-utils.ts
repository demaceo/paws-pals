// Image processing utilities for cropping and resizing

export interface CroppedArea {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface ResizeOptions {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number; // 0.1 to 1.0
}

/**
 * Creates a canvas element from an image source
 */
function createImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener("load", () => resolve(image));
        image.addEventListener("error", (error) => reject(error));
        image.setAttribute("crossOrigin", "anonymous");
        image.src = url;
    });
}

/**
 * Converts degrees to radians
 */
function getRadianAngle(degreeValue: number): number {
    return (degreeValue * Math.PI) / 180;
}

/**
 * Returns the new bounding area of a rotated rectangle
 */
function rotateSize(width: number, height: number, rotation: number) {
    const rotRad = getRadianAngle(rotation);
    return {
        width:
            Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
        height:
            Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
    };
}

/**
 * Crops and resizes an image
 * @param imageSrc - Source image URL (can be a data URL or blob URL)
 * @param pixelCrop - The cropped area in pixels
 * @param rotation - Rotation in degrees (default 0)
 * @param flip - Flip options { horizontal: boolean, vertical: boolean }
 * @param resizeOptions - Optional resize and quality settings
 */
export async function getCroppedImg(
    imageSrc: string,
    pixelCrop: CroppedArea,
    rotation = 0,
    flip = { horizontal: false, vertical: false },
    resizeOptions: ResizeOptions = {}
): Promise<Blob> {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
        throw new Error("Could not get canvas context");
    }

    const rotRad = getRadianAngle(rotation);

    // Calculate bounding box of the rotated image
    const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
        image.width,
        image.height,
        rotation
    );

    // Set canvas size to match the bounding box
    canvas.width = bBoxWidth;
    canvas.height = bBoxHeight;

    // Translate canvas context to center
    ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
    ctx.rotate(rotRad);
    ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
    ctx.translate(-image.width / 2, -image.height / 2);

    // Draw rotated image
    ctx.drawImage(image, 0, 0);

    // Reset transformation
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // Extract the cropped area
    const croppedCanvas = document.createElement("canvas");
    const croppedCtx = croppedCanvas.getContext("2d");

    if (!croppedCtx) {
        throw new Error("Could not get cropped canvas context");
    }

    // Set the size of the cropped canvas
    let outputWidth = pixelCrop.width;
    let outputHeight = pixelCrop.height;

    // Apply resize if specified
    if (resizeOptions.maxWidth || resizeOptions.maxHeight) {
        const aspectRatio = pixelCrop.width / pixelCrop.height;

        if (resizeOptions.maxWidth && resizeOptions.maxHeight) {
            // Fit within both constraints
            const maxAspectRatio =
                resizeOptions.maxWidth / resizeOptions.maxHeight;
            if (aspectRatio > maxAspectRatio) {
                outputWidth = resizeOptions.maxWidth;
                outputHeight = resizeOptions.maxWidth / aspectRatio;
            } else {
                outputHeight = resizeOptions.maxHeight;
                outputWidth = resizeOptions.maxHeight * aspectRatio;
            }
        } else if (resizeOptions.maxWidth) {
            outputWidth = Math.min(resizeOptions.maxWidth, pixelCrop.width);
            outputHeight = outputWidth / aspectRatio;
        } else if (resizeOptions.maxHeight) {
            outputHeight = Math.min(resizeOptions.maxHeight, pixelCrop.height);
            outputWidth = outputHeight * aspectRatio;
        }
    }

    croppedCanvas.width = outputWidth;
    croppedCanvas.height = outputHeight;

    // Draw the cropped image with potential resize
    croppedCtx.drawImage(
        canvas,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        outputWidth,
        outputHeight
    );

    // Convert to blob
    return new Promise((resolve, reject) => {
        croppedCanvas.toBlob(
            (blob) => {
                if (blob) {
                    resolve(blob);
                } else {
                    reject(new Error("Canvas is empty"));
                }
            },
            "image/jpeg",
            resizeOptions.quality || 0.92
        );
    });
}

/**
 * Reads a File as a data URL
 */
export function readFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.addEventListener("load", () => resolve(reader.result as string));
        reader.addEventListener("error", reject);
        reader.readAsDataURL(file);
    });
}

/**
 * Converts a blob to a File object
 */
export function blobToFile(blob: Blob, fileName: string): File {
    return new File([blob], fileName, {
        type: blob.type,
        lastModified: Date.now(),
    });
}
