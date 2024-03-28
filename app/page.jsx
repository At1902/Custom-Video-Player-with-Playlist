"use client";

import React, { useState, useEffect } from "react";
import VideoPlayer from "@components/VideoPlayer";
import Playlist from "@components/PlayList";
import style from "@styles/HomePage.module.css";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [playedSeconds, setPlayedSeconds] = useState(0);

  useEffect(() => {
    const storedVideoIndex = localStorage.getItem(
      "videoPlayerActiveVideoIndex"
    );
    const storedPlayedSeconds = localStorage.getItem(
      "videoPlayerPlayedSeconds"
    );

    if (storedVideoIndex !== null) {
      setActiveVideo(videos[parseInt(storedVideoIndex)]);
    }

    if (storedPlayedSeconds !== null) {
      setPlayedSeconds(parseFloat(storedPlayedSeconds));
    }
  }, []);

  useEffect(() => {
    if (activeVideo !== null) {
      localStorage.setItem(
        "videoPlayerActiveVideoIndex",
        videos.indexOf(activeVideo)
      );
    }
  }, [activeVideo]);

  useEffect(() => {
    localStorage.setItem("videoPlayerPlayedSeconds", playedSeconds);
  }, [playedSeconds]);

  // Fetching videos from file local (we can also use a database to store videos or can fetch from any external API)
  useEffect(() => {
    fetch("/videos.json")
      .then((response) => response.json())
      .then((data) => {
        setVideos(data);
        !activeVideo && setActiveVideo(data[0]);
      })
      .catch((error) => console.error("Error fetching videos:", error));
  }, []);

  const handleVideoClick = (video) => {
    setActiveVideo(video);
    setPlaying(true);
  };

  const handleProgress = (seconds) => {
    setPlayedSeconds(seconds);
  };

  return (
    <div className={style.homepage}>
      <section className={style.playerSection}>
        <VideoPlayer
          url={activeVideo ? activeVideo.url : ""}
          playing={playing}
          onProgress={handleProgress}
          setPlaying={setPlaying}
          activeVideo={activeVideo}
          handleVideoClick={handleVideoClick}
        />
      </section>
      <section className={style.playlistSection}>
        <Playlist
          videos={videos}
          activeVideo={activeVideo}
          onVideoClick={handleVideoClick}
        />
      </section>
    </div>
  );
};

export default Home;
