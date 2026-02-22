import React from "react";
import PhotoSection from "./PhotoSection";
import { Product } from "@/types/product.types";
import { integralCF } from "@/styles/fonts";
import { cn } from "@/lib/utils";
import Rating from "@/components/ui/Rating";
import SizeSelection from "./SizeSelection";
import AddToCardSection from "./AddToCardSection";

const Header = ({ data }: { data: Product }) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <PhotoSection data={data} />
        </div>
        <div>
          <h1
            className={cn([
              "text-2xl md:text-[40px] md:leading-[40px] mb-3 md:mb-3.5 capitalize text-dark-800 font-extrabold",
            ])}
          >
            {data.title}
          </h1>


          <div className="flex items-center mb-3 sm:mb-3.5">
            <Rating
              initialValue={data.rating}
              allowFraction
              SVGclassName="inline-block"
              emptyClassName="fill-gray-200"
              fillClassName="fill-yellow-400"
              size={25}
              readonly
            />
            <span className="text-green-700 text-xs sm:text-sm ml-[11px] sm:ml-[13px] pb-0.5 sm:pb-0">
              {data.rating.toFixed(1)}
              <span className="text-green-600">/5</span>
            </span>
          </div>
          <div className="flex items-center space-x-2.5 sm:space-x-3 mb-5">
            {data.discount.percentage > 0 ? (
              <span className="font-bold text-green-800 text-2xl sm:text-[32px]">
                {` UGX ${Math.round(
                  data.price - (data.price * data.discount.percentage) / 100
                ).toLocaleString()}`}
              </span>
            ) : data.discount.amount > 0 ? (
              <span className="font-bold text-green-800 text-2xl sm:text-[32px]">
                {`UGX ${(data.price - data.discount.amount).toLocaleString()}`}
              </span>
            ) : (
              <span className="font-bold text-green-800 text-2xl sm:text-[32px]">
                UGX {data.price.toLocaleString()}
              </span>
            )}
            {data.discount.percentage > 0 && (
              <span className="font-bold text-dark-600/70 line-through text-2xl sm:text-[32px]">
                UGX {data.price.toLocaleString()}
              </span>
            )}
            {data.discount.amount > 0 && (
              <span className="font-bold text-green-600/70 line-through text-2xl sm:text-[32px]">
                UGX {data.price.toLocaleString()}
              </span>
            )}
            {data.discount.percentage > 0 ? (
              <span className="font-medium text-[10px] sm:text-xs py-1.5 px-3.5 rounded-full bg-green-100 text-green-700">
                {`-${data.discount.percentage}%`}
              </span>
            ) : (
              data.discount.amount > 0 && (
                <span className="font-medium text-[10px] sm:text-xs py-1.5 px-3.5 rounded-full bg-green-100 text-green-700">
                  {`-UGX ${data.discount.amount.toLocaleString()}`}
                </span>
              )
            )}
          </div>
          {data.shortDescription ? (
            <p className="text-sm sm:text-base text-dark-700/80 mb-5">
              {data.shortDescription}
            </p>
          ) : data.description ? (
            <div
              className="text-sm sm:text-base text-dark-700/80 mb-5 prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: data.description }}
            />
          ) : null}
          {/* <hr className="h-[1px] border-t-green-200 mb-5" /> */}
          {/* <ColorSelection /> */}
          <hr className="h-[1px] border-t-green-200 my-5" />
          <SizeSelection data={data} />
          <hr className="hidden md:block h-[1px] border-t-green-200 my-5" />
          <AddToCardSection data={data} />
        </div>
      </div>
    </>
  );
};

export default Header;