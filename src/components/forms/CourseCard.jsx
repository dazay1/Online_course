import { FaFile, FaStar } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import { Tilt } from "react-tilt";
const defaultOptions = {
	reverse:        false,  // reverse the tilt direction
	max:            35,     // max tilt rotation (degrees)
	perspective:    1000,   // Transform perspective, the lower the more extreme the tilt gets.
	scale:          1.1,    // 2 = 200%, 1.5 = 150%, etc..
	speed:          1000,   // Speed of the enter/exit transition
	transition:     true,   // Set a transition on enter/exit.
	axis:           null,   // What axis should be disabled. Can be X or Y.
	reset:          true,    // If the tilt effect has to be reset on exit.
	easing:         "cubic-bezier(.03,.98,.52,.99)",    // Easing on enter/exit.
}
const CourseCard = ({ course }) => {
  return (
    <Tilt options={defaultOptions}>
      <div className="bg-white rounded-lg overflow-hidden cursor-pointer">
        {/* Image */}
        <div>
          <img
            src={course.image}
            alt={course.title}
            width={400}
            height={400}
            className="w-full h-full lg:h-[250px]"
          />
        </div>
      </div>
      <div className="p-4">
        {/* Price */}
        <h1 className="ml-auto relative z-[10] h-20 w-20 flex items-center text-lg font-bold justify-center flex-col mt-[-4rem] rounded-full bg-rose-700 text-white">
          ${course.price}
        </h1>
        {/* information */}
        <div className="flex items-center mt-6 space-x-4">
          <span className="text-lg text-black text-opacity-70 font-bold">
            {course.category}
          </span>
          <span className="text-base text-gray-600">{course.author}</span>
        </div>
        {/* title */}
        <h1 className="text-xl text-black font-bold mt-2">{course.title}</h1>
        {/* reviews */}
        <div className="flex mt-2 items-center space-x-2">
          <div className="flex itesms-center">
            <FaStar className="w-4 h-4 text-yellow-600" />
            <FaStar className="w-4 h-4 text-yellow-600" />
            <FaStar className="w-4 h-4 text-yellow-600" />
            <FaStar className="w-4 h-4 text-yellow-600" />
            <FaStar className="w-4 h-4 text-yellow-600" />
          </div>
          <span className="text-base text-orange-800 font-semibold ">
            ({course.reviewNumber} Reviews)
          </span>
        </div>
        {/* Line */}
        <div className="mt-6 mb-6 w-full h-[2px] bg-gray-500 opacity-15"></div>
        {/* Lessons and student info */}
        <div className="flex mb-8 items-center justify-between">
          <div className="flex items-center space-x-2">
            <FaFile className="w-4 h-4 text-orange-600" />
            <p className="text-base font-semibold text-gray-800">
              {course.lessons} Lessons
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <FaUserGroup className="w-4 h-4 text-orange-600" />
            <p className="text-base font-semibold text-gray-800">
              {course.students} Students
            </p>
          </div>
        </div>
      </div>
    </Tilt>
  );
};

export default CourseCard;
