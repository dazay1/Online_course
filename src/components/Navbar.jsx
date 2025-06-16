import React, { useState } from "react";
import { navList } from "./index";
import { Link, useLocation, useParams } from "react-router-dom";
import logo from "../assets/logo.svg";
import { HiMenuAlt3 } from "react-icons/hi";
import { IoCloseSharp } from "react-icons/io5";
import "./component.css";
import { useSelector } from "react-redux";
import { useEffect } from "react";
function Navbar() {
  const location = useLocation();
  const pathname = location.pathname;

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const { userInfo } = useSelector((state) => state.userLogin);
  console.log(userInfo);

  const id = userInfo ? userInfo.id : null;
  console.log(id);

  useEffect(() => {
    if (id) setIsAuthorized(true);
  }, [isAuthorized, id]);
  console.log(isAuthorized);

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
              <div className="navbar-button">
                {isAuthorized ? (
                  <Link to={`/profile`}>
                    <button className="navbar-button-1">Profile</button>
                  </Link>
                ) : (
                  <Link to="/sign-up">
                    <button className="navbar-button-1">Getting Started</button>
                  </Link>
                )}
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
