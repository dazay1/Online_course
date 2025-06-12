import React, { useState } from "react";
import { AiFillThunderbolt } from "react-icons/ai";
import { MdArrowOutward } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";
import { GoArrowRight } from "react-icons/go";
import { GrClose } from "react-icons/gr";
import { LuPlus } from "react-icons/lu";
import {
  benefitList,
  cardList,
  iconList,
  inputCheckList,
  ourCourseList,
  sliderList,
} from "./index";
import main from "../../assets/main.png";

import "./home.css";
function Home() {
  const [openCardIndex, setOpenCardIndex] = useState(false);

  const handleToggle = (index) => {
    setOpenCardIndex((prevIndex) => (prevIndex === index ? null : index));
  };
  return (
    <>
      <section className="begin">
        <div className="container">
          <div className="begin-box">
            <div className="begin-box__title">
              <div className="begin-box__title_icon">
                <AiFillThunderbolt className="icon" />
              </div>
              <h2 className="begin-box__title_text">
                <span>Unlock</span> Your Creative Potential
              </h2>
            </div>
            <p className="begin-box__description">
              with Online Design and Development Courses
            </p>
            <p className="begin-box__text">
              Learn from Industry Experts and Enhance Your Skills
            </p>
            <div className="begin-box__button">
              <button className="begin-box__button-1">
                <a href="/courses">Explore Courses</a>
              </button>
              <button className="begin-box__button-2">
                <a href="/price">View Pricing</a>
              </button>
            </div>
          </div>
          <ul className="begin-icons">
            {iconList.map((item) => {
              return (
                <li className="begin-icons__item">
                  <img src={item.img} alt="icon" />
                </li>
              );
            })}
          </ul>
          <img src={main} alt="" />
        </div>
      </section>
      <section className="benefits">
        <div className="container">
          <div className="benefits-box">
            <div className="box__info">
              <h2>Benefits</h2>
              <div className="box__info_description">
                <p className="box__info_description-text">
                  Online courses offer numerous benefits that make them an
                  increasingly popular choice for learning. Here are some key
                  advantages of online courses: Flexibility and Convenience,
                  Diverse Course Selection, Cost-Effectiveness and others
                </p>
                <button className="box__info_description-button">
                  <a href="/courses">View All</a>
                </button>
              </div>
            </div>
            <ul className="benefits-box__list">
              {benefitList.map((item) => {
                return (
                  <li className="benefits-box__item">
                    <h1 className="benefits-box__item_number">{item.id}</h1>
                    <div>
                      <h5 className="benefits-box__item_title">{item.title}</h5>
                      <p className="benefits-box__item_text">{item.text}</p>
                    </div>
                    <div className="benefits-box__item_icon">
                      <MdArrowOutward className="benefits-box__item_icon-img" />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>
      <section className="course-information">
        <div className="container">
          <div className="course-information__box">
            <div className="box__info">
              <h2>Our Courses</h2>
              <div className="box__info_description">
                <p className="box__info_description-text">
                  Welcome to our platform, where we offer a wide range of online
                  courses designed to enrich your knowledge and skills. Let's
                  explore the benefits of our online courses and how they can
                  empower you in your personal and professional journey.
                </p>
                <button className="box__info_description-button">
                  <a href="/">View All</a>
                </button>
              </div>
            </div>
            <ul className="course-information__list">
              {ourCourseList.map((item) => {
                return (
                  <li className="course-information__item">
                    <img src={item.img} alt="" />
                    <div className="course-information__item_description">
                      <div className="course-information__item-box">
                        <div className="course-information__item-box-1">
                          <p className="course-information__item_description-data">
                            {item.data}
                          </p>
                        </div>
                        <div className="course-information__item-box-2">
                          <p className="course-information__item_description-level">
                            {item.level}
                          </p>
                        </div>
                      </div>
                      <h6 className="course-information__item_description_author">
                        {item.author}
                      </h6>
                    </div>
                    <h5 className="course-information__item_title">
                      {item.title}
                    </h5>
                    <p className="course-information__item_text">{item.text}</p>
                    <button className="course-information__item_button">
                      <a href="/courses">Get it Now</a>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>
      <section className="testimonials">
        <div className="container">
          <div className="testimonials-box">
            <div className="box__info">
              <h2>Our Testimonials</h2>
              <div className="box__info_description">
                <p className="box__info_description-text">
                  At our platform, we take immense pride in the quality of our
                  services and the positive impact we have on our customers'
                  lives. Don't just take our word for it; let our satisfied
                  customers share their experiences and testimonials with you.
                </p>
                <button className="box__info_description-button">
                  <a href="/">View All</a>
                </button>
              </div>
            </div>
            <ul className="testimonials-list">
              {sliderList.map((item) => {
                return (
                  <li className="testimonials-item">
                    <p>{item.text}</p>
                    <div className="testimonials-info">
                      <div className="testimonials-info_text">
                        <img src={item.img} alt="" />
                        <h5 className="testimonials-info__title">
                          {item.name}
                        </h5>
                      </div>
                      <button className="testimonials-info__button">
                        Read Full Story
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>
      <section className="price-information">
        <div className="container">
          <div className="price-information">
            <div className="box__info">
              <h2>Our Pricing</h2>
              <div className="box__info_description">
                <p className="box__info_description-text">
                  At our platform, we believe in making education accessible and
                  affordable for everyone. We offer flexible pricing options
                  that cater to your needs and ensure that you receive
                  exceptional value for the knowledge and skills you gain.
                </p>
                <div className="box__info_description-buttons">
                  <button className="box__info_description-button-1">
                    <a
                      className="box__info_description-button-1__link"
                      href="/price"
                    >
                      Monthly
                    </a>
                  </button>
                  <button className="box__info_description-button-2">
                    <a href="/price">Yearly</a>
                  </button>
                </div>
              </div>
            </div>
            <ul className="price-information__list">
              {Object.keys(inputCheckList).map((item) => {
                const plan = inputCheckList[item];
                return (
                  <li className="price-information__item" key={item}>
                    <div className="price-information__item_plan">
                      <h5 className="price-information__item_plan-title">
                        {plan.title}
                      </h5>
                    </div>
                    <div className="price-information__item_price">
                      <h1 className="price-information__item_price-number">
                        {plan.price}
                      </h1>
                      <p className="price-information__item_price-data">
                        /month
                      </p>
                    </div>
                    <h5 className="price-information__item_text">
                      Available Features
                    </h5>
                    <ul className="price-information__item_list">
                      {plan.input.map((feature, index) => (
                        <li
                          className="price-information__item_item"
                          key={index}
                        >
                          <div className="price-infomation__item_item-box">
                            <FaCheck className="price-information__item_item-box__icon" />
                          </div>
                          <p className="price-information__item_item-text">
                            {feature.text}
                          </p>
                        </li>
                      ))}
                    </ul>
                    <button className="price-information__button">
                      <a href="/price">Get Started</a>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>
      <section className="famouse">
        <div className="container">
          <div className="famouse-box">
            <div className="famouse-box__description">
              <div>
                <h2 className="famouse-box__description_title">
                  Frequently Asked Questions
                </h2>
                <p className="famouse-box__description__text">
                  Still you have any questions? Contact our Team via
                  support@skillbridge.com
                </p>
              </div>
              <button className="famouse-box__description__button">
                See All FAQ's
              </button>
            </div>
            <ul className="famouse-box__list">
              {cardList.map((card, index) => (
                <li className="famouse-box__item" key={index}>
                  <div
                    className="famouse-box__item_info"
                    onClick={() => handleToggle(index)}
                  >
                    <h3 className="famouse-box__item_info-title">
                      {card.question}
                    </h3>
                    {openCardIndex === index ? (
                      <div className="famouse-box__item_info-icon">
                        <GrClose className="famouse-box__item_info-close__icon" />
                      </div>
                    ) : (
                      <div className="famouse-box__item_info-icon">
                        <LuPlus className="famouse-box__item_info-open__icon" />
                      </div>
                    )}
                  </div>
                  {openCardIndex === index && (
                    <div className="famouse-box__item_box">
                      <p className="famouse-box__item_text">{card.answer}</p>
                      <div className="famouse-box__item_more">
                        <h5 className="famouse-box__item_more-title">
                          More information about our Courses
                        </h5>
                        <div className="famouse-box__item_more-arrow">
                          <a href="/courses">
                            <GoArrowRight />
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
