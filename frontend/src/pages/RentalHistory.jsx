import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function RentalHistory() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const token = currentUser?.access_token;

  useEffect(() => {
    const fetchRentalHistory = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/rentals", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!data.success) throw new Error(data.message);
        setRentals(data.rentals);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRentalHistory();
  }, [token]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Rental History</h1>

      {loading && <p className="text-center text-gray-600">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && rentals.length === 0 && (
        <p className="text-center text-gray-500">No rental history found.</p>
      )}

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {rentals.map((rental) => (
          <div
            key={rental._id}
            className="bg-white shadow-md rounded-2xl p-6 border hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold text-blue-700 mb-2">
              {rental.propertyName}
            </h2>
            <p className="text-gray-600 mb-1">{rental.propertyAddress}</p>
            <p className="text-gray-500 mb-1">
              Tenant: <span className="font-medium">{rental.tenantName}</span>
            </p>
            <p className="text-sm text-gray-500 mb-2">
              {new Date(rental.startDate).toLocaleDateString()} -{" "}
              {new Date(rental.endDate).toLocaleDateString()}
            </p>
            <span
              className={`inline-block px-3 py-1 text-sm rounded-full font-semibold ${
                rental.paymentStatus === "Paid"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {rental.paymentStatus}
            </span>
          </div>
        ))}
      </div>
    </main>
  );
}
