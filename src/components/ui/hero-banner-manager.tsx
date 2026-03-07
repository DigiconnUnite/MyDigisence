"use client";

import { useState } from 'react';
import { getOptimizedImageUrl } from '@/lib/image-utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Save, Trash2, ChevronUp, ChevronDown, Image as ImageIcon, Play, Settings, ImageOff, Crop as CropIcon } from 'lucide-react';
import ImageUpload from '@/components/ui/image-upload';
import BannerCropper from '@/components/ui/bannercropper';
import BusinessBannerUploader from '@/components/ui/business-banner-uploader';

// Keep Banner interface for data model compatibility (API still accepts these fields)
interface Banner {
  mediaType: 'image' | 'video';
  media: string;
  headline?: string;
  headlineSize?: string;
  headlineColor?: string;
  headlineAlignment?: 'left' | 'center' | 'right';
  subtext?: string;
  subtextSize?: string;
  subtextColor?: string;
  subtextAlignment?: 'left' | 'center' | 'right';
  cta?: string;
  ctaLink?: string;
  showText?: boolean;
}

interface HeroContent {
  slides: Banner[];
  autoPlay: boolean;
  transitionSpeed: number;
  showDots?: boolean;
  showArrows?: boolean;
  showText?: boolean;
}

interface HeroBannerManagerProps {
  heroContent: HeroContent;
  onChange: (content: HeroContent) => void;
}

