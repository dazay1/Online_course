import crown from "../assets/crown.svg";
import medal from "../assets/medal.svg";
import mask from "../assets/mask.svg";
import boltShield from "../assets/bolt-shield.svg";
import backpack from "../assets/backpack.svg";
import book from "../assets/book.svg";
import puzzle from "../assets/puzzle.svg";
import light from "../assets/puzzle.svg";

export const achieveList = [
  {
    img: crown,
    title: "Truested by Thousands",
    text: "We have successsfully served thousands of students, helping them unlock their potential and achieve their career goals.",
  },
  {
    img: medal,
    title: "Award-Winning Courses",
    text: "Our courses have received recognition and accolades in the industry for their quality, depth of content, and effective teaching methodologies",
  },

  {
    img: mask,
    title: "Positive Student Feedback",
    text: "We take pride in the positive feedback we receive from our students, who appreciate the practicality and relevance of our course materials.",
  },
  {
    img: boltShield,
    title: "Industry Partnerships",
    text: "We have established strong partnerships with industry leaders, enabling us to provide our students with access to the latest tools and technologies",
  },
];

export const goalList = [
  {
    img: backpack,
    title: "Provide Practical Skills",
    text: "We focus on delivering practical skills that are relevant to the current industry demands. Our courses are designed to equip learners with the knowledge and tools needed to excel in their chosen field.",
  },
  {
    img: book,
    title: "Foster Creative Problem-Solving",
    text: "We encourage creative thinking and problem-solving abilities, allowing our students to tackle real-world challenges with confidence and innovation.",
  },

  {
    img: puzzle,
    title: "Promote Collaboration and Community",
    text: "We believe in the power of collaboration and peer learning. Our platform fosters a supportive and inclusive community where learners can connect, share insights, and grow together.",
  },
  {
    img: light,
    title: "Stay Ahead of the Curve",
    text: "The digital landscape is constantly evolving, and we strive to stay at the forefront of industry trends. We regularly update our course content to ensure our students receive the latest knowledge and skills.",
  },
];

export { default as Home } from "./home/Home";
export { default as About } from "./About";
export { default as Courses } from "./courses/Courses";
export { default as CourseOpen } from "./courses/CourseOpen";
export { default as Pricing } from "./Pricing";
export { default as Teachers } from "./Teachers";
export { default as Students } from "./Students";
export { default as Class } from "./Class";
export { default as Homework } from "./Homework.jsx";
export { default as TeachersPage } from "./singlePage/TeacherPage.jsx";
export { default as StudentPage } from "./singlePage/StudentPage.jsx";
export { default as TeacherSinglePage } from "./singlePage/TeacherSinglePage.jsx";
export { default as ClassPage } from "./singlePage/ClassPage.jsx";
export { default as Attendance } from "./singlePage/Attendance.jsx";
export { default as Payment } from "./Payment.jsx";
