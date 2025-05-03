import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function Earnings() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const { currentUser } = useSelector((state) => state.user);
  const token = currentUser?.access_token;

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/get-earnings", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            // hello
          },
        });

        const json = await res.json();
        if (!res.ok) throw new Error(json.message || "Failed to fetch");
        setData(json);
        console.log(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchEarnings();
  }, []);

  if (error) return <div className="text-red-600">{error}</div>;
  if (!data) return <div>Loading earnings...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Total Earnings: ${data.totalEarnings}
      </h1>
      <ul className="space-y-2">
        {data.earnings?.map((e, index) => (
          <li key={index} className="border p-3 rounded shadow">
            Listing ID: {e.listingId} — Amount: ${e.amount}
          </li>
        ))}
      </ul>
    </div>
  );
}
