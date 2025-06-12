import React, { useState } from "react";
import { navList } from "./index";
import { useLocation } from "react-router-dom";
import logo from "../assets/logo.svg";
import { HiMenuAlt3 } from "react-icons/hi";
import { IoCloseSharp } from "react-icons/io5";
import "./component.css";
import Profile from "./Profile";
function Navbar() {
  const location = useLocation();
  const pathname = location.pathname;

  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <section className="navbar">
        <div className="container">
          <div className="navbar-box">
            <div className="navbar-info">
              <a href="/">
                <img src={logo} alt="" />
              </a>
              <ul className="navbar-list">
                {navList.map((link, index) => {
                  const isActive =
                    (pathname.includes(link.route) && link.route.length > 1) ||
                    pathname === link.route;
                  return (
                    <a
                      className={`navbar-item ${isActive && "active-link"}`}
                      href={link.route}
                      key={link.id}
                    >
                      {link.label}
                    </a>
                  );
                })}
              </ul>
            </div>
            <div className="navbar-box_menu">
              {/* <div className="navbar-button">
                <a href="/sign-up">
                  <button className="navbar-button-1">Sign Up</button>
                </a>
                <a href="/login">
                  <button className="navbar-button-2">Login</button>
                </a>
              </div> */}
              <div className="navbar-button">
                <a href="/sign-up">
                  <button className="navbar-button-1">Getting Started</button>
                </a>
              </div>
              <div className="hamburger-menu">
                {isOpen ? (
                  <IoCloseSharp
                    className="hamburger-menu_icon"
                    onClick={toggleMenu}
                  />
                ) : (
                  <HiMenuAlt3
                    className="hamburger-menu_icon"
                    onClick={toggleMenu}
                  />
                )}
                <ul
                  className={`hamburger-menu_list ${isOpen ? "open" : "close"}`}
                >
                  {navList.map((link) => {
                    return (
                      <>
                        <div className="hamburger-menu_item">
                          <a
                            className="hamburger-item"
                            href={link.route}
                            key={link.id}
                          >
                            {link.label}
                          </a>
                        </div>
                      </>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Navbar;
