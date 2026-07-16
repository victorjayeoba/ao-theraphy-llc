import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProductCard from "@/components/ProductCard";
import { useQuery } from "@tanstack/react-query";
import NotFound from "@/assets/undraw_file-search_cbur.svg";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";


const ShopPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  // const [filtersOpen, setFiltersOpen] = useState(false);
  // const filtersRef = useRef<HTMLDivElement | null>(null);

  
  // Fetch products from API. The backend should expose `/api/products` that returns
  // an array of product objects. Each object should contain at least `id`, `name`,
  // `description`, `price`, and `image` (URL) fields. If your API returns different
  // field names, adapt the mapping below accordingly.

  const API_BASE = `${import.meta.env.VITE_BASE_URL}/api`;

  const fetchProducts = async () => {
    const res = await fetch(`${API_BASE}/products`);
    if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
    const data = await res.json();
    return data;
  };
  interface ProductItem {
    id: string;
    slug: string;
    name: string;
    description?: string;
    price?: number;
    image?: string;
    category?: string;
    rating?: number;
    reviewCount?: number;
    featured?: boolean;
    [key: string]: any;
  }
  
  // Allow response to be either ProductItem[] or { data: ProductItem[] }
  type ProductsResponse = ProductItem[] | { data: ProductItem[] };

  const { data: products, isLoading, error } = useQuery<ProductsResponse, Error>({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });
  

  // Local state for debounced search to reduce re-computations while typing
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearchTerm(searchTerm), 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const productList: ProductItem[] = Array.isArray(products) ? products : ((products as { data: ProductItem[] })?.data ?? []);
  const suggestions = useMemo(() => {
    const q = (debouncedSearchTerm ?? "").toString().trim().toLowerCase();
    if (!q) return [];
    return productList
      .filter((p) => (p.name ?? "").toString().toLowerCase().includes(q))
      .slice(0, 6);
  }, [productList, debouncedSearchTerm]);

  // Debug: log sample product category fields so we can see how backend sends them
  useEffect(() => {
    if (!productList || productList.length === 0) return;
    console.log(
      "Shop product categories sample:",
      productList.slice(0, 6).map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        categories: p.categories,
      }))
    );
  }, [productList]);


    const categories = useMemo(() => {
    if (!products || !Array.isArray(productList) || productList.length === 0) {
      return [{ id: 'all', name: 'All Products' }];
    }
    
    // Extract unique categories
    const uniqueCategories = new Map();
    uniqueCategories.set('all', { id: 'all', name: 'All Products' });
    
    productList.forEach((product: ProductItem) => {
      if (product.category) {
        uniqueCategories.set(product.category, { 
          id: product.category, 
          name: product.category 
        });
      } else if (Array.isArray(product.categories)) {
        product.categories.forEach((cat: string) => {
          uniqueCategories.set(cat, { id: cat, name: cat });
        });
      }
    });
    
    return Array.from(uniqueCategories.values());
  }, [products, productList]);

  const filteredProducts = useMemo(() => {
    const normalize = (v: any) =>
      String(v ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "");
    const term = (debouncedSearchTerm ?? "").toString().trim().toLowerCase();
    const sel = normalize(selectedCategory);
    return productList.filter((p) => {
      // Category filter
      if (sel && sel !== "all") {
        // normalize product category sources
        let prodCats = "";
        if (Array.isArray(p.categories)) {
          prodCats = p.categories.map((c: any) => normalize(c)).join(" ");
        } else {
          prodCats = normalize(p.category ?? p.categories ?? p.type ?? p.tag ?? "");
        }
        if (!prodCats.includes(sel)) return false;
      }

      // Search term filter (checks name and description)
      if (term) {
        const name = (p.name ?? '').toString().toLowerCase();
        const desc = (p.description ?? '').toString().toLowerCase();
        return name.includes(term) || desc.includes(term);
      }

      return true;
    });
  }, [productList, debouncedSearchTerm, selectedCategory]);

  return (

    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12" data-aos="fade-up">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Therapeutic Tools & Resources
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Professional-grade therapeutic tools carefully selected to support your therapy goals at home and in clinical settings.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 ">
          <div className="flex flex-col lg:flex-row gap-6 mb-6">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                className="pl-10"
              />
              {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute left-0 right-0 mt-1 bg-white dark:bg-gray-800 border rounded-md shadow z-50 max-h-56 overflow-auto">
                  {suggestions.map((s) => (
                    <li
                      key={s.id}
                      className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      onMouseDown={(e) => {
                        e.preventDefault(); // prevent blur from hiding before click
                        setSearchTerm(s.name || "");
                        // if backend provides category info, set it to refine results
                        setSelectedCategory(s.category || (Array.isArray(s.categories) ? s.categories[0] : "all") || "all");
                        setShowSuggestions(false);
                      }}
                    >
                      <div className="text-sm">{s.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {s.category ?? (Array.isArray(s.categories) ? s.categories.join(", ") : "")}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Filters button removed */}
           </div>
         {/* Category Filters */}
         <div className="flex flex-wrap gap-2 mb-4">
           {categories.map((category) => (
             <button
               key={category.id}
               className={`px-3 py-1 rounded-full text-sm cursor-pointer transition-colors ${
                 selectedCategory === category.id
                   ? "bg-primary text-primary-foreground"
                   : "border border-neutral hover:bg-primary/10"
               }`}
               onClick={() => setSelectedCategory(category.id)}
             >
               {category.name}
             </button>
           ))}
         </div>
       </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12 py-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse space-y-4 p-4 rounded-lg shadow-sm bg-white dark:bg-gray-800"
            >
              <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-md" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-full mt-2" />
            </div>
          ))}
        </div>
       ) : error ? (
        <div className="py-20 text-center text-red-500">Error loading products: {error.message}</div>
      ) : (
        <>
          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center">
              <div className="flex justify-center">
                <img src={NotFound} className="h-[200px] w-[200px]" alt="" />
              </div>
              <p className="mb-4 text-lg">No products found matching your filters.</p>
              <div className="flex items-center justify-center gap-3">
                <Button variant="outline" onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}>
                  Clear Filters
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
              {filteredProducts.map((product, index) => (
                <div key={product.id} data-aos="fade-up" data-aos-delay={`${(index % 4) * 100}`}>
                  <ProductCard {...(product as any)} />
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Load More */}
      {/* <div className="text-center">
        <Button variant="outline" size="lg">
          Load More Products
        </Button>
      </div> */}

      {/* Info Section */}
      <div className="mt-20 py-16 bg-secondary/30 rounded-2xl" data-aos="fade-up">
        <div className="max-w-4xl mx-auto text-center px-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Need Help Choosing the Right Tools?
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Every individual has unique therapeutic needs. Schedule a consultation with Dr. Ani to get personalized 
            recommendations for tools that will best support your specific goals and challenges.
          </p>
          <Button asChild size="lg" className="btn-accent">
            <a href="/consultation">Schedule Consultation</a>
          </Button>
        </div>
      </div>
    </div>
    </div>
    
  );
};

export default ShopPage;