import React, { useEffect } from "react";
import $ from "jquery";
import { GrFormNextLink, GrFormPreviousLink } from "react-icons/gr";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel";
import "./component.css";
import { sliderList } from ".";
function Slider() {
  useEffect(() => {
    $(".slider").slick({
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      prevArrow: $(".prev"),
      nextArrow: $(".next"),
    });
  }, []);

  return (
    <>
      <div className="slider">
        {sliderList.map((item) => {
          return (
            <div className="slider-box">
              <p>{item.text}</p>
              <div className="slider-info">
                <div className="slider-info_text">
                  <img src={item.img} alt="" />
                  <h5 className="slider-info__title">{item.name}</h5>
                </div>
                <button className="slider-info__button">Read More</button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="slider-button">
        <button className="prev">
          <GrFormPreviousLink className="prev_icon" />
        </button>
        <button className="next">
          <GrFormNextLink className="next_icon" />
        </button>
      </div>
    </>
  );
}

export default Slider;
