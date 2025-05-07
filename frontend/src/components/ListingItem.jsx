import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import { FaBath, FaBed, FaParking, FaChair } from "react-icons/fa";

export default function ListingItem({ listing }) {
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

  const handleImageError = (e) => {
    console.error("Image failed to load:", e.target.src);
    e.target.src = "https://placehold.co/600x400?text=No+Image";
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link to={`/listing/${listing._id}`}>
        <div className="relative h-[220px] w-full">
          <img
            src={
              listing.imageUrls && listing.imageUrls.length > 0
                ? getImageUrl(listing.imageUrls[0])
                : "https://placehold.co/600x400?text=No+Image"
            }
            alt={listing.name || "Property"}
            className="h-full w-full object-cover"
            onError={handleImageError}
          />

          <div
            className={`absolute top-2 right-2 px-2 py-1 rounded-md text-xs font-semibold text-white 
            ${listing.status === "active" ? "bg-green-600" : "bg-yellow-500"}`}
          >
            {listing.status === "active" ? "Active" : "Pending"}
          </div>

          <div
            className={`absolute top-2 left-2 px-2 py-1 rounded-md text-xs font-semibold text-white
            ${listing.type === "rent" ? "bg-blue-600" : "bg-purple-600"}`}
          >
            {listing.type === "rent" ? "For Rent" : "For Sale"}
          </div>
        </div>

        <div className="p-4">
          <h2 className="text-lg font-semibold line-clamp-1 mb-1">
            {listing.name}
          </h2>

          <div className="flex items-center gap-1 text-sm text-slate-600 mb-2">
            <MdLocationOn className="text-green-700" />
            <p className="line-clamp-1">{listing.address}</p>
          </div>

          <p className="line-clamp-2 text-sm text-gray-600 mb-2">
            {listing.description}
          </p>

          <div className="font-semibold text-lg mb-2">
            ${listing.regularPrice}
            {listing.type === "rent" && " / month"}
            {listing.offer && listing.discountPrice && (
              <span className="text-sm font-normal text-red-600 ml-2">
                (-${listing.regularPrice - listing.discountPrice} discount)
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-700">
            <div className="flex items-center gap-1">
              <FaBed className="text-lg" />
              {listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : "1 Bed"}
            </div>

            <div className="flex items-center gap-1">
              <FaBath className="text-lg" />
              {listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : "1 Bath"}
            </div>

            {listing.parking && (
              <div className="flex items-center gap-1">
                <FaParking className="text-lg" />
                <span>Parking</span>
              </div>
            )}

            {listing.furnished && (
              <div className="flex items-center gap-1">
                <FaChair className="text-lg" />
                <span>Furnished</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
