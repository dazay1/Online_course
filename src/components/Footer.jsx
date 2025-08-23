import logo from "../assets/logo.svg";
import {
  FaFacebook,
  FaInstagram,
  FaPhoneAlt,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
const Footer = () => {
  return (
    <div className="pt-20 pb-12 bg-black">
      <div className="container">
        {/* Define grid */}
        <div className="w-[80%] mx-auto grid items-start grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-8 border-b-[1.5px] border-white border-opacity-20">
          {/* 1st footer part */}
          <div>
            <img src={logo} alt="logo" width={100} height={100} />
            <p className="text-white text-opacity-50">
              Biz haqimizda ko'pro ma'lumot bilmoqchi bo'lsangiz shu telefon
              raqamiga murojat qiling.
            </p>
            <div className="flex items-center gap-2">
              <FaPhoneAlt color="white" />
              <p className="text-[18px] hover:decoration-1 text-white">
                33-880-03-99
              </p>
            </div>
            {/* social link */}
            <div className="flex items-center space-x-4 mt-6">
              <FaFacebook className="w-6 h-6 text-blue-600" />
              <FaTwitter className="w-6 h-6 text-sky-500" />
              <FaYoutube className="w-6 h-6 text-red-700" />
              <FaInstagram className="w-6 h-6 text-pink-600" />
            </div>
          </div>
          {/* 2nd part */}
          <div>
            <h4 className="footer__heading">Popular</h4>
            <p className="footer__link">Web development</p>
            <p className="footer__link">Figma</p>
            <p className="footer__link">UI/Ux Design</p>
            <p className="footer__link">App Development</p>
            <p className="footer__link">Desktop Development</p>
            <p className="footer__link">Digital Marketing</p>
          </div>
          {/* 3rd part */}
          <div>
            <h4 className="footer__heading">Quick Link</h4>
            <p className="footer__link">Home</p>
            <p className="footer__link">About</p>
            <p className="footer__link">Courses</p>
            <p className="footer__link">Instructor</p>
            <p className="footer__link">Profile</p>
            <p className="footer__link">Privacy Policy</p>
          </div>
          {/* 4th part (newsLetter) */}
          <div>
            <h1 className="footer__heading">Subscribe our Newsletter</h1>
            <input
              type="text"
              placeholder="Enter your email"
              className="px-6 py-2 rounded-lg outline-none bg-gray-700 w-full text-white"
            />
            <button className="px-6 py-2 mt-4 rounded-lg outline-none bg-rose-700 w-full text-white">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
