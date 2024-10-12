import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./style.css";
import { Navigation, Pagination, Mousewheel, Keyboard } from "swiper/modules";

interface SwiperSlidesProps {
  slides: string[];
}

const SwiperSlides: React.FC<SwiperSlidesProps> = ({ slides }) => {
  return (
    <Swiper
      cssMode={true}
      navigation={true}
      pagination={true}
      mousewheel={true}
      keyboard={true}
      modules={[Navigation, Pagination, Mousewheel, Keyboard]}
      className="mySwiper z-0"
    >
      {slides.map((image, index) => (
        <SwiperSlide key={index.toString()}>
          <img
            src={image}
            alt={`slide-${index + 1}`}
            className=" aspect-square object-cover"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default SwiperSlides;
