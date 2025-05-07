import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserFailure,
  deleteUserSuccess,
  signOutUserFailure,
  signOutUserSuccess,
  signOutUserStart,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [formData, setFormData] = useState({});
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [loadingListings, setLoadingListings] = useState(false);
  const navigate = useNavigate();

  // Helper function to ensure consistent URL format for images
  const getImageUrl = (url) => {
    if (!url) return "";
    return url.startsWith("http") ? url : `http://localhost:3000${url}`;
  };

  useEffect(() => {
    if (currentUser?.user?._id) {
      handleShowListings();
    }
  }, [currentUser?.user?._id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setLoadingListings(true);
      setShowListingsError(false);

      const userId = currentUser.user._id;

      // Make sure we have a user ID
      if (!userId) {
        setShowListingsError(true);
        setLoadingListings(false);
        return;
      }

      const token = currentUser?.access_token;

      const res = await fetch(`/api/user/listings/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      setLoadingListings(false);

      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
      console.log("Fetched user listings:", data);
    } catch (error) {
      console.error("Error fetching listings:", error);
      setShowListingsError(true);
      setLoadingListings(false);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const token = currentUser?.access_token;

      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="file" ref={fileRef} hidden accept="image/*" />
        <img
          onClick={() => fileRef.current.click()}
          src={currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />

        <input
          type="text"
          placeholder="username"
          defaultValue={currentUser.username}
          id="username"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          defaultValue={currentUser.email}
          id="email"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          defaultValue={currentUser.password}
          id="password"
          className="border p-3 rounded-lg"
          autoComplete="current-password"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
          to={"/create-listing"}
        >
          Create Listing
        </Link>
      </form>
      <button
        onClick={() => navigate("/earnings")}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full mt-4"
      >
        View Earnings
      </button>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer"
        >
          Delete account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          Sign out
        </span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ""}</p>
      <p className="text-green-700 mt-5">
        {updateSuccess ? "User is updated successfully" : ""}
      </p>

      <div className="mt-5">
        <h2 className="text-xl font-semibold mb-4">Your Listings</h2>
        {loadingListings ? (
          <p className="text-center text-gray-500">Loading your listings...</p>
        ) : showListingsError ? (
          <div className="flex flex-col items-center">
            <p className="text-red-700 mb-2">Error loading listings</p>
            <button
              onClick={handleShowListings}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Retry
            </button>
          </div>
        ) : userListings.length === 0 ? (
          <p className="text-center text-gray-500">
            You don't have any listings yet.
          </p>
        ) : (
          <div className="flex flex-col gap-4 mt-2">
            {userListings.map((listing) => (
              <div
                key={listing._id}
                className="border rounded-lg p-3 flex justify-between items-center gap-4 hover:bg-gray-50"
              >
                <Link
                  to={`/listing/${listing._id}`}
                  className="flex items-center gap-4 flex-1"
                >
                  {/* Use helper function to ensure consistent URL format */}
                  <img
                    src={getImageUrl(listing.imageUrls[0])}
                    alt="listing cover"
                    className="h-16 w-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="text-slate-700 font-semibold truncate">
                      {listing.name}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {listing.address}
                    </p>
                    <div className="flex items-center mt-1">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          listing.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {listing.status}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        {listing.bedrooms} bed • {listing.bathrooms} bath
                      </span>
                    </div>
                  </div>
                </Link>

                <div className="flex flex-col gap-2">
                  <Link to={`/update-listing/${listing._id}`}>
                    <button className="text-blue-700 bg-blue-50 px-3 py-1 rounded hover:bg-blue-100">
                      Edit
                    </button>
                  </Link>
                  <button
                    onClick={() => handleListingDelete(listing._id)}
                    className="text-red-700 bg-red-50 px-3 py-1 rounded hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
