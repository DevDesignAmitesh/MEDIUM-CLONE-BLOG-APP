"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

interface TypeBlogs {
  title: string;
  content: string;
  authorId: string;
  id: string;
  imageUrl: string;
}

function AllBlogPage() {
  const URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [blogs, setBlogs] = useState<TypeBlogs[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null); // State to store token

  // Use effect to get token from localStorage only in the browser
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token"); // Access localStorage
      setToken(storedToken); // Set token state
    }
  }, []); // Runs only once when the component mounts

  // Function to fetch all blogs
  const getAllBlogs = useCallback(async () => {
    if (!token) {
      console.error("Token is not available"); // Optional: Handle token absence
      return;
    }
    setLoading(true);
    try {
      const allBlogs = await axios.get(`${URL}/api/v1/blog/blog`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBlogs(allBlogs.data.allBlogs);
    } catch (error) {
      console.log("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  }, [URL, token]);

  useEffect(() => {
    if (token) {
      getAllBlogs();
    }
  }, [token, getAllBlogs]);

  const logoutFunction = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    router.push("/");
  };

  const deleteBlogFunction = async (id: string) => {
    if (!token) return; // Exit if token is not available
    try {
      await axios.delete(`${URL}/api/v1/blog/blog`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          id,
        },
      });
      getAllBlogs();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen px-20 py-3 w-full flex justify-start flex-col items-center pt-32 relative">
      <header className="top-0 px-20 py-3 border-b-2 border-gray-400 absolute w-full flex justify-between items-center">
        <h1 className="text-2xl font-bold">Medium</h1>
        <div className="flex items-center gap-5">
          <Link href={"/blogs/createblog"}>
            <button className="py-2 px-4 bg-green-600 text-white font-semibold rounded-md">
              Create Blog
            </button>
          </Link>
          <button
            onClick={logoutFunction}
            className="py-2 px-4 bg-black text-white font-semibold rounded-md"
          >
            Logout
          </button>
        </div>
      </header>
      <h1 className="text-4xl font-bold mb-14">All blogs</h1>
      {loading ? (
        <h1 className="text-5xl">Loading...</h1> // Show loading indicator
      ) : blogs.length === 0 ? (
        <h1 className="text-5xl font-bold">No blogs</h1>
      ) : (
        blogs.map((blog) => (
          <div
            key={blog.id}
            className="flex mb-5 justify-center items-center border-2 border-black p-5 rounded-md gap-2"
          >
            <Link href={`/blogs/oneblog?id=${blog.id}`}>
              <h1 className="text-2xl font-bold">
                {blog.title.length > 10 ? blog.title + "..." : blog.title}
              </h1>
              <p className="text-[18px]">
                {blog.content.length > 10 ? blog.content + "..." : blog.content}
              </p>
              <p className="font-semibold text-gray-700">{blog.authorId}</p>
              {blog.imageUrl && (
                <img
                  className="h-[50px] object-cover"
                  src={blog.imageUrl}
                  alt="blog-photo"
                />
              )}
            </Link>
            <button
              onClick={() => deleteBlogFunction(blog.id)}
              className="py-1 px-3 bg-red-600 text-white font-semibold rounded-md"
            >
              Delete Blog
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default AllBlogPage;
