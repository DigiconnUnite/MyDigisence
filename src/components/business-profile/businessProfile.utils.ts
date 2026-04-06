import {
  InquiryFormData,
  Product,
  SelectCategoryOption,
  BusinessCategory,
} from "@/components/business-profile/BusinessProfile.types";

export const getSelectCategories = (
  categories: BusinessCategory[],
): SelectCategoryOption[] => {
  return categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
  }));
};

export const getFilteredProducts = ({
  products,
  searchTerm,
  selectedCategory,
  selectedBrand,
}: {
  products: Product[];
  searchTerm: string;
  selectedCategory: string;
  selectedBrand: string | null;
}): Product[] => {
  return products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category?.id === selectedCategory;
    const matchesBrand =
      selectedBrand === null || product.brandName === selectedBrand;

    return matchesSearch && matchesCategory && matchesBrand;
  });
};

export const getRelatedProducts = (
  products: Product[],
  mainProduct: Product | null,
): Product[] => {
  if (!mainProduct) return [];

  const allProducts = products.filter(
    (product) => product.id !== mainProduct.id && product.isActive,
  );

  const componentKeywords = [
    "spare",
    "part",
    "component",
    "accessory",
    "kit",
    "module",
    "unit",
    "assembly",
    "replacement",
  ];

  const scoredProducts = allProducts.map((product) => {
    let score = 0;

    if (product.category?.id === mainProduct.category?.id) {
      score += 3;
    }

    if (product.brandName === mainProduct.brandName) {
      score += 2;
    }

    const mainProductWords = mainProduct.name.toLowerCase().split(" ");
    const productWords = product.name.toLowerCase().split(" ");

    for (const mainWord of mainProductWords) {
      if (mainWord.length > 3 && product.name.toLowerCase().includes(mainWord)) {
        score += 5;
        break;
      }
    }

    const productText = (product.name + " " + (product.description || "")).toLowerCase();
    for (const keyword of componentKeywords) {
      if (productText.includes(keyword)) {
        score += 4;
        break;
      }
    }

    const commonWords = mainProductWords.filter(
      (word) => word.length > 3 && productWords.includes(word),
    );
    score += commonWords.length * 2;

    return { product, score };
  });

  return scoredProducts
    .sort((a, b) => b.score - a.score)
    .filter((item) => item.score > 0)
    .slice(0, 3)
    .map((item) => item.product);
};

export const validateInquiryData = (inquiryData: InquiryFormData): string[] => {
  const errors: string[] = [];

  if (!inquiryData.name.trim()) {
    errors.push("Name is required");
  } else if (inquiryData.name.trim().length < 2) {
    errors.push("Name must be at least 2 characters long");
  } else if (inquiryData.name.trim().length > 100) {
    errors.push("Name must be less than 100 characters");
  }

  if (!inquiryData.email.trim()) {
    errors.push("Email is required");
  } else {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(inquiryData.email.trim())) {
      errors.push("Please enter a valid email address");
    }
  }

  if (inquiryData.phone.trim()) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(inquiryData.phone.replace(/[\s\-\(\)]/g, ""))) {
      errors.push("Please enter a valid phone number");
    }
  }

  if (!inquiryData.message.trim()) {
    errors.push("Message is required");
  } else if (inquiryData.message.trim().length < 10) {
    errors.push("Message must be at least 10 characters long");
  } else if (inquiryData.message.trim().length > 2000) {
    errors.push("Message must be less than 2000 characters");
  }

  return errors;
};

export const getProductShareUrl = ({
  businessSlug,
  productId,
}: {
  businessSlug: string;
  productId: string;
}): string => {
  return `${window.location.origin}/catalog/${businessSlug}?product=${productId}&modal=open`;
};

export const toWhatsappNumber = (phone: string): string => {
  return phone.replace(/[^\d]/g, "");
};
