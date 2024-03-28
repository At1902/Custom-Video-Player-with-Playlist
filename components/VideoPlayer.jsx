import React, { useRef, useState, useEffect } from "react";
import style from "@styles/VideoPlayer.module.css";
import cornersIn from "@public/corners-in.svg";
import cornersOut from "@public/corners-out.svg";
import play from "@public/play.svg";
import pause from "@public/pause.svg";
import arrowForward from "@public/arrow-clockwise.svg";
import arrorBackward from "@public/arrow-counter-clockwise.svg";
import speakerHigh from "@public/speaker-high.svg";
import speakerLow from "@public/speaker-low.svg";
import speakerSlash from "@public/speaker-slash.svg";
import Image from "next/image";

const VideoPlayer = ({
  url,
  playing,
  onProgress,
  activeVideo,
  handleVideoClick,
}) => {
  const videoRef = useRef(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playingState, setPlayingState] = useState(playing);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isVolumeSliderOpen, setIsVolumeSliderOpen] = useState(false);
  const speakerRef = useRef(null);

  // Handling keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      console.log("key pressed", event.keyCode);
      switch (event.keyCode) {
        case 32: // Spacebar
          handlePlayPause();
          break;
        case 37: // Left arrow
          handleSeek(videoRef.current.currentTime - 10); // Seek back 10 seconds
          break;
        case 39: // Right arrow
          handleSeek(videoRef.current.currentTime + 10); // Seek forward 10 seconds
          break;
        case 70: // F key
          toggleFullscreen();
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [playingState]);


  // Updating current playback time and total duration of video using event Listeners  
  useEffect(() => {
    const handleTimeUpdate = () => {
      setCurrentTime(videoRef.current.currentTime);
    };

    const handleDurationChange = () => {
      setDuration(videoRef.current.duration);
    };

    if (videoRef.current) {
      videoRef.current.addEventListener("timeupdate", handleTimeUpdate);
      videoRef.current.addEventListener("loadedmetadata", handleDurationChange);

      return () => {
        videoRef?.current?.removeEventListener("timeupdate", handleTimeUpdate);
        videoRef?.current?.removeEventListener(
          "loadedmetadata",
          handleDurationChange
        );
      };
    }
  }, []);

  useEffect(() => {
    const storedVolume = localStorage.getItem("videoPlayerVolume");
    if (storedVolume !== null) {
      setVolume(parseFloat(storedVolume));
    }
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
      localStorage.setItem("videoPlayerVolume", volume);
    }
  }, [volume]);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setPlayingState(true);
    }
  };

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setPlayingState(false);
    }
  };

  const handlePlayPause = () => {
    playingState ? handlePause() : handlePlay();
  };

  const handleSeek = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
    }
  };

  const handleProgress = () => {
    if (videoRef.current && onProgress) {
      onProgress(videoRef.current.currentTime);
    }
  };

  const handlePlaybackRateChange = (event) => {
    const newPlaybackRate = parseFloat(event.target.value);
    setPlaybackRate(newPlaybackRate);
    if (videoRef.current) {
      videoRef.current.playbackRate = newPlaybackRate;
    }
  };

  const handleVolumeChange = (event) => {
    setVolume(parseFloat(event.target.value));
  };

  const toggleVolumeSlider = () => {
    setIsVolumeSliderOpen(!isVolumeSliderOpen);
  };

  const closeVolumeSlider = () => {
    setIsVolumeSliderOpen(false);
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
        setIsFullScreen(false);
      } else {
        videoRef.current.requestFullscreen();
        setIsFullScreen(true);
      }
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  // Handling Autoplay when the current video ends (on firing 'onEnded' event)
  const handleVideoEnded = () => {
    const playlist = localStorage.getItem("playlist");
    const parsedPlaylist = JSON.parse(playlist);
    console.log("playlist", playlist);
    const currentIndex = parsedPlaylist?.findIndex(
      (video) => video.id === activeVideo.id
    );

    const nextIndex = (currentIndex + 1) % parsedPlaylist.length;

    const nextVideo = parsedPlaylist[nextIndex];

    handleVideoClick(nextVideo);
    setPlayingState(true);
  };

  return (
    <div className={style.videoPlayer}>
      <video
        ref={videoRef}
        src={url}
        onTimeUpdate={handleProgress}
        playbackRate={playbackRate}
        onEnded={handleVideoEnded}
        width="100%"
        onClick={handlePlayPause}
        muted={false}
        className={style.video}
        autoPlay
      />
      <div className={style.videoControls}>
        <div className={style.seeker}>
          <input
            type="range"
            min={0}
            max={duration}
            step="any"
            value={currentTime}
            onChange={(e) => handleSeek(parseFloat(e.target.value))}
          />
        </div>
        <div className={style.controlBtnStack}>
          <button
            className={style.controlBtn}
            onClick={() => handleSeek(videoRef.current.currentTime - 10)}
          >
            <Image
              src={arrorBackward}
              alt="Rewind 10s"
              width={24}
              height={24}
            />
          </button>
          <button
            onClick={playingState ? handlePause : handlePlay}
            className={style.controlBtn}
          >
            {playingState ? (
              <Image src={pause} alt="Pause" width={24} height={24} />
            ) : (
              <Image src={play} alt="Play" width={24} height={24} />
            )}
          </button>
          <button
            className={style.controlBtn}
            onClick={() => handleSeek(videoRef.current.currentTime + 10)}
          >
            <Image
              src={arrowForward}
              alt="Forward 10s"
              width={24}
              height={24}
            />
          </button>
          <div>
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
          <div className={style.volumeControl}>
            <div
              className={style.volume}
              ref={speakerRef}
              onMouseEnter={toggleVolumeSlider} // Opening volume slider on mouse enter
              onMouseLeave={closeVolumeSlider} // Closing volume slider on mouse leave
            >
              <Image
                src={
                  volume === 0
                    ? speakerSlash
                    : volume < 0.5
                      ? speakerLow
                      : speakerHigh
                }
                alt="Volume"
                width={24}
                height={24}
              />
              {isVolumeSliderOpen && (
                <input
                  type="range"
                  min={0}
                  max={1}
                  step="any"
                  value={volume}
                  onChange={handleVolumeChange}
                  className={style.volumeSlider}
                />
              )}
            </div>
          </div>
          <div className={style.btnStackRight}>
            <select
              value={playbackRate}
              onChange={handlePlaybackRateChange}
              className={style.playbackRateSelector}
            >
              <option value={0.5}>0.5x</option>
              <option value={1}>1x</option>
              <option value={1.5}>1.5x</option>
              <option value={2}>2x</option>
            </select>
            <button onClick={toggleFullscreen} className={style.controlBtn}>
              {isFullScreen ? (
                <Image
                  src={cornersIn}
                  alt="Exit Full Screen"
                  width={24}
                  height={24}
                />
              ) : (
                <Image
                  src={cornersOut}
                  alt="Full Screen"
                  width={24}
                  height={24}
                />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
