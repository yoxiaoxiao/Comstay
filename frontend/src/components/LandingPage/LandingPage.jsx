import React, { useEffect, useState } from "react";
import "./LandingPage.css";

const LandingPage = () => {
    const [spots, setSpots] = useState([]);

    useEffect(() => {
        fetch("/api/spots")
            .then((response) => response.json())
            .then((data) => setSpots(data.Spots))
            .catch((error) => console.error("Error fetching spots:", error));
    }, []);

    return (
        <div className="landing-page">
            <h2 className="landing-page-title">Explore Our Featured Spots!</h2>
            <div className="listings-grid">
                {spots.map((spot) => (
                    <div className="listing-card" key={spot.id}>
                        <div className="tooltip">{spot.name}</div> {/* Tooltip moved here */}
                        <div className="spot-image-container">
                            <img
                                src={spot.previewImage}
                                alt={spot.name}
                                className="spot-image"
                            />
                        </div>
                        <div className="spot-details">
                            <div className="spot-location">
                                <p>{`${spot.city}, ${spot.state}`}</p>
                                <p className="spot-rating">
                                    ⭐ {spot.avgRating ? spot.avgRating : "New"}
                                </p>
                            </div>
                            <p>
                                <strong>${spot.price}</strong> / night
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LandingPage;
