"use client";

import AuthBtn from "@/component/AuthBtn";
import AuthHeading from "@/component/AuthHeading";
import AuthInput from "@/component/AuthInput";
import AuthSubHeading from "@/component/AuthSubHeading";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function SignupPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const router = useRouter();

  const signupFunction = async () => {
    if (!email || !name || !password) {
      return setError("fill up your credentials");
    }
    try {
      setLoading(true);
      const res = await axios.post(`${URL}/api/v1/user/signup`, {
        email,
        name,
        password,
      });
      if (res.status === 200 && res.data.jwt) {
        localStorage.setItem("token", res.data.jwt);
        router.push("/blogs/allblog"); // Redirect to the next page on success
      } else {
        setError("Invalid credentials. Please try again.");
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      setError("something went wrong please try again");
      setEmail("");
      setName("");
      setPassword("");
      console.log(error)
    }
  };

  return (
    <div className="h-screen w-full flex gap-10 justify-center flex-col items-center">
      <div className="flex flex-col gap-1 justify-center items-center">
        <AuthHeading label="Create New Account" />
        <AuthSubHeading
          href="/auth/signin"
          span="Signin.."
          label="Already have an account"
        />
      </div>
      <div className="flex gap-2 flex-col">
        <AuthInput
          className="border-2 border-black rounded-md p-2 w-[400px]"
          value={email}
          label="Name"
          placeholder="amitesh"
          onChange={(e) => setEmail(e.target.value)}
          type="text"
        />
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
        label={`${loading ? "Loading...." : "Sign up"}`}
        onClick={signupFunction}
      />
    </div>
  );
}

export default SignupPage;
