

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

function SearchAndFilterUI({ setSearchQuery, setPetFilter }) {
    return (
        <div className={styles.SearchAndFilter}>
            <SearchBar setSearchQuery={setSearchQuery}/>
            <FilterUI setPetFilter={setPetFilter}/>
        </div>
    )
}

function SearchBar({ setSearchQuery }) {

    const [userSearch, setUserSearch] = useState("");

    const handleUserSearchChange = (e) => {
        setUserSearch(e.target.value);
    }

    const handleSearchQueryChange = (e) => {
        e.preventDefault();
        setSearchQuery(userSearch)
    }

    return (
        <div className={styles.searchContainer}>
            <div className={styles.searchInput}>
                <form onSubmit={handleSearchQueryChange}>
                    <input
                        type="text"
                        placeholder="Search by name or breed"
                        value={userSearch}
                        onChange={handleUserSearchChange}
                    />
                </form>

                <img 
                    src="./searchBarIcons/searchIcon.png" 
                    alt="magnifying glass"
                    onClick={handleSearchQueryChange}
                />
            </div>
        </div>
    )
}

function FilterUI({ setPetFilter }) {
    const [showFilters, setShowFilters] = useState(false);

    const handlePetFilterChanger = (selectedFilter) => {
        setPetFilter(selectedFilter);
    }

    return (
        <div className={styles.filterButtonContainer}>
            <button 
                className={styles.filterButton}
                onClick={() => setShowFilters(!showFilters)}
            >
                Filter
            </button>

            {showFilters && (
                <div className={styles.filterDisplayContainer}> 
                    <button onClick={() => handlePetFilterChanger('none')}>Reset</button>
                    <button onClick={() => handlePetFilterChanger('dog')}> Dogs</button>
                    <button onClick={() => handlePetFilterChanger('cat')}>Cats</button>
                </div>
            )}
        </div>
    )
}

export default function AdoptPet() {
    const [searchQuery, setSearchQuery] = useState('');
    const [petFilter, setPetFilter] = useState("none");
    
    const displayedAdoptablePets = AdoptablePets.filter((adoptablePet) => {
        const query = searchQuery.toLowerCase();

        const matchesSearch = (
            searchQuery == "" || 
            adoptablePet.name.toLowerCase().includes(query) || 
            adoptablePet.breed.toLowerCase().includes(query)
        );

        const matchesFilter = (
            petFilter == "none" ||
            adoptablePet.species.toLowerCase() == petFilter
        );

        return matchesSearch && matchesFilter;
    });

    return (
        <div className={styles.adoptPetContainer}>

            <h2 className={styles.title}>
                <div className={styles.titleContainer}>Adopt Pet</div>
            </h2>

            <SearchAndFilterUI
                setSearchQuery={setSearchQuery}
                setPetFilter={setPetFilter}
            />
            
            {/* Filler image cards. Replace when database is set up */}
            <div className={styles.cardContainer}>
                {
                    displayedAdoptablePets.map((adoptablePet) => {
                        return <Card key={adoptablePet.id} pet={adoptablePet}/> 
                    })
                }
            </div>
        </div>
    )
}