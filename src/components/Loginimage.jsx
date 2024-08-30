import React, { useState, useEffect } from "react";
import "../style/Mainpage.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../style/loginimg.css";
import bg from "../image/loginimage1.png";
import bg1 from "../image/screenshot2.png";
import bg2 from "../image/screenshot3.png";
import bg3 from "../image/screenshot4.png";

const backgroundImages = [bg1, bg2, bg3];

export default function Loginimage() {
  const [currentBg, setCurrentBg] = useState(0);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentBg((prevBg) => (prevBg + 1) % backgroundImages.length);
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="container mt-5">
      <div className="position-relative">
        {/* Background Image */}
        <img src={bg} alt="Background" className="img-fluid"   style={{ width: "100%", height: "auto" }}/>

        {/* Overlay Image */}
        <div
          className="position-absolute"
          style={{ top: `${(20 / window.innerHeight) * 100}vh`,left: `${(138 / window.innerWidth) * 100}vw` }}

      
        >
          <img
            src={backgroundImages[currentBg]}
            alt="Overlay Image"
            className="img-fluid"
            style={{ width: "91%", height: "auto" }}
          />
        </div>
      </div>
    </div>
  );
}
