import React from "react";
import { Link } from "react-router-dom";
import BannerImage from "../assets/homeBack.png";
import "../styles/Home.css";
import { Skaiciai } from "../helpers/FloatingNumbers";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Dubai from "../assets/dubai-min.png";
import NewYork from "../assets/nyc.webp";
import Sydney from "../assets/sydney.webp";

function Home() {
  return (
    <div>
      <div className="home" style={{ backgroundImage: `url(${BannerImage})` }}>
        {Skaiciai.map((skaicius, key) => {
          let Dizainas = skaicius.stilius;
          return <Dizainas key={key}>{skaicius.value}</Dizainas>;
        })}
        <div className="textContainer">
          <div className="headerContainer">
            <p>Compete to become the POPMASTERR!!!</p>
          </div>
          <Link id="mygtukas" to="/play">
            Play
          </Link>
        </div>
        <div className="image-slider">
          <Carousel
            axis="vertical"
            autoPlay={true}
            dynamicHeight={true}
            infiniteLoop={true}
            interval={3000}
            showArrows={false}
            showStatus={false}
            showIndicators={false}
            showThumbs={false}
            stopOnHover={false}
            swipeable={false}
          >
            <div>
              <img src={Dubai} draggable="false" />
            </div>
            <div>
              <img src={NewYork} draggable="false" />
            </div>
            <div>
              <img src={Sydney} draggable="false" />
            </div>
          </Carousel>
        </div>
      </div>
    </div>
  );
}

export default Home;
