import React, { useEffect, useState } from "react";
import VideoCard from "./VideoCard";
import style from "@styles/PlayList.module.css";
import equals from "@public/equals.svg";
import searchIcon from "@public/magnifying-glass.svg";
import Image from "next/image";

const Playlist = ({ videos, activeVideo, onVideoClick }) => {
  const [playlist, setPlaylist] = useState([]);
  const [activeVideoId, setActiveVideoId] = useState(null);
  const [hoveredVideoId, setHoveredVideoId] = useState(null);
  const [filteredPlaylist, setFilteredPlaylist] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Using Localstorage to save the user's playlist
  useEffect(() => {
    setPlaylist(videos);
    setFilteredPlaylist(videos);
    setActiveVideoId(activeVideo?.id);
    localStorage.setItem("playlist", JSON.stringify(videos));
  }, [videos, activeVideo]);

  // Filtering the playlist based on the search query
  useEffect(() => {
    const filtered = playlist.filter((video) =>
      video.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPlaylist(filtered);
  }, [searchQuery, playlist]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleDragStart = (index) => (event) => {
    event.dataTransfer.setData("index", index);
  };

  const handleDragOver = (index) => (event) => {
    event.preventDefault();
  };

  // Handling onDrop event to re-order the user's playlist.
  const handleDrop = (index) => (event) => {
    event.preventDefault();
    const dragIndex = parseInt(event.dataTransfer.getData("index"));
    if (dragIndex !== index) {
      const newPlaylist = [...playlist];
      const [draggedVideo] = newPlaylist.splice(dragIndex, 1);
      newPlaylist.splice(index, 0, draggedVideo);
      setPlaylist(newPlaylist);
      setFilteredPlaylist(newPlaylist);
      localStorage.setItem("playlist", JSON.stringify(newPlaylist));
    }
  };

  const handleVideoClick = (video) => {
    if (onVideoClick) {
      setActiveVideoId(video.id);
      console.log("id", activeVideoId);
      onVideoClick(video);
    }
  };

  const handleMouseEnter = (videoId) => {
    setHoveredVideoId(videoId);
  };

  const handleMouseLeave = () => {
    setHoveredVideoId(null);
  };

  return (
    <div className={style.playlistSection}>
      <h2 className={style.heading}>Playlist</h2>
      <div className={style.searchBar}>
        <Image src={searchIcon} alt="Search Videos" width={24} height={24} />
        <input
          type="text"
          placeholder="Search videos..."
          value={searchQuery}
          onChange={handleSearch}
          className={style.searchInput}
        />
      </div>
      <ul>
        {filteredPlaylist.map((video, index) => (
          <li
            key={video.id}
            draggable
            onDragStart={handleDragStart(index)}
            onDragOver={handleDragOver(index)}
            onDrop={handleDrop(index)}
            onClick={() => handleVideoClick(video)}
            onMouseEnter={() => handleMouseEnter(video.id)}
            onMouseLeave={handleMouseLeave}
            className={style.listItem}
            // Add some background-color on mouseEnter and on selected video.
            style={{
              backgroundColor:
                activeVideoId === video.id
                  ? "rgba(235, 229, 221, 0.949)"
                  : hoveredVideoId === video.id
                    ? "rgba(0, 0, 0, 0.05)"
                    : "transparent",
            }}
          >
            {/* Add drag handler as two horizontal lines */}
            {hoveredVideoId === video.id && (
              <Image src={equals} alt="Reorder Video" width={24} height={24} />
            )}
            <VideoCard
              thumbnail={video.thumbnail}
              title={video.title}
              description={video.description}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Playlist;
