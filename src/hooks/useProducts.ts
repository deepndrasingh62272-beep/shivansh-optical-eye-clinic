import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Product, ProductCategory } from '@/types';

interface DbProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  material: string;
  price: number;
  original_price: number;
  image_url: string;
  colors: { name: string; hex: string }[];
  rating: number;
  reviews: number;
  badge: string | null;
}

function mapDbProduct(db: DbProduct): Product {
  return {
    id: db.id,
    name: db.name,
    brand: db.brand,
    category: db.category as ProductCategory,
    material: db.material,
    price: db.price,
    originalPrice: db.original_price,
    image: db.image_url,
    colors: db.colors || [],
    rating: Number(db.rating),
    reviews: db.reviews,
    badge: db.badge || undefined,
  };
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    const { data, error: dbError } = await supabase
      .from('products_db')
      .select('*')
      .order('created_at', { ascending: false });

    if (dbError) {
      setError(dbError.message);
      setProducts([]);
    } else if (data) {
      setProducts((data as DbProduct[]).map(mapDbProduct));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refreshProducts: fetchProducts };
}
