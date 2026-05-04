import { useEffect, useState } from "react";
import { Star, X } from "lucide-react";
import { getFavorites, removeFromFavorites } from "../lib/api";
import toast from "react-hot-toast";

export default function FavoritesList({ isOpen, onClose }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const data = await getFavorites();
        setFavorites(data.favorites || []);
      // eslint-disable-next-line no-unused-vars
      } catch (_error) {
        toast.error("Failed to load favorites");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [isOpen]);

  const handleRemove = async (messageId) => {
    try {
      await removeFromFavorites(messageId);
      setFavorites((prev) => prev.filter((f) => f.messageId !== messageId));
      toast.success("Removed from favorites");
    // eslint-disable-next-line no-unused-vars
    } catch (_error) {
      toast.error("Failed to remove favorite");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-white" />
            <h2 className="text-white font-bold">⭐ Favorite Messages</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:opacity-80 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : favorites.length === 0 ? (
            <p className="text-center text-gray-500">No favorite messages yet</p>
          ) : (
            <div className="space-y-3">
              {favorites.map((fav, idx) => (
                <div
                  key={idx}
                  className="bg-blue-50 border border-blue-200 rounded-lg p-4 hover:bg-blue-100 transition"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-sm text-gray-700">
                        {fav.sender}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(fav.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemove(fav.messageId)}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-gray-800 text-sm break-words">{fav.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
