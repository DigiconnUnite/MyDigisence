import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { generateSrcSet, getOptimizedImageUrl } from "@/lib/image-utils";
import { Image } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { Product } from "@/components/business-profile/BusinessProfile.types";

interface BusinessProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedProduct: Product | null;
  relatedProducts: Product[];
  onSelectRelatedProduct: (product: Product) => void;
  onInquireRelatedProduct: (product: Product, e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function BusinessProductModal({
  open,
  onOpenChange,
  selectedProduct,
  relatedProducts,
  onSelectRelatedProduct,
  onInquireRelatedProduct,
}: BusinessProductModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto hide-scrollbar">
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl">{selectedProduct?.name}</DialogTitle>
          <DialogDescription>Product details and related items</DialogDescription>
        </DialogHeader>

        {selectedProduct && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="relative w-full max-w-md h-64 md:h-80 rounded-lg overflow-hidden border border-gray-200 shadow-sm ">
                {selectedProduct.image && selectedProduct.image.trim() !== "" ? (
                  <img
                    src={getOptimizedImageUrl(selectedProduct.image, {
                      width: 600,
                      height: 400,
                      quality: 90,
                      format: "auto",
                      crop: "fill",
                      gravity: "center",
                    })}
                    srcSet={generateSrcSet(selectedProduct.image)}
                    sizes="(max-width: 768px) 100vw, 600px"
                    alt={selectedProduct.name}
                    className="w-full h-full object-contain"
                    loading="eager"
                    decoding="async"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-100">
                    <Image className="h-16 w-16 md:h-24 md:w-24 text-gray-400" />
                  </div>
                )}
                <Badge
                  className={`absolute top-3 text-white right-3 ${
                    selectedProduct.inStock
                      ? "bg-linear-to-l from-gray-900 to-lime-900"
                      : "bg-linear-to-l from-gray-900 to-red-900"
                  } text-white border-0`}
                >
                  {selectedProduct.inStock ? (
                    <span className="flex items-center gap-1">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                      </span>{" "}
                      In Stock
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
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

            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {selectedProduct.brandName && (
                  <Badge variant="outline" className="text-sm">
                    {selectedProduct.brandName}
                  </Badge>
                )}
                {selectedProduct.category && (
                  <Badge variant="outline" className="text-sm">
                    {selectedProduct.category.name}
                  </Badge>
                )}
              </div>

              {selectedProduct.price && (
                <div className="text-2xl font-bold text-green-600">{selectedProduct.price}</div>
              )}

              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {selectedProduct.description || "No description available"}
                </p>
              </div>

              {selectedProduct.additionalInfo &&
                Object.keys(selectedProduct.additionalInfo).length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-gray-900">Additional Information</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full border border-gray-200 rounded-lg">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                              Property
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                              Value
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {Object.entries(selectedProduct.additionalInfo).map(([key, value], index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-4 py-2 text-sm font-medium text-gray-900 capitalize">
                                {key.replace(/([A-Z])/g, " $1").trim()}
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-700">{value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
            </div>

            {relatedProducts.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Products Components</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {relatedProducts.map((product) => (
                    <Card
                      key={product.id}
                      className="overflow-hidden pt-0 py-0 bg-white hover:shadow-lg transition-shadow duration-300 pb-2 cursor-pointer"
                      onClick={() => onSelectRelatedProduct(product)}
                    >
                      <div className="relative h-32 md:h-48">
                        {product.image && product.image.trim() !== "" ? (
                          <img
                            src={getOptimizedImageUrl(product.image, {
                              width: 400,
                              height: 300,
                              quality: 85,
                              format: "auto",
                              crop: "fill",
                              gravity: "center",
                            })}
                            srcSet={generateSrcSet(product.image)}
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 25vw"
                            alt={product.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <Image className="h-10 w-10 md:h-16 md:w-16 text-gray-400" />
                          </div>
                        )}
                        <Badge
                          className={`absolute top-3 text-white right-3 ${
                            product.inStock
                              ? "bg-linear-to-l from-gray-900 to-lime-900"
                              : "bg-linear-to-l from-gray-900 to-red-900"
                          } text-white border-0`}
                        >
                          {product.inStock ? (
                            <span className="flex items-center gap-1">
                              <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                              </span>{" "}
                              In Stock
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                              </span>{" "}
                              Out of Stock
                            </span>
                          )}
                        </Badge>
                      </div>
                      <CardHeader className="pb-0 px-2 md:px-3 ">
                        <CardTitle className="text-xs md:text-lg line-clamp-1">{product.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0 px-2 md:px-3 ">
                        <div className="flex flex-row flex-nowrap gap-1 mb-2 md:mb-3 overflow-x-auto hide-scrollbar">
                          {product.brandName && (
                            <Badge
                              variant="outline"
                              className="text-[8px] md:text-xs px-1 md:px-2 py-0.5 h-4 md:h-5 min-w-max"
                            >
                              {product.brandName}
                            </Badge>
                          )}
                          {product.category && (
                            <Badge
                              variant="outline"
                              className="text-[8px] md:text-xs px-1 md:px-2 py-0.5 h-4 md:h-5 min-w-max"
                            >
                              {product.category.name}
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="mb-2 md:mb-4 text-[10px] md:text-sm leading-relaxed line-clamp-2">
                          {product.description || "No description available"}
                        </CardDescription>
                        <div className="flex-1 "></div>
                        <Button
                          className="w-full mt-auto bg-green-500 hover:bg-slate-900 text-white cursor-pointer text-xs md:text-sm"
                          onClick={(e) => onInquireRelatedProduct(product, e)}
                        >
                          Inquire Now
                          <SiWhatsapp className="h-3 w-3 md:h-4 md:w-4 ml-1 md:ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
