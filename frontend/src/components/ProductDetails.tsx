
import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

interface Product {
	id: string;
	title?: string;
	name?: string;
	price?: number;
	description?: string;
	picture?: string;
	[key: string]: any;
}




const ProductDetails: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const location = useLocation();
	const navigate = useNavigate();

	const initial: Product | null = (location.state as any)?.product ?? null;
	const [product, setProduct] = useState<Product | null>(initial);
	const [loading, setLoading] = useState<boolean>(!initial && !!id);
	const [error, setError] = useState<string | null>(null);

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

	if (loading) return <div>Loading product...</div>;
	if (error) return <div>Error loading product: {error}</div>;
	if (!product) return <div>Product not found.</div>;
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
						src={product.picture}
						alt={product.title ?? product.name}
						className="w-full h-[500px] object-cover rounded-lg shadow-sm"
					/>

				</div>

				<div className="flex flex-col justify-between space-y-6">
					<div>
                        <h1 className="text-2xl font-semibold text-foreground mb-2">
						{product.title ?? product.name}
					</h1>

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

					{/* <div className="flex items-center space-x-3">
						<button
							className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90 disabled:opacity-50"
							onClick={() => {
								// TODO: call real add-to-cart handler (context/Redux)
								// eslint-disable-next-line no-alert
								alert('Add to cart clicked (implement handler)');
							}}
						>
							Add to cart
						</button>

						<button
							className="px-4 py-2 border rounded-md text-sm text-foreground hover:bg-gray-50"
							onClick={() => navigate('/cart')}
						>
							Go to cart
						</button>
					</div> */}

					{/* Terms & Conditions */}
					
				</div>
			</div>
		</div>
	);
};

export default ProductDetails;
