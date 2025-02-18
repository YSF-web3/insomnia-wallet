import { ethers } from "ethers";
import { toast } from "react-hot-toast";

interface NFT {
  contractAddress: string;
  tokenId: string;
  tokenStandard: string; // "ERC721" or "ERC1155"
}

interface SendNFTParams {
  nft: NFT;
  recipientAddress: string;
}

const useSendNFT = () => {
  const sendNFT = async ({ nft, recipientAddress }: SendNFTParams) => {
    const toastId = toast.loading("Sending NFT...");

    try {
      if (!window.ethereum) {
        throw new Error("No Ethereum provider found. Please install MetaMask.");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const senderAddress = await signer.getAddress();

      let tx;
      if (nft.tokenStandard === "ERC721") {
        // ERC721 Transfer
        const erc721Contract = new ethers.Contract(
          nft.contractAddress,
          [
            "function safeTransferFrom(address from, address to, uint256 tokenId) external",
          ],
          signer
        );

        tx = await erc721Contract.safeTransferFrom(
          senderAddress,
          recipientAddress,
          nft.tokenId
        );
      } else if (nft.tokenStandard === "ERC1155") {
        // ERC1155 Transfer
        const erc1155Contract = new ethers.Contract(
          nft.contractAddress,
          [
            "function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes calldata data) external",
          ],
          signer
        );

        tx = await erc1155Contract.safeTransferFrom(
          senderAddress,
          recipientAddress,
          nft.tokenId,
          1,
          "0x"
        );
      } else {
        throw new Error("Unsupported token standard");
      }

      await tx.wait();
      toast.success("NFT sent successfully!", { id: toastId });
      console.log("NFT sent successfully!");
    } catch (error: any) {
      let errorMessage = "An error occurred while sending the NFT.";

      if (error.code === "ACTION_REJECTED") {
        errorMessage = "Transaction was rejected by the user.";
      } else if (error.code === "INSUFFICIENT_FUNDS") {
        errorMessage = "Not enough funds to complete the transaction.";
      } else if (error.message.includes("user rejected transaction")) {
        errorMessage = "Transaction rejected by the user.";
      } else if (error.message.includes("execution reverted")) {
        errorMessage = "Transaction failed. Check contract permissions.";
      }

      toast.error(errorMessage, { id: toastId });
    } finally {
      toast.dismiss(toastId);
    }
  };

  return { sendNFT };
};

export default useSendNFT;
