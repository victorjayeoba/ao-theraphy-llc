
import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import StarRating from '@/components/StarRating';
import { productRating } from '@/lib/ratings';
import { Loader2, Minus, Plus, ShoppingCart } from 'lucide-react';

interface Product {
	id: string;
	title?: string;
	name?: string;
	price?: number;
	description?: string;
	picture?: string;
	rating?: number | string | null;
	review_count?: number | null;
	[key: string]: any;
}




const ProductDetails: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const location = useLocation();
	const navigate = useNavigate();

	const { addItem, closeCart } = useCart();

	const initial: Product | null = (location.state as any)?.product ?? null;
	const [product, setProduct] = useState<Product | null>(initial);
	const [loading, setLoading] = useState<boolean>(!initial && !!id);
	const [error, setError] = useState<string | null>(null);
	const [quantity, setQuantity] = useState(1);

	useEffect(() => {
		if (product || !id) {
			setLoading(false);
			return;
		}

		let cancelled = false;
		setLoading(true);
		setError(null);

		// Try to fetch product from a REST endpoint. If your app uses a different
		// data layer (context, Redux, GraphQL), adapt this to read from that store.
		fetch(`${import.meta.env.VITE_BASE_URL}/api/products/${id}`)
			.then((res) => {
				if (!res.ok) throw new Error(`Failed to load product (${res.status})`);
				return res.json();
			})
			.then((data) => {
				if (!cancelled) setProduct(data as Product);
			})
			.catch((err) => {
				if (!cancelled) setError(err.message || 'Unknown error');
			})
			.finally(() => {
				if (!cancelled) setLoading(false);
			});

		return () => {
			cancelled = true;
		};
	}, [id]);

	if (loading)
		return (
			<div className="min-h-[60vh] flex items-center justify-center text-muted-foreground">
				<Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading product...
			</div>
		);
	if (error || !product)
		return (
			<div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
				<p className="text-lg">{error ? "We couldn't load this product." : 'Product not found.'}</p>
				<Button className="btn-accent" onClick={() => navigate('/shop')}>Back to Shop</Button>
			</div>
		);

	const title = product.title ?? product.name ?? 'Product';
	const stars = productRating(product);
	const pic = product.picture ?? '';
	const image = !pic || /^(https?:|data:)/.test(pic) ? pic : `${import.meta.env.VITE_BASE_URL}${pic}`;

	const handleAddToCart = () =>
		addItem(
			{
				id: String(product.id),
				name: title,
				price: Number(product.price) || 0,
				image,
			},
			quantity
		);

	const handleBuyNow = () => {
		handleAddToCart();
		closeCart(); // skip the sidebar, go straight to checkout
		navigate('/checkout');
	};
	return (
		<div className="container mx-auto py-[80px] px-4 lg:px-8 bg-white/80 dark:bg-slate-900 rounded-lg shadow-sm">
			<div className="mb-4">
				<button
					className="text-sm text-gray-600 border border-[#dadfe7] py-2 px-6 rounded-[30px] mb-8 dark:text-gray-300"
					onClick={() => navigate(-1)}
				>
					← Back
				</button>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
				<div>
					<img
						src={image}
						alt={product.title ?? product.name}
						className="w-full h-[500px] object-cover rounded-lg shadow-sm"
					/>

				</div>

				<div className="flex flex-col justify-between space-y-6">
					<div>
                        <h1 className="text-2xl font-semibold text-foreground mb-2">
						{title}
					</h1>

					{stars && <StarRating rating={stars.rating} reviewCount={stars.reviewCount} size={16} />}

                    <div className="prose max-w-none my-6 text-muted-foreground">
						{product.description ?? 'No description available.'}
					</div>

					<div className="flex items-baseline space-x-4 mb-4">
						<div className="text-2xl font-bold text-foreground">
							{/* {typeof product.price === 'number' ? `$${product.price.toFixed(2)}` : product.price ?? '—'} */}
                            {Number(product.price)
                            ? `$${Number(product.price).toFixed(2)}`
                            : product.price ?? '—'}

						</div>
						{product.category && (
							<span className="text-sm px-2 py-1 bg-gray-100 rounded text-gray-700">{product.category}</span>
						)}
					</div>

                    <section className="mt-6 bg-gray-50 dark:bg-slate-800 p-4 rounded">
						<h2 className="text-sm font-medium mb-2">Terms & Conditions</h2>
						<ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
							<li>All purchases are subject to availability and confirmation of the order price.</li>
							<li>Please read product labels and usage instructions before use.</li>
							<li>Keep products out of reach of children and pets.</li>
							<li>If you have allergies or medical concerns, consult a professional before use.</li>
							<li>Returns and refunds are handled according to our store policy.</li>
						</ul>
					</section>

					
                    </div>

					<div className="flex flex-wrap items-center gap-4">
						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								size="icon"
								className="h-9 w-9"
								aria-label="Decrease quantity"
								onClick={() => setQuantity((q) => Math.max(1, q - 1))}
							>
								<Minus className="w-4 h-4" />
							</Button>
							<span className="w-10 text-center font-medium" aria-live="polite">
								{quantity}
							</span>
							<Button
								variant="outline"
								size="icon"
								className="h-9 w-9"
								aria-label="Increase quantity"
								onClick={() => setQuantity((q) => q + 1)}
							>
								<Plus className="w-4 h-4" />
							</Button>
						</div>

						<Button className="btn-accent flex-1 min-w-[160px]" onClick={handleAddToCart}>
							<ShoppingCart className="w-4 h-4 mr-2" />
							Add to Cart
						</Button>

						<Button variant="outline" onClick={handleBuyNow}>
							Buy Now
						</Button>
					</div>

					{/* Terms & Conditions */}
					
				</div>
			</div>
		</div>
	);
};

export default ProductDetails;
