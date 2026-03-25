

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
                    <span className={styles.petAgeText}>{pet.age} years old</span>
                </div>
                <div className={styles.petTypeInfoContainer}>
                    <span className={styles.petSpeciesText}>{pet.breed}</span>
                    <span className={styles.petBreedText}>{pet.species}</span>
                </div>
                <div className={styles.petLocationContainer}>
                    <span>{`${pet.city}, ${pet.state}`}</span>
                    <span>{`${pet.address}`}</span>
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

function SearchAndFilterUI({ setSearchQuery, setPetFilter, setStateFilter }) {
    return (
        <div className={styles.SearchAndFilter}>
            <SearchBar setSearchQuery={setSearchQuery}/>
            <FilterUI setPetFilter={setPetFilter} setStateFilter={setStateFilter}/>
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

function FilterUI({ setPetFilter, setStateFilter }) {
    const [showFilters, setShowFilters] = useState(false);
    const [selectedPetFilter, setSelectedPetFilter] = useState("all");
    const [selectedStateFilter, setSelectedStateFilter] = useState("all");


    const handlePetFilterChanger = (selectedFilter) => {
        setSelectedPetFilter(selectedFilter);
    }

    const handlePetStateChanger = (selectedState) => {
        setSelectedStateFilter(selectedState)
    }

    const handleResetFilters = () => {
        setSelectedPetFilter("all");
        setSelectedStateFilter("all");
    }

    const handleApplyFilters = () => {
        setPetFilter(selectedPetFilter);
        setStateFilter(selectedStateFilter);
        setShowFilters(false)
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

                    <div className={styles.filterHeader}>
                        <span>Filters</span>
                        <button 
                            className={styles.filterResetButton}
                            onClick={handleResetFilters}
                        >
                            Reset all
                        </button>
                    </div>

                    <div className={styles.filterSection}>
                        <div className={styles.filterByTitle}>
                            Animal Type
                        </div>
                        <div className={styles.filterButtonsContainer}>
                            <button 
                                onClick={() => handlePetFilterChanger('all')}
                                className={`${selectedPetFilter == "all" ? styles.activeFilter : styles.inactiveFilter}`}
                            >
                                All
                            </button>
                            <button 
                                onClick={() => handlePetFilterChanger('dog')}
                                className={`${selectedPetFilter == "dog" ? styles.activeFilter : styles.inactiveFilter}`}
                            > 
                                Dogs
                            </button>
                            <button 
                                onClick={() => handlePetFilterChanger('cat')}
                                className={`${selectedPetFilter == "cat" ? styles.activeFilter : styles.inactiveFilter}`}
                            >
                                Cats
                            </button>
                        </div>
                    </div>

                    <div className={styles.sectionDivider}/>

                    <div className={styles.filterSection}>
                        <div className={styles.filterByTitle}>
                            State
                        </div>
                        <div className={styles.filterButtonsContainer}>
                            <button 
                                onClick={() => handlePetStateChanger('all')}
                                className={`${selectedStateFilter == "all" ? styles.activeFilter : styles.inactiveFilter}`}
                            >
                                All
                            </button>
                            <button 
                                onClick={() => handlePetStateChanger('NY')}
                                className={`${selectedStateFilter == "NY" ? styles.activeFilter : styles.inactiveFilter}`}
                            > 
                                New York
                            </button>
                            <button 
                                onClick={() => handlePetStateChanger('NJ')}
                                className={`${selectedStateFilter == "NJ" ? styles.activeFilter : styles.inactiveFilter}`}
                            >
                                New Jersey
                            </button>
                        </div>
                    </div>

                    <button 
                        className={styles.applyFilterButton}
                        onClick={handleApplyFilters}
                    >
                        Apply Filters
                    </button>
                </div>
            )}
        </div>
    )
}

export default function AdoptPet() {
    const [searchQuery, setSearchQuery] = useState("");
    const [petFilter, setPetFilter] = useState("all");
    const [stateFilter, setStateFilter] = useState("all")
    
    const displayedAdoptablePets = AdoptablePets.filter((adoptablePet) => {
        const query = searchQuery.toLowerCase();

        const matchesSearch = (
            searchQuery == "" || 
            adoptablePet.name.toLowerCase().includes(query) || 
            adoptablePet.breed.toLowerCase().includes(query)
        );

        const matchesPetFilter = (
            petFilter == "all" ||
            adoptablePet.species.toLowerCase() == petFilter
        );

        const matchesStateFilter = (
            stateFilter === "all" ||
            adoptablePet.state == stateFilter
        )

        return matchesSearch && matchesPetFilter && matchesStateFilter;
    });

    return (
        <div className={styles.adoptPetContainer}>

            <h2 className={styles.title}>
                <div className={styles.titleContainer}>Adopt Pet</div>
            </h2>

            <SearchAndFilterUI
                setSearchQuery={setSearchQuery}
                setPetFilter={setPetFilter}
                setStateFilter={setStateFilter}
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