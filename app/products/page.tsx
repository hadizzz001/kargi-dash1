"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import Upload from "../components/Upload";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function AddProduct() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [img, setImg] = useState([""]);
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [bed, setBedrooms] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!category || !type) {
      alert("Please select both category and type");
      return;
    }

    if (img.length === 1 && img[0] === "") {
      alert("Please choose at least 1 image");
      return;
    }

    const payload = { title, description, img, price, category, type, bed };

    const response = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      alert("added successfully!");
      window.location.href = "/dashboard";
    } else {
      alert("Failed to add product");
    }
  };

  const handleImgChange = (url) => {
    if (url) {
      setImg(url);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Add New List</h1>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border p-2 mb-4"
        required
      />

      <label className="block text-lg font-bold mb-2">Category</label>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full border p-2 mb-4"
        required
      >
        <option value="" disabled>Select a category</option>
        <option value="Sale">Sale</option>
        <option value="Rent">Rent</option>
      </select>

      <label className="block text-lg font-bold mb-2">Type</label>
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="w-full border p-2 mb-4"
        required
      >
        <option value="" disabled>Select type</option>
        <option value="Residential">Residential</option>
        <option value="Commercial">Commercial</option>
      </select>

      <label className="block text-lg font-bold mb-2">Number of Bedrooms</label>
      <input
        type="number"
        placeholder="e.g. 3"
        value={bed}
        onChange={(e) => setBedrooms(e.target.value)}
        className="w-full border p-2 mb-4"
        min={0}
      />

      <input
        type="number"
        step="0.01"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="w-full border p-2 mb-4"
        required
      />

      <label className="block text-lg font-bold mb-2">Description</label>
      <ReactQuill
        value={description}
        onChange={setDescription}
        className="mb-4"
        theme="snow"
        placeholder="Write your product description here..."
      />

      <Upload onImagesUpload={handleImgChange} />

      <button type="submit" className="bg-green-500 text-white px-4 py-2">
        Save
      </button>
    </form>
  );
}
