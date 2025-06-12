import React, { useEffect, useState } from "react";
import Slider from "./Slider";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function SignUp() {
  const history = useNavigate();

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checked, setChecked] = useState(false);

  const onRegisterFrom = async (e) => {
    e.preventDefault();

    const info = {
      name,
      surname,
      email,
      password,
    };
    // console.log(info);

    try {
      const response = await fetch("http://localhost:5000/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(info),
      });
      const data = await response.json();
      console.log(data);

      if (data.message) {
        alert(data.message);
        history("/login", { state: { id: email } });
      } else {
        history("/", { state: { id: email } });
        setIsAuthorized(true);
      }
      console.log(data, isAuthorized);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      {isAuthorized ? (
        <button>Profile</button>
      ) : (
        <section className="sign-up">
          <div className="container">
            <div className="sign-up_box">
              <div className="container-small">
                <div className="sign-up_box__info">
                  <h4 className="sign-up_box__info-title">
                    Students Testimonials
                  </h4>
                  <p className="sign-up_box__info-text">
                    At our institution, we believe that the best way to
                    understand the impact of our educational programs is through
                    the words of our students themselves. Here are some
                    heartfelt testimonials from our students, sharing their
                    experiences and thoughts on their educational journey with
                    us.
                  </p>
                  <Slider />
                </div>
              </div>
              <div className="sign-up_auth">
                <div className="sign-up_auth__info">
                  <h2 className="sign-up_auth__title">Sign Up</h2>
                  <p className="sign-up_auth__text">
                    Create an account to unlock exclusive features.
                  </p>
                </div>
                <form className="sign-up_auth__list" onSubmit={onRegisterFrom}>
                  <div className="sign-up_auth__item">
                    <p className="sign-up_auth__item-title">Name</p>
                    <input
                      className="sign-up_auth__item-input"
                      type="text"
                      placeholder="Enter your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="sign-up_auth__item">
                    <p className="sign-up_auth__item-title">Surname</p>
                    <input
                      className="sign-up_auth__item-input"
                      type="text"
                      placeholder="Enter your Name"
                      value={surname}
                      onChange={(e) => setSurname(e.target.value)}
                    />
                  </div>
                  <div className="sign-up_auth__item">
                    <p className="sign-up_auth__item-title">Email</p>
                    <input
                      className="sign-up_auth__item-input"
                      type="email"
                      placeholder="Enter your Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="sign-up_auth__item">
                    <p className="sign-up_auth__item-title">Password</p>
                    <input
                      className="sign-up_auth__item-input"
                      type="password"
                      placeholder="Enter your Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="sign-up_auth__item">
                    <label className="sign-up_auth__item-check">
                      <input
                        type="checkbox"
                        className="sign-up_auth__item-check_input"
                        value={checked}
                        onChange={(e) => setChecked(e.target.value)}
                      />
                      I agree with Terms of Use and Privacy Policy
                    </label>
                  </div>
                  <button className="sign-up_auth__item-button">Sign Up</button>
                </form>
                <p className="sign-up_auth__choose">OR</p>

                <button className="sign-up_auth__choose-button">
                  <FcGoogle className="sign-up_auth__choose-icon" /> Sign Up
                  with Google
                </button>
                <p className="sign-up_auth__choose-account">
                  Already have an account? <a href="/login">Login</a>
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export default SignUp;
