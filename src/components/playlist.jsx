import React, { useState } from "react";
import Video from "./video";

const Playlist = ({ videos, playSelectedVideo, currentSelectedVideoIndex }) => {
  const [FilteredVideos, setFilteredVideos] = useState([...videos]);
  const [searchedValue, setSearchedValue] = useState("");
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
      const newVideos = [...FilteredVideos];
      const [draggedVideo] = newVideos.splice(draggedIndex, 1);
      newVideos.splice(draggedOverIndex, 0, draggedVideo);
      setFilteredVideos(newVideos);
    }
    setDraggedIndex(null);
    setDraggedOverIndex(null);
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchedValue(value);
    filterVideos(value);
  };

  const filterVideos = (value) => {
    if (value && value.replaceAll(/\s/g, "") !== "") {
      const filtered = videos.filter((item) =>
        item.title
          .toLowerCase()
          ?.replaceAll(/\s/g, "")
          .includes(value.toLowerCase()?.replaceAll(/\s/g, ""))
      );
      setFilteredVideos(filtered);
    } else {
      setFilteredVideos([...videos]);
    }
  };

  return (
    <div
      className="pb-10 lg:max-w-md lg:min-w-[29.5%] min-h-screen p-4"
      onDragEnd={handleDragEnd}
      onDragOver={(e) => e.preventDefault()}
    >
      <div className="fixed bottom-2 w-full px-4 left-0 lg:mb-10 lg:px-0 lg:mx-0 lg:sticky lg:top-2">
        <input
          value={searchedValue}
          onChange={handleInputChange}
          type="text"
          className="w-full px-3 py-2 text-white bg-gray-800 border border-gray-600 rounded-md focus:outline-none  focus:border-blue-300 dark:bg-gray-700 dark:border-gray-500 dark:text-white"
          placeholder="Search..."
        />
      </div>
      {FilteredVideos.map((video, index) => (
        <Video
          key={video.id}
          video={video}
          index={index}
          isDragged={draggedIndex === index}
          isDraggedOver={draggedOverIndex === index}
          onDragStart={() => handleDragStart(index)}
          onDragEnter={() => handleDragEnter(index)}
          playSelectedVideo={playSelectedVideo}
          currentSelectedVideoIndex={currentSelectedVideoIndex}
        />
      ))}
      {FilteredVideos.length === 0 && (
        <div className="w-full text-lg font-semibold text-white">
          Sorry, the video you are looking for is currently unavailable. Please
          check back later or try searching for a different video.....
        </div>
      )}
    </div>
  );
};

export default Playlist;
