import React from "react";
import "../styles/background.css";

const BackgroundVideo = () => {
  return (
    <div className="video-container">
      <iframe
        className="youtube-background"
        src="https://www.youtube.com/embed/X8zLJlU_-60?autoplay=1&mute=1&loop=1&controls=0&modestbranding=1&showinfo=0&disablekb=1&rel=0&playsinline=1&start=180&end=240&playlist=X8zLJlU_-60"
        allow="autoplay; encrypted-media"
        allowFullScreen
      ></iframe>

    </div>
  );
};

export default BackgroundVideo;
