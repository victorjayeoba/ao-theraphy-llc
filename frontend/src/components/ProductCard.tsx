import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useNavigate } from "react-router-dom";
import StarRating from "@/components/StarRating";
import { productRating } from "@/lib/ratings";


interface ProductCardProps {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  picture: string;
  category: string;
  rating?: number | string | null;
  review_count?: number | null;
  reviewCount?: number;
  inStock?: boolean;
  featured?: boolean;
}

const ProductCard = ({
  id,
  slug,
  name,
  description,
  price,
  picture,
  category,
  rating,
  review_count,
  reviewCount,
  featured = false
}: ProductCardProps) => {
  const { addItem } = useCart();
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BASE_URL;

  // Resolve image URL from different possible API shapes
  const resolveImageUrl = (img: any): string | undefined => {
    if (!img) return undefined;
    if (typeof img === 'string') return img;
    if (Array.isArray(img) && img.length > 0) {
      return resolveImageUrl(img[0]);
    }
    if (typeof img === 'object') {
      if (img.url && typeof img.url === 'string') return img.url;
      if (img.src && typeof img.src === 'string') return img.src;
      if (img.path && typeof img.path === 'string') return img.path;
      // Strapi-like shapes
      if (img.data) {
        if (Array.isArray(img.data) && img.data.length > 0) {
          const attr = img.data[0]?.attributes;
          if (attr?.url) return attr.url;
        }
        const attr = img.data?.attributes;
        if (attr?.url) return attr.url;
      }
      if (img.attributes && img.attributes.url) return img.attributes.url;
      if (img.image) return resolveImageUrl(img.image);
    }
    return undefined;
  };

  const placeholder = `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'><rect width='100%' height='100%' fill='%23f3f4f6'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-family='Arial,Helvetica,sans-serif' font-size='20'>No image</text></svg>`
  )}`;

  const imageUrl = resolveImageUrl(picture) ?? placeholder;
  // Absolute URL, so the cart and checkout can render the same image.
  const displayImage = imageUrl.startsWith("http") || imageUrl.startsWith("data:")
    ? imageUrl
    : `${baseUrl}${imageUrl}`;

  const stars = productRating({ rating, review_count, reviewCount });

  // Build a product object from props so we can pass it via navigation state
  const product = {
    id,
    slug,
    name,
    description,
    price,
    picture: displayImage,
    category,
    rating,
    review_count: review_count ?? reviewCount,
    featured,
  };

  const handleAddToCart = () => {
    addItem({ id, name, price: Number(price), image: displayImage });
  };

  return (
    <div data-aos="fade-up" data-aos-duration="700" className={`therapy-card h-full ${featured ? 'ring-2 ring-accent ring-offset-2' : ''}`}>
      <div className="flex flex-col h-full">
        {/* Image */}
        <div className="relative mb-4">
          <img
            src={displayImage}
            alt={name}
            className="w-full h-48 object-cover rounded-lg"
          />
          {featured && (
            <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground">
              Featured
            </Badge>
          )}
          
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="mb-2">
            <Badge variant="outline" className="text-xs mb-2">
              {category}
            </Badge>
          </div>
          
          <h3 className="font-semibold text-foreground mb-2">{name}</h3>
          <p className="text-muted-foreground text-sm mb-3 leading-relaxed line-clamp-2">
            {description}
          </p>
          
          {/* Rating */}
          {stars && (
            <StarRating
              rating={stars.rating}
              reviewCount={stars.reviewCount}
              className="mb-4"
            />
          )}
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-xl font-bold text-foreground">${Number(price).toFixed(2)}</span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/products/${slug}`, { state: { product } })}
            >
              Details
            </Button>
            <Button
              className="btn-accent"
              size="sm"
              onClick={handleAddToCart}
              aria-label={`Add ${name} to cart`}
            >
              <ShoppingCart size={16} className="mr-1" />
              Add
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;