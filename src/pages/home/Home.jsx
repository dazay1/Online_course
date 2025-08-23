import { FaArrowRight, FaAward } from "react-icons/fa";
import { Feature, Footer, Navbar } from "../../components";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import hero from '../../assets/hero.png'
import { coursesData } from "../../components/data";
import CourseCard from "../../components/forms/CourseCard";
export default function Home() {
  useEffect(() => {
    const initAOS = async () => {
      await import("aos");
      AOS.init({
        duration: 1000,
        easing: "ease",
        once: true,
        anchorPlacement: "top-bottom",
      });
    };
    initAOS();
  });
  return (
    <>
      <section className="w-full pt-4 md:pt-2 h-full bg-indigo-950">
        <Navbar />
        <div className="container">
          <div className="flex justify-center flex-col w-4/5 h-full mx-auto overflow-hidden mt-40">
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
              {/* Text content */}
              <div>
                {/* Title */}
                <h1
                  data-aos="fade-right"
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold md:leading-[3rem] lg:leading-[3.5rem] xl:leading-[4rem] text-white"
                >
                  Farzandlaringiz uchun eng ishonchli o'quv markazi.
                </h1>
                {/* Description */}
                <p
                  data-aos="fade-left"
                  data-aos-delay="150"
                  className="mt-6 text-sm md:text-base text-white text-opacity-60"
                >
                  O'quv markazimizda farzandingiz uchun eng zamonaviy bo'lgan
                  metodika asosida dars o'tiladi. Kurslarimiz farzandingizni
                  kelajakka tayyorlab, o'z kasblarini topishga yordam beradi
                </p>
                {/* Buttons */}
                <div className="mt-8 flex items-center space-x-4">
                  <button
                    data-aos="zoom-in"
                    data-aos-delay="300"
                    className="button__cls bg-green-700 hover:bg-green-900 px-4 py-2 rounded-lg text-white"
                  >
                    Kurslarimiz haqida to'liq ma'lumot olish
                  </button>
                </div>
                {/* Stats */}
                <div className="flex items-center flex-wrap space-x-16 my-8">
                  <div data-aos="fade-up" data-aos-delay="600">
                    <p className="md:text-xl lg:text-2xl text-base text-white font-bold ">
                      260+
                    </p>
                    <p className="w-[100px] h-[3px] bg-green-600 mt-2 mb-2 rounded-lg"></p>
                    <p className="md:text-lg text-sm text-white text-opacity-70">
                      Tutors
                    </p>
                  </div>
                  <div data-aos="fade-up" data-aos-delay="750">
                    <p className="md:text-xl lg:text-2xl text-base text-white font-bold ">
                      2260+
                    </p>
                    <p className="w-[100px] h-[3px] bg-blue-600 mt-2 mb-2 rounded-lg"></p>
                    <p className="md:text-lg text-sm text-white text-opacity-70">
                      Students
                    </p>
                  </div>
                  <div data-aos="fade-up" data-aos-delay="900">
                    <p className="md:text-xl lg:text-2xl text-base text-white font-bold ">
                      60+
                    </p>
                    <p className="w-[100px] h-[3px] bg-pink-600 mt-2 mb-2 rounded-lg"></p>
                    <p className="md:text-lg text-sm text-white text-opacity-70">
                      Courses
                    </p>
                  </div>
                </div>
              </div>
              {/* ImageContent */}
              <div
                data-aos="fade-left"
                data-aos-delay="1050"
                className="hidden lg:block"
              >
                <img src={hero} width={800} height={600} alt="Hero" />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* About */}
      <div className="container">
        <div className="pt-20 pb-20 ">
          {/* define grid */}
          <div className="w-4/5 mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-16">
            {/* 1st part */}
            <div data-aos="fade-right" data-aos-anchor-placement="top-center">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-rose-600 rounded-full flex items-center justify-center flex-col">
                  <FaAward className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-xl font-semibold">
                  Online va Offline darslar
                </h1>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl mt-8 font-bold md:leading-[3rem] lg:leading-[3.5rem] xl:leading-[3.9rem] text-gray-800">
                Kurslarimizning afzalliklari
              </h1>
              <p className="mt-4 text-gray-600">
                O'quv kurslarimiz online va offline tarzda olib boriladi. Ofline
                kurslarimiza yuzma yuz bo'lganligi hisobiga siz ko'proq va
                yaxshiroq bilim olasiz.
              </p>
              <button className="flex items-center space-x-2 px-8 py-3 mt-8 hover:bg-gray-700 transition-all duration-200 rounded-3xl bg-black text-white">
                <span>Kurslarimiz haqida ma'lumotlar</span>
                <FaArrowRight />
              </button>
            </div>
            {/* 2nd part */}
            <div
              data-aos="fade-left"
              data-aos-anchor-placement="top-center"
              data-aos-delay="150"
            >
              <div>
                <h1 className="text-7xl lg:text-9xl font-bold text-black text-opacity-5">
                  01
                </h1>
                <div className="-mt-10">
                  <h1 className="text-xl md:text-2xl text-black text-opacity-70 mb-3 font-bold">
                    Moslashuvchan jadval
                  </h1>
                  <p className="w-[90%] lg:w-[70%] text-base  text-black text-opacity-60">
                    O'zingizga mos kun va vaqtni tanlab darslarga qatnashingiz
                    mumkin
                  </p>
                </div>
              </div>
              <div className="mt-8 w-full">
                <h1 className="text-7xl lg:text-9xl font-bold text-black text-opacity-5">
                  02
                </h1>
                <div className="-mt-10">
                  <h1 className="text-xl md:text-2xl text-black text-opacity-70 mb-3 font-bold">
                    Cho'ntak bob
                  </h1>
                  <p className="w-[90%] lg:w-[70%] text-base text-black text-opacity-60">
                    Kurslarimizning narxi boshqa o'quv markazlaridan ancha
                    arzonroq, va sifatli bilim olishingiz uchun hamma
                    shart-sharoitlar yaratilgan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Courses */}
      <div className="pt-16 pb-12 relative bg-gray-200">
        <div className="container">
          <div className="w-[80%] pt-8 pb-8 mx-auto">
            <h1 className="text-4xl md:text-5xl text-gray-900 font-bold">
              O'quv kurslarimiz
            </h1>
            <div className="md:mt-16 mt-10 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10">
              {coursesData.map((course, i) => {
                return (
                  <div
                    key={course.id}
                    data-aos="fade-right"
                    data-aos-anchor-placement="top-center"
                    data-aos-delay={`${i * 150}`}
                  >
                    <CourseCard course={course} /> 
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {/* Feature */}
      <Feature />
      <Footer />
    </>
  );
}
