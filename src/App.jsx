import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AssetTable from "./Table";
import AssetDetails from "./AssertDetails";
import './index.css'
import SidebarLayout from "./SidebarLayout"; // ⬅️ Import Layout
import VerifiedAssets from "./VerifiedAssets";

function App() {
  useEffect(() => {
    const handleContextMenu = (e) => {
        e.preventDefault();
    };
    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
        document.removeEventListener("contextmenu", handleContextMenu);
    };
}, []);
  return (
    <Router>
      <SidebarLayout>
        <Routes>
          <Route path="/" element={<AssetTable />} />
          <Route path="/asset-details/:id" element={<AssetDetails />} />
          <Route path="/verifiedAssets" element={<VerifiedAssets />} />
        </Routes>
      </SidebarLayout>
    </Router>
  );
}

export default App;
