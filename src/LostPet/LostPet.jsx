
import Card from "../components/card"
import styles from "./modules/LostPet.module.css"

import { useState } from "react"
import { useNavigate } from "react-router-dom";

function SearchBar() {
    const [userInput, setUserInput] = useState('');

    const handleInputChange = (e) => {
        setUserInput(e.target.value);
    }

    return (
        <div className={styles.searchContainer}>
            <div className={styles.searchInput}>
                <input
                    type="text"
                    placeholder="Search"
                    value={userInput}
                    onChange={handleInputChange}
                />


                <img src="./searchBarIcons/searchIcon.png" alt="magnifying glass"/>
            </div>

            <button className={styles.filterButton}>
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
        "golden-retriever", "cat", "golden-retriever", "golden-retriever",
        "golden-retriever", "golden-retriever", "cat", "cat"
    ]

    return (
        <div className={styles.lostPetContainer}>

            <h2 className={styles.title}>
                <div className={styles.titleContainer}>Current Lost Pets</div>
            </h2>

            <SearchBar/>

            <button 
                className={styles.reportButton}
                onClick={handleNavigation}
            >
                Create Report
            </button>
            
            {/* Filler image cards. Replace when database is set up */}
            <div className={styles.cardContainer}>
                {
                    currentLostPets.map((missingPet, idx) => (
                        <Card
                            key={idx}
                            img={`./animalImgs/${missingPet}.webp`}
                            alt={`${missingPet} image`}
                        />
                    ))
                }
            </div>
        </div>
    )
}