
import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { isValidEmail, isValidPhoneNumber } from "./ReportValidation"
import { submitReport } from "./databaseAccess/SubmitReport"

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
        <div className="flex flex-col gap-2.5 bg-white p-3 rounded-xl">
            <h2 className="text-center"> Pet Information </h2>

            <label className="text-[14px] font-bold">Pet's Name</label>
            <input 
                type="text" 
                placeholder="Enter your pet's name"
                value={formData.petName}
                onChange={(e) => handlePetInfoChange("petName", e.target.value)}
                className="p-2.5 rounded-[5px] text-sm border"
            />

            <label htmlFor="species" className="text-[14px] font-bold">Species</label>
            <select
                id="species"
                value={formData.petType}
                onChange={handlePetTypeChange}
                className="p-2.5 rounded-[5px] text-sm border"
            >
                <option value="" disabled>Select the type of pet you have</option>
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
            </select>

            {formData.petType && (
                <>
                    <label htmlFor="breed" className="text-[14px] font-bold">Breed</label>
                    <select
                        id="breed"
                        value={formData.breed}
                        onChange={handleBreedChange}
                        className="p-2.5 rounded-[5px] text-sm border"
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
                    <label className="text-[14px] font-bold">Custom Breed</label>
                    <input
                        type="text"
                        placeholder="Enter you pet's breed"
                        value={formData.customBreed}
                        onChange={handleCustomBreedChange}
                        className="p-2.5 rounded-[5px] text-sm border"
                    />
                </>
            )}

            <label className="text-[14px] font-bold">Date Last Seen</label>
            <input 
                type="date" 
                value={formData.dateLastSeen} 
                onChange={(e) => handlePetInfoChange("dateLastSeen", e.target.value)}
                className="p-2.5 rounded-[5px] text-sm border"
            />

            <label className="text-[14px] font-bold">Additional Information</label>
            <textarea 
                placeholder="Any additional information about your pet?"
                value={formData.additionalInfo}
                onChange={(e) => handlePetInfoChange("additionalInfo", e.target.value)}
                className="p-2.5 rounded-[5px] text-sm border resize-y min-h-25"
            />
        </div>
    )
}

function OwnerInformation({ formData, setFormData, checkUserInfo }) {

    const handleOwnerInfoChange = (field, value) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            [field]: value
        }))
    }

    return (
        <div className="flex flex-col gap-2.5 bg-white p-3 rounded-xl">
            <h2 className="text-center">Owner Contact Information</h2>

            <label className="text-sm font-bold">Name </label>
            <input 
                type="text" 
                placeholder="Enter your name"
                value={formData.ownerName}
                onChange={(e) => handleOwnerInfoChange("ownerName", e.target.value)}
                className="p-2.5 rounded-[5px] text-sm border"
            />
            
            <label className="text-sm font-bold">Email Address</label>
            <input 
                type="email" 
                placeholder="Enter your email" 
                value={formData.email}
                onChange={(e) => handleOwnerInfoChange("email", e.target.value)}
                className="p-2.5 rounded-[5px] text-sm border"
            />

            {checkUserInfo.isValidEmailFormat === false && 
                <span className="text-red-500 font-bold text-[12px]">
                    Please Enter a valid email
                </span>
            }

            <label className="text-sm font-bold">Phone Number</label>
            <input 
                type="tel" 
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={(e) => handleOwnerInfoChange("phone", e.target.value)}
                className="p-2.5 rounded-[5px] text-sm border"
            />

            {checkUserInfo.isValidPhoneFormat === false && 
                <span className="text-red-500 font-bold text-[12px]">
                    Please Enter a valid phone number
                </span>
            }
        </div>
    )
}

function ImageUpload({ formData, setFormData }) {
    
    const handleImageChange = (event) => {
        const file = event.target.files[0]

        if (file) {
            setFormData(prevFormData => ({
                ...prevFormData,
                imageFile: file,
                image: URL.createObjectURL(file)
            }))
        }
    }

    return (
        <label 
            className="flex justify-center items-center flex-col border-2 border-dashed border-[rgb(151,145,145)],
                        rounded-xl text-center w-full h-full overflow-hidden cursor-pointer hover:border-black"
            htmlFor="imageUpload"
        >
            {formData.image == null && <h2>Upload Image</h2>}

            <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                id="imageUpload"
                className="hidden"
            />

            <img 
                src={formData.image || "./cameraIcon.png" }
                alt="camera"
                className={
                    formData.image == null 
                    ? "w-20 h-20 object-contain"
                    : "w-full h-full object-cover"
                }
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
        additionalInfo: "",
        ownerName: "",
        email: "",
        phone: "",
        imageFile: null,
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

    const [checkUserInfo, setCheckUserInfo] = useState({
        isValidEmailFormat: null,
        isValidNumberFormat: null
    })

    const isUserInfoValid = () => {
        
        const emailValid = formData.email ? isValidEmail(formData.email) : null;
        const phoneValid = formData.phone ? isValidPhoneNumber(formData.phone) : null;

        setCheckUserInfo({
            isValidEmailFormat: emailValid,
            isValidPhoneFormat: phoneValid
        })
        
        if(emailValid === false && phoneValid === null) return false;
        else if(emailValid === null && phoneValid === false) return false;
        else if(emailValid === false && phoneValid === false) return false;
        else if(emailValid && phoneValid === false) return false;
        else if(emailValid === false && phoneValid) return false;

        return true;
    }

    return (
        <div className="m-7.5">
            <h1 className="text-center">
                Lost Pet Report
            </h1>

            <p className="text-center font-['Lucida Sans', Geneva, sans-serif], mb-12.5">
                We are sorry that your pet is missing. We hope that you will be able to bring them back home soon
            </p>

            <div className="flex justify-between rounded-2xl shadow-[2px_5px_10px_black] p-[2.5] bg-[#f9f7f5] gap-12.5">
                <div className="flex flex-col gap-10 flex-1">   
                    <PetInformation formData={formData} setFormData={setFormData}/>
                    <OwnerInformation 
                        formData={formData} 
                        setFormData={setFormData}
                        checkUserInfo={checkUserInfo}
                    />
                </div>
                <div className="flex m-auto justify-center items-start flex-1 h-125">
                    <ImageUpload formData={formData} setFormData={setFormData}/>
                </div>
            </div>
            
            <button 
                className={
                    `block m-auto border-0 rounded-xl text-white font-bold text-sm bg-[#E63737]
                    px-7.5 py-3.75 mt-7.5 transition-all duration-300 ease-in-out
                    ${isFormFilled 
                        ? "bg-[#E63737] hover:bg-[#b32c2c] hover:scale-105 cursor-pointer" 
                        : "bg-[#e28c8c] cursor-not-allowed"
                    }
                `}
                onClick={() => {
                    if(isUserInfoValid()) {
                        submitReport(formData)
                        handleNavigation()
                    }
                }}
      
                disabled={!isFormFilled}
            >
                Create Report
            </button>   
        </div>
    )
}