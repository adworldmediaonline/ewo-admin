'use client';
import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import ErrorMsg from '../../common/error-msg';

interface SEOFieldsProps {
  register: UseFormRegister<any>;
  errors: FieldErrors;
  defaultValues?: {
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
  };
}

export default function SEOFields({ register, errors, defaultValues }: SEOFieldsProps) {

  return (
    <div className="px-8 py-8 mb-6 bg-white rounded-md">
      <h4 className="text-[22px] mb-6">SEO Settings</h4>
      
      {/* Meta Title */}
      <div className="mb-5">
        <p className="mb-0 text-base text-black capitalize">
          Meta Title
        </p>
        <input
          {...register('metaTitle', {
            maxLength: {
              value: 60,
              message: 'Meta title cannot be more than 60 characters'
            }
          })}
          className="form-control"
          type="text"
          placeholder="Enter meta title for SEO"
          maxLength={60}
          defaultValue={defaultValues?.metaTitle}
        />
        <span className="leading-4 text-tiny text-gray-500">
          Recommended: 50-60 characters for optimal SEO
        </span>
        <ErrorMsg msg={(errors?.metaTitle?.message as string) || ''} />
      </div>

      {/* Meta Description */}
      <div className="mb-5">
        <p className="mb-0 text-base text-black capitalize">
          Meta Description
        </p>
        <textarea
          {...register('metaDescription', {
            maxLength: {
              value: 160,
              message: 'Meta description cannot be more than 160 characters'
            }
          })}
          className="form-control"
          rows={3}
          placeholder="Enter meta description for SEO"
          maxLength={160}
          defaultValue={defaultValues?.metaDescription}
        />
        <span className="leading-4 text-tiny text-gray-500">
          Recommended: 150-160 characters for optimal SEO
        </span>
        <ErrorMsg msg={(errors?.metaDescription?.message as string) || ''} />
      </div>

      {/* Meta Keywords */}
      <div className="mb-5">
        <p className="mb-0 text-base text-black capitalize">
          Meta Keywords
        </p>
        <input
          {...register('metaKeywords')}
          className="form-control"
          type="text"
          placeholder="Enter keywords separated by commas (e.g. wireless, headphones, audio, music)"
          defaultValue={defaultValues?.metaKeywords || ''}
        />
        <span className="leading-4 text-tiny text-gray-500">
          Enter keywords separated by commas. Maximum 255 characters.
        </span>
        <ErrorMsg msg={(errors?.metaKeywords?.message as string) || ''} />
      </div>
    </div>
  );
} 