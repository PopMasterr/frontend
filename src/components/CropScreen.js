import React, {
    useContext,
    useEffect,
    useState,
    useCallback,
    useMemo,
    useRef
} from "react";
import "../styles/CropScreen.css";
import { LoginContext } from "../pages/Login";
import Cookies from "js-cookie";
import debounce from "lodash.debounce";
import "react-image-crop/dist/ReactCrop.css";
import ReactCrop from 'react-image-crop';
import { IoCloseCircleOutline } from "react-icons/io5";


function CropScreen(params) {
    const [height, setHeight] = useState(0)
    const [width, setWidth] = useState(0)
    const ref = useRef(null)
    const [tempProfilePicture, setTempProfilePicture] = useState();
    const [crop, setCrop] = useState();
    const [CropScreenOpen, setCropScreenOpen] = useState(false);
    const apiURL = process.env.REACT_APP_API + "api/profileImage/upload";

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
    
    const deleteProfilePicture = async() => {
        const deleteAPI = process.env.REACT_APP_API + "api/profileImage/removeImage"
        try { 
            const response = await fetch(deleteAPI, {
                method: "POST",
                credentials: "include",
                headers: getAuthHeaders
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
            }

            const result = await response.json();
            console.log(result);

            if (!result.error) {
                window.location.reload();
            }
        } catch (error) {
            console.error(
            "There was an error deleting the profile picture!",
            error
            );
        }
    }

    useEffect(() => {
        if (tempProfilePicture) {
            setHeight(ref.current.clientHeight)
            setWidth(ref.current.clientWidth)
        }
    })

    return(
        <div className="crop-background">
            <div className="crop-container">
                <button className="close-button" onClick={params.onClose}><IoCloseCircleOutline /></button>
                {tempProfilePicture && <h3>Crop your image</h3>}
                <div className="crop-screen">
                    {!tempProfilePicture &&
                    <div className="crop-buttons-row">
                        {!tempProfilePicture && !params.hasProfilePicture &&
                        <label htmlFor="fileUpload" className="upload-button">
                            Upload
                        </label>
                        }
                        {!tempProfilePicture && params.hasProfilePicture &&
                        <label htmlFor="fileUpload" className="upload-button">
                            Change
                        </label>
                        }
                        {tempProfilePicture && 
                        <label htmlFor="fileUpload" className="upload-button">
                            Upload a different image
                        </label>
                        }
                        <input
                            id="fileUpload"
                            type="file"
                            accept="image/*"
                            // onChange={}
                            style={{ display: 'none' }} // Hide the actual file input
                            onChange={handleProfilePictureUpload}
                        />
                        {!tempProfilePicture && params.hasProfilePicture && <button className="delete-button" onClick={deleteProfilePicture}>Delete</button>}
                        {tempProfilePicture && <button class="submit-button" onClick={() => params.onSubmit(tempProfilePicture, crop, width, height)}>Submit</button>}
                    </div>
                    }
                    {tempProfilePicture &&
                    <div className="crop-buttons-column">
                        {!tempProfilePicture && !params.hasProfilePicture &&
                        <label htmlFor="fileUpload" className="upload-button">
                            Upload
                        </label>
                        }
                        {!tempProfilePicture && params.hasProfilePicture &&
                        <label htmlFor="fileUpload" className="upload-button">
                            Change
                        </label>
                        }
                        {tempProfilePicture && 
                        <label htmlFor="fileUpload" className="upload-button">
                            Upload a different image
                        </label>
                        }
                        <input
                            id="fileUpload"
                            type="file"
                            accept="image/*"
                            // onChange={}
                            style={{ display: 'none' }} // Hide the actual file input
                            onChange={handleProfilePictureUpload}
                        />
                        {!tempProfilePicture && params.hasProfilePicture && <button className="delete-button" onClick={deleteProfilePicture}>Delete</button>}
                        {tempProfilePicture && <button class="submit-button" onClick={() => params.onSubmit(tempProfilePicture, crop, width, height)}>Submit</button>}
                    </div>
                    }
                    {tempProfilePicture && 
                    <div className="crop-image">
                        
                        <ReactCrop
                            aspect={1}
                            circularCrop
                            crop={crop}
                            onChange={c => setCrop(c)}
                        >
                            <img ref={ref} src={tempProfilePicture} alt="Crop me" />
                        </ReactCrop>
                        
                    </div>
                    }
                </div>
            </div>
        </div>
    );
}

export default CropScreen;