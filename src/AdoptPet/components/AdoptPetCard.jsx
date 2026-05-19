

import { useState } from "react";
import { deleteReport } from "../dbAdoptAccess/deleteReport";
import { getUserAdoptionReport } from "../dbAdoptAccess/getAdoptionReports";


export default function AdoptPetCard({ reportData, isCurrentTabAllReports, setReports }) {
    const [isCardFlipped, setIsCardFlipped] = useState(false);

    const handleCardFlip = () => {
        setIsCardFlipped(!isCardFlipped);
    }

    return (
        <div className="w-full h-105 perspective">
            <div
                className="relative w-full h-full transition-transform duration-700"
                style={{
                    transformStyle: "preserve-3d",
                    transform: isCardFlipped ? "rotateY(180deg)" : "rotateY(0deg)"
                }}
            >
                <div className="absolute w-full h-full backface-hidden"
                >
                    <CardFront reportData={reportData} flipCard={handleCardFlip} isCurrentTabAllReports={isCurrentTabAllReports} setReports={setReports}/>
                </div>

                <div 
                    className="absolute w-full h-full backface-hidden"
                    style={{ transform: "rotateY(180deg)" }}
                >
                    <CardBack reportData={reportData} flipCard={handleCardFlip}/>
                </div>

            </div>
        </div>
    )
}

function CardFront({ reportData, flipCard, isCurrentTabAllReports, setReports }) {
    async function handleDeleteAdoptionReport(id, imageUrl) {
        try {
            await deleteReport(id, imageUrl);
            const newReports = await getUserAdoptionReport();
            setReports(newReports);
        } catch (error) {
            console.log("Error deleting and getting new reports", error);
        }
    }

    return (
        <div className="flex flex-col shadow-md rounded-2xl overflow-hidden bg-white
        transition-all duration-300 hover:translate-y-1.25 hover:shadow-xl">
            <div className="overflow-hidden h-52.5 relative shrink-0">
                {/* the default report uses .img file the actual report uses .image */}
                <img
                    src={reportData.image || reportData.img}
                    alt="Pet Image"
                    className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2.5 left-3 font-bold text-sm bg-gray-300 rounded-2xl px-1.5 py-0.5">
                    {reportData.name}
                </span>

                <span className="absolute bottom-2.5 right-3 font-semibold text-sm bg-gray-300 rounded-full px-1.5 py-0.5">
                    {reportData.age} years old
                </span>

                {isCurrentTabAllReports === false && (
                    <button
                        className="absolute top-2 right-2 rounded-lg border-0 text-white font-bold bg-red-400 px-2.5 py-1.5 cursor-pointer 
                        transition-colors duration-300 ease-in-out mb-5 hover:bg-red-600"
                        onClick={() => handleDeleteAdoptionReport(reportData.id, reportData.image)}
                    >
                        Delete
                    </button>
                )}
            </div>

            <div className="flex flex-col px-3 pt-2 gap-2">
                <div>
                    <p className="font-bold text-sm">{reportData.breed}</p>
                    <p className="text-xs">{reportData.species}</p>
                </div>

                <div>
                    <span className="px-1.5 py-0.5 bg-green-300 rounded-full  text-sm">
                        {reportData.city}, {reportData.state}
                    </span>
                </div>

                <div className="border-t">
                    <p className="overflow-scroll text-sm pt-2 h-20">
                        {reportData.notes}
                    </p>
                </div>

                <button 
                    className="border rounded-2xl text-sm text-white font-bold bg-green-500
                    py-2 mb-3 transition-all duration-300 hover:bg-green-600 cursor-pointer"
                    onClick={flipCard}
                >
                    Contact Center
                </button>
            </div>
        </div>
    )
}

function CardBack({ reportData, flipCard }) {
    return (
        <div 
            className="bg-white rounded-2xl border-none transition-all duration-1000 ease-in-out 
            cursor-pointer hover:-translate-y-1.25 hover:shadow-2xl overflow-hidden h-full 
            flex flex-col p-4 gap-5 shadow-md"
        >

            <div className="flex flex-row items-center gap-5 border-b pb-5">
                <img
                    src={reportData.image || reportData.img}
                    alt={`${reportData.name}'s image`}
                    className="w-14 h-14 rounded-full object-cover"
                />

                <div>
                    <p className="font-bold">{reportData.name}</p>
                    <p className="text-xs">{reportData.customBreed == "" ? reportData.breed : reportData.customBreed}</p>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <p className="font-bold text-sm">Contant Information</p>
                
                <div className="bg-green-100 rounded-xl px-4 py-2.5 text-sm w-full">
                    <label className="font-bold text-xs">Name: </label>
                    <span>{reportData.contactName}</span>
                </div>

                {reportData.email != "" &&
                    <div className="bg-green-100 rounded-xl px-4 py-2.5 text-sm w-full">
                        <label className="font-bold text-xs">Email Address: </label>
                        <span>{reportData.email}</span>
                    </div>
                }

                {reportData.phone != "" &&
                    <div className="bg-green-100 rounded-xl px-4 py-2.5 text-sm w-full">
                        <label className="font-bold text-xs">Phone Number: </label>
                        <span>{reportData.phone}</span>
                    </div>
                }

                <div className="flex items-center justify-center mt-10">
                    <button 
                        onClick={flipCard}
                        className="rounded-lg border-0 bg-[#f4a261] hover:bg-[#e76f51] text-white font-bold px-2.5 py-1.5 
                        cursor-pointer transition-colors duration-300 ease-in-out w-4/5 mb-5"
                    >
                        Back
                    </button>
                </div>
            </div>
        </div>
    )
}
