// CenteredCarousel.js
import React, { useState } from "react";
import { toast } from "react-toastify";
import Progress from "react-progressbar";
import { MdAdd, MdArrowRight, MdClose } from "react-icons/md"; // Importing the plus and close icons
import { ReactComponent as CameraIcon } from "../../assets/camera.svg"; // Import as React component
import { ReactComponent as HomeworkIcon } from "../../assets/task-list.svg"; // Import as React component
import vocabularyImg from "../../assets/vocabulary.png";
import { Link } from "react-router-dom";

const CenteredCarousel = ({ theme, video, homework, vocabulary }) => {
  const [homeworkData, setHomeworkData] = useState([]);
  const [isOpen, setIsOpen] = useState(false); // State to control the visibility of the bottom div

  // Set default values for video, homework, and vocabulary
  const videoValue = video || 0;
  const homeworkValue = homework || 0;
  const vocabularyValue = vocabulary || 0;

  // Calculate completed percentage
  const totalTasks = videoValue + homeworkValue;
  const completed = totalTasks > 0 ? totalTasks / 2 : null; // Calculate average if there are tasks

  // Function to determine the color based on completion percentage
  const getProgressColor = (percentage) => {
    if (percentage < 50) return "#ff4d4d"; // Red
    if (percentage < 80) return "#ffcc00"; // Yellow
    return "#4caf50"; // Green
  };

  // Toggle function for the bottom div
  const toggleDiv = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="container">
      <ul>
        <li className="background w-full p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-white">{theme}</h4>
            <button
              onClick={toggleDiv}
              className="w-10 h-10 rounded-full bg-yellow-400 flex justify-center items-center"
            >
              {isOpen ? (
                <MdClose className="text-white" size={24} />
              ) : (
                <MdAdd className="text-white" size={24} />
              )}
            </button>
          </div>
          {/* Progress Bar */}
          <div
            style={{ alignItems: "center" }}
            className={isOpen ? "hidden" : "flex"}
          >
            <Progress
              completed={completed !== null ? completed : 0} // Show 0 if completed is null
              color={getProgressColor(completed !== null ? completed : 0)} // Use 0 for color determination
              borderRadius="20px"
              style={{ borderRadius: "20px", width: "100%" }}
            />
            <span
              style={{ marginLeft: "10px" }}
              className={
                completed === null
                  ? "text-red text-[24px]"
                  : "text-white text-[20px]"
              }
            >
              {completed !== null ? `${completed.toFixed(0)}%` : "0%"}{" "}
              {/* Show 0% if completed is null */}
            </span>
          </div>
          {/* Bottom Div with Smooth Transition */}
          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              isOpen ? "max-h-50" : "max-h-0"
            }`} // Smooth transition
            style={{
              backgroundColor: "transparent",
              borderRadius: "10px",
              marginTop: "10px",
              padding: isOpen ? "10px" : "0",
            }}
          >
            {isOpen && (
              <div className="flex flex-col gap-2">
                <div className="px-3 py-4 bg-[#ffffff79] borderClass rounded-lg">
                  <div className="flex justify-between">
                    <div className="flex gap-2 items-center mb-3">
                      <CameraIcon className="w-10 h-10" />
                      <h4>Video</h4>
                    </div>
                    <Link to="/simple/video">
                      <button className="bg-yellow-400 py-2 px-6 rounded-xl">
                        Start
                      </button>
                    </Link>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Progress
                      completed={videoValue}
                      color={getProgressColor(videoValue)}
                      borderRadius="20px"
                      style={{ borderRadius: "20px", width: "100%" }}
                    />
                    <span
                      style={{ marginLeft: "10px" }}
                      className={
                        videoValue === 0
                          ? "text-red text-[24px]"
                          : "text-white text-[20px]"
                      }
                    >
                      {videoValue}%
                    </span>
                  </div>
                </div>
                {/* <div className="px-3 py-4 bg-[#ffffff79] borderClass rounded-lg">
                  <div className="flex justify-between">
                    <div className="flex gap-2 items-center mb-3">
                      <img src={vocabularyImg} alt="" className="w-10 h-10" />
                      <h4>Vocabulary</h4>
                    </div>
                    <Link to="/simple/vocabulary">
                      <button className="bg-yellow-400 py-2 px-6 rounded-xl">
                        Start
                      </button>
                    </Link>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Progress
                      completed={vocabularyValue}
                      color={getProgressColor(vocabularyValue)}
                      borderRadius="20px"
                      style={{ borderRadius: "20px", width: "100%" }}
                    />
                    <span
                      style={{ marginLeft: "10px" }}
                      className={
                        vocabularyValue === 0
                          ? "text-red text-[24px]"
                          : "text-white text-[20px]"
                      }
                    >
                      {vocabularyValue}%
                    </span>
                  </div>
                </div> */}
                <div className="px-3 py-4 bg-[#ffffff79] borderClass rounded-lg">
                  <div className="flex justify-between">
                    <div className="flex gap-2 items-center mb-3">
                      <HomeworkIcon className="w-10 h-10" />
                      <h4>Homework</h4>
                    </div>
                    <Link to="/simple/homework">
                      <button className="bg-yellow-400 py-2 px-6 rounded-xl">
                        Start
                      </button>
                    </Link>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Progress
                      completed={homeworkValue}
                      color={getProgressColor(homeworkValue)}
                      borderRadius="20px"
                      style={{ borderRadius: "20px", width: "100%" }}
                    />
                    <span
                      style={{ marginLeft: "10px" }}
                      className={
                        homeworkValue === 0
                          ? "text-red text-[24px]"
                          : "text-white text-[20px]"
                      }
                    >
                      {homeworkValue}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </li>
      </ul>
    </div>
  );
};

export default CenteredCarousel;
