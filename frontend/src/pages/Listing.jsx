import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { useSelector } from "react-redux";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";
import Contact from "../components/Contact";

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  // Helper function to ensure consistent URL format for images
  const getImageUrl = (url) => {
    if (!url) return "";

    // Check if it's already a full URL
    if (url.startsWith("http")) {
      return url;
    }

    // Handle URLs starting with /uploads/
    if (url.startsWith("/uploads/")) {
      return `http://localhost:3000${url}`;
    }

    // If it's neither, return the URL as is (fallback)
    return url;
  };

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }

        console.log("Fetched listing data:", data);

        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        console.error("Error fetching listing:", error);
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  // Function to handle if image fails to load
  const handleImageError = (e) => {
    console.error("Image failed to load:", e.target.src);
    e.target.src = "https://placehold.co/600x400?text=No+Image";
  };

  return (
    <main className="max-w-6xl mx-auto p-3">
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && (
        <p className="text-center my-7 text-2xl">Something went wrong!</p>
      )}
      {listing && !loading && !error && (
        <div>
          {/* Image Carousel */}
          <div className="mt-6 mb-8">
            <Swiper
              navigation
              className="rounded-lg overflow-hidden shadow-md"
              slidesPerView={1}
            >
              {listing.imageUrls && listing.imageUrls.length > 0 ? (
                listing.imageUrls.map((url, index) => (
                  <SwiperSlide key={index}>
                    <div className="relative flex justify-center bg-gray-200">
                      <img
                        src={getImageUrl(url)}
                        alt={`Property ${index + 1}`}
                        className="max-h-[400px] object-contain"
                        onError={handleImageError}
                      />
                    </div>
                  </SwiperSlide>
                ))
              ) : (
                <SwiperSlide>
                  <div className="h-[400px] flex items-center justify-center bg-gray-200">
                    <p className="text-xl text-gray-500">No images available</p>
                  </div>
                </SwiperSlide>
              )}
            </Swiper>
          </div>

          {/* Share Button */}
          <div className="fixed top-[10%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-white shadow-md cursor-pointer">
            <FaShare
              className="text-slate-500"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className="fixed top-[16%] right-[3%] z-10 rounded-md bg-white p-2 shadow-md">
              Link copied!
            </p>
          )}

          {/* Listing Details */}
          <div className="flex flex-col gap-4 bg-white rounded-lg p-6 shadow-sm">
            <h1 className="text-2xl font-semibold border-b pb-2">
              {listing.name}
              {listing.regularPrice ? (
                <span className="text-xl text-gray-600 ml-2">
                  ${listing.regularPrice}
                  {listing.type === "rent" && " / month"}
                </span>
              ) : null}
            </h1>

            <p className="flex items-center gap-2 text-gray-600">
              <FaMapMarkerAlt className="text-green-700" />
              {listing.address}
            </p>

            <div className="flex gap-3 my-2">
              <span className="bg-red-800 text-white px-4 py-1 rounded-md text-sm">
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </span>
              <span
                className={`px-4 py-1 rounded-md text-sm text-white ${
                  listing.status === "active" ? "bg-green-700" : "bg-yellow-600"
                }`}
              >
                {listing.status === "active" ? "Active" : "Pending"}
              </span>
            </div>

            <div className="mt-2">
              <h3 className="font-semibold text-gray-800">Description</h3>
              <p className="text-gray-700 mt-1">{listing.description}</p>
            </div>

            <ul className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 bg-gray-50 p-4 rounded-lg">
              <li className="flex items-center gap-2">
                <FaBed className="text-lg text-green-700" />
                <span>
                  {listing.bedrooms} {listing.bedrooms > 1 ? "beds" : "bed"}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <FaBath className="text-lg text-green-700" />
                <span>
                  {listing.bathrooms} {listing.bathrooms > 1 ? "baths" : "bath"}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <FaParking className="text-lg text-green-700" />
                <span>{listing.parking ? "Parking spot" : "No Parking"}</span>
              </li>
              <li className="flex items-center gap-2">
                <FaChair className="text-lg text-green-700" />
                <span>{listing.furnished ? "Furnished" : "Unfurnished"}</span>
              </li>
            </ul>

            {currentUser &&
              currentUser.user &&
              listing.userRef !== currentUser.user._id &&
              !contact && (
                <button
                  onClick={() => setContact(true)}
                  className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3 mt-4 w-full md:w-auto md:min-w-[200px]"
                >
                  Contact landlord
                </button>
              )}

            {contact && <Contact listing={listing} className="mt-4" />}
          </div>
        </div>
      )}
    </main>
  );
}
