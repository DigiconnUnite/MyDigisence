"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Palette,
  Eye,
  Download,
  Upload,
  RotateCcw,
  Sparkles,
  Layout,
  Type,
  Image as ImageIcon,
  Monitor,
  Smartphone,
  Tablet,
  Brush,
  Zap,
  Save,
  RefreshCw
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ThemeViewProps {
  isLoading?: boolean;
}

interface ThemeSettings {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    muted: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    fontSize: {
      base: number;
      scale: number;
    };
    lineHeight: number;
  };
  layout: {
    borderRadius: number;
    spacing: number;
    maxWidth: number;
    sidebarWidth: number;
  };
  components: {
    buttonStyle: "rounded" | "square" | "pill";
    cardStyle: "flat" | "elevated" | "outlined";
    showShadows: boolean;
    animations: boolean;
  };
  customCSS: string;
}

const defaultTheme: ThemeSettings = {
  colors: {
    primary: "#3b82f6",
    secondary: "#6b7280",
    accent: "#f59e0b",
    background: "#ffffff",
    text: "#111827",
    muted: "#6b7280",
  },
  typography: {
    headingFont: "Inter",
    bodyFont: "Inter",
    fontSize: {
      base: 16,
      scale: 1.25,
    },
    lineHeight: 1.6,
  },
  layout: {
    borderRadius: 8,
    spacing: 16,
    maxWidth: 1200,
    sidebarWidth: 280,
  },
  components: {
    buttonStyle: "rounded",
    cardStyle: "elevated",
    showShadows: true,
    animations: true,
  },
  customCSS: "",
};

const fontOptions = [
  "Inter",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Poppins",
  "Playfair Display",
  "Merriweather",
];

const presetThemes = [
  {
    name: "Professional Blue",
    colors: {
      primary: "#2563eb",
      secondary: "#64748b",
      accent: "#0ea5e9",
      background: "#ffffff",
      text: "#0f172a",
      muted: "#64748b",
    },
  },
  {
    name: "Modern Purple",
    colors: {
      primary: "#7c3aed",
      secondary: "#6b7280",
      accent: "#a855f7",
      background: "#ffffff",
      text: "#111827",
      muted: "#6b7280",
    },
  },
  {
    name: "Elegant Green",
    colors: {
      primary: "#059669",
      secondary: "#6b7280",
      accent: "#10b981",
      background: "#ffffff",
      text: "#111827",
      muted: "#6b7280",
    },
  },
  {
    name: "Warm Orange",
    colors: {
      primary: "#ea580c",
      secondary: "#6b7280",
      accent: "#f97316",
      background: "#ffffff",
      text: "#111827",
      muted: "#6b7280",
    },
  },
  {
    name: "Dark Mode",
    colors: {
      primary: "#3b82f6",
      secondary: "#9ca3af",
      accent: "#f59e0b",
      background: "#111827",
      text: "#f9fafb",
      muted: "#9ca3af",
    },
  },
];

