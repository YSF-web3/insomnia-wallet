export default function UsernameModal({
  isOpen,
  onClose,
  onRegister,
  username,
  setUsername,
  loading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onRegister: () => void;
  username: string;
  setUsername: (value: string) => void;
  loading: boolean;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className=" p-6 rounded-lg shadow-lg w-96 animate-fadeIn bg-black">
        <h3 className="text-lg font-semibold mb-4 text-center">
          Choose a Username
        </h3>

        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-black"
        />

        <div className="flex justify-between mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={onRegister}
            disabled={loading || !username}
            className={`px-4 py-2 rounded-md transition ${
              loading || !username
                ? "bg-green-300 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </div>
      </div>
    </div>
  );
}
