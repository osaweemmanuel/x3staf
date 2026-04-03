import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/ImageCarousel.css";
import review1 from "../assets/Review.svg";
import review2 from "../assets/Review (1).svg";
import review3 from "../assets/Review (2).svg";
import { useLocation } from "react-router-dom";

const Recommendations = ({ BGcolor }: { BGcolor: string }) => {
  const location = useLocation();
  const whiteBackgroundPaths = ["/about"];
  // Check if the current path is in the whitelist
  const isWhiteBackground = whiteBackgroundPaths.some((path) =>
    location.pathname.includes(path)
  );

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000, // Set the autoplay interval in milliseconds
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const images = [review1, review2, review3];
  return (
    <section
      className={`overflow-hidden w-full py-20 ${
        isWhiteBackground ? "bg-white" : "bg-black"
      } relative`}
      style={{ backgroundColor: BGcolor }}
    >
      <div className="relative space-x-[14px]">
        <Slider {...settings}>
          {images.map((image, index) => (
            <div key={index}>
              <img
                src={image}
                className="w-[97%] max-md:w-full h-auto object-cover"
                alt={`Image ${index + 1}`}
              />
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default Recommendations;
