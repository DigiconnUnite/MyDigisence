import { Edit, Briefcase, Image as ImageIcon, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PortfolioItem } from "../types";

interface BusinessPortfolioSectionProps {
  images: PortfolioItem[];
  onSaveImages: (images: PortfolioItem[]) => Promise<void>;
  onDeleteImageRequest: (index: number) => void;
}

export function BusinessPortfolioSection({
  images,
  onSaveImages,
  onDeleteImageRequest,
}: BusinessPortfolioSectionProps) {
  const updateImageAtIndex = async (index: number, url: string) => {
    const updatedImages = [...images];
    updatedImages[index] = {
      url,
      alt: "Portfolio image",
    };
    await onSaveImages(updatedImages);
  };

  const openFilePicker = (index: number) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*,video/*";
    fileInput.onchange = (event) => {
      const target = event.target as HTMLInputElement;
      if (!target.files || !target.files[0]) {
        return;
      }

      const file = target.files[0];
      const reader = new FileReader();
      reader.onload = async (loadEvent) => {
        const result = loadEvent.target?.result;
        if (typeof result === "string") {
          await updateImageAtIndex(index, result);
        }
      };
      reader.readAsDataURL(file);
    };
    fileInput.click();
  };

  return (
    <div className=" mx-auto">
      <div className="mb-6">
        <h1 className="text-lg font-bold text-gray-900">Portfolio Manager</h1>
        <p className="text-md text-gray-600">Manage your portfolio images</p>
      </div>

      <div className="space-y-6">
        <Card className="rounded-3xl overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Portfolio Grid</CardTitle>
                <CardDescription>Click empty slots to add, icons to manage.</CardDescription>
              </div>
              <div className="text-sm text-gray-500 font-medium">{images.length}/6 Images</div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:gap-4 grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => {
                const image = images[index];

                const aspectRatioClass = "aspect-3/2";
                const isVideo =
                  !!image?.url &&
                  (image.url.includes(".mp4") ||
                    image.url.includes(".webm") ||
                    image.url.includes(".ogg"));

                return (
                  <div
                    key={index}
                    className={`relative bg-gray-100 border-2 border-dashed border-gray-300 rounded-2xl overflow-hidden group transition-all duration-300 ${
                      image ? "border-gray-200 shadow-sm hover:shadow-md" : "hover:border-blue-400 hover:bg-blue-50"
                    } ${aspectRatioClass}`}
                  >
                    {!image && (
                      <div
                        className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer z-10"
                        onClick={() => openFilePicker(index)}
                      >
                        <div
                          className={
                            "flex items-center justify-center rounded-full bg-white shadow-sm mb-3 w-14 h-14"
                          }
                        >
                          <Plus className={"text-gray-400 w-7 h-7"} />
                        </div>
                        <span className="text-xs font-medium text-gray-500 group-hover:text-blue-600">
                          Add Image (3:2)
                        </span>
                      </div>
                    )}

                    {image && (
                      <>
                        <div className="absolute inset-0 bg-gray-200">
                          {isVideo ? (
                            <video
                              src={image.url}
                              className="w-full h-full object-cover"
                              muted
                              loop
                              playsInline
                            />
                          ) : (
                            <img
                              src={image.url}
                              alt={image.alt || "Portfolio image"}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          )}
                        </div>

                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20" />

                        <div className="absolute top-2 right-2 flex space-x-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openFilePicker(index);
                            }}
                            className="bg-white/90 backdrop-blur text-gray-700 hover:text-blue-600 hover:bg-white p-2 rounded-full shadow-lg transition-transform hover:scale-105"
                            title="Edit Image"
                          >
                            <Edit className="h-4 w-4" />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteImageRequest(index);
                            }}
                            className="bg-white/90 backdrop-blur text-gray-700 hover:text-red-600 hover:bg-white p-2 rounded-full shadow-lg transition-transform hover:scale-105"
                            title="Delete Image"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
