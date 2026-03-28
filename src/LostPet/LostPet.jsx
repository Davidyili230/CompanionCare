
import styles from "./modules/LostPet.module.css"

import { useState } from "react"
import { useNavigate } from "react-router-dom";

function MissingPetCard({ img }) {
    const [isCardFlipped, setIsCardFlipped] = useState(false);

    const handleCardFlip = () => {
        setIsCardFlipped(!isCardFlipped);
    }

    return (
        <div className={styles.displayedCard}>
            <div className={`${styles.innerCard} ${isCardFlipped ? styles.flipped : ""}`}>
                <div className={styles.frontCard}>
                    <CardFront img={img} flipCard={handleCardFlip}/>
                </div>

                <div className={styles.backCard}>
                    <CardBack flipCard={handleCardFlip}/>
                </div>
            </div>
        </div>
    )
}

function CardFront({ img, flipCard }) {
    return (
        <div className={styles.cardFrontContainer}>
            <div className={styles.cardFrontImgContainer}>
                <img 
                    src={img}
                    alt="Pet Image"
                />
            </div>

            <div className={styles.cardFrontInfo}>
                <p className={styles.petName}>{`Fluffy`}</p>

                <div className={styles.divider}/>

                <div className={styles.petInfo}>
                    <label>Breed: </label>
                    <span>{`Golden Retriever`}</span>
                </div>

                <div className={styles.petInfo}>
                    <label>Last Seen:</label>
                    <span>{`3/9/2026`}</span>
                </div>
    
                <div className={styles.petNoteContainer}>
                    <label className={styles.petNotes}>Notes: </label>
                    <span>
                        Lorem ipsum dolor sit, amet consectetur adipisicing elit. 
                        Eveniet eius omnis quisquam numquam nulla non repellat totam blanditiis. 
                        Magnam velit dicta voluptates voluptate commodi a recusandae deserunt soluta necessitatibus excepturi.
                    </span>
                </div>

                <div className={styles.buttonContainer}>
                    <button onClick={flipCard}>
                        More Information
                    </button>
                </div>
            </div>
        </div>
    )
}

function CardBack({ flipCard }) {
    return (
        <div className={styles.cardBackContainer}>
            <div className={styles.cardBackInfo}>
                <h2>Owner Information</h2>
                
                <div className={styles.ownerInfo}>
                    <label>Name: </label>
                    <span>{`John Smith`}</span>
                </div>
                
    
                <div className={styles.ownerInfo}>
                    <label>Email Address: </label>
                    <span>{`PlaceHolder@gmail.com`}</span>
                </div>
    
                <div className={styles.ownerInfo}>
                    <label>Phone Number: </label>
                    <span>{`123-456-7890`}</span>
                </div>
            </div>

            <div className={styles.cardBackButtonContainer}>
                <button onClick={flipCard}>
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
        "golden-retriever", "cat", "golden-retriever", "kitten",
        "golden-retriever", "golden-retriever", "kitten", "cat"
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