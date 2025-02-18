"use client"; // Required for Next.js App Router
import { useAccount, useConnect, useDisconnect } from "wagmi";

export default function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <div>
      {isConnected ? (
        <button
          onClick={() => disconnect()}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Disconnect ({address?.slice(0, 6)}...{address?.slice(-4)})
        </button>
      ) : (
        connectors.map((connector) => (
          <button
            key={connector.id}
            onClick={() => connect({ connector })}
            className="bg-blue-500 text-white px-4 py-2 rounded m-2"
          >
            Connect {connector.name}
          </button>
        ))
      )}
    </div>
  );
}
