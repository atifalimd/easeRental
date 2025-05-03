import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const token = currentUser?.access_token;

  const navigate = useNavigate();
  console.log(currentUser._id);

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
  });
  const [uploading, setUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageSubmit = async (images) => {
    const formDataData = new FormData();
    for (let i = 0; i < images.length; i++) {
      formDataData.append("images", images[i]);
    }

    try {
      const res = await fetch(
        "http://localhost:3000/api/listing/upload-images",
        {
          method: "POST",
          body: formDataData,
        }
      );

      if (!res.ok) throw new Error("Image upload failed");

      const data = await res.json();
      console.log("Uploaded image URLs:", data.imageUrls);

      setFormData((prev) => ({
        ...prev,
        imageUrls: [
          ...prev.imageUrls,
          ...data.imageUrls.map((url) => `http://localhost:3000${url}`),
        ],
      }));
    } catch (error) {
      console.error("Upload error:", error.message);
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

    if (type === "checkbox") {
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

    if (formData.imageUrls.length < 1) {
      return setError("You must upload at least one image.");
    }

    if (formData.regularPrice < formData.discountPrice) {
      return setError("Discount price must be lower than the regular price.");
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:3000/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        // credentials: "include",
        body: JSON.stringify({
          ...formData,
          userRef: currentUser.user._id,
        }),
      });
      console.log("Creating listing with userRef:", currentUser._id);

      const data = await res.json();

      setLoading(false);

      if (!data.success) {
        setError(data.message);
      } else {
        navigate(`/listing/${data._id}`);
      }
    } catch (err) {
      setError("Failed to create the listing. Try again.");
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
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
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
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
          </div>

          <div className="flex gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
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
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>Baths</p>
            </div>
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

        <div className="flex flex-col gap-4 flex-1">
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
              onClick={() => handleImageSubmit(files)}
              disabled={uploading}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          {imageUploadError && (
            <p className="text-red-700">{imageUploadError}</p>
          )}
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={`${url}-${index}`}
                className="flex justify-between items-center p-3 border"
              >
                <img
                  src={`http://localhost:3000${url}`}
                  alt={`uploaded-${index}`}
                  className="w-16 h-16 object-cover"
                />
                <button
                  type="button"
                  className="text-red-600"
                  onClick={() => handleRemoveImage(index)}
                >
                  Remove
                </button>
              </div>
            ))}
          <div className="flex justify-center gap-8 mt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full max-w-[200px] text-white bg-blue-700 p-3 rounded-lg uppercase hover:shadow-lg disabled:bg-blue-300"
            >
              {loading ? "Creating..." : "Create Listing"}
            </button>
          </div>
        </div>

        {error && <p className="text-center text-red-700 mt-4">{error}</p>}
      </form>
    </main>
  );
}
