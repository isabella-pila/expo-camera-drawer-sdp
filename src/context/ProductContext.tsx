import React, { createContext, useState, useContext, ReactNode } from 'react';

// 1. Defina o tipo do Produto
export type Product = {
  id: string;
  name: string;
  price: string;
  description: string;
  imageUri: string;
  user: string; // O usuário que cadastrou
};

// 2. Defina o que o Contexto fornece
interface IProductContext {
  products: Product[];
  addProduct: (newProductData: Omit<Product, 'id'>) => void;
  // Estado temporário para a foto
  tempImageUri: string | null;
  setTempImageUri: (uri: string | null) => void;
}

const ProductContext = createContext<IProductContext | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [tempImageUri, setTempImageUri] = useState<string | null>(null);

  const addProduct = (newProductData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      id: new Date().toISOString(),
      ...newProductData,
    };
    setProducts(prev => [newProduct, ...prev]);
  };

  const value = {
    products,
    addProduct,
    tempImageUri,
    setTempImageUri,
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

// 3. Hook customizado
export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts deve ser usado dentro de um ProductProvider');
  }
  return context;
};