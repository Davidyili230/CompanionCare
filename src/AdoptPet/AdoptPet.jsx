
import Card from "../components/card"
import styles from "./AdoptPet.module.css"

import { useState } from "react"

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

            <button className={styles.addPetButton}>
                Add Pet
            </button>
            
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