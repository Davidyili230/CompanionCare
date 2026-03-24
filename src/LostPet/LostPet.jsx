

import { useState } from "react"
import { useNavigate } from "react-router-dom";

function MissingPetCard({ img }) {
    const [isCardFlipped, setIsCardFlipped] = useState(false);

    const handleCardFlip = () => {
        setIsCardFlipped(!isCardFlipped);
    }

    return (
        <div className="w-85 h-120 perspective">
            <div 
                className="relative w-full h-full transition-transform duration-700"
                style={{
                    transformStyle: "preserve-3d",
                    transform: isCardFlipped ? "rotateY(180deg)" : "rotateY(0deg)"
                }}
            >
                <div className="absolute w-full h-full backface-hidden">
                    <CardFront img={img} flipCard={handleCardFlip}/>
                </div>

                <div 
                    className="absolute w-full h-full backface-hidden"
                    style={{ transform: "rotateY(180deg" }}
                >
                    <CardBack flipCard={handleCardFlip}/>
                </div>
            </div>
        </div>
    );
}

function CardFront({ img, flipCard }) {
    return (
        <div 
            className="flex flex-col bg-white border rounded-lg border-red-500 transition-all duration-1000 ease-in-out 
            hover:-translate-y-1.25 hover:shadow-2xl overflow-hidden h-full"
        >
            <div className="overflow-hidden h-52.5">
                <img 
                    src={img}
                    alt="Pet Image"
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="px-2.5 py-2 flex-1">
                <div>
                    <span className="font-bold text-2xl">Pet Name</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-semibold text-xl">Breed </span>
                    <span>Age</span>
                </div>

                <div className="mb-1.5">
                    <span>Species</span>
                </div>

                <div className="mb-1.5">
                    <span>Date last Seen</span>
                </div>

                <div className="border-t border-t-[rgb(186, 146, 146)] pt-1 max-h-20 overflow-y-scroll ">
                    <span className="text-[14px]">
                        Lorem ipsum dolor sit, amet consectetur adipisicing elit. 
                        Eveniet eius omnis quisquam numquam nulla non repellat totam blanditiis. 
                        Magnam velit dicta voluptates voluptate commodi a recusandae deserunt soluta necessitatibus excepturi.
                    </span>
                </div>
            </div>

            <div className="flex items-center justify-center mt-2.5">
                <button 
                    onClick={flipCard}
                    className="rounded-lg border-0 text-white font-bold bg-[#f16b6b] px-2.5 py-1.5 cursor-pointer 
                    transition-colors duration-300 ease-in-out w-4/5 mb-5 hover:bg-[#f61c1c]"
                >
                    Contact Owner
                </button>
            </div>
        </div>
    )
}

function CardBack({ flipCard }) {
    return (
        <div 
            className="bg-white border rounded-lg border-red-600 transition-all duration-1000 ease-in-out cursor-pointer 
            hover:-translate-y-1.25 hover:shadow-2xl overflow-hidden h-full flex flex-col justify-between p-4"
        >
            <div>
                
                <h2 className="text-2xl font-bold mb-10 text-center underline mt-5">Owner Information</h2>
                
                <div className="space-y-2 text-md">
                    <div className="flex justify-center gap-1">
                        <label className="font-bold">Name: </label>
                        <span>John Smith</span>
                    </div>

                    <div className="flex justify-center gap-1">
                        <label className="font-bold">Email Address: </label>
                        <span>PlaceHolder@gmail.com</span>
                    </div>

                    <div className="flex justify-center gap-1">
                        <label className="font-bold">Phone Number: </label>
                        <span>123-456-7890</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-center mt-2.5">
                <button 
                    onClick={flipCard}
                    className="rounded-lg border-0 text-white font-bold bg-[#f16b6b] px-2.5 py-1.5 cursor-pointer 
                    transition-colors duration-300 ease-in-out w-4/5 mb-5 hover:bg-[#f61c1c]"
                >
                    Back
                </button>
            </div>
        </div>
    )
}

function SearchBar() {
    const [userInput, setUserInput] = useState('');

    const handleInputChange = (e) => {
        setUserInput(e.target.value);
    }

    return (
        <div className="flex justify-center flex-col items-center gap-2.5 mb-5">
            <div className="flex items-center rounded-3xl px-2.5 py-1.25 border bg-white hover:shadow-[0_2px_6px_rgb(113,111,111)]">
                <input
                    type="text"
                    placeholder="Search"
                    value={userInput}
                    onChange={handleInputChange}
                    className="border- text-base p-1.5 outline-0 w-112.5"
                />


                <img 
                    src="./searchBarIcons/searchIcon.png" 
                    alt="magnifying glass"
                    className="w-6.25 h-6.25 cursor-pointer ml-1.25"
                />
            </div>

            <button 
                className="border-0 rounded-3xl bg-[#FFB6B6] px-7 py-2.5 font-bold 
                cursor-pointer transition-colors duration-300 ease-in-out hover:bg-[#d28e8e]"
            >
                Filter
            </button>
        </div>
    )
}

export default function LostPet() {
    const navigate = useNavigate();

    const handleNavigation = () => {
        navigate("/LostPetReport");
    }

    // to be replaced with actual data from database
    const currentLostPets = [
        "golden-retriever", "cat", "cat", "kitten",
        "golden-retriever", "golden-retriever", "kitten", "cat"
    ]

    return (
        <div className="bg-[#FFF9F0] min-h-screen pb-12.5 pt-5">

            <h2 className="text-center text-2xl mb-7">
                <div 
                    className="inline-block bg-[rgb(238,235,235)] px-7.5 py-2.5 rounded-md font-bold"
                >
                    Current Lost Pets
                </div>
            </h2>

            <SearchBar/>

            <button 
                className="text-white bg-[#FC1818] rounded-full border-0 px-5 py-3 font-bold cursor-pointer
                ml-5 transitioin-all duration-300 ease-in-out hover:bg-[#c71515]"
                onClick={handleNavigation}
            >
                Create Report
            </button>
            
            {/* Filler image cards. Replace when database is set up */}
            <div className="grid grid-cols-4 gap-6 mt-8">
                {
                    currentLostPets.map((missingPet, idx) => (
                        <MissingPetCard
                            key={idx}
                            img={`./animalImgs/${missingPet}.webp`}
                        />
                    ))
                }
            </div>
        </div>
    )
}