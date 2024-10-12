import { Link } from "react-router-dom";
import { FaInstagram } from "react-icons/fa";

const Logo: React.FC = () => {
  return (
    <div className=" px-3 max-md:hidden">
      <h1 className={" hidden xl:block"}>
        {" "}
        <span
          aria-label="Instagram"
          className=" sidebar__logo mt-5"
          role="img"
        ></span>
      </h1>

      <Link
        to="/"
        className=" mt-5 inline-block active:scale-95 hover:bg-opacity-10 hover:bg-white cursor-pointer xl:hidden"
      >
        <FaInstagram className=" text-2xl" />
      </Link>
    </div>
  );
};

export default Logo;
