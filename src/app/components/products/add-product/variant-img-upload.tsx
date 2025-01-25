import React, { useEffect, useState } from 'react';
import { Drug } from '@/svg';
import Loading from '../../common/loading';
import { useUploadImageMultipleMutation } from '@/redux/cloudinary/cloudinaryApi';
import { notifyError, notifySuccess } from '@/utils/toast';

type IPropType = {
  formData: string[];
  setFormData: React.Dispatch<React.SetStateAction<string[]>>;
  setImageURLs: React.Dispatch<React.SetStateAction<string[]>>;
  isSubmitted: boolean;
};

const VariantImgUpload = ({
  setFormData,
  formData,
  setImageURLs,
  isSubmitted,
}: IPropType) => {
  const [uploadImages, { data: uploadData, isError, isLoading }] =
    useUploadImageMultipleMutation();

  // handle multiple image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target && e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const formData = new FormData();

      files.forEach(file => {
        formData.append('images', file);
      });

      uploadImages(formData)
        .unwrap()
        .then(response => {
          if (response.success && response.data) {
            const newUrls = response.data.map(item => item.url);
            setFormData(prevUrls => [...prevUrls, ...newUrls]);
            setImageURLs(prevUrls => [...prevUrls, ...newUrls]);
            notifySuccess('Images uploaded successfully');
          }
        })
        .catch(error => {
          console.error('Upload failed:', error);
          notifyError('Failed to upload images');
        });
    }
  };

  // Handle image removal
  const handleRemoveImage = (index: number) => {
    setFormData(prev => prev.filter((_, i) => i !== index));
    setImageURLs(prev => prev.filter((_, i) => i !== index));
  };

  // Sync formData with imageURLs on mount
  useEffect(() => {
    setImageURLs(formData);
  }, []);

  return (
    <div className="px-8 py-8 mb-6 bg-white rounded-md">
      <div className="mb-5">
        <p className="mb-2 text-base text-black">
          Upload variant images (multiple)
        </p>
        <input
          onChange={handleImageUpload}
          type="file"
          name="images"
          id="variant_images"
          className="hidden"
          multiple
          accept="image/*"
        />
        <label
          htmlFor="variant_images"
          className="flex items-center justify-center h-[100px] border-2 border-gray6 dark:border-gray-600 border-dashed rounded-md cursor-pointer hover:bg-slate-100 transition-all linear ease"
        >
          <div className="text-center">
            <span className="flex justify-center mx-auto mb-2">
              <Drug />
            </span>
            <span className="text-gray-600">
              Drop images here or click to upload
              <br />
              <span className="text-sm text-gray-400">
                (You can select multiple images)
              </span>
            </span>
          </div>
        </label>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {isLoading ? (
          <div className="flex justify-center col-span-4">
            <Loading loading={isLoading} spinner="scale" />
          </div>
        ) : (
          formData.map((url, idx) => (
            <div key={idx} className="relative group">
              <img
                src={url}
                alt={`Variant ${idx + 1}`}
                className="object-cover w-full h-32 rounded-md"
              />
              <button
                onClick={() => handleRemoveImage(idx)}
                className="absolute flex items-center justify-center w-6 h-6 text-white transition-opacity bg-red-500 rounded-full opacity-0 top-1 right-1 hover:bg-red-600 group-hover:opacity-100"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VariantImgUpload;
