

import styles from "./AdoptPet.module.css"

import AdoptablePets from "./AdoptablePets.json"

import { useState } from "react"


function Card({ pet }) {
    return (
        <div className={styles.animalCard}>
            <div className={styles.imageContainer}>
                <img src={pet.img} alt="pet image"/>
            </div>
            <div className={styles.animalCardBody}>
                <div className={styles.petNameAgeContainer}>
                    <span className={styles.petNameText}>{pet.name}</span>
                    <span className={styles.petAgeText}>{pet.age}</span>
                </div>
                <div className={styles.petTypeInfoContainer}>
                    <span className={styles.petSpeciesText}>{pet.breed}</span>
                    <span className={styles.petBreedText}>{pet.species}</span>
                </div>
                <div className={styles.petLocationContainer}>
                    <span>{pet.location}</span>
                </div>
                <div className={styles.petNotesContainer}>
                    <span>
                        {pet.notes}
                    </span>
                </div>
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

export default function AdoptPet() {
    return (
        <div className={styles.adoptPetContainer}>

            <h2 className={styles.title}>
                <div className={styles.titleContainer}>Adopt Pet</div>
            </h2>

            <SearchBar/>
            
            {/* Filler image cards. Replace when database is set up */}
            <div className={styles.cardContainer}>
                {
                    AdoptablePets.map((adoptablePet) => (
                        <Card key={adoptablePet.id} pet={adoptablePet}/>
                    ))
                }
            </div>
        </div>
    )
}