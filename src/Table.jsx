import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


export default function AssetTable() {
  const [assets, setAssets] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://alpha-terra.vercel.app/api/unverifiedassets")
      .then((res) => res.json())
      .then((data) => {
        setAssets(data);
        setFilteredAssets(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching assets:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let result = assets;

    if (filterCategory !== "All") {
      result = result.filter((item) => item.category === filterCategory);
    }

    if (search.trim() !== "") {
      result = result.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredAssets(result);
  }, [search, filterCategory, assets]);

  const handleRowClick = (asset) => {
    navigate(`/asset-details/${asset._id}`, { state: asset });
  };

  if (loading) return <p className="text-center py-8">Loading...</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
        <input
          type="text"
          placeholder="Search by name..."
          className="border border-gray-300 px-4 py-2 rounded-md w-full sm:w-1/2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border border-gray-300 px-4 py-2 rounded-md w-full sm:w-1/4"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Residential">Residential</option>
          <option value="Commercial">Commercial</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
              <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Property Value</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Full Address</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Kind</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Category</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredAssets.map((asset) => (
              <tr
                key={asset._id}
                className="hover:bg-gray-100 cursor-pointer"
                onClick={() => handleRowClick(asset)}
              >
                <td className="px-4 py-3 text-sm text-gray-800">{asset.name}</td>
                <td className="px-4 py-3 text-sm text-gray-800 text-right">
                  ₹
                  {asset.property_value &&
                    new Intl.NumberFormat("en-IN", {
                      maximumFractionDigits: 0,
                    }).format(asset.property_value)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-800">{asset.full_address}</td>
                <td className="px-4 py-3 text-sm text-gray-800">{asset.kind}</td>
                <td className="px-4 py-3 text-sm text-gray-800">{asset.category}</td>
              </tr>
            ))}
            {filteredAssets.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No matching assets found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
