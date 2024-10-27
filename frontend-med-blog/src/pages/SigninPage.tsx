"use client";

import AuthBtn from "@/component/AuthBtn";
import AuthHeading from "@/component/AuthHeading";
import AuthInput from "@/component/AuthInput";
import AuthSubHeading from "@/component/AuthSubHeading";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const signinFunction = async () => {
    if (!email || !password) {
        return setError("Fill up your credentials");
    }

    try {
        setLoading(true);
        const res = await axios.post(`${URL}/api/v1/user/signin`, {
            email,
            password,
        });

        // Check if the response contains a valid JWT
        if (res.status === 200 && res.data.jwt) {
            localStorage.setItem("token", res.data.jwt);
            router.push("/blogs/allblog"); // Redirect to the next page on success
        } else {
            setError("Invalid credentials. Please try again.");
            setLoading(false);
        }
    } catch (error) {
        console.error("Sign-in error:", error);
        
        // Handle specific error messages if available
        if (error) {
            setError("Something went wrong");
        } else {
            setError("Something went wrong");
        }
        
        setLoading(false);
        setEmail("");
        setPassword("");
        // Don't redirect to signup on error
    }
};


  return (
    <div className="h-screen w-full flex gap-10 justify-center flex-col items-center">
      <div className="flex flex-col gap-1 justify-center items-center">
        <AuthHeading label="Welcome Back" />
        <AuthSubHeading
          href="/auth/signup"
          span="Signup.."
          label="Don't have an account?"
        />
      </div>
      <div className="flex gap-2 flex-col">
        <AuthInput
          className="border-2 border-black rounded-md p-2 w-[400px]"
          value={email}
          label="Email"
          placeholder="amitesh@gmail.com"
          onChange={(e) => setEmail(e.target.value)}
          type="text"
        />
        <AuthInput
          className="border-2 border-black rounded-md p-2 w-[400px]"
          value={password}
          label="Password"
          placeholder="amit1gsy12"
          onChange={(e) => setPassword(e.target.value)}
          type="password"
        />
        <p className="text-red-600 text-center capitalize w-full">{error}</p>
      </div>
      <AuthBtn
        className="font-semibold bg-black text-white p-2 w-[400px] rounded-md"
        label={`${loading ? "Loading...." : "Sign in"}`}
        onClick={signinFunction}
      />
    </div>
  );
}

export default SignupPage;
