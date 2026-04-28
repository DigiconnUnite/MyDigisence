import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getOptimizedImageUrl } from "@/lib/image-utils";
import { Grid2X2Check, ImageOff, Share2, Tag } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { Product } from "@/components/business-profile/BusinessProfile.types";

interface ProductCardProps {
  product: Product;
  onOpenProduct: (product: Product) => void;
  onShare: (product: Product) => void;
  onInquire: (product: Product) => void;
}

export default function ProductCard({
  product,
  onOpenProduct,
  onShare,
  onInquire,
}: ProductCardProps) {
  return (
    <Card
      id={`product-${product.id}`}
      className="group overflow-hidden p-0 rounded-2xl border border-slate-200/80 transition-all duration-300 flex flex-col h-full"
    >
      <div
        className="relative w-full rounded-xl  h-52 md:h-64 overflow-hidden cursor-pointer bg-white p-2"
        onClick={() => onOpenProduct(product)}
      >
        {product.image && product.image.trim() !== "" ? (
          <div className="w-full h-full rounded-xl overflow-hidden ">
            <img
              src={getOptimizedImageUrl(product.image, {
                width: 500,
                height: 500,
                quality: 85,
                format: "auto",
              })}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
              decoding="async"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-50">
            <ImageOff className="h-10 w-10 text-gray-300" />
          </div>
        )}

        <div className="absolute top-0 right-0">
          <Badge
            className={`absolute top-3 text-white right-3 ${
              product.inStock
                ? "bg-linear-to-l from-gray-900 to-lime-900"
                : "bg-linear-to-l from-gray-900 to-red-900"
            } text-white border-0`}
          >
            {product.inStock ? (
              <span className="flex items-center gap-1 text-[11px] md:text-xs font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                </span>{" "}
                In Stock
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] md:text-xs font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-400"></span>
                </span>{" "}
                Out of Stock
              </span>
            )}
          </Badge>
        </div>
      </div>

      <div className="p-3.5  md:p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start gap-2 mb-1 sm:mb-2">
          <h3
            className="font-semibold text-slate-800 line-clamp-2 cursor-pointer group-hover:text-orange-600 transition-colors text-sm md:text-base leading-snug"
            onClick={() => onOpenProduct(product)}
          >
            {product.name}
          </h3>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-2.5 sm:mb-3">
          {product.brandName && (
            <Badge
              variant="outline"
              className="text-[11px] md:text-xs px-2 py-0.5 rounded-full border-slate-200 bg-slate-50 text-slate-600"
            >
              <Grid2X2Check className="h-3.5 w-3.5 mr-1" />
              {product.brandName}
            </Badge>
          )}
          {product.category && (
            <Badge
              variant="outline"
              className="text-[11px] md:text-xs px-2 py-0.5 rounded-full border-slate-200 bg-slate-50 text-slate-600"
            >
              <Tag className="h-3.5 w-3.5 mr-1" />
              {product.category.name}
            </Badge>
          )}
        </div>

        <p className="text-xs text-slate-500 line-clamp-2 mb-3 sm:mb-4 leading-relaxed flex-1">
          {product.description || "No description available."}
        </p>

        <div className="flex gap-2 mt-auto">
          <Button
            className="flex-1 bg-green-600 hover:bg-slate-900 text-white h-9 text-xs md:text-sm font-medium rounded-xl"
            onClick={() => onInquire(product)}
          >
            Inquire
            <SiWhatsapp className="h-3.5 w-3.5 ml-1.5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-xl border-slate-200 hover:bg-slate-50 hover:text-slate-900"
            onClick={(e) => {
              e.stopPropagation();
              onShare(product);
            }}
          >
            <Share2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
