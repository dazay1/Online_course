import React from "react";
import "./home/home.css";
import { achieveList, goalList } from "./index";
function About() {
  return (
    <>
      <section className="about-info">
        <div className="container">
          <div className="about-info__box">
            <h2 className="about-info__box_title">About Skillbridge</h2>
            <p className="about-info__box_text">
              Welcome to our platform, where we are passionate about empowering
              individuals to master the world of design and development. We
              offer a wide range of online courses designed to equip learners
              with the skills and knowledge needed to succeed in the
              ever-evolving digital landscape.
            </p>
          </div>
        </div>
      </section>
      <section className="achievement">
        <div className="container">
          <div className="achievement-box">
            <div className="achievement-info">
              <h2 className="achievement-info__title">Achievements</h2>
              <p className="achievement-info__text">
                Our commitment to excellence has led us to achieve significant
                milestones along our journey. Here are some of our notable
                achievements
              </p>
            </div>
            <ul className="achievement-list">
              {achieveList.map((item) => {
                return (
                  <li className="achievement-item">
                    <div className="achievement-item__img">
                      <img
                        className="achievement-item__img_icon"
                        src={item.img}
                        alt=""
                      />
                    </div>
                    <h5 className="achievement-item__title">{item.title}</h5>
                    <p className="achievement-item__text">{item.text}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>
      <section className="goal">
        <div className="container">
          <div className="goal-box">
            <div className="goal-info">
              <h2 className="goal-info__title">Our Goals</h2>
              <p className="goal-info__text">
                At SkillBridge, our goal is to empower individuals from all
                backgrounds to thrive in the world of design and development. We
                believe that education should be accessible and transformative,
                enabling learners to pursue their passions and make a meaningful
                impact. Through our carefully crafted courses, we aim to
              </p>
            </div>
            <ul className="achievement-list">
              {goalList.map((item) => {
                return (
                  <li className="achievement-item">
                    <div className="achievement-item__img">
                      <img
                        className="achievement-item__img_icon"
                        src={item.img}
                        alt=""
                      />
                    </div>
                    <h5 className="achievement-item__title">{item.title}</h5>
                    <p className="achievement-item__text">{item.text}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}

export default About;
