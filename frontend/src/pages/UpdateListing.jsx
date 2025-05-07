import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();

  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    status: "pending",
    regularPrice: 0,
    discountPrice: 0,
    offer: false,
  });
  const [uploading, setUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const getImageUrl = (url) => {
    if (!url) return "";
    return url.startsWith("http") ? url : `http://localhost:3000${url}`;
  };

  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${listingId}`);
        const data = await res.json();

        if (data.success === false) {
          setError("Failed to fetch listing");
          setLoading(false);
          return;
        }

        setFormData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching listing:", error);
        setError("Failed to fetch listing details");
        setLoading(false);
      }
    };

    fetchListing();
  }, [params.listingId]);

  const handleImageSubmit = async (e) => {
    e.preventDefault();

    if (!files || files.length === 0) {
      setImageUploadError("Please select at least one image");
      return;
    }

    if (files.length > 6) {
      setImageUploadError("You can only upload up to 6 images");
      return;
    }

    setUploading(true);
    setImageUploadError(null);

    const formDataData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formDataData.append("images", files[i]);
    }

    try {
      const res = await fetch(
        "http://localhost:3000/api/listing/upload-images",
        {
          method: "POST",
          body: formDataData,
        }
      );

      const data = await res.json();
      console.log("Uploaded image URLs:", data.imageUrls);

      if (!res.ok) {
        setImageUploadError(data.error || "Image upload failed");
        setUploading(false);
        return;
      }

      // Store the URLs as they are returned from the server
      setFormData((prev) => {
        // Add new images to existing ones
        const updatedImageUrls = [...prev.imageUrls, ...data.imageUrls];

        console.log("Updated formData with image URLs:", updatedImageUrls);

        setUploading(false);
        setFiles([]);

        return {
          ...prev,
          imageUrls: updatedImageUrls,
        };
      });
    } catch (error) {
      console.error("Upload error:", error.message);
      setImageUploadError("Failed to upload images.");
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  const handleChange = (e) => {
    const { id, type, value, checked } = e.target;

    if (id === "sale" || id === "rent") {
      // Handle property type (sale/rent) radio buttons
      setFormData({
        ...formData,
        type: id,
      });
    } else if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [id]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous states
    setError(null);
    setSuccess(false);

    if (formData.imageUrls.length < 1) {
      setError("You must upload at least one image.");
      return;
    }

    if (formData.offer && formData.regularPrice < formData.discountPrice) {
      setError("Discount price must be lower than the regular price.");
      return;
    }

    setLoading(true);

    try {
      const token = currentUser?.access_token;
      const res = await fetch(
        `http://localhost:3000/api/listing/update/${params.listingId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            userRef: currentUser.user._id,
          }),
        }
      );

      const data = await res.json();
      console.log("Update response:", data);

      setLoading(false);

      if (data.success === false) {
        setError(data.message || "Failed to update listing");
      } else {
        setSuccess(true);
        // Redirect after a short delay to allow the user to see the success message
        setTimeout(() => {
          navigate(`/listing/${data._id || params.listingId}`);
        }, 1500);
      }
    } catch (err) {
      console.error("Update error:", err);
      setError("Failed to update the listing. Try again.");
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Update Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="radio"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="radio"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>
          </div>

          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg w-20"
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg w-20"
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>Baths</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="0"
                required
                className="p-3 border border-gray-300 rounded-lg w-24"
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className="flex flex-col">
                <p>Regular price</p>
                {formData.type === "rent" && (
                  <span className="text-xs">($ / month)</span>
                )}
              </div>
            </div>

            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  min="0"
                  required
                  className="p-3 border border-gray-300 rounded-lg w-24"
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className="flex flex-col">
                  <p>Discounted price</p>
                  {formData.type === "rent" && (
                    <span className="text-xs">($ / month)</span>
                  )}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Listing Status
            </label>
            <div className="flex items-center space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  id="status"
                  value="active"
                  checked={formData.status === "active"}
                  onChange={handleChange}
                  className="form-radio text-blue-600"
                />
                <span className="ml-2">Active</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  id="status"
                  value="pending"
                  checked={formData.status === "pending"}
                  onChange={handleChange}
                  className="form-radio text-blue-600"
                />
                <span className="ml-2">Pending</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={(e) => setFiles(e.target.files)}
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              disabled={uploading}
              onClick={handleImageSubmit}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          {imageUploadError && (
            <p className="text-red-700">{imageUploadError}</p>
          )}

          <div className="grid grid-cols-2 gap-2">
            {formData.imageUrls.length > 0 &&
              formData.imageUrls.map((url, index) => (
                <div
                  key={`${url}-${index}`}
                  className="flex justify-between p-3 border items-center rounded"
                >
                  <img
                    src={getImageUrl(url)}
                    alt="listing image"
                    className="w-20 h-20 object-contain rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="p-2 text-red-700 rounded-lg uppercase hover:opacity-75"
                  >
                    Delete
                  </button>
                </div>
              ))}
          </div>

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full max-w-[200px] text-white bg-blue-700 p-3 rounded-lg uppercase hover:shadow-lg disabled:bg-blue-300"
            >
              {loading ? "Updating..." : "Update Listing"}
            </button>
          </div>

          {error && (
            <p className="text-center text-red-700 bg-red-100 p-2 rounded-lg">
              {error}
            </p>
          )}

          {success && (
            <p className="text-center text-green-700 bg-green-100 p-2 rounded-lg">
              Listing updated successfully! Redirecting...
            </p>
          )}
        </div>
      </form>
    </main>
  );
}
