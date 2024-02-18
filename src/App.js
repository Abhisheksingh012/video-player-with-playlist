import "./App.css";
import { videosArray } from "./constants/video";
import VideoPlayer from "./components/videoPlayer";
import Playlist from "./components/playlist";
import { useCallback, useEffect, useState } from "react";
const App = () => {
  const [currentSelectedVideoIndex, setCurrentPlayedVideoIndex] = useState(0);
  useEffect(() => {
    const lastPlayedVideo = localStorage.getItem("lastPlayedVideo");
    if (lastPlayedVideo) {
      setCurrentPlayedVideoIndex(+lastPlayedVideo);
    }
  }, []);

  const playSelectedVideo = useCallback((i) => {
    localStorage.setItem("lastPlayedVideo", i);
    setCurrentPlayedVideoIndex(i);
  }, []);

  return (
    <div className="flex flex-wrap flex-col lg:flex-row bg-[#101314] items-start">
      <VideoPlayer
        currentPlayedVideo={videosArray[currentSelectedVideoIndex]}
      />
      <Playlist
        videosArray={videosArray}
        currentSelectedVideoIndex={currentSelectedVideoIndex}
        playSelectedVideo={playSelectedVideo}
      />
    </div>
  );
};
export default App;
