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

  const playSlectedVideo = useCallback((i) => {
    localStorage.setItem("lastPlayedVideo", i);
    setCurrentPlayedVideoIndex(i);
  }, []);

  return (
    <div className="flex flex-wrap bg-[#101314]">
      <VideoPlayer
        currentPlayedVideo={videosArray[currentSelectedVideoIndex]}
      />
      <Playlist
        videosArray={videosArray}
        currentSelectedVideoIndex={currentSelectedVideoIndex}
        playSlectedVideo={playSlectedVideo}
      />
    </div>
  );
};
export default App;
