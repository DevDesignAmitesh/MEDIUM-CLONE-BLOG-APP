"use client";

import axios from "axios";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

type TypeBlogs = {
  title: string;
  content: string;
  imageUrl: string;
};

function OneBlogPage() {
  const searchParams = useSearchParams();
  const id = searchParams?.get("id");
  const URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [uniqueBlog, setUniqueBlog] = useState<TypeBlogs | null>(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null); // State to store token

  // Use effect to get token from localStorage only in the browser
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken); // Set the token state
    }
  }, []); // Runs only once when the component mounts

  const getUniqueBlog = useCallback(async () => {
    if (!token) {
      console.error("Token is not available"); // Optional: Handle token absence
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(`${URL}/api/v1/blog/blog/unique`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          id,
        },
      });
      setUniqueBlog(res.data.uniqueBlog);
    } catch (error) {
      console.error("Error fetching unique blog:", error);
    } finally {
      setLoading(false);
    }
  }, [URL, id, token]);

  useEffect(() => {
    if (id) {
      getUniqueBlog();
    }
  }, [id, getUniqueBlog]);

  return (
    <div className="flex justify-center relative items-center w-full px-14 min-h-screen">
      <header className="top-0 px-20 py-3 border-b-2 border-gray-400 absolute w-full flex justify-between items-center">
        <h1 className="text-2xl font-bold">Medium</h1>
        <div className="flex items-center gap-5">
        <Link href={`/blogs/updateblog?id=${id}`}>
            <button className="py-2 px-4 bg-gray-600 text-white font-semibold rounded-md">
              Update Blog
            </button>
          </Link>
          <Link href={"/blogs/allblog"}>
            <button className="py-2 px-4 bg-black text-white font-semibold rounded-md">
              Back To Dashboard
            </button>
          </Link>
        </div>
      </header>
      {loading ? (
        <h1 className="text-4xl font-semibold">Loading.....</h1>
      ) : (
        <div className="w-full flex flex-col justify-center gap-5 items-center h-screen">
          <h1 className="text-2xl font-bold ">Author Name</h1>
          <div className="flex flex-col justify-center items-center">
            <h1 className="text-[30px] text-center leading-tight font-bold">
              Title: {uniqueBlog?.title || "No Title Available"}
            </h1>
            <p className="text-[18px] text-center">
              <span className="font-semibold">Content:</span>{" "}
              {uniqueBlog?.content || "No Content Available"}
            </p>
            <img className="h-[200px] object-cover" src={uniqueBlog?.imageUrl} alt="" />
          </div>
        </div>
      )}
    </div>
  );
}

export default OneBlogPage;
