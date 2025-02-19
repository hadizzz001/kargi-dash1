'use client';

import { useState, useEffect } from 'react';
import Upload from '../components/Upload';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function ProductTable() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const response = await fetch('/api/products');
    if (response.ok) {
      const data = await response.json();
      setProducts(data);
    } else {
      console.error('Failed to fetch products');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`/api/products/${id}`, { method: 'DELETE' });
        if (response.ok) {
          alert('Product deleted successfully');
          fetchProducts();
        } else {
          console.error('Failed to delete product');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      {editingProduct && (
        <EditProductForm
          product={editingProduct}
          onCancel={() => setEditingProduct(null)}
          onSave={() => {
            setEditingProduct(null);
            fetchProducts();
          }}
        />
      )}
      <h1 className="text-2xl font-bold mb-4">Product List</h1>

      <table className="table-auto w-full border-collapse border border-gray-200 mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Title</th>
            <th className="border p-2">Image</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Category</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50">
              <td className="border p-2">{product.title}</td>
              <td className="border p-2">
                {product.img.length > 0 && (
                  <img src={product.img[0]} alt="Product" className="w-24 h-auto" />
                )}
              </td>
              <td className="border p-2">{product.price}</td>
              <td className="border p-2">{product.category}</td>
              <td className="border p-2">
                <button
                  onClick={() => setEditingProduct(product)}
                  className="bg-yellow-500 text-white px-2 py-1 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="bg-red-500 text-white px-2 py-1"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EditProductForm({ product, onCancel, onSave }) {
  const [title, setTitle] = useState(product.title);
  const [description, setDescription] = useState(product.description);
  const [img, setImg] = useState(product.img || []);
  const [price, setPrice] = useState(product.price);
  const [category, setCategory] = useState(product.category || 'Sale');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedProduct = { ...product, title, description, img, price, category };

    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct),
      });

      if (response.ok) {
        alert('Product updated successfully');
        onSave();
      } else {
        console.error('Failed to update product');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleImgChange = (urls) => {
    if (urls.length > 0) {
      setImg(urls);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border p-4 bg-gray-100 rounded">
      <h2 className="text-xl font-bold mb-4">Edit Product</h2>

      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <ReactQuill value={description} onChange={setDescription} theme="snow" />
      </div>

      <div className="mb-4">
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
          Price
        </label>
        <input
          id="price"
          type="text"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border p-2"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border p-2"
        >
          <option value="Sale">Sale</option>
          <option value="Rent">Rent</option>
        </select>
      </div>

      <Upload onImagesUpload={handleImgChange} />

      <div className="flex gap-2 mt-4">
        <button type="submit" className="bg-green-500 text-white px-4 py-2">
          Save
        </button>
        <button type="button" onClick={onCancel} className="bg-gray-500 text-white px-4 py-2">
          Cancel
        </button>
      </div>
    </form>
  );
}
