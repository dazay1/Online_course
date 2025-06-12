import React from "react";
import logo from "../assets/logo.svg";
import { IoMdMail } from "react-icons/io";
import { FaPhoneAlt } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import { footerAboutList, footerHomeList } from ".";
function Footer() {
  return (
    <>
      <section className="footer">
        <div className="container">
          <div className="footer-box">
            <div className="footer-box_info">
              <a href="/">
                <img src={logo} alt="" />
              </a>
              <div className="footer-box_info__link">
                <a
                  className="footer-box_info__link-text"
                  href="mailto:hello@skillbridge.com"
                >
                  <IoMdMail /> hello@skillbridge.com
                </a>
                <a
                  className="footer-box_info__link-text"
                  href="tel:+9191813232309"
                >
                  <FaPhoneAlt /> +91 91813 23 2309
                </a>
                <a className="footer-box_info__link-text" href="/">
                  <MdLocationOn /> Somewhere in the World
                </a>
              </div>
            </div>
            <div className="footer-box_list">
              <div className="footer-box_item">
                <h6 className="footer-box_item__title">
                  <a href="/">Home</a>
                </h6>
                <div className="footer-box_item__list">
                  {footerHomeList.map((link) => {
                    return (
                      <a
                        className="footer-box_item__list-link"
                        href={link.route}
                      >
                        <p>{link.label}</p>
                      </a>
                    );
                  })}
                </div>
              </div>
              <div className="footer-box_item">
                <h6 className="footer-box_item__title">
                  <a href="/about">About Us</a>
                </h6>
                <div className="footer-box_item__list">
                  {footerAboutList.map((link) => {
                    return (
                      <a
                        className="footer-box_item__list-link"
                        href={link.route}
                      >
                        <p>{link.label}</p>
                      </a>
                    );
                  })}
                </div>
              </div>
              <div className="footer-box_item">
                <h6 className="footer-box_item__title">
                  <a href="/about">Social Profiles</a>
                </h6>
                <div className="footer-box_item__list-social">
                  <div className="footer-box_item__list-item">
                    <a
                      className="footer-box_item__list-social"
                      href="https://www.facebook.com/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FaFacebook />
                    </a>
                  </div>
                  <div className="footer-box_item__list-item">
                    <a
                      className="footer-box_item__list-social"
                      href="https://twitter.com/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FaTwitter />
                    </a>
                  </div>
                  <div className="footer-box_item__list-item">
                    <a
                      className="footer-box_item__list-social"
                      href="https://www.linkedin.com/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FaLinkedin />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="footer-text">
            © 2023 Skillbridge. All rights reserved.
          </p>
        </div>
      </section>
    </>
  );
}

export default Footer;
