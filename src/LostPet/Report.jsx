
import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { isValidEmail, isValidPhoneNumber } from "./ReportValidation"
import { submitReport } from "./databaseAccess/SubmitReport"

function FieldLabel({ text }) {
    return (
       <label className="font-bold mb-1.5 block">
            {text}
       </label>
    )
}

function TextInput({ value, onChange, placeholder, inputType}) {
    return (
        <input
            type={inputType}
            placeholder={placeholder}
            onChange={onChange}
            value={value}
            className="border rounded-xl px-4 py-2 text-sm outline-none w-full"
            min={0}
            max={50}
        />
    )
}

function TextAreaInput({ value, onChange, placeholder }) {
    return (
        <textarea
            placeholder="Any additional information about the pet?"
            value={value}
            onChange={onChange}
            className="border rounded-xl w-full px-4 py-2 text-sm outline-none resize-y"
            rows={4}
        />
    )
}

function SelectionInput({ value, onChange, children }) {
    return (
        <select
            value={value}
            onChange={onChange}
            className="border rounded-xl px-4 py-2 text-sm outline-none w-full"
        >
            {children}
        </select>
    );
}

function Section({ sectionTitle, children }) {
    return (
        <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 md:p-6 shadow-xl">
            <div className="flex flex-row items-center gap-2 pb-4 border-b">
                <h2 className="text-lg">{sectionTitle}</h2>
            </div>
            {children}
        </div>
    )
}


function PetInformation({ formData, setFormData }) {
    const breeds = {
        Dog: ["Golden-Retriever", "German Shepherd", "Pomeranian", "Husky", "Poodle", "Other"],
        Cat: ["Maine Coon", "Ragdoll", "British ShortHair", "Siamese", "Bengal", "Other"]
    }
    const selectedBreeds = breeds[formData.petType] || [];

    return (
        <Section sectionTitle={"Pet Information"}>
            <div>
                <FieldLabel text={"Pet's Name"}/>
                <TextInput
                    placeholder="Enter your pet's name"
                    value={formData.petName}
                    onChange={(e) => setFormData(prevFormData => ({...prevFormData, name: e.target.value}))}
                    inputType={"text"}
                />
            </div>

            <div>
                <FieldLabel text={"Species"}/>
                <div className="flex flex-row gap-5">
                    {["Dog", "Cat"].map((text, idx) => (
                        <button 
                            key={idx}
                            type="button"
                            className={`border rounded-xl text-sm font-semibold py-2.5 flex-1 cursor-pointer
                            ${formData.petType === text ? "bg-green-400 border-green-300" : "bg-white border-gray-400"}`}
                            onClick={() => setFormData(prevFormData => ({ ...prevFormData, petType: text, breed: "", customBreed: ""}))}
                        >
                            {text}
                        </button>
                    ))}
                </div>
            </div>
            
            {formData.petType && (
                <div>
                    <FieldLabel text={"Breed"}/>
                    <SelectionInput
                        value={formData.breed}
                        onChange={(e) => setFormData(prevFormData => ({...prevFormData, breed: e.target.value, customBreed: ""}))}
                    >
                        <option value="" disabled>Select Your Pet's Breed</option>
                        {(breeds[formData.petType]).map((breed, idx) => (
                            <option key={idx} value={breed}>{breed}</option>
                        ))}
                    </SelectionInput>
                </div>
            )}

            {formData.breed === "Other" && (
                <div>
                    <FieldLabel text="Custom Breed"/>
                    <TextInput 
                        placeholder="Enter Your Pet's Breed"
                        value={formData.customBreed}
                        onChange={(e) => setFormData(prevFormData => ({...prevFormData, customBreed: e.target.value}))}
                    />
                </div>
            )}

            <div>
                <FieldLabel text={"Date Last Seen"}/>
                <TextInput
                    placeholder=""
                    value={formData.dateLastSeen}
                    onChange={(e) => setFormData(prevFormData => ({...prevFormData, dataLastSeen: e.target.value}))}
                    inputType={"date"}
                />
            </div>

            <div>
                <FieldLabel text={"Additional information"}/>
                <TextAreaInput
                    value={formData.notes}
                    onChange={(e) => setFormData(prevFormData => ({...prevFormData, notes: e.target.value}))}
                    placeholder="Any additional information about the pet?"
                />
            </div>

        </Section>
    )
}