export default function HeroBannerManager({ heroContent, onChange }: HeroBannerManagerProps) {
  const [selectedBannerIndex, setSelectedBannerIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editingBannerIndex, setEditingBannerIndex] = useState<number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<number | null>(null);
  const [savingBanner, setSavingBanner] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showBannerUploader, setShowBannerUploader] = useState(false);
  const [uploadingBannerIndex, setUploadingBannerIndex] = useState<number | null>(null);
  
  // Simplified form state - only media fields
  const [bannerForm, setBannerForm] = useState<Partial<Banner>>({
    mediaType: 'image',
    media: '',
  });

  const banners = heroContent.slides || [];

  const handleSelectBanner = (index: number) => {
    setSelectedBannerIndex(index);
  };

  const handleMoveUp = () => {
    if (selectedBannerIndex > 0) {
      const newSlides = [...banners];
      [newSlides[selectedBannerIndex], newSlides[selectedBannerIndex - 1]] = [newSlides[selectedBannerIndex - 1], newSlides[selectedBannerIndex]];
      onChange({ ...heroContent, slides: newSlides });
      setSelectedBannerIndex(selectedBannerIndex - 1);
    }
  };

  const handleMoveDown = () => {
    if (selectedBannerIndex < banners.length - 1) {
      const newSlides = [...banners];
      [newSlides[selectedBannerIndex], newSlides[selectedBannerIndex + 1]] = [newSlides[selectedBannerIndex + 1], newSlides[selectedBannerIndex]];
      onChange({ ...heroContent, slides: newSlides });
      setSelectedBannerIndex(selectedBannerIndex + 1);
    }
  };
  
  const handleDelete = () => {
    setBannerToDelete(selectedBannerIndex);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (bannerToDelete !== null) {
      const newSlides = banners.filter((_, i) => i !== bannerToDelete);
      onChange({ ...heroContent, slides: newSlides });
      setSelectedBannerIndex(Math.max(0, bannerToDelete - 1));
      setShowDeleteDialog(false);
    }
  };

  const handleEdit = (index?: number) => {
    const bannerIndex = index !== undefined ? index : selectedBannerIndex;
    
    if (banners[bannerIndex]) {
      // If editing existing, load that banner's data (only media fields)
      setBannerForm({
        mediaType: banners[bannerIndex].mediaType,
        media: banners[bannerIndex].media,
      });
      setEditingBannerIndex(bannerIndex);
    } else {
      // If adding new or invalid index, reset form
      setBannerForm({
        mediaType: 'image',
        media: '',
      });
      setEditingBannerIndex(null);
    }
    setShowModal(true);
  };

  const handleAddSlide = () => {
    // Open BusinessBannerUploader directly for new banner
    setUploadingBannerIndex(null); // null means adding new
    setShowBannerUploader(true);
  };

  const handleEditBannerUpload = (index: number) => {
    // Open BusinessBannerUploader directly for editing existing banner
    setUploadingBannerIndex(index);
    // Pre-fill with existing banner data if editing
    if (banners[index]) {
      setBannerForm({
        mediaType: banners[index].mediaType,
        media: banners[index].media,
      });
    }
    setShowBannerUploader(true);
    setShowModal(false);
  };

  const handleBannerUploadComplete = (url: string, type: 'image' | 'video') => {
    const newSlides = [...banners];
    const newBanner = {
      mediaType: type,
      media: url,
    };
    
    if (uploadingBannerIndex !== null && uploadingBannerIndex < newSlides.length) {
      // Update existing banner
      newSlides[uploadingBannerIndex] = { ...newSlides[uploadingBannerIndex], ...newBanner };
    } else {
      // Add new banner
      newSlides.push(newBanner);
      setSelectedBannerIndex(newSlides.length - 1);
    }
    
    onChange({ ...heroContent, slides: newSlides });
    setShowBannerUploader(false);
    setUploadingBannerIndex(null);
    setBannerForm({ mediaType: 'image', media: '' });
  };

  const handleSaveBanner = async () => {
    setSavingBanner(true);
    try {
      const newSlides = [...banners];
      if (editingBannerIndex !== null) {
        // Update existing - preserve existing text fields, only update media
        newSlides[editingBannerIndex] = {
          ...newSlides[editingBannerIndex],
          mediaType: bannerForm.mediaType || 'image',
          media: bannerForm.media || '',
        };
      } else {
        // Add new - only media fields
        newSlides.push({
          mediaType: bannerForm.mediaType || 'image',
          media: bannerForm.media || '',
        });
        setSelectedBannerIndex(newSlides.length - 1);
      }
      onChange({ ...heroContent, slides: newSlides });
      setShowModal(false);
    } finally {
      setSavingBanner(false);
    }
  };

  const handleSaveSettings = () => {
    onChange({ ...heroContent });
    setShowSettingsDialog(false);
  };

  const currentBanner = banners[selectedBannerIndex];

  return (
    <div className="space-y-6">
      {/* Controls Row */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex-1 min-w-0">
          <Select 
            value={selectedBannerIndex.toString()}
            onValueChange={(value) => handleSelectBanner(parseInt(value))}
          >
            <SelectTrigger className="rounded-2xl bg-white">
              <SelectValue placeholder="Select a banner" />
            </SelectTrigger>
            <SelectContent>
              {banners.map((banner, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {index + 1}: {banner.media ? "Banner " + (index + 1) : "Untitled"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        

        {/* Move Up */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (selectedBannerIndex > 0) {
              const newSlides = [...banners];
              [newSlides[selectedBannerIndex], newSlides[selectedBannerIndex - 1]] = [
                newSlides[selectedBannerIndex - 1],
                newSlides[selectedBannerIndex]
              ];
              setSelectedBannerIndex(selectedBannerIndex - 1);
            }
          }}
          disabled={selectedBannerIndex === 0}
          className="rounded-xl"
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
        {/* Move Down */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (selectedBannerIndex < banners.length - 1) {
              const newSlides = [...banners];
              [newSlides[selectedBannerIndex], newSlides[selectedBannerIndex + 1]] = [
                newSlides[selectedBannerIndex + 1],
                newSlides[selectedBannerIndex]
              ];
              setSelectedBannerIndex(selectedBannerIndex + 1);
            }
          }}
          disabled={selectedBannerIndex === banners.length - 1}
          className="rounded-xl"
        >
          <ChevronDown className="h-4 w-4" />
        </Button>

        <div className="w-px h-8 bg-gray-300 mx-1" />

        {/* Settings Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSettingsDialog(true)}
          className="rounded-xl"
        >
          <Settings className="h-4 w-4" />
        </Button>

        {/* Add Button (Always enabled) */}
        <Button onClick={handleAddSlide} className="rounded-2xl ml-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Banner
        </Button>
      </div>

      {/* BusinessBannerUploader Dialog - Opens directly when clicking Add Banner */}
      <BusinessBannerUploader
        open={showBannerUploader}
        onOpenChange={setShowBannerUploader}
        onUpload={handleBannerUploadComplete}
      />

      {/* Banner Preview Section */}
      <Card className="bg-transparent border-none shadow-none  p-0 relative z-0">
        <CardContent className="p-0">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Banner Preview</h3>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEditBannerUpload(selectedBannerIndex)}
                disabled={!currentBanner}
                className="rounded-xl"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                disabled={!currentBanner}
                className="rounded-xl"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="bg-gray-100 border-3 aspect-3/1 rounded-2xl overflow-hidden relative">
            {currentBanner ? (
              <>
                {currentBanner.mediaType === "video" ||
                currentBanner.media?.includes(".mp4") ? (
                  <video
                    src={currentBanner.media}
                    className="w-full h-full object-cover"
                    muted
                    loop
                    autoPlay
                    playsInline
                  />
                ) : currentBanner.media ? (
                  <img
                    src={getOptimizedImageUrl(currentBanner.media, {
                      width: 800,
                      height: 450,
                      quality: 85,
                      format: "auto",
                    })}
                    alt="Banner preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
                    <ImageOff className="w-24 h-24 text-gray-400 mb-4" />
                    <p className="text-gray-500 text-center">
                      No image configured for this banner
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div
                className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={handleAddSlide}
              >
                <Plus className="w-24 h-24 text-gray-400 mb-4" />
                <p className="text-gray-500 text-center">
                  No banners added yet.
                  <br />
                  Click "Add Banner" to create your first banner.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Banners Table */}
      <Card className="p-0 pb-1 overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Preview</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {banners.map((banner, index) => (
                <TableRow
                  key={index}
                  className={index === selectedBannerIndex ? "bg-blue-50" : ""}
                >
                  <TableCell>
                    <div className="w-16 h-12 bg-gray-100 rounded-lg overflow-hidden relative">
                      {banner.media ? (
                        banner.mediaType === "video" ||
                        banner.media.includes(".mp4") ? (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <Play className="w-6 h-6 text-gray-500" />
                          </div>
                        ) : (
                          <img
                            src={getOptimizedImageUrl(banner.media, {
                              width: 64,
                              height: 48,
                              quality: 85,
                              format: "auto",
                            })}
                            alt="Banner thumbnail"
                            className="w-full h-full object-cover"
                          />
                        )
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="capitalize">{banner.mediaType}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          if (index > 0) {
                            const newSlides = [...banners];
                            [newSlides[index], newSlides[index - 1]] = [
                              newSlides[index - 1],
                              newSlides[index],
                            ];
                            onChange({ ...heroContent, slides: newSlides });
                            if (index === selectedBannerIndex) {
                              setSelectedBannerIndex(index - 1);
                            } else if (index - 1 === selectedBannerIndex) {
                              setSelectedBannerIndex(index);
                            }
                          }
                        }}
                        disabled={index === 0}
                        className="rounded-xl"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          if (index < banners.length - 1) {
                            const newSlides = [...banners];
                            [newSlides[index], newSlides[index + 1]] = [
                              newSlides[index + 1],
                              newSlides[index],
                            ];
                            onChange({ ...heroContent, slides: newSlides });
                            if (index === selectedBannerIndex) {
                              setSelectedBannerIndex(index + 1);
                            } else if (index + 1 === selectedBannerIndex) {
                              setSelectedBannerIndex(index);
                            }
                          }
                        }}
                        disabled={index === banners.length - 1}
                        className="rounded-xl"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditBannerUpload(index)}
                        className="rounded-xl"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setBannerToDelete(index);
                          setShowDeleteDialog(true);
                        }}
                        className="rounded-xl"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {banners.length === 0 && (
            <div className="text-center py-12">
              <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No banners yet
              </h3>
              <p className="text-gray-600">
                Add your first banner using the controls above
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit/Add Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col z-50 bg-white">
          <DialogHeader className="bg-white border-b">
            <DialogTitle className="text-md font-semibold leading-none tracking-tight">
              {editingBannerIndex !== null ? "Edit Banner" : "Add New Banner"}
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500 font-normal">
              {editingBannerIndex !== null ? "Update banner details" : "Create a new hero banner"}
            </DialogDescription>
          </DialogHeader>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto hide-scrollbar px-1 py-4 space-y-6 bg-white">
            {/* Media Section - Using BusinessBannerUploader with tabs for Image and Video */}
            <div>
              <Label className="text-sm font-medium">Background Media</Label>
              <div className="mt-2">
                <BusinessBannerUploader
                  currentBanner={bannerForm.media}
                  mediaType={bannerForm.mediaType as 'image' | 'video' || 'image'}
                  onUpload={(url, type) => {
                    setBannerForm((prev) => ({ ...prev, media: url, mediaType: type }));
                  }}
                  trigger={
                    <div className="p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-primary transition-colors cursor-pointer text-center">
                      <ImageIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-500">Click to upload banner image or video</p>
                      <p className="text-xs text-gray-400 mt-1">Supports: JPG, PNG, MP4, WebM (1500×500)</p>
                    </div>
                  }
                />
              </div>
              {/* Show selected media info */}
              {bannerForm.media && (
                <div className="mt-2 p-2 bg-gray-50 rounded-lg flex items-center gap-2">
                  {bannerForm.mediaType === 'video' || bannerForm.media.includes('.mp4') ? (
                    <Play className="w-4 h-4 text-blue-500" />
                  ) : (
                    <ImageIcon className="w-4 h-4 text-green-500" />
                  )}
                  <span className="text-xs text-gray-600 truncate">{bannerForm.media}</span>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="px-6 py-3 flex flex-row justify-center border-t bg-white z-10 shrink-0">
            <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="rounded-full w-auto flex-1">
              Cancel
            </Button>
            <Button onClick={handleSaveBanner} disabled={savingBanner} className="rounded-full w-auto flex-1">
              {savingBanner ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {editingBannerIndex !== null ? 'Update Banner' : 'Add Banner'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="rounded-2xl max-w-sm p-4 z-50">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-base">Delete Banner</DialogTitle>
            <DialogDescription className="text-xs">
              Delete this banner? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteDialog(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button size="sm" onClick={confirmDelete} className="rounded-xl bg-red-500 hover:bg-red-600">
              <Trash2 className="h-3 w-3 mr-1" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog - KEEP slider settings */}
      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
        <DialogContent className="max-w-md z-50 bg-white">
          <DialogHeader className="bg-white border-b">
            <DialogTitle className="text-md font-semibold leading-none tracking-tight">
              Slider Settings
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500 font-normal">
              Configure hero slider behavior and appearance
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-1 py-4 space-y-6 bg-white">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="autoplay" className="text-sm">Auto-play</Label>
                <Switch
                  id="autoplay"
                  checked={heroContent.autoPlay}
                  onCheckedChange={(checked) => {
                    onChange({ ...heroContent, autoPlay: checked });
                  }}
                />
              </div>

              <div>
                <Label className="text-sm">Transition Speed (seconds)</Label>
                <Select
                  value={heroContent.transitionSpeed?.toString()}
                  onValueChange={(value) => {
                    onChange({ ...heroContent, transitionSpeed: parseInt(value) });
                  }}
                >
                  <SelectTrigger className="mt-2 rounded-2xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 seconds</SelectItem>
                    <SelectItem value="5">5 seconds</SelectItem>
                    <SelectItem value="7">7 seconds</SelectItem>
                    <SelectItem value="10">10 seconds</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="showDots" className="text-sm">Show Navigation Dots</Label>
                <Switch
                  id="showDots"
                  checked={heroContent.showDots !== false}
                  onCheckedChange={(checked) => {
                    onChange({ ...heroContent, showDots: checked });
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="showArrows" className="text-sm">Show Navigation Arrows</Label>
                <Switch
                  id="showArrows"
                  checked={heroContent.showArrows !== false}
                  onCheckedChange={(checked) => {
                    onChange({ ...heroContent, showArrows: checked });
                  }}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="px-6 py-3 flex flex-row justify-center border-t bg-white z-10 shrink-0">
            <Button type="button" variant="outline" onClick={() => setShowSettingsDialog(false)} className="rounded-full w-auto flex-1">
              Cancel
            </Button>
            <Button onClick={handleSaveSettings} className="rounded-full w-auto flex-1">
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

