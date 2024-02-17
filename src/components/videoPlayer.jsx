import { useEffect, useRef, useState } from "react";

const VideoPlayer = ({ currentPlayedVideo }) => {
  const [play, setPlay] = useState(false);
  const [screenMode, setScreenMode] = useState("");
  const [currentTime, setCurrentTime] = useState("00.00");
  const [currentTimePercent, setCurrentTimePercent] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [volumeSlider, setVolumeSlider] = useState(0.5);
  const [isSkipping, SetIsSkipping] = useState(false);
  const [wasPaused, SetWasPaused] = useState(false);
  const videoRef = useRef(null);
  const timelineRef = useRef(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    setIsVideoLoaded(false);
  }, [currentPlayedVideo.sources]);
  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    document.addEventListener("mouseup", handleMouseUpOnDocument);
    document.addEventListener("mousemove", handleMouseMoveOnDocument);
    videoRef.current.addEventListener(
      "enterpictureinpicture",
      handleEnterPictureInPicture
    );
    videoRef.current.addEventListener(
      "leavepictureinpicture",
      handleLeavePictureInPicture
    );
    return () => {
      document.removeEventListener("mouseup", handleMouseUpOnDocument);
      document.removeEventListener("keydown", handleKeyPress);
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
      document.removeEventListener("mousemove", handleMouseMoveOnDocument);
      videoRef.current.removeEventListener(
        "enterpictureinpicture",
        handleEnterPictureInPicture
      );
      videoRef.current.removeEventListener(
        "leavepictureinpicture",
        handleLeavePictureInPicture
      );
    };
  });
  const handleFullScreenChange = () => {
    setScreenMode((prvState) => {
      return prvState === "full-screen" ? "" : "full-screen";
    });
  };
  const handleMouseUpOnDocument = (e) => {
    if (isSkipping) toggleScrubbing(e);
  };
  const handleMouseMoveOnDocument = (e) => {
    if (isSkipping) handleTimelineChange(e);
  };
  const handleEnterPictureInPicture = () => {
    setScreenMode("mini");
  };
  const handleLeavePictureInPicture = () => {
    setScreenMode("");
    setPlay(false);
    videoRef.current.pause();
  };
  const toggleMiniPlayer = () => {
    if (screenMode === "mini") {
      document.exitPictureInPicture();
    } else {
      videoRef.current.requestPictureInPicture();
    }
  };
  const handleKeyPress = (e) => {
    const tagName = document.activeElement.tagName.toLowerCase();

    if (tagName === "input") return;

    switch (e.key.toLowerCase()) {
      case " ":
        if (tagName === "button") return;
      case "k":
        togglePlay();
        break;
      case "f":
        setScreenMode("full-screen");
        break;
      case "t":
        setScreenMode("theater");
        break;
      case "i":
        setScreenMode("");
        break;
      case "m":
        toggleMute();
        break;
      case "arrowleft":
      case "j":
        skip(-5);
        break;
      case "arrowright":
      case "l":
        skip(5);
        break;
    }
  };
  const isPlaying = () => {
    return (
      videoRef.current &&
      videoRef.current.currentTime > 0 &&
      !videoRef.current.paused &&
      !videoRef.current.ended &&
      videoRef.current.readyState > videoRef.current.HAVE_CURRENT_DATA
    );
  };
  const togglePlay = (e) => {
    play ? videoRef.current.pause() : videoRef.current.play();
    setPlay((prvValue) => !prvValue);
  };
  const toggleMute = () => {
    if (videoRef.current.muted) {
      setVolumeSlider(0.5);
    }
    videoRef.current.muted = !videoRef.current.muted;
  };

  const toggleFullScreenMode = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoRef.current.requestFullscreen();
    }
  };
  const toggleScrubbing = (e) => {
    const rect = timelineRef.current.getBoundingClientRect();
    const percent =
      Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
    const isleftClick = (e.buttons & 1) === 1;
    SetIsSkipping(isleftClick);
    if (isleftClick) {
      SetWasPaused(videoRef.current.paused);
      videoRef.current.pause();
    } else {
      videoRef.current.currentTime = percent * videoRef.current.duration;
      if (!wasPaused && !isPlaying()) videoRef.current.play();
    }
    handleTimelineChange(e);
  };

  const handleVolumeChange = () => {
    if (videoRef.current.muted || videoRef.current.volume === 0) {
      setVolumeSlider(0);
    }
  };
  const handleRangeChange = (e) => {
    videoRef.current.volume = e.target.value;
    videoRef.current.muted = e.target.value === 0;
    setVolumeSlider(e.target.value);
  };
  const handleTimeUpdateChange = (e) => {
    if (videoRef.current.currentTime === videoRef.current?.duration) {
      videoRef.current.pause();
    }
    setCurrentTime(formatDuration(videoRef.current.currentTime));
    if (isVideoLoaded) {
      localStorage.setItem(
        currentPlayedVideo.title,
        videoRef.current.currentTime
      );
    }
    setCurrentTimePercent(
      videoRef.current.currentTime / videoRef.current?.duration
    );
  };
  const handleTimelineChange = (e) => {
    const rect = timelineRef.current.getBoundingClientRect();
    const percent =
      Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
    if (isSkipping) {
      e.preventDefault();
      setCurrentTimePercent(percent);
    }
  };
  const handelLoadMataData = () => {
    if (videoRef.current) {
      const playbacktime = localStorage.getItem(currentPlayedVideo.title);
      if (playbacktime && +playbacktime < videoRef.current.duration) {
        videoRef.current.currentTime = +playbacktime;
      } else {
        localStorage.setItem(currentPlayedVideo.title, 0);
      }
      if (!isPlaying()) {
        videoRef.current.play();
        setPlay(true);
      }
      setIsVideoLoaded(true);
    }
  };
  const digitFormate = new Intl.NumberFormat(undefined, {
    minimumIntegerDigits: 2,
  });
  const formatDuration = (time) => {
    const seconds = Math.floor(time % 60);
    const minutes = Math.floor(time / 60) % 60;
    const hours = Math.floor(time / 3600);
    if (hours === 0) {
      return `${minutes}:${digitFormate.format(seconds)}`;
    } else {
      return `${hours}:${digitFormate.format(minutes)}:${digitFormate.format(
        seconds
      )}`;
    }
  };
  const skip = (duration) => {
    videoRef.current.currentTime += duration;
  };
  const handlePlaybackSpeedChange = () => {
    let newPlaybackRate = playbackSpeed + 0.25;
    if (newPlaybackRate > 2) newPlaybackRate = 0.25;
    setPlaybackSpeed(newPlaybackRate);
    videoRef.current.playbackRate = newPlaybackRate;
  };
  return (
    <div className="w-8/12 p-4">
      <div className={`video-container ${!play && "paused"}  ${screenMode}`}>
        <div className="video-controls-container">
          <div
            style={{ "--progress-position": currentTimePercent }}
            className="timeline-container"
          >
            <div
              onMouseMove={handleTimelineChange}
              onMouseDown={toggleScrubbing}
              className="timeline"
              ref={timelineRef}
            >
              <div className="thumb-indicator"></div>
            </div>
          </div>
          <div className="controls">
            <button className="play-pause-btn">
              {play ? (
                <span
                  onClick={togglePlay}
                  className="material-symbols-outlined"
                >
                  pause
                </span>
              ) : (
                <span
                  onClick={togglePlay}
                  className="material-symbols-outlined"
                >
                  play_arrow
                </span>
              )}
            </button>
            <div className="volume-container">
              <button onClick={toggleMute} className="mute-btn">
                {videoRef.current?.muted || volumeSlider == 0 ? (
                  <span className="material-symbols-outlined">volume_off</span>
                ) : volumeSlider < 0.5 && volumeSlider > 0 ? (
                  <span className="material-symbols-outlined">volume_down</span>
                ) : (
                  <span className="material-symbols-outlined">volume_up</span>
                )}
              </button>
              <input
                value={volumeSlider}
                onChange={(e) => handleRangeChange(e)}
                className="volume-slider"
                type="range"
                min="0"
                max="1"
                step="any"
              />
            </div>
            <div className="duration-container">
              <div className="current-time">{currentTime}</div>/
              <div className="total-time">
                {formatDuration(videoRef.current?.duration ?? 0)}
              </div>
            </div>
            <button
              onClick={handlePlaybackSpeedChange}
              className="speed-btn wide-btn"
            >
              {playbackSpeed}X
            </button>
            <button className="mini-player-btn">
              <span
                onClick={toggleMiniPlayer}
                className="material-symbols-outlined"
              >
                picture_in_picture_alt
              </span>
            </button>
            <button className="theater-btn">
              {screenMode === "theater" ? (
                <span
                  onClick={() => setScreenMode("")}
                  className="material-symbols-outlined"
                >
                  crop_7_5
                </span>
              ) : (
                <span
                  onClick={() => setScreenMode("theater")}
                  className="material-symbols-outlined"
                >
                  crop_16_9
                </span>
              )}
            </button>
            <button>
              {screenMode === "full-screen" ? (
                <span
                  onClick={toggleFullScreenMode}
                  className="material-symbols-outlined"
                >
                  fullscreen_exit
                </span>
              ) : (
                <span
                  onClick={toggleFullScreenMode}
                  className="material-symbols-outlined"
                >
                  pageless
                </span>
              )}
            </button>
          </div>
        </div>

        <video
          onClick={togglePlay}
          ref={videoRef}
          onVolumeChange={handleVolumeChange}
          onTimeUpdate={handleTimeUpdateChange}
          onLoadedMetadata={handelLoadMataData}
          src={currentPlayedVideo.sources}
          muted="muted"
        ></video>
      </div>
    </div>
  );
};

export default VideoPlayer;
