"use client";

import React, { useState, useEffect, useRef } from "react";
import debounce from "lodash/debounce";
import useSendNFT from "../hooks/useSendNFT";
import { generateRandomGradient } from "@/lib/utils";

interface NFT {
  contractAddress: string;
  tokenId: string;
  name: string;
  imageUrl: string;
  tokenStandard: string;
}

interface User {
  id: string;
  username: string;
  address: string;
  avatar?: string;
}

interface SendModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedNFT: NFT | null;
}
const randomGradient = generateRandomGradient();

const SendModal: React.FC<SendModalProps> = ({
  isOpen,
  onClose,
  selectedNFT,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const { sendNFT } = useSendNFT();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  // Debounced search function (unchanged)
  const searchUsers = debounce(async (query: string) => {
    if (!query) {
      setUsers([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/search?query=${query}`
      );
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error searching users:", error);
    } finally {
      setIsLoading(false);
    }
  }, 300);

  useEffect(() => {
    searchUsers(searchQuery);
    return () => searchUsers.cancel();
  }, [searchQuery]);

  const handleSend = async () => {
    if (!selectedUser || !selectedNFT) return;

    try {
      await sendNFT({
        nft: selectedNFT,
        recipientAddress: selectedUser.address,
      });

      onClose(); // Close the modal after sending the NFT
    } catch (error) {
      console.error("Error sending NFT:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div
        ref={modalRef}
        className="bg-black text-white rounded-lg p-6 w-full max-w-md shadow-xl"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Send NFT</h2>
          <button onClick={onClose} className="text-gray-300 hover:text-white">
            ✕
          </button>
        </div>

        {selectedNFT && (
          <div className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg mb-4">
            <img
              src={selectedNFT.imageUrl}
              alt={selectedNFT.name}
              className="w-16 h-16 rounded-lg object-cover"
              onError={(e) => {
                e.currentTarget.src = "/api/placeholder/64/64";
              }}
            />
            <div>
              <h3 className="font-medium">{selectedNFT.name}</h3>
              <p className="text-sm text-gray-400">
                Token ID: {selectedNFT.tokenId}
              </p>
            </div>
          </div>
        )}

        <div className="relative">
          <input
            type="text"
            placeholder="Search username or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 border border-gray-600 rounded-lg mb-2 bg-gray-800 text-white"
          />

          {(users.length > 0 || isLoading) && (
            <div className="absolute w-full bg-gray-700 border rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 text-center text-gray-500">
                  Searching...
                </div>
              ) : (
                users.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => {
                      setSelectedUser(user);
                      setSearchQuery("");
                    }}
                    className="p-2  cursor-pointer flex gap-2 items-center"
                  >
                    <div
                      style={{
                        background: randomGradient,
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                      }}
                    />
                    <div>
                      <div className="font-medium">{user.username}</div>
                      <div className="text-sm text-gray-500">
                        {user.address}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {selectedUser && (
          <div className="mt-4 p-4 bg-gray-800 rounded-lg">
            <h3 className="font-medium mb-2">Selected Recipient:</h3>
            <div className="flex items-center  gap-2">
              <div
                style={{
                  background: randomGradient,
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                }}
              />
              <div>
                <div className="font-medium">{selectedUser.username}</div>
                <div className="text- text-gray-500">
                  {selectedUser.address}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={!selectedUser}
            className={`px-4 py-2 rounded-lg text-white ${
              selectedUser
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Send NFT
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendModal;
