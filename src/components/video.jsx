import React from "react";
import { IMAGE_BASE_URL } from "../constants/video";
const Video = ({
  key,
  video,
  index,
  isDragged,
  isDraggedOver,
  onDragStart,
  onDragEnter,
  playSlectedVideo,
  currentSelectedVideoIndex,
}) => {
  const backgroundColor = isDragged
    ? "bg-blue-300"
    : isDraggedOver
    ? "bg-gray-200"
    : currentSelectedVideoIndex === index
    ? "bg-green-500A"
    : "bg-black";

  return (
    <div
      onClick={() => playSlectedVideo(index)}
      className={`${backgroundColor} shadow-md rounded-lg p-4 w-full card border cursor-pointer mb-2.5 p-2.5 rounded-[5px] border-solid border-[#eee]`}
      draggable
      onDragStart={onDragStart}
      onDragEnter={onDragEnter}
    >
      <div key={key} className="flex items-center mb-4">
        <img
          src={`${IMAGE_BASE_URL + video.thumb}`}
          alt={video.title}
          className="w-40 h-24 rounded-lg mr-4"
        />
        <div>
          <h2 className="text-lg font-semibold text-white">{video.title}</h2>
          <p className={`text-gray-200 line-clamp-2`}>{video.description}</p>
        </div>
      </div>
    </div>
  );
};

export default Video;
