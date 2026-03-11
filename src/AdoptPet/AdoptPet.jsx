
import styles from "./AdoptPet.module.css"

import { useState } from "react"


function Card({ img }) {
    return (
        <div className={styles.animalCard}>
            <div className={styles.imageContainer}>
                <img src={img} alt="pet image"/>
            </div>
            <div className={styles.animalCardBody}>
                <div className={styles.petNameAgeContainer}>
                    <span className={styles.petNameText}>Fluffy</span>
                    <span className={styles.petAgeText}>1 years old</span>
                </div>
                <div className={styles.petTypeInfoContainer}>
                    <span className={styles.petSpeciesText}>Golden Retriever</span>
                    <span className={styles.petBreedText}>Dog</span>
                </div>
                <div className={styles.petLocationContainer}>
                    <span>Location</span>
                </div>
                <div className={styles.petNotesContainer}>
                    <span>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                        Aut dolore necessitatibus odio labore sed iusto dolor in tempore quibusdam,
                        magni saepe quod voluptatibus maiores, aliquam commodi ducimus blanditiis, 
                        architecto distinctio?
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
                <Card img="./animalImgs/golden-retriever.webp"/>
                <Card img="./animalImgs/cat.webp"/>
                <Card img="./animalImgs/golden-retriever.webp"/>
                <Card img="./animalImgs/golden-retriever.webp"/>
                <Card img="./animalImgs/golden-retriever.webp"/>
                <Card img="./animalImgs/golden-retriever.webp"/>
                <Card img="./animalImgs/cat.webp"/>
                <Card img="./animalImgs/cat.webp"/>
                <Card img="./animalImgs/cat.webp"/>
                <Card img="./animalImgs/cat.webp"/>
                <Card img="./animalImgs/golden-retriever.webp"/>
                <Card img="./animalImgs/golden-retriever.webp"/>
            </div>
        </div>
    )
}