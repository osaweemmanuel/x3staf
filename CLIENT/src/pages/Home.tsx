import Explore from "../components/Home/Explore";
import Find from "../components/Home/Find";
import Hero from "../components/Home/Hero";
import Welcome from "../components/Home/Welcome";
import Recommendations from "../components/Recommendations";
import GetInTouch from "../components/GetInTouch";
import FeaturesShowcase from "../components/FeaturesShowcase";

export const Home = () => {
  return (
    <div>
      <Hero />
      <FeaturesShowcase />
      <Welcome />
      <Explore />
      <Find />
      <Recommendations BGcolor="#0F100D" />
      <div className="my-20 w-full">
        <GetInTouch />
      </div>
    </div>
  );
};
