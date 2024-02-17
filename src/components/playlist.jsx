import React, { useState } from "react";
import Video from "./video";

const Playlist = ({
  videosArray,
  playSlectedVideo,
  currentSelectedVideoIndex,
}) => {
  const [videos, setVideos] = useState([...videosArray]);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [draggedOverIndex, setDraggedOverIndex] = useState(null);

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragEnter = (index) => {
    setDraggedOverIndex(index);
  };

  const handleDragEnd = () => {
    if (
      draggedIndex !== null &&
      draggedOverIndex !== null &&
      draggedIndex !== draggedOverIndex
    ) {
      const newVideos = [...videos];
      const [draggedVideo] = newVideos.splice(draggedIndex, 1);
      newVideos.splice(draggedOverIndex, 0, draggedVideo);
      setVideos(newVideos);
    }
    setDraggedIndex(null);
    setDraggedOverIndex(null);
  };

  return (
    <div
      className="flex flex-col items-center p-4 h-screen overflow-y-scroll w-4/12"
      onDragEnd={handleDragEnd}
      onDragOver={(e) => e.preventDefault()}
    >
      {videos.map((video, index) => (
        <Video
          key={video.id}
          video={video}
          index={index}
          isDragged={draggedIndex === index}
          isDraggedOver={draggedOverIndex === index}
          onDragStart={() => handleDragStart(index)}
          onDragEnter={() => handleDragEnter(index)}
          playSlectedVideo={playSlectedVideo}
          currentSelectedVideoIndex={currentSelectedVideoIndex}
        />
      ))}
    </div>
  );
};

export default Playlist;
