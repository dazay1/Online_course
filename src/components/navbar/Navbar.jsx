import { useState } from "react";
import logo from "../../assets/logo.svg";
import { HiBars3BottomRight } from "react-icons/hi2";
import { CgClose } from "react-icons/cg";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Navbar() {
  const userInfo = useSelector((state) => state.userLogin.userInfo);
  const [showNav, setShownNav] = useState(false);
  const navOpen = showNav ? 'translate-x-0' : 'translate-x-[-100%]';
  const showNavHandler = () => setShownNav(true);
  const hideNavHandler = () => setShownNav(false);
  const id = userInfo ? userInfo.id : undefined;

  return (
    <>
      {/* Nav */}
      <section className='fixed w-full transition-all duration-200 z-[1000] mb-15 mt-[-20px] py-4 bg-indigo-950'>
        <div className="flex items-center justify-between container">
          <div className="flex items-center gap-4">
            <Link to="/">
              <img src={logo} alt="Logo" />
            </Link>
            <div className="hidden lg:flex items-center gap-4">
              <a className="text-white nav__link" href="#benefits">
                Foydali tomonlari
              </a>
              <a className="text-white nav__link" href="#courses">
                O'quv dasturi
              </a>
              <a className="text-white nav__link" href="#about">
                Biz haqimizda
              </a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="bg-[#ae00ff] px-6 py-1 rounded-3xl text-white ml-4 text-xl">
              {id !== undefined ? (
                <Link to={userInfo.role === 'admin' ? '/admin' : '/profile'}>Profile</Link>
              ) : (
                <Link to='/login'>Login</Link>
              )}
            </button>
            {/* Burger menu */}
            {/* <HiBars3BottomRight onClick={showNavHandler} className="w-8 h-8 cursor-pointer text-white lg:hidden" /> */}
          </div>
        </div>
      </section>
      {/* Mobile Nav */}
      {/* <div>
        {/* Overlay
        <div className={`fixed ${navOpen} top-[-5px] transform transition-all duration-500 z-[10000] left-0 right-0 bottom-0 bg-black opacity-70 w-full h-[100vh]`} />
        <div className={`text-white ${navOpen} fixed justify-center flex flex-col h-full transform transition-all duration-500 delay-300 md:w-[50%] w-[80%] sm:w-[60%] bg-indigo-900 space-y-6 z-[100006] mt-[-10px]`}>
          <a className="nav__link text-[34px] ml-12 sm:text-[30px]" href="#about">
            Biz haqimizda
          </a>
          <a className="nav__link text-[34px] ml-12 sm:text-[30px]" href="#courses">
            O'quv dasturi
          </a>
          <a className="nav__link text-[34px] ml-12 sm:text-[30px]" href="#benefits">
            Foydali tomonlari
          </a>
          <CgClose onClick={hideNavHandler} className="absolute top-[0.7rem] right-[1.4rem] sm:w-8 sm:h-8 w-6 h-6 text-white cursor-pointer" />
        </div>
      </div> */}
    </>
  );
}

export default Navbar;



