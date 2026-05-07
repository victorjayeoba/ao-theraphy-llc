import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useNavigate } from "react-router-dom";


interface ProductCardProps {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  picture: string;
  category: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
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

  // Build a product object from props so we can pass it via navigation state
  const product = {
    id,
    slug,
    name,
    description,
    price,
    picture,
    category,
    reviewCount,
    featured,
  };

  console.log(slug);

  // const handleAddToCart = () => {
  //   addItem({ id, name, price, picture });
  // };
  return (
    <div data-aos="fade-up" data-aos-duration="700" className={`therapy-card h-full ${featured ? 'ring-2 ring-accent ring-offset-2' : ''}`}>
      <div className="flex flex-col h-full">
        {/* Image */}
        <div className="relative mb-4">
          <img 
            src={imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl}`}
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
          {/* <div className="flex items-center space-x-2 mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={14} 
                  className={`${
                    i < Math.floor(rating) 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-300'
                  }`} 
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              {rating} ({reviewCount} reviews)
            </span>
          </div> */}
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between">
          <div>
            {/* <span>$</span> */}
            <span className="text-xl font-bold text-foreground">${price}</span>
          </div>
          <Button
            className="btn-accent"
            size="sm"
            onClick={() => navigate(`/products/${slug}`, { state: { product } })}
          >
            View Details
          </Button>

          
        </div>
      </div>
    </div>
  );
};

export default ProductCard;