import React, { useState } from "react";
// import comment from "../assets/comment.png";
import Slider from "./Slider";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserInfo } from './userSlice';
function Login() {
  // const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checked, setChecked] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  const dispatch = useDispatch();
  const history = useNavigate();

  const onSubmitForm = async (e) => {
    e.preventDefault();

    const body = { email, password };
    console.log(body);
    try {
      const response = await fetch("http://localhost:5000/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      dispatch(setUserInfo(data))
      console.log(data.id);

      const id = data.id;
      if (data.email) {
        // or data.userFound, depending on your API response
        // history(`/user/${id}`, { state: { id: email } });
        // setIsAuthorized(!isAuthorized);
        history("/profile", { state: { id: email } });
        console.log(isAuthorized);
        
      } else {
        alert("User does not exist");
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  return (
    <>
      <section className="login">
        <div className="container">
          <div className="sign-up_box">
            <div className="container-small">
              <div className="sign-up_box__info">
                <h4 className="sign-up_box__info-title">
                  Students Testimonials
                </h4>
                <p className="sign-up_box__info-text">
                  At our institution, we believe that the best way to understand
                  the impact of our educational programs is through the words of
                  our students themselves. Here are some heartfelt testimonials
                  from our students, sharing their experiences and thoughts on
                  their educational journey with us.
                </p>
                <Slider />
              </div>
            </div>
            <div className="sign-up_auth">
              <div className="sign-up_auth__info">
                <h2 className="sign-up_auth__title">Login</h2>
                <p className="sign-up_auth__text">
                  Welcome back! Please log in to access you account
                </p>
              </div>
              <form className="sign-up_auth__list" onSubmit={onSubmitForm}>
                <li className="sign-up_auth__item">
                  <p className="sign-up_auth__item-title">Email</p>
                  <input
                    className="sign-up_auth__item-input"
                    type="email"
                    placeholder="Enter your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </li>
                <li className="sign-up_auth__item">
                  <p className="sign-up_auth__item-title">Password</p>
                  <input
                    className="sign-up_auth__item-input"
                    type="password"
                    placeholder="Enter your Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </li>
                <li className="sign-up_auth__item">
                  <label className="sign-up_auth__item-check">
                    <input
                      type="checkbox"
                      className="sign-up_auth__item-check_input"
                      checked={checked}
                      onChange={(e) => setChecked(e.target.checked)}
                    />
                    Remember Me
                  </label>
                </li>
                <button className="sign-up_auth__item-button" type="submit">
                  Login
                </button>
              </form>
              <p className="sign-up_auth__choose-account">
                Already have an account? <a href="/sign-up">Sign Up</a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Login;
