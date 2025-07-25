'use client';
import React from 'react';
import useProductSubmit from '@/hooks/useProductSubmit';
import ErrorMsg from '../../common/error-msg';
import FormField from '../form-field';
import DescriptionTextarea from '../add-product/description-textarea';
import { useGetProductQuery } from '@/redux/product/productApi';
import OfferDatePicker from '../add-product/offer-date-picker';
import AdditionalInformation from '../add-product/additional-information';
import ProductVariants from '../add-product/product-variants';
import ProductImgUpload from '../add-product/product-img-upload';
import Tags from '../add-product/tags';
import ProductCategory from '../../category/product-category';
import Tiptap from '@/components/tipTap/Tiptap';
import { Controller } from 'react-hook-form';
import ProductOptions from '../add-product/product-options';
import ShippingPrice from '../shipping-price';
import SEOFields from '../add-product/seo-fields';

const EditProductSubmit = ({ id }: { id: string }) => {
  const { data: product, isError, isLoading } = useGetProductQuery(id);
  const {
    handleSubmit,
    handleSubmitProduct,
    register,
    errors,
    tags,
    setTags,
    setAdditionalInformation,
    control,
    setCategory,
    setParent,
    setChildren,
    setImg,
    img,
    imageURLs,
    setImageURLs,
    offerDate,
    setOfferDate,
    options,
    setOptions,
    isSubmitted,
    setIsSubmitted,
    handleEditProduct,
    editLoading,
  } = useProductSubmit();

  // decide what to render
  let content = null;

  if (isLoading) {
    content = <h2>Loading....</h2>;
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }
  if (!isLoading && !isError && product) {
    console.log('product--->', product);
    console.log('product.options', product.options);
    content = (
      <form onSubmit={handleSubmit(data => handleEditProduct(data, id))}>
        <div className="grid grid-cols-12 gap-6 mb-6">
          {/* left side */}
          <div className="col-span-12 xl:col-span-8 2xl:col-span-9">
            <div className="px-8 py-8 mb-6 bg-white rounded-md">
              <h4 className="text-[22px]">General</h4>
              <FormField
                title="title"
                isRequired={true}
                placeHolder="Product Title"
                register={register}
                errors={errors}
                defaultValue={product.title}
              />
              {/* <DescriptionTextarea
                register={register}
                errors={errors}
                defaultValue={product.description}
              /> */}
              {/* tip tap editor start */}
              <div className="mb-5">
                <p className="mb-0 text-base text-black capitalize">
                  Description <span className="text-red">*</span>
                </p>
                <Controller
                  name="description"
                  control={control}
                  defaultValue={product.description}
                  rules={{ required: true }}
                  render={({ field }) => <Tiptap {...field} />}
                />
                <ErrorMsg
                  msg={(errors?.description?.message as string) || ''}
                />
              </div>
              {/* tip tap editor end */}
            </div>

            <div className="px-8 py-8 mb-6 bg-white rounded-md">
              <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-6">
                <FormField
                  title="price"
                  isRequired={true}
                  placeHolder="Product price"
                  bottomTitle="Set the base price of product."
                  type="number"
                  defaultValue={product.price}
                  register={register}
                  errors={errors}
                  step="0.01"
                />
                <FormField
                  title="SKU"
                  isRequired={true}
                  placeHolder="SKU"
                  bottomTitle="Enter the product SKU."
                  defaultValue={product.sku}
                  register={register}
                  errors={errors}
                />
                <FormField
                  title="quantity"
                  isRequired={true}
                  placeHolder="Quantity"
                  bottomTitle="Enter the product quantity."
                  type="number"
                  defaultValue={product.quantity}
                  register={register}
                  errors={errors}
                />
                <FormField
                  title="discount"
                  type="number"
                  isRequired={false}
                  placeHolder="Discount"
                  bottomTitle="Set the product Discount."
                  defaultValue={product.discount}
                  register={register}
                  errors={errors}
                  step="0.01"
                />
              </div>
            </div>

            <ShippingPrice
              register={register}
              errors={errors}
              defaultPrice={product.shipping ? product.shipping.price : 0}
              defaultDescription={
                product.shipping ? product.shipping.description : ''
              }
            />

            <div className="px-8 py-8 mb-6 bg-white rounded-md">
              <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-x-6">
                <FormField
                  title="youtube video Id"
                  isRequired={false}
                  placeHolder="video id"
                  bottomTitle="Set the video id of product."
                  defaultValue={product.videoId}
                  register={register}
                  errors={errors}
                />
                {/* date picker start */}
                <div>
                  <p className="mb-0 text-base text-black capitalize">
                    start and end date
                  </p>
                  <OfferDatePicker
                    offerDate={offerDate}
                    setOfferDate={setOfferDate}
                    defaultValue={product.offerDate}
                  />
                  <span className="leading-4 text-tiny">
                    set the product offer and end date
                  </span>
                </div>
                {/* date picker start */}
              </div>
            </div>

            {/* additional information page start */}
            <AdditionalInformation
              setAdditionalInformation={setAdditionalInformation}
              default_value={product.additionalInformation}
            />
            {/* additional information page end */}

            {/* product options start */}
            <ProductOptions
              setOptions={setOptions}
              default_value={product.options}
              isSubmitted={isSubmitted}
            />
            {/* product options end */}

            {/* product variations start */}
            <ProductVariants
              isSubmitted={isSubmitted}
              setImageURLs={setImageURLs}
              default_value={product.imageURLs}
            />
            {/* product variations end */}

            {/* SEO fields start */}
            <SEOFields
              register={register}
              errors={errors}
              defaultValues={{
                metaTitle: product.seo?.metaTitle || '',
                metaDescription: product.seo?.metaDescription || '',
                metaKeywords: product.seo?.metaKeywords || '',
              }}
            />
            {/* SEO fields end */}
          </div>

          {/* right side */}
          <div className="col-span-12 xl:col-span-4 2xl:col-span-3">
            <ProductImgUpload
              imgUrl={img}
              setImgUrl={setImg}
              default_img={product.img}
              isSubmitted={isSubmitted}
            />

            <div className="px-8 py-8 mb-6 bg-white rounded-md">
              <p className="mb-5 text-base text-black">Product Category</p>
              {/* category start */}
              <div className="grid grid-cols-1 gap-3 mb-5 sm:grid-cols-1">
                <ProductCategory
                  setCategory={setCategory}
                  setParent={setParent}
                  setChildren={setChildren}
                  default_value={{
                    parent: product.category.name,
                    id: product.category.id,
                    children: product.children,
                  }}
                />
                <Tags
                  tags={tags}
                  setTags={setTags}
                  default_value={product.tags}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button
            type="submit"
            className="flex items-center gap-2 rounded bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600 dark:bg-green-500 dark:hover:bg-green-600"
            disabled={editLoading}
          >
            {editLoading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                <span>Updating...</span>
              </>
            ) : (
              'Update Product'
            )}
          </button>
        </div>
      </form>
    );
  }

  return <>{content}</>;
};

export default EditProductSubmit;
