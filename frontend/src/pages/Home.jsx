import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ListingItem from "../components/ListingItem";

export default function Home() {
  const [rentListings, setRentListings] = useState([]);

  useEffect(() => {
    const fetchRentListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=rent&limit=4");
        const data = await res.json();
        setRentListings(data);
      } catch (error) {
        console.error("Error fetching rent listings:", error);
      }
    };

    fetchRentListings();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-100 to-indigo-200 py-20 px-4 sm:px-10 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-800 leading-tight mb-6">
            Discover Your <span className="text-indigo-600">Dream Home</span>
            <br />
            with <span className="text-blue-600">Zero Hassle</span>
          </h1>
          <p className="text-gray-600 text-base sm:text-lg mb-6">
            From cozy apartments to luxury estates — browse verified listings
            tailored to your lifestyle. Start your next chapter today.
          </p>

          <Link
            to="/search"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-indigo-700 shadow-md transition"
          >
            Browse Properties
          </Link>
        </div>
      </section>

      {/* Rent Listings Section */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        {rentListings.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">For Rent</h2>
              <Link
                to="/search?type=rent"
                className="text-indigo-600 text-sm hover:underline"
              >
                Explore Rentals
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rentListings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