export default function ThemeView({ isLoading = false }: ThemeViewProps) {
  const { themeSettings, updateTheme, resetTheme } = useTheme();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("colors");
  const [theme, setTheme] = useState<ThemeSettings>(defaultTheme);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Load saved theme settings
    if (themeSettings) {
      setTheme({
        ...defaultTheme,
        ...themeSettings,
      });
    }
  }, [themeSettings]);

  const handleColorChange = (colorKey: keyof ThemeSettings["colors"], value: string) => {
    setTheme(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorKey]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleTypographyChange = (key: string, value: any) => {
    setTheme(prev => ({
      ...prev,
      typography: {
        ...prev.typography,
        [key]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleLayoutChange = (key: string, value: any) => {
    setTheme(prev => ({
      ...prev,
      layout: {
        ...prev.layout,
        [key]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleComponentChange = (key: string, value: any) => {
    setTheme(prev => ({
      ...prev,
      components: {
        ...prev.components,
        [key]: value,
      },
    }));
    setHasChanges(true);
  };

  const applyPresetTheme = (preset: typeof presetThemes[0]) => {
    setTheme(prev => ({
      ...prev,
      colors: preset.colors,
    }));
    setHasChanges(true);
    toast({
      title: "Theme Applied",
      description: `${preset.name} theme has been applied.`,
    });
  };

  const saveTheme = async () => {
    setIsSaving(true);
    try {
      // Save theme settings
      await updateTheme(theme);
      setHasChanges(false);
      toast({
        title: "Theme Saved",
        description: "Your theme settings have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save theme settings.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const resetToDefault = () => {
    setTheme(defaultTheme);
    setHasChanges(true);
    toast({
      title: "Theme Reset",
      description: "Theme has been reset to default settings.",
    });
  };

  const exportTheme = () => {
    const dataStr = JSON.stringify(theme, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = "theme-settings.json";

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const importTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedTheme = JSON.parse(e.target?.result as string);
          setTheme({ ...defaultTheme, ...importedTheme });
          setHasChanges(true);
          toast({
            title: "Theme Imported",
            description: "Theme settings have been imported successfully.",
          });
        } catch (error) {
          toast({
            title: "Import Error",
            description: "Failed to import theme settings.",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Theme Settings</h1>
            <p className="text-sm text-gray-500 mt-1">Customize your public profile appearance</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-3 bg-gray-200 rounded w-4/6"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Theme Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Customize your public profile appearance</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={resetToDefault}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button variant="outline" size="sm" onClick={exportTheme}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" asChild>
            <label className="cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              Import
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={importTheme}
              />
            </label>
          </Button>
          <Button 
            size="sm" 
            onClick={saveTheme} 
            disabled={!hasChanges || isSaving}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Panel */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="colors" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Colors
              </TabsTrigger>
              <TabsTrigger value="typography" className="flex items-center gap-2">
                <Type className="h-4 w-4" />
                Typography
              </TabsTrigger>
              <TabsTrigger value="layout" className="flex items-center gap-2">
                <Layout className="h-4 w-4" />
                Layout
              </TabsTrigger>
              <TabsTrigger value="components" className="flex items-center gap-2">
                <Brush className="h-4 w-4" />
                Components
              </TabsTrigger>
            </TabsList>

            {/* Colors Tab */}
            <TabsContent value="colors" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Color Palette
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(theme.colors).map(([key, value]) => (
                      <div key={key} className="space-y-2">
                        <Label className="text-sm font-medium capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </Label>
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-lg border-2 border-gray-200"
                            style={{ backgroundColor: value }}
                          />
                          <Input
                            type="color"
                            value={value}
                            onChange={(e) => handleColorChange(key as keyof ThemeSettings["colors"], e.target.value)}
                            className="w-20 h-10"
                          />
                          <Input
                            type="text"
                            value={value}
                            onChange={(e) => handleColorChange(key as keyof ThemeSettings["colors"], e.target.value)}
                            className="flex-1"
                            placeholder="#000000"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Preset Themes */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Preset Themes</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {presetThemes.map((preset) => (
                        <Button
                          key={preset.name}
                          variant="outline"
                          size="sm"
                          onClick={() => applyPresetTheme(preset)}
                          className="h-auto p-3 flex flex-col items-center gap-2"
                        >
                          <div className="flex gap-1">
                            {Object.values(preset.colors).slice(0, 4).map((color, i) => (
                              <div
                                key={i}
                                className="w-4 h-4 rounded"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                          <span className="text-xs">{preset.name}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Typography Tab */}
            <TabsContent value="typography" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Type className="h-5 w-5" />
                    Typography Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Heading Font</Label>
                      <Select
                        value={theme.typography.headingFont}
                        onValueChange={(value) => handleTypographyChange("headingFont", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {fontOptions.map((font) => (
                            <SelectItem key={font} value={font}>
                              {font}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Body Font</Label>
                      <Select
                        value={theme.typography.bodyFont}
                        onValueChange={(value) => handleTypographyChange("bodyFont", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {fontOptions.map((font) => (
                            <SelectItem key={font} value={font}>
                              {font}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Base Font Size: {theme.typography.fontSize.base}px</Label>
                      <Slider
                        value={[theme.typography.fontSize.base]}
                        onValueChange={([value]) => handleTypographyChange("fontSize", { ...theme.typography.fontSize, base: value })}
                        min={12}
                        max={20}
                        step={1}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Font Scale: {theme.typography.fontSize.scale}</Label>
                      <Slider
                        value={[theme.typography.fontSize.scale]}
                        onValueChange={([value]) => handleTypographyChange("fontSize", { ...theme.typography.fontSize, scale: value })}
                        min={1.1}
                        max={1.5}
                        step={0.05}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Line Height: {theme.typography.lineHeight}</Label>
                      <Slider
                        value={[theme.typography.lineHeight]}
                        onValueChange={([value]) => handleTypographyChange("lineHeight", value)}
                        min={1.2}
                        max={2.0}
                        step={0.1}
                        className="w-full"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Layout Tab */}
            <TabsContent value="layout" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layout className="h-5 w-5" />
                    Layout Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Border Radius: {theme.layout.borderRadius}px</Label>
                      <Slider
                        value={[theme.layout.borderRadius]}
                        onValueChange={([value]) => handleLayoutChange("borderRadius", value)}
                        min={0}
                        max={16}
                        step={1}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Spacing: {theme.layout.spacing}px</Label>
                      <Slider
                        value={[theme.layout.spacing]}
                        onValueChange={([value]) => handleLayoutChange("spacing", value)}
                        min={8}
                        max={32}
                        step={4}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Max Width: {theme.layout.maxWidth}px</Label>
                      <Slider
                        value={[theme.layout.maxWidth]}
                        onValueChange={([value]) => handleLayoutChange("maxWidth", value)}
                        min={800}
                        max={1600}
                        step={100}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Sidebar Width: {theme.layout.sidebarWidth}px</Label>
                      <Slider
                        value={[theme.layout.sidebarWidth]}
                        onValueChange={([value]) => handleLayoutChange("sidebarWidth", value)}
                        min={200}
                        max={400}
                        step={20}
                        className="w-full"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Components Tab */}
            <TabsContent value="components" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brush className="h-5 w-5" />
                    Component Styles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Button Style</Label>
                      <Select
                        value={theme.components.buttonStyle}
                        onValueChange={(value: any) => handleComponentChange("buttonStyle", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rounded">Rounded</SelectItem>
                          <SelectItem value="square">Square</SelectItem>
                          <SelectItem value="pill">Pill</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Card Style</Label>
                      <Select
                        value={theme.components.cardStyle}
                        onValueChange={(value: any) => handleComponentChange("cardStyle", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="flat">Flat</SelectItem>
                          <SelectItem value="elevated">Elevated</SelectItem>
                          <SelectItem value="outlined">Outlined</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Show Shadows</Label>
                      <Switch
                        checked={theme.components.showShadows}
                        onCheckedChange={(checked) => handleComponentChange("showShadows", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Enable Animations</Label>
                      <Switch
                        checked={theme.components.animations}
                        onCheckedChange={(checked) => handleComponentChange("animations", checked)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Custom CSS</Label>
                    <Textarea
                      value={theme.customCSS}
                      onChange={(e) => setTheme(prev => ({ ...prev, customCSS: e.target.value }))}
                      placeholder="Add custom CSS rules..."
                      className="min-h-[100px] font-mono text-sm"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Preview Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Device Selector */}
              <div className="flex items-center gap-2">
                <Button
                  variant={previewDevice === "desktop" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPreviewDevice("desktop")}
                >
                  <Monitor className="h-4 w-4" />
                </Button>
                <Button
                  variant={previewDevice === "tablet" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPreviewDevice("tablet")}
                >
                  <Tablet className="h-4 w-4" />
                </Button>
                <Button
                  variant={previewDevice === "mobile" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPreviewDevice("mobile")}
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
              </div>

              {/* Preview Content */}
              <div
                className={cn(
                  "border rounded-lg overflow-hidden",
                  previewDevice === "mobile" && "max-w-sm mx-auto",
                  previewDevice === "tablet" && "max-w-md mx-auto"
                )}
                style={{
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text,
                  fontFamily: theme.typography.bodyFont,
                  fontSize: `${theme.typography.fontSize.base}px`,
                  lineHeight: theme.typography.lineHeight,
                }}
              >
                {/* Preview Header */}
                <div
                  className="p-4 border-b"
                  style={{
                    backgroundColor: theme.colors.primary,
                    borderColor: theme.colors.muted,
                  }}
                >
                  <h3
                    style={{
                      fontFamily: theme.typography.headingFont,
                      fontSize: `${theme.typography.fontSize.base * theme.typography.fontSize.scale * 1.5}px`,
                      color: "#ffffff",
                    }}
                  >
                    John Doe
                  </h3>
                  <p style={{ color: "#ffffff", opacity: 0.9 }}>
                    Professional Developer
                  </p>
                </div>

                {/* Preview Content */}
                <div className="p-4 space-y-4">
                  <div>
                    <h4
                      style={{
                        fontFamily: theme.typography.headingFont,
                        fontSize: `${theme.typography.fontSize.base * theme.typography.fontSize.scale}px`,
                        color: theme.colors.primary,
                      }}
                    >
                      About Me
                    </h4>
                    <p style={{ color: theme.colors.text }}>
                      Experienced developer with expertise in modern web technologies.
                    </p>
                  </div>

                  <div>
                    <h4
                      style={{
                        fontFamily: theme.typography.headingFont,
                        fontSize: `${theme.typography.fontSize.base * theme.typography.fontSize.scale}px`,
                        color: theme.colors.primary,
                      }}
                    >
                      Services
                    </h4>
                    <div className="space-y-2">
                      <div
                        className="p-3 border"
                        style={{
                          borderColor: theme.colors.muted,
                          borderRadius: `${theme.layout.borderRadius}px`,
                          boxShadow: theme.components.showShadows ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                        }}
                      >
                        <h5 style={{ color: theme.colors.text, fontWeight: "bold" }}>Web Development</h5>
                        <p style={{ color: theme.colors.muted, fontSize: "0.9em" }}>
                          Custom web applications
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Button
                      style={{
                        backgroundColor: theme.colors.primary,
                        color: "#ffffff",
                        borderRadius: theme.components.buttonStyle === "pill" ? "9999px" : 
                                     theme.components.buttonStyle === "square" ? "0" : 
                                     `${theme.layout.borderRadius}px`,
                      }}
                    >
                      Contact Me
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Theme Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Theme Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <Badge variant={hasChanges ? "outline" : "default"}>
                  {hasChanges ? "Modified" : "Saved"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Updated</span>
                <span className="text-sm">Just now</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Version</span>
                <span className="text-sm">1.0.0</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
