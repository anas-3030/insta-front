import React from "react";
import { useParams } from "react-router-dom"; // Import useParams to get URL parameters
import Sidebar from "../components/Sidebar";
import Exploresearch from "../components/explore";
import '../style/ProfilePage.css'; // Import the CSS file for additional styling

export default function SearchPage() {


  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 col-sm-4 col-12">
          <Sidebar />
        </div>

        {/* Profile Layout */}
        <div className="col-md-9 col-sm-8 col-12 profile-layout">
          <Exploresearch  /> {/* Pass userId as a prop */}
        </div>
      </div>
    </div>
  );
}
