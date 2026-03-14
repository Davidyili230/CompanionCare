
import styles from "./modules/PetDetails.module.css"

 function PetInfo() {
    return (
        <div className={styles.infoCard}>
            <h2>Pet Information</h2>

            <p>
                <label>Name: </label>
                <span>{"Place holder name"}</span>
            </p>

            <p>
                <label>Species: </label>
                <span>{"Place holder species"}</span>
            </p>


            <p>
                <label>Date Last Seen: </label>
                <span>{"Place holder date"}</span>
            </p>
            
            <p>
                <label>Notes from Owner: </label>
                <span>{"Place holder information"}</span>
            </p>
        </div>
    )
}

function OwnerInfo() {
    return (
        <div className={styles.infoCard}>
            <h2>Owner Information</h2>
            
            <p>
                <label>Name: </label>
                <span>{"placeholder name"}</span>
            </p>
         

            <p>
                <label>Email Address: </label>
                <span>{"placeholder email"}</span>
            </p>

            <p>
                <label>Phone Number: </label>
                <span>{"placeholder number"}</span>
            </p>
        </div>
    )
}

export default function PetDetails() {
    return (
        <div className={styles.petDetailsContainer}>
            <h2 className={styles.title}>
                <div>Details</div>
            </h2>

            <div className={styles.detailContainer}>
                {/* It is hard coded to show cat image. Update when database is available */}
                <div className={styles.imgContainer}>
                    <img src="./animalImgs/cat.webp" alt="animal image"/>
                </div>

                <div className={styles.infoContainer}>
                    <PetInfo/>
                    <OwnerInfo/>
                </div>
            </div>
        </div>
    )
}