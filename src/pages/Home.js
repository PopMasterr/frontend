import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import BannerImage from "../assets/homeBack.png";
import "../styles/Home.css";
import { Skaiciai } from "../helpers/FloatingNumbers";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { LoginContext } from "./Login";
import Dubai from "../assets/carousel/dubai-min.png";
import NewYork from "../assets/carousel/nyc.webp";
import Sydney from "../assets/carousel/sydney.webp";
import Popmasterr_logo_white from "../assets/home/ppmstr_white.svg";

function Home() {
  const { logged } = useContext(LoginContext);

  return (
    <div>
      <div className="home" style={{backgroundImage: `url(${BannerImage})`}}>
{/*        {Skaiciai.map((skaicius, key) => {
          let Dizainas = skaicius.stilius;
          return <Dizainas key={key}>{skaicius.value}</Dizainas>;
        })}*/}
{/*tbh nzn ar su sitais kazka daryt, su jais kazkaip cluttered, tai may as well nedaryt ig
       <div className="image-container left">
          <img className="side-image left" src={Australia} alt="Australia" draggable="false"/>
          <div className="number left-number">52,072,635</div>
      </div>
      <div className="image-container right">
        <img className="side-image right" src={USA} alt="USA" draggable="false"/>
        <div className="number right-number">156,443,351</div>
      </div>*/}

        <div className="textContainer">
          <div className="headerContainer">
            <p className="top-of-text top">Guess the population and</p>
            <p className="top-of-text">Compete to become the</p>
            <img className="logo" src={Popmasterr_logo_white} alt="POPMASTERR" draggable="false"/>
          </div>
          {logged ? (
              <Link
                  id="mygtukas"
                  className="generic-button play-button"
                  to="/play"
              >
                Play
              </Link>
          ) : (
              <>
                <Link
                    id="mygtukas"
                    className="generic-button play-button"
                    to="/login"
                >
                  Log in!
                </Link>
                <Link
                    className="signUp"
                    to="/signup"
                >
                  or Sign up!
                </Link>
              </>
          )}
        </div>
        {/*        <div className="image-slider">
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
              <img src={Dubai} alt="Dubai" draggable="false" />
            </div>
            <div>
              <img src={NewYork} alt="NewYork" draggable="false" />
            </div>
            <div>
              <img src={Sydney} alt="Sydney" draggable="false" />
            </div>
          </Carousel>
        </div>*/}
      </div>
    </div>
  );
}

export default Home;
