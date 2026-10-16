import { useEffect, useRef, useState } from "react";
import { Input } from "./TextField";
import { IMAGEUPLOAD } from "../types/IMAGEUPLOAD";

export default function ImageUpload({
  label = IMAGEUPLOAD.labelselection,
  onImageChange,
}) {
  const [previewUrl, setPreviewUrl] = useState("");
  const previewUrlRef = useRef("");

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const handleChange = (event) => {
    const selectedImage = event.target.files?.[0] ?? null;
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }

    const nextPreviewUrl = selectedImage
      ? URL.createObjectURL(selectedImage)
      : "";
    previewUrlRef.current = nextPreviewUrl;
    setPreviewUrl(nextPreviewUrl);
    onImageChange?.(selectedImage);
  };

  return (
    <div className="space-y-2">
      <label className="block text-left text-sm font-medium text-neutral-700">
        {label}
        <Input
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="mt-1 block w-full rounded-lg border border-neutral-300 p-2 text-sm text-neutral-700 file:mr-3 file:rounded-md file:border-0 file:bg-neutral-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-neutral-700 hover:file:bg-neutral-200"
        />
      </label>

      {previewUrl && (
        <div className="space-y-1">
          <img
            src={previewUrl}
            alt={IMAGEUPLOAD.altview}
            className="max-h-64 rounded-lg border border-neutral-200 object-contain"
          />
          <p className="text-xs text-neutral-500">
            {IMAGEUPLOAD.localviewnote}
          </p>
        </div>
      )}
    </div>
  );
}