
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { isValidEmail, isValidPhoneNumber } from "../LostPet/ReportValidation";
import { submitAdoptionReport } from "./dbAdoptAccess/submitAdoptionReport";

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
        Dog: ["Golden Retriever", "German Shepherd", "Pomeranian", "Husky", "Poodle", "Other"],
        Cat: ["Maine Coon", "Ragdoll", "British ShortHair", "Siamese", "Bengal", "Other"]
    }

    return (
        <Section sectionTitle="Pet Information">
            <div>
                <FieldLabel text={"Pet's Name"}/>
                <TextInput 
                    placeholder="Enter the pet's name"
                    value={formData.name}
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
                            ${formData.species === text ? "bg-green-400 border-green-300" : "bg-white border-gray-400"}`}
                            onClick={() => setFormData(prevFormData => ({...prevFormData, species: text, breed: "", customBreed: ""}))}
                        >
                            {text}
                        </button>
                    ))}
                </div>
            </div>

            {formData.species && (
                <div>
                    <FieldLabel text={"Breed"}/>
                    <SelectionInput
                        value={formData.breed}
                        onChange={(e) => setFormData(prevFormData => ({...prevFormData, breed: e.target.value, customBreed: ""}))}
                    >
                        <option value="" disabled>Select the pet's breed</option>
                        {(breeds[formData.species]).map((breed, idx) => (
                            <option key={idx} value={breed}>{breed}</option>
                        ))}
                    </SelectionInput>
                </div>
            )}

            {formData.breed === "Other" && (
                <div>
                    <FieldLabel text="Custom Breed"/>
                    <TextInput 
                        placeholder="Enter the pet's breed"
                        value={formData.customBreed}
                        onChange={(e) => setFormData(prevFormData => ({...prevFormData, customBreed: e.target.value}))}
                    />
                </div>
            )}

            <div>
                <FieldLabel text={"Age"}/>
                <div className="flex flex-row items-center">
                    <TextInput
                        placeholder="Enter the pet's age"
                        value={formData.age}
                        onChange={(e) => setFormData(prevFormData => ({...prevFormData, age: e.target.value}))}
                        inputType={"number"}
                    />
                </div>
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
    );
}

function LocationInformation({ formData, setFormData }) {

    const states = ["NY", "NJ", "CT", "PA", "MA", "CA", "TX", "FL", "IL", "WA",
                    "OH", "GA", "NC", "VA", "AZ", "CO", "OR", "WA", "MN", "MO"];

    return (
        <Section sectionTitle={"Location"}>
            <div>
                <FieldLabel text={"City"}/>
                <TextInput
                    placeholder="Enter the city of where the pet is located"
                    value={formData.city}
                    onChange={(e) => setFormData(prevFormData => ({...prevFormData, city: e.target.value}))}
                    inputType={"text"}
                />
            </div>

            <div>
                <FieldLabel text={"State"}/>
                <SelectionInput
                    value={formData.state}
                    onChange={(e) => setFormData(prevFormData => ({...prevFormData, state: e.target.value}))}
                >
                    <option value="" disabled>Select a state</option>
                    {states.map((state, idx) => (
                        <option key={idx} value={state}>{state}</option>
                    ))}
                </SelectionInput>
            </div>

            <div>
                <FieldLabel text={"Street Address"}/>
                <TextInput
                    placeholder="Enter the street address of where the pet is located"
                    value={formData.address}
                    onChange={(e) => setFormData(prevFormData => ({...prevFormData, address: e.target.value}))}
                    inputType={"text"}
                />
            </div>
        </Section>
    )
}

function ContactInformation({ formData, setFormData, checkUserInfo }) {
    return (
        <Section sectionTitle="Contact Information">
            <div>
                <FieldLabel text={"Your Name / Animal Shelter Name"}/>
                <TextInput
                    placeholder="Please Enter Your Name or the Animal Shelter Name"
                    value={formData.contactName}
                    onChange={(e) => setFormData(prevFormData => ({...prevFormData, contactName: e.target.value}))}
                    inputType={"text"}
                />
            </div>

            <div>
                <FieldLabel text={"Email Address"}/>
                <TextInput
                    placeholder="Please Enter Your Email Address"
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
                    placeholder="Please Enter Your Phone Number"
                    value={formData.phone}
                    onChange={(e) => setFormData(prevFormData => ({...prevFormData, phone: e.target.value}))}
                    inputType={"tel"}
                />

                {checkUserInfo.isValidPhoneFormat === false &&
                    <p className="text-xs font-semibold text-red-500 mt-1">
                        Please enter a valid phone number
                    </p>
                }
            </div>
        </Section>
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
            }));
        }
    }

    return (
        <Section sectionTitle={"Pet Image"}>
            <p className="text-xs">
                Please submit a clear photo of the pet
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
    )
}


export default function AdoptionForm() {
    const navigate = useNavigate();

    const handleNavigation = () => {
        navigate("/AdoptPet")
    }

    const [formData, setFormData] = useState({
        name: "", species: "", breed: "", customBreed: "", age: "", notes: "",
        address: "", city: "", state: "",
        contactName: "", email: "", phone: "",
        image: "", imageUrl: "", imageFile: null,
    });

    const [checkUserInfo, setCheckUserInfo] = useState({
        isValidEmailFormat: null,
        isValidPhoneFormat: null
    })

    const isFormFilled = 
        formData.name && formData.species && formData.breed && formData.age && formData.address &&
        formData.city && formData.state && formData.image && formData.contactName && 
        (formData.email || formData.phone) &&
        (formData.breed !== "Other" || formData.customBreed);

    
    const isUserInfoValid = () => {
        
        const emailValid = formData.email ? isValidEmail(formData.email) : null;
        const phoneValid = formData.phone ? isValidPhoneNumber(formData.phone) : null;

        setCheckUserInfo({
            isValidEmailFormat: emailValid,
            isValidPhoneFormat: phoneValid
        })
        
        if (emailValid === false && phoneValid !== true) return false;
        if (phoneValid === false && emailValid !== true) return false;

        return true;
    };


    return (
        <div className="px-6 py-8 min-h-screen space-y-5">
            <div className="flex flex-col items-center justify-between rounded-3xl
            bg-white shadow-md mt-5 py-5">
                <h1 className="font-bold text-xl">
                    Put a Pet Up for Adoption
                </h1>
                <p className="text-xs md:text-sm mt-2">
                    Please fill in the details to help the pet find a new home
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="flex flex-col gap-3">
                    <PetInformation formData={formData} setFormData={setFormData}/>
                    <LocationInformation formData={formData} setFormData={setFormData}/>
                </div>

                <div className="flex flex-col gap-3">
                    <ContactInformation formData={formData} setFormData={setFormData} checkUserInfo={checkUserInfo}/>
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
    )
}