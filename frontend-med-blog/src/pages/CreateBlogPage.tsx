"use client";

import AuthInput from "@/component/AuthInput";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function CreateBlogPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const url = process.env.NEXT_PUBLIC_BACKEND_URL;
  const router = useRouter();

  // Effect to fetch the token from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken); // Set the token state
    }
  }, []); // Runs only once when the component mounts

  const createBlogFunction = async () => {
    if (!token) {
      console.error("Token is not available"); // Optional: Handle token absence
      return;
    }

    setLoading(true);
    try {
      if (!title && !content && !selectedImage) {
        return setError("please fill some details");
      }
      await axios.post(
        `${url}/api/v1/blog/blog`,
        {
          title,
          content,
          imageUrl: selectedImage ? URL.createObjectURL(selectedImage) : null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      router.push("/blogs/allblog");
    } catch (error) {
      console.error("Error creating blog:", error); // Handle error accordingly
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center flex-col gap-5 relative">
      <header className="px-20 py-3 top-0 border-b-2 border-gray-400 absolute w-full flex justify-between items-center">
        <h1 className="text-2xl font-bold">Medium</h1>
        <Link className="flex items-center gap-5" href={"/blogs/allblog"}>
          <button className="py-2 px-4 bg-black text-white font-semibold rounded-md">
            Cancel
          </button>
        </Link>
      </header>
      <h1 className="font-medium capitalize text-green-600">{error}</h1>
      <AuthInput
        className="font-semibold border-2 border-black text-black p-2 w-[400px] rounded-md"
        value={title}
        label="Add Title"
        placeholder="title..."
        type="text"
        onChange={(e) => setTitle(e.target.value)}
      />
      <AuthInput
        className="font-semibold border-2 border-black text-black p-2 w-[400px] rounded-md"
        value={content}
        label="Add Content"
        placeholder="content..."
        type="text"
        onChange={(e) => setContent(e.target.value)}
      />
      <AuthInput
        className="font-semibold border-2 border-black text-black p-2 w-[400px] rounded-md"
        value={""}
        label="Add Image"
        placeholder=""
        type="file"
        onChange={(e) => {
          const file = e.target.files?.[0] || null
          setSelectedImage(file)
        }}
      />
      <span>{selectedImage?.name}</span>
      <button
        onClick={createBlogFunction}
        className="py-2 px-4 bg-green-600 text-white font-semibold rounded-md"
      >
        {loading ? "Loading" : "Save"}
      </button>
    </div>
  );
}

export default CreateBlogPage;
