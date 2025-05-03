import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function ActiveListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { currentUser } = useSelector((state) => state.user);
  const token = currentUser?.access_token;

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch(
          "http://localhost:3000/api/get-active-listing",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        console.log(data);

        if (!data.success) {
          throw new Error(data.message || "Failed to load listings");
        }

        setListings(data.active || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  return (
    <main className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Active Listings</h1>

      {loading && <p className="text-center">Loading listings...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

      {!loading && !error && listings.length === 0 && (
        <p className="text-center text-gray-500">No active listings found.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <div
            key={listing._id}
            className="border rounded-lg p-4 shadow hover:shadow-lg transition"
          >
            <img
              src={listing.imageUrls?.[0] || "/activeListing.jpg"}
              alt={listing.name}
              className="w-full h-48 object-cover rounded"
            />
            <h2 className="text-xl font-semibold mt-4">{listing.name}</h2>
            <p className="text-gray-700 mt-1">{listing.address}</p>
            <p className="text-blue-600 font-bold mt-2">
              ${listing.regularPrice}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
