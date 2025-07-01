import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AssetTable from "./Table";
import AssetDetails from "./AssertDetails";
import './index.css'
import SidebarLayout from "./SidebarLayout"; // ⬅️ Import Layout

function App() {
  return (
    <Router>
      <SidebarLayout>
        <Routes>
          <Route path="/" element={<AssetTable />} />
          <Route path="/asset-details/:id" element={<AssetDetails />} />
        </Routes>
      </SidebarLayout>
    </Router>
  );
}

export default App;
