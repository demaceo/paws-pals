"use client";

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";

interface ImageCropModalProps {
  imageSrc: string;
  onComplete: (croppedBlob: Blob) => void;
  onCancel: () => void;
  aspectRatio?: number;
  title?: string;
}

export default function ImageCropModal({
  imageSrc,
  onComplete,
  onCancel,
  aspectRatio = 1,
  title = "Crop Image",
}: ImageCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [processing, setProcessing] = useState(false);

  // Resize options
  const [maxWidth, setMaxWidth] = useState(1200);
  const [quality, setQuality] = useState(90);

  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [],
  );

  const handleCropImage = async () => {
    if (!croppedAreaPixels) return;

    setProcessing(true);
    try {
      const { getCroppedImg } = await import("@/lib/image-utils");

      const croppedBlob = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation,
        { horizontal: false, vertical: false },
        {
          maxWidth,
          quality: quality / 100,
        },
      );

      onComplete(croppedBlob);
    } catch (error) {
      console.error("Error cropping image:", error);
      alert("Failed to crop image. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl h-[90vh] bg-white dark:bg-gray-900 rounded-lg shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
          <button
            onClick={onCancel}
            disabled={processing}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition disabled:opacity-50"
            aria-label="Close"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Crop Area */}
        <div className="relative flex-1 bg-gray-100 dark:bg-gray-800">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspectRatio}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onCropComplete={onCropComplete}
          />
        </div>

        {/* Controls */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 space-y-4">
          {/* Zoom Control */}
          <div>
            <label className="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                />
              </svg>
              <span>Zoom: {zoom.toFixed(1)}x</span>
            </label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full mt-2 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-orange-500"
            />
          </div>

          {/* Rotation Control */}
          <div>
            <label className="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span>Rotation: {rotation}°</span>
            </label>
            <input
              type="range"
              min={0}
              max={360}
              step={1}
              value={rotation}
              onChange={(e) => setRotation(Number(e.target.value))}
              className="w-full mt-2 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-orange-500"
            />
          </div>

          {/* Resize Options */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Max Width (px)
              </label>
              <input
                type="number"
                min={200}
                max={3000}
                step={100}
                value={maxWidth}
                onChange={(e) => setMaxWidth(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quality: {quality}%
              </label>
              <input
                type="range"
                min={60}
                max={100}
                step={5}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full mt-2 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-orange-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={onCancel}
              disabled={processing}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleCropImage}
              disabled={processing}
              className="px-5 py-2.5 text-sm font-medium text-white bg-linear-to-r from-orange-500 to-orange-600 rounded-lg hover:from-orange-600 hover:to-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/30"
            >
              {processing ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing...
                </span>
              ) : (
                "Crop & Upload"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
