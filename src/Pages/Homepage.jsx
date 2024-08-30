import React from "react";
import Sidebar from "../components/Sidebar";
import MainPage from "../components/MainSection";
import Suggestions from "../components/Suggestions";
import StoryComponent from "../components/StoryComponent";
export default function Dashboard() {
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-2 col-2">
            <Sidebar />
          </div>

          {/* Main Page */}
          <div className="col-md-10 col-lg-7 col-sm-10 col-10">
            <StoryComponent></StoryComponent>
            <MainPage />
          </div>

          {/* Suggestions - Only visible on larger screens */}
          <div className="d-none d-lg-block col-lg-3">
            <Suggestions />
          </div>
        </div>
      </div>
    </>
  );
}
