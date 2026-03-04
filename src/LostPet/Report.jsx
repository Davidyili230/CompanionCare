
import styles from "./modules/Report.module.css"

import { useState } from "react"
import { useNavigate } from "react-router-dom"

function PetInformation({ formData, setFormData }) {


    const breeds = {
        dog: ["Golden-Retriever", "German Shepherd", "Pomeranian", "Husky", "Poodle", "Other"],
        cat: ["Maine Coon", "Ragdoll", "British ShortHair", "Siamese", "Bengal", "Other"]
    }

    const handlePetInfoChange = (field, value) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            [field]: value
        }))
    }

    const selectedBreeds = breeds[formData.petType] || []

    function handlePetTypeChange(e) {
        setFormData(prevFormData => ({
            ...prevFormData,
            petType: e.target.value,
            breed: "",
            customBreed: ""
        }))
    }

    function handleBreedChange(e) {
        setFormData(prevFormData => ({
            ...prevFormData,
            breed: e.target.value,
            customBreed: ""

        }))
    }

    function handleCustomBreedChange(e) {
        setFormData(prevFormData => ({
            ...prevFormData,
            customBreed: e.target.value
        }))
    }

    return (
        <div className={styles.petInfoContainer}>
            <h2> Pet Information </h2>

            <label>Pet's Name</label>
            <input 
                type="text" 
                placeholder="Enter your pet's name"
                value={formData.petName}
                onChange={(e) => handlePetInfoChange("petName", e.target.value)}
            />

            <label htmlFor="species">Species</label>
            <select
                id="species"
                value={formData.petType}
                onChange={handlePetTypeChange}
            >
                <option value="" disabled>Select the type of pet you have</option>
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
            </select>

            {formData.petType && (
                <>
                    <label htmlFor="breed">Breed</label>
                    <select
                        id="breed"
                        value={formData.breed}
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

            {formData.breed == "Other" && (
                <>
                    <label>Custom Breed</label>
                    <input
                        type="text"
                        placeholder="Enter you pet's breed"
                        value={formData.customBreed}
                        onChange={handleCustomBreedChange}
                    />
                </>
            )}

            <label>Date Last Seen</label>
            <input 
                type="date" 
                value={formData.dateLastSeen} 
                onChange={(e) => handlePetInfoChange("dateLastSeen", e.target.value)}
            />

            <label>Additional Information</label>
            <textarea 
                placeholder="Any additional information about your pet?"
                value={formData.additionalInfo}
                onChange={(e) => handlePetInfoChange("additionalInfo", e.target.value)}
            />
        </div>
    )
}

function OwnerInformation({ formData, setFormData }) {

    const handleOwnerInfoChange = (field, value) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            [field]: value
        }))
    }

    return (
        <div className={styles.userInfoContainer}>
            <h2>Owner Contact Information</h2>

            <label>Name </label>
            <input 
                type="text" 
                placeholder="Enter your name"
                value={formData.ownerName}
                onChange={(e) => handleOwnerInfoChange("ownerName", e.target.value)}
            />
            
            <label>Email Address</label>
            <input 
                type="email" 
                placeholder="Enter your email" 
                value={formData.email}
                onChange={(e) => handleOwnerInfoChange("email", e.target.value)}
            />

            <label>Phone Number</label>
            <input 
                type="tel" 
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={(e) => handleOwnerInfoChange("phone", e.target.value)}
            />
        </div>
    )
}

function ImageUpload({ formData, setFormData }) {
    
    const handleImageChange = (event) => {
        const file = event.target.files[0]

        if (file) {
            setFormData(prevFormData => ({
                ...prevFormData,
                image: URL.createObjectURL(file)
            }))
        }
    }

    return (
        <label className={styles.imgContainer} htmlFor="imageUpload">
            {formData.image == null && <h2>Upload Image</h2>}

            <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                id="imageUpload"
                className={styles.imageInput}
            />

            <img 
                src={formData.image || "./cameraIcon.png" }
                alt="camera"
                className={formData.image == null ? styles.imgIcon : styles.userImg}
            />
        </label>
    )
}


export default function LostPetReport() {
    const navigate = useNavigate();

    const handleNavigation = () => {
        navigate("/LostPet")
    }

    const [formData, setFormData] = useState({
        petName: "",
        petType: "",
        breed: "",
        customBreed: "",
        dateLastSeen: "",
        addtionalInfo: "",
        ownerName: "",
        email: "",
        phone: "",
        image: null,
    })

    const isFormFilled = 
        formData.petName &&
        formData.petType &&
        formData.breed && 
        formData.dateLastSeen &&
        formData.ownerName && 
        formData.image &&
        (formData.email || formData.phone) &&
        (formData.breed !== "Other" || formData.customBreed)

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
                    <PetInformation formData={formData} setFormData={setFormData}/>
                    <OwnerInformation formData={formData} setFormData={setFormData}/>
                </div>
                <div className={styles.rightContent}>
                    <ImageUpload formData={formData} setFormData={setFormData}/>
                </div>
            </div>
            
            <button 
                className={
                    `${styles.reportButton}
                    ${isFormFilled ? styles.reportButtonEnabled : styles.reportButtonDisabled}`
                }
                onClick={handleNavigation}
                disabled={!isFormFilled}
            >
                Create Report
            </button>   
        </div>
    )
}