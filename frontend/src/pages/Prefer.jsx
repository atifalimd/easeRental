import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PreferencesPage() {
  const { currentUser } = useSelector((state) => state.user);
  const token = currentUser?.access_token;
  const [preferences, setPreferences] = useState({
    propertyType: "rent", // default to 'rent'
    location: "",
    budgetMin: 0,
    budgetMax: 10000, // default budget range
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Function to fetch current preferences from the backend
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/tenant/preferences",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        if (!data.success) throw new Error(data.message);

        setPreferences({
          propertyType: data.preferences.propertyType || "rent",
          location: data.preferences.location || "",
          budgetMin: data.preferences.budgetMin || 0,
          budgetMax: data.preferences.budgetMax || 10000,
        });
      } catch (err) {
        console.error("Fetch preferences failed:", err);
        setError("Failed to load preferences");
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPreferences((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:3000/api/tenant/preferences",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(preferences),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("Preferences updated successfully");
        navigate("/profile"); // Go back to profile page
      } else {
        setError(data.message || "Something went wrong. Try again.");
      }
    } catch (err) {
      setError("Failed to save preferences.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        Update Property Preferences
      </h1>

      {error && (
        <p className="text-red-600 text-sm text-center mb-4">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Property Type:
          </label>
          <select
            name="propertyType"
            value={preferences.propertyType}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="rent">Rent</option>
            <option value="sale">Sale</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Preferred Location:
          </label>
          <input
            type="text"
            name="location"
            value={preferences.location}
            onChange={handleChange}
            placeholder="Enter location"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="block text-gray-700 font-medium mb-1">
              Budget (Min):
            </label>
            <input
              type="number"
              name="budgetMin"
              value={preferences.budgetMin}
              onChange={handleChange}
              min="0"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="w-1/2">
            <label className="block text-gray-700 font-medium mb-1">
              Budget (Max):
            </label>
            <input
              type="number"
              name="budgetMax"
              value={preferences.budgetMax}
              onChange={handleChange}
              min="0"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition duration-200"
        >
          Save Preferences
        </button>
      </form>
    </div>
  );
}