function OwnerInformation({ formData, setFormData, checkUserInfo }) {

    return (
        <Section sectionTitle={"Owner Contact Information"}>
            <div>
                <FieldLabel text={"Name"}/>
                <TextInput
                    placeholder={"Enter your name"}
                    value={formData.ownername}
                    onChange={(e) => setFormData(prevFormData => ({...prevFormData, ownerName: e.target.value}))}
                    inputType={"text"}
                />
            </div>

            <div>
                <FieldLabel text={"Email Address"}/>
                <TextInput
                    placeholder={"Enter your email"}
                    value={formData.email}
                    onChange={(e) => setFormData(prevFormData => ({...prevFormData, email: e.target.value}))}
                    inputType={"email"}
                />

                {checkUserInfo.isValidEmailFormat === false &&
                    <p className="text-xs font-semibold text-red-500 mt-1">
                        Please enter a valid email address
                    </p>
                }
            </div>

            <div>
                <FieldLabel text={"Phone Number"}/>
                <TextInput
                    placeholder={"Enter your phone number"}
                    value={formData.phone}
                    onChange={(e) => setFormData(prevFormData => ({...prevFormData, phone: e.target.value}))}
                    inputType={"email"}
                />

                {checkUserInfo.isValidPhoneFormat === false &&
                    <p className="text-xs font-semibold text-red-500 mt-1">
                        Please enter a valid phone number
                    </p>
                }
            </div>
        </Section>
    );
}

function ImageUpload({ formData, setFormData }) {
    
    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setFormData(prevFormData => ({
                ...prevFormData,
                imageFile: file,
                image: URL.createObjectURL(file)
            }))
        }
    }

    return (
        <Section sectionTitle={"Pet Image"}>
            <p className="text-xs">
                Please submit a clear photo of your pet
            </p>

            <label
                className="flex flex-col justify-center items-center border-2 rounded-2xl border-dashed cursor-pointer 
                overflow-hidden min-h-70"
                htmlFor="imageUpload"
            >
                {formData.image ? (
                <>
                    <img 
                        src={formData.image}
                        alt="image of a pet"
                        className="w-full h-full object-cover max-h-80"
                    />

                 
                </>
            ) : (
                <div className="flex flex-col justify-center items-center text-center">
                    <span className="text-2xl">📷</span>
                    <p className="text-sm font-semibold">Click to upload a image</p>
                </div>
            )}

            <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                id="imageUpload"
                className="hidden"
            />
            </label>
        </Section>
    );
}

export default function LostPetReport() {
    const [formData, setFormData] = useState({
        petName: "", petType: "", breed: "", customBreed: "",
        dateLastSeen: "", additionalInfo: "",
        ownerName: "", phone: "", 
        imageFile: null, image: null
    })

    const [checkUserInfo, setCheckUserInfo] = useState({
        isValidEmailFormat: null, 
        isValidNumberFormat: null
    });

    const isFormFilled = 
        formData.petName && formData.petType && formData.breed && formData.customBreed &&
        formData.dateLastSeen && formData.ownerName && formData.image &&
        (formData.email || formData.phone) &&
        (formData.breed !== "Other" || formData.customBreed);

    const isUserInfoValid = () => {
        const emailValid = formData.email ? isValidEmail(formData.email) : null;
        const phoneValid = formData.phone ? isValidPhoneNumber(formData.phone) : null;
        setCheckUserInfo({isValidEmailFormat: emailValid, isValidNumberFormat: phoneValid});

        if (emailValid === false && phoneValid !== true) return false;
        if (phoneValid === false && emailValid !== true) return false;

        return true;
    }

    const navigate = useNavigate();
    const handleNavigation = () => {
        navigate("/LostPet");
    };

    return (
        <div className="px-6 py-8 min-h-screen space-y-5">
            <div className="flex flex-col items-center justify-between rounded-3xl
            bg-white shadow-md mt-5 py-5">
                <h1 className="font-bold text-xl">
                    Lost Pet Report
                </h1>
                <p className="text-xs md:text-sm mt-2 text-center">
                    We are sorry that your pet is missing. We hope that you will be able to bring them back home soon.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="flex flex-col gap-3">
                    <PetInformation formData={formData} setFormData={setFormData}/>
                    <OwnerInformation formData={formData} setFormData={setFormData} checkUserInfo={checkUserInfo}/>
                </div>
                
                <div>
                    <ImageUpload formData={formData} setFormData={setFormData}/>
                </div>
            </div>

            <div className="flex flex-col items-center mt-10">
                <button 
                    className={`${isFormFilled ? "bg-green-500 cursor-pointer" : "bg-gray-300 cursor-not-allowed"} 
                    rounded-xl px-10 py-3 text-sm font-bold`}
                    onClick={() => {
                        if (isUserInfoValid()) {
                            submitAdoptionReport(formData)
                            handleNavigation()
                        }
                    }}
                    disabled={!isFormFilled}
                >
                    Submit Form
                </button>
            </div>
        </div>
    );
}
