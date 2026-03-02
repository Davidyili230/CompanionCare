
import styles from "./modules/Report.module.css"

import { useState } from "react"
import { useNavigate } from "react-router-dom"

function PetInformation() {

    const [petType, setPetType] = useState("")
    const [breed, setBreed] = useState("")
    const [customBreed, setCustomBreed] = useState("")

    const breeds = {
        dog: ["Golden-Retriever", "German Shepherd", "Pomeranian", "Husky", "Poodle", "Other"],
        cat: ["Maine Coon", "Ragdoll", "British ShortHair", "Siamese", "Bengal", "Other"]
    }

    const selectedBreeds = breeds[petType] || []

    function handlePetTypeChange(e) {
        setPetType(e.target.value)
        setBreed("")
        setCustomBreed("")
    }

    function handleBreedChange(e) {
        setBreed(e.target.value)
        setCustomBreed("")
    }

    function handleCustomBreedChange(e) {
        setCustomBreed(e.target.value)
    }

    return (
        <div className={styles.petInfoContainer}>
            <h2> Pet Information </h2>

            <label>Pet's Name</label>
            <input type="text" placeHolder="Enter your pet's name"/>

            <label htmlFor="species">Species</label>
            <select
                id="species"
                value={petType}
                onChange={handlePetTypeChange}
            >
                <option value="" disabled>Select the type of pet you have</option>
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
            </select>

            {petType && (
                <>
                    <label htmlFor="breed">Breed</label>
                    <select
                        id="breed"
                        value={breed}
                        onChange={handleBreedChange}
                    >
                        <option value="" disabled>Select Your Pet's Breed</option>
                        {
                            selectedBreeds.map((petBreed, idx) => (
                                <option
                                    key={idx}
                                    value={petBreed}
                                >
                                    {petBreed}
                                </option>
                            ))
                        }
                    </select>
                </>
            )}

            {breed == "Other" && (
                <>
                    <label>Custom Breed</label>
                    <input
                        type="text"
                        placeHolder="Enter you pet's breed"
                        value={customBreed}
                        onChange={handleCustomBreedChange}
                    />
                    
                </>
            )}

            <label>Date Last Seen</label>
            <input type="date"/>

            <label>Additional Information</label>
            <textarea placeholder="Any additional information about your pet?"/>
        </div>
    )
}

function OwnerInformation() {
    return (
        <div className={styles.userInfoContainer}>
            <h2>Owner Contact Information</h2>

            <label>Name </label>
            <input type="text" placeholder="Enter your name"/>
            
            <label>Email Address</label>
            <input type="email" placeholder="Enter your email"/>

            <label>Phone Number</label>
            <input type="tel" placeholder="Enter your phone number"/>
        </div>
    )
}

function ImageUpload() {
    const [uploadedImage, setUploadedImage] = useState(null)

    const handleImageChange = (event) => {
        const file = event.target.files[0]
        if (file) {
            setUploadedImage(URL.createObjectURL(file))
        }
    }


    return (
        <label className={styles.imgContainer} htmlFor="imageUpload">
            {uploadedImage == null && <h2>Upload Image</h2>}

            <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                id="imageUpload"
                className={styles.imageInput}
            />

            <img 
                src={uploadedImage || "./cameraIcon.png" }
                alt="camera"
                className={uploadedImage == null ? styles.imgIcon : styles.userImg}
            />
        </label>
    )
}


export default function LostPetReport() {
    const navigate = useNavigate();

    const handleNavigation = () => {
        navigate("/LostPet")
    }

    return (
        <div className={styles.pageContainer}>
            <h1 className={styles.title}>
                Lost Pet Report
            </h1>

            <p className={styles.subtext}>
                We are sorry that your pet is missing. We hope that you will be able to bring them back home soon
            </p>

            <div className={styles.reportContent}>
                <div className={styles.leftContent}>   
                    <PetInformation/>
                    <OwnerInformation/>
                </div>
                <div className={styles.rightContent}>
                    <ImageUpload/>
                </div>
            </div>
            
            <button 
                className={styles.reportButton}
                onClick={handleNavigation}
            >
                Create Report
            </button>   
        </div>
    )
}