import React from "react";
function CourseCard({ title, text, img1, img2, img3, data, level, author, object }) {
  return (
    <>
      <section className="course-card">
        <div className="container">
          <div className="course-card__box">
            <div className="box__info">
              <h2>{title}</h2>
              <div className="box__info_description">
                <p className="box__info_description-text">
                  {text}
                </p>
                <button className="box__info_description-button">
                  <a href="/courses">View Course</a>
                </button>
              </div>
            </div>
            <div className="course-card__box__description">
              <div className="box__description_img">
                <img src={img1} alt="" />
                <img src={img2} alt="" />
                <img src={img3} alt="" />
              </div>
              <div className="course-card__box__description_text">
                <div className="course-card__box__description_text-description">
                  <p className="course-card__box__description_text-data">
                    {data}
                  </p>
                  <p className="course-card__box__description_text-level">
                    {level}
                  </p>
                </div>
                <h5 className="course-card__box__description_text-author">
                  {author}
                </h5>
              </div>
              <h6 className="course-card__box__description_title">Curriculum</h6>
              <ul className="course-card__box__description_list">
                {object.map((item, index) => {
                  return (
                    <li
                      className="course-card__box__description_item"
                      key={index}
                    >
                      <h2 className="course-card__box__description_item-number">
                        {item.id}
                      </h2>
                      <h6 className="course-card__box__description_item-title">
                        {item.text}
                      </h6>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default CourseCard;
