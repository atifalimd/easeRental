import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ListingItem from "../components/ListingItem";

export default function Home() {
  const [rentListings, setRentListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const getImageUrl = (url) => {
    if (!url) return "";

    if (url.startsWith("http")) {
      return url;
    }

    if (url.startsWith("/uploads/")) {
      return `http://localhost:3000${url}`;
    }

    return url;
  };

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);

        // Fetch rent listings
        const rentRes = await fetch("/api/listing/get?type=rent&limit=4");
        const rentData = await rentRes.json();

        const rentListingsWithFixedImages = rentData.map((listing) => ({
          ...listing,
          imageUrls: listing.imageUrls.map((url) => getImageUrl(url)),
        }));

        setRentListings(rentListingsWithFixedImages);

        // Fetch sale listings
        const saleRes = await fetch("/api/listing/get?type=sale&limit=4");
        const saleData = await saleRes.json();

        // Fix image URLs in the sale listings
        const saleListingsWithFixedImages = saleData.map((listing) => ({
          ...listing,
          imageUrls: listing.imageUrls.map((url) => getImageUrl(url)),
        }));

        setSaleListings(saleListingsWithFixedImages);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching listings:", error);
        setLoading(false);
      }
    };

    fetchListings();
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
          <p className="text-gray-600 text-base sm:text-lg mb-8">
            From cozy apartments to luxury estates — browse verified listings
            tailored to your lifestyle. Start your next chapter today.
          </p>

          <div className="flex justify-center gap-4">
            <Link
              to="/search?type=rent"
              className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-indigo-700 shadow-md transition"
            >
              Rent a Home
            </Link>
            <Link
              to="/search?type=sale"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-blue-700 shadow-md transition"
            >
              Buy a Home
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Listings Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-pulse text-indigo-600 text-lg">
              Loading featured properties...
            </div>
          </div>
        ) : (
          <>
            {/* Rent Listings */}
            {rentListings.length > 0 && (
              <div className="mb-12">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Featured Rentals
                  </h2>
                  <Link
                    to="/search?type=rent"
                    className="text-indigo-600 text-sm hover:underline"
                  >
                    Explore All Rentals →
                  </Link>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {rentListings.map((listing) => (
                    <ListingItem key={listing._id} listing={listing} />
                  ))}
                </div>
              </div>
            )}

            {/* Sale Listings */}
            {saleListings.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Properties for Sale
                  </h2>
                  <Link
                    to="/search?type=sale"
                    className="text-blue-600 text-sm hover:underline"
                  >
                    Explore All Properties →
                  </Link>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {saleListings.map((listing) => (
                    <ListingItem key={listing._id} listing={listing} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {/* Features Section */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
            Why Choose Us
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <div className="text-indigo-600 text-4xl mb-4">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Listings</h3>
              <p className="text-gray-600">
                Every property is thoroughly vetted for quality and accuracy.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <div className="text-indigo-600 text-4xl mb-4">
                <i className="fas fa-hand-holding-usd"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Best Value</h3>
              <p className="text-gray-600">
                Find the perfect property within your budget with no hidden
                fees.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <div className="text-indigo-600 text-4xl mb-4">
                <i className="fas fa-headset"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600">
                Our dedicated team is always ready to assist with your queries.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
