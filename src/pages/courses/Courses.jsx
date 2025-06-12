import React from "react";
import webSmall from "../../assets/web-small.png";
import draw from "../../assets/draw.png";
import type from "../../assets/type.png";
import ui1 from "../../assets/ui-1.png";
import ui2 from "../../assets/ui-2.png";
import ui3 from "../../assets/ui-3.png";
import mobile1 from "../../assets/mobile-1.png";
import mobile2 from "../../assets/mobile-2.png";
import mobile3 from "../../assets/mobile-3.png";
import graphic1 from "../../assets/graphic-1.png";
import graphic2 from "../../assets/graphic-2.png";
import graphic3 from "../../assets/graphic-3.png";
import front1 from "../../assets/front-1.png";
import front2 from "../../assets/front-2.png";
import front3 from "../../assets/front-3.png";
import "./courses.css";
import { frontList, graphicList, mobileList, uiList, webList } from "./index";
import CourseCard from "./CourseCard";
function Courses() {
  return (
    <>
      <section className="course-info">
        <div className="container">
          <div className="course-info__box">
            <h2 className="course-info__box_title">
              Online Courses on Design and Development
            </h2>
            <p className="course-info__box_text">
              Welcome to our online course page, where you can enhance you
              skills in design and development. Choose from our carefully
              curated selection of 10 courses designed to provide you with
              comprehensive knowledge and practical experience. Explore the
              courses below and find the perfect fit for you learning journey
            </p>
          </div>
        </div>
      </section>
      <CourseCard
        title="Web Design Fundamentals"
        text="Learn the fundamentals of web design, including HTML, CSS, and
                  responsive design principles. Develop the skills to create
                  visually appealing and user-friendly websites."
        img1={webSmall}
        img2={draw}
        img3={type}
        data="4 Week"
        level="Begginner"
        author="By John Smith"
        object={webList}
      />
      <CourseCard
        title="UI/UX Design"
        text="Master the art of creating intuitive user interfaces (UI) and
                  enhancing user experiences (UX). Learn design principles,
                  wireframing, prototyping, and usability testing techniques."
        img1={ui1}
        img2={ui2}
        img3={ui3}
        data="6 Week"
        level="Intermediate"
        author="By Emily Johnson"
        object={uiList}
      />
      <CourseCard
        title="Mobie App Development"
        text="Dive into the world of mobile app development. Learn to build
                  native iOS and Android applications using industry-leading
                  frameworks like Swift and Kotlin."
        img1={mobile1}
        img2={mobile2}
        img3={mobile3}
        data="8 Week"
        level="Intermediate"
        author="By David Brown"
        object={mobileList}
      />
      <CourseCard
        title="Graphic Design for Beginners"
        text="Discover the fundamentals of graphic design, including typography, color theory, layout design, and image manipulation techniques. Create visually stunning designs for print and digital media."
        img1={graphic1}
        img2={graphic2}
        img3={graphic3}
        data="10 Week"
        level="Beginner"
        author="By Sarah Thompsone"
        object={graphicList}
      />
      <CourseCard
        title="Front-End Web Development"
        text="Become proficient in front-end web development. Learn HTML, CSS, JavaScript, and popular frameworks like Bootstrap and React. Build interactive and responsive websites."
        img1={front1}
        img2={front2}
        img3={front3}
        data="10 Week"
        level="Intermediate"
        author="By Michael Adams"
        object={frontList}
      />
    </>
  );
}

export default Courses;
