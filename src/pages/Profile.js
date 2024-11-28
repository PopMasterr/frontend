import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef
} from "react";
import "../styles/Profile.css";
import DefaultProfile from "../assets/Profile.png";
import { LoginContext } from "../pages/Login";
import Cookies from "js-cookie";
import debounce from "lodash.debounce";
import { Badges } from "../helpers/Badges";
import klaustukas from "../assets/klaustukas.png";
import "react-image-crop/dist/ReactCrop.css";
import ReactCrop from 'react-image-crop';

function Profile() {
  const [height, setHeight] = useState(0)
  const [width, setWidth] = useState(0)
  const ref = useRef(null)
  const { username } = useContext(LoginContext);
  const [tempProfilePicture, setTempProfilePicture] = useState();
  const [profilePictureURL, setProfilePictureURL] = useState(DefaultProfile);
  const [crop, setCrop] = useState();
  const apiURL = process.env.REACT_APP_API + "api/profileImage/upload";
  const apiUpdateImageURL = process.env.REACT_APP_API + "api/profileImage/updateImage";
  const apiGetImageURL = process.env.REACT_APP_API + "api/profileImage/getImage";
  const googleCloudStorageURL = process.env.REACT_APP_GOOGLE_CLOUD_API;

  const getAuthHeaders = useMemo(
      () => ({
        authorization: Cookies.get("AuthToken"),
        refreshToken: Cookies.get("RefreshToken"),
      }),
      []
  );

  const handleProfilePictureUpload = useCallback(
    debounce(async (event) => {
      const file = event.target.files[0];
  
      // Check if the file is an image
      if (!file.type.startsWith("image/")) {
        alert("Please upload a valid image file.");
        return;
      }
  
      if (file.size > 5 * 1024 * 1024) {
        alert("Please upload an image smaller than 5MB.");
        return;
      }

      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setTempProfilePicture(reader.result);
      });
  
      reader.readAsDataURL(file);
    }, 300),
    []
  );

  const handleProfilePictureChange = async (imageSrc, crop) => {
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
            const apiEndpoint = profilePictureURL === DefaultProfile ? apiURL : apiUpdateImageURL;
  
            const response = await fetch(apiEndpoint, {
              method: "POST",
              credentials: "include",
              headers: getAuthHeaders,
              body: formData,
            });
  
            if (!response.ok) {
              const errorText = await response.text();
              throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
            }
  
            const result = await response.json();
            console.log(result);
  
            if (!result.error) {
              console.log("Profile picture uploaded successfully!");
              await getProfilePicture(); // Fetch the latest profile picture
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

  const apiGetProfileStatistics = process.env.REACT_APP_API + "api/userMetrics/getMetrics";

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
      }
    } catch (error) {
      console.error(
          "There was an error fetching the profile statistics!",
          error
      );
    }
  };

  useEffect(() => {
    setHeight(ref.current.clientHeight)
    setWidth(ref.current.clientWidth)
  })

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
                style={{backgroundImage: `url(${profilePictureURL})`}}
            ></div>
            <input
                type="file"
                id="file"
                accept="image/*"
                onChange={handleProfilePictureUpload}
            />
            
            <ReactCrop
              aspect={1}
              circularCrop
              crop={crop}
              onChange={c => setCrop(c)}
              >
              <img ref={ref} src={tempProfilePicture} alt="Crop me" />
            </ReactCrop>
            <button onClick={() => handleProfilePictureChange(tempProfilePicture, crop)}>Submit</button>
            <div>{username}</div>
          </div>
          <div className="profile-statistics">
            <h1>Your statistics:</h1>
            <p>Games played: {gamesPlayed}</p>
            <p>Total score: {totalScore}</p>
            <p>Average score: {averageScore}</p>
            <p>Perfect guesses: {perfectGuesses}</p>
          </div>
        </div>
        <div className="achievements">
          <h1>Your achievements</h1>
        </div>
        <div className="badges">
          {Badges.map((badge) => (
              <div key={badge.id} className="badge" title={badge.title}>
                <p>{badge.description}</p>
                <img src={klaustukas} alt="question mark icon"/>
                <h2>{badge.title}</h2>
              </div>
          ))}
        </div>
      </div>
  );
}

export default Profile;