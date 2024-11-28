import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import "../styles/Profile.css";
import DefaultProfile from "../assets/Profile.png";
import { LoginContext } from "../pages/Login";
import Cookies from "js-cookie";
import { Badges } from "../helpers/Badges";
import klaustukas from "../assets/klaustukas.png";
import CropScreen from "../components/CropScreen";
import { FaPencil } from "react-icons/fa6";

function Profile() {
  const { username } = useContext(LoginContext);
  const [profilePictureURL, setProfilePictureURL] = useState(DefaultProfile);
  const [CropScreenOpen, setCropScreenOpen] = useState(false);
  const apiURL = process.env.REACT_APP_API + "api/profileImage/upload";
  const apiUpdateImageURL =
    process.env.REACT_APP_API + "api/profileImage/updateImage";
  const apiGetImageURL =
    process.env.REACT_APP_API + "api/profileImage/getImage";
  const googleCloudStorageURL = process.env.REACT_APP_GOOGLE_CLOUD_API;

  const getAuthHeaders = useMemo(
    () => ({
      authorization: Cookies.get("AuthToken"),
      refreshToken: Cookies.get("RefreshToken"),
    }),
    []
  );

  const handleProfilePictureChange = async (imageSrc, crop, width, height) => {
    console.log(crop.x, crop.y, crop.width, crop.height);
    const image = new Image();
    image.src = imageSrc;

    image.onload = () => {
      const canvas = document.createElement("canvas");
      console.log(image.width, image.height);
      const scaleX = image.naturalWidth / width;
      const scaleY = image.naturalHeight / height;
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext("2d");

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );

      canvas.toBlob(
        async (blob) => {
          const formData = new FormData();
          formData.append("profilePicture", blob, "profile.jpg");

          try {
            const apiEndpoint =
              profilePictureURL === DefaultProfile ? apiURL : apiUpdateImageURL;

            const response = await fetch(apiEndpoint, {
              method: "POST",
              credentials: "include",
              headers: getAuthHeaders,
              body: formData,
            });

            if (!response.ok) {
              const errorText = await response.text();
              throw new Error(
                `HTTP error! status: ${response.status}, body: ${errorText}`
              );
            }

            const result = await response.json();
            console.log(result);

            if (!result.error) {
              console.log("Profile picture uploaded successfully!");
              await getProfilePicture(); // Fetch the latest profile picture
              window.location.reload();
            }
          } catch (error) {
            console.error(
              "There was an error uploading the profile picture!",
              error
            );
          }
        },
        "image/jpeg",
        0.75
      );
    };
  };

  const getProfilePicture = useCallback(async () => {
    try {
      const response = await fetch(apiGetImageURL, {
        method: "GET",
        headers: getAuthHeaders,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(result);

      if (!result.error && result.imageUrl.length !== 0) {
        console.log("Profile picture fetched successfully!");
        const imageUrl = `${googleCloudStorageURL}${result.imageUrl[0]}`;
        setProfilePictureURL(imageUrl);
      } else {
        console.log("No profile picture found.");
      }
    } catch (error) {
      console.error("There was an error fetching the profile picture!", error);
    }
  }, [getAuthHeaders]);

  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [averageScore, setAverageScore] = useState(0);
  const [perfectGuesses, setPerfectGuesses] = useState(0);
  const [highestStreak, setHighestStreak] = useState(0);

  const apiGetProfileStatistics =
    process.env.REACT_APP_API + "api/userMetrics/getMetrics";

  const getProfileStatistics = async () => {
    try {
      const response = await fetch(apiGetProfileStatistics, {
        method: "GET",
        headers: getAuthHeaders,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.error) {
        setGamesPlayed(result.data.games_played);
        setTotalScore(result.data.total_points);
        setAverageScore(result.data.average_score);
        setPerfectGuesses(result.data.perfect_guesses);
        setHighestStreak(result.data.highest_streak);
      }
    } catch (error) {
      console.error(
        "There was an error fetching the profile statistics!",
        error
      );
    }
  };

  useEffect(() => {
    getProfilePicture();
    getProfileStatistics();
  }, []); // Empty dependency array ensures this runs only once

  return (
    <div className="centras">
      <div className="profile">
        <div className="profile-personal-info">
          <div
            className="circle"
            style={{ backgroundImage: `url(${profilePictureURL})` }}
          ></div>
          <button
            className="edit-button"
            onClick={() => setCropScreenOpen(!CropScreenOpen)}
          >
            <FaPencil />
          </button>
          {CropScreenOpen && (
            <CropScreen
              hasProfilePicture={
                profilePictureURL === DefaultProfile ? false : true
              }
              onClose={() => setCropScreenOpen(false)}
              onSubmit={handleProfilePictureChange}
            />
          )}
          <div>{username}</div>
        </div>
        <div className="profile-statistics">
          <h1>Your statistics:</h1>
          <p>Games played: {gamesPlayed}</p>
          <p>Total score: {totalScore}</p>
          <p>Average score: {averageScore}</p>
          <p>Perfect guesses: {perfectGuesses}</p>
          <p>Highest streak: {highestStreak}</p>
        </div>
      </div>
      <div className="achievements">
        <h1>Your achievements</h1>
      </div>
      <div className="badges">
        {Badges.map((badge) => (
          <div key={badge.id} className="badge" title={badge.title}>
            <p>{badge.description}</p>
            <img src={klaustukas} alt="question mark icon" />
            <h2>{badge.title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Profile;
