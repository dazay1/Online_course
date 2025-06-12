import React from 'react'
import { inputCheckList } from '../home';
import { FaCheck } from 'react-icons/fa6';

function Pricing() {
  return (
    <>
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
    </>
  )
}

export default Pricing