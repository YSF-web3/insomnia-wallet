"use client";

import axiosInstance from "@/config/axios";
import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function signIn(walletAddress: string) {
  const res = await fetch(`${API_URL}/auth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ walletAddress }),
  });

  if (!res.ok) throw new Error("Failed to get nonce");
  console.log("Sign in", await res.json());

  return res.json(); // { nonce: "random_string" }
}

export async function verifySignature(
  walletAddress: string,
  signature: string
) {
  console.log("Verify");

  const res = await fetch(`${API_URL}/auth/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ walletAddress, signature }),
  });

  if (!res.ok) throw new Error("Signature verification failed");
  console.log("VERIFY", await res.json());

  return res.json(); // { accessToken: "jwt_token" }
}

export async function registerUser(
  walletAddress: string,
  username: string,
  signature: string
) {
  const response = await axios.post(`${API_URL}/auth/register`, {
    walletAddress,
    username,
    signature,
  });
  return response.data; // { token: string }
}

export async function whoami(): Promise<any> {
  try {
    if (localStorage.getItem("token")) {
      const response = await axiosInstance.get("/auth/whoami");
      return response;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}
