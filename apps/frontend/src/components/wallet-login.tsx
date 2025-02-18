"use client";

import { useState, useEffect } from "react";
import { signIn, verifySignature, registerUser } from "@/services/auth";
import { ethers } from "ethers";
import UsernameModal from "@/components/username-modal";
import { useAccount } from "wagmi";

export default function WalletLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState("");
  const [pendingAuthData, setPendingAuthData] = useState<{
    address: string;
    signature: string;
  } | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    }
  }, [token]);

  async function handleLogin() {
    setError(null);
    setLoading(true);

    try {
      if (!window.ethereum) throw new Error("MetaMask is not installed");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      // Get nonce & check if user exists
      const { nonce, exists } = await signIn(address);

      //  Sign the nonce
      const signature = await signer.signMessage(nonce);

      if (!exists) {
        setPendingAuthData({ address, signature });
        setShowModal(true);
        return;
      }

      //  Verify the signature & get JWT for existing users
      const { token: newToken } = await verifySignature(address, signature);
      setToken(newToken);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister() {
    if (!pendingAuthData) {
      setError("No pending authentication data found");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const { address, signature } = pendingAuthData;

      // Register the new user with a username
      await registerUser(address, username, signature);

      // Verify the signature to obtain JWT
      const { token: newToken } = await verifySignature(address, signature);

      setToken(newToken);
      setPendingAuthData(null);
      setShowModal(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleModalClose() {
    setShowModal(false);
    setPendingAuthData(null);
    setUsername("");
  }

  const { address } = useAccount();

  return (
    <div className="w-full">
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!address && (
        <div className="p-4 flex justify-center   ">
          <button
            onClick={handleLogin}
            disabled={loading}
            className="px-4 py-2 bg-green-600 hover:bg-green-500 active:bg-green-700 transition-colors rounded-lg shadow-md text-white font-medium"
          >
            {loading ? "Signing in..." : "Login with MetaMask"}
          </button>
        </div>
      )}
      <UsernameModal
        isOpen={showModal}
        onClose={handleModalClose}
        onRegister={handleRegister}
        username={username}
        setUsername={setUsername}
        loading={loading}
      />
    </div>
  );
}
