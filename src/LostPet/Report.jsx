
import styles from "./Report.module.css"

function PetInformation() {
    return (
        <div className={styles.petInfoContainer}>
            <h2> Pet Information </h2>

            <label>Pet's Name</label>
            <input type="text" placeholder="Enter your pet's name"/>

            <label>Species</label>
            <input type="text" placeholder="Enter your pet's species"/>

            <label>Date Last Seen</label>
            <input type="date"/>

            <label>Additional Information</label>
            <textarea placeholder="Any additional information about your pet?"/>
        </div>
    )
}

function OwnerInformation() {
    return (
        <div className={styles.userInfoContainer}>
            <h2>Owner Contact Information</h2>

            <label>Name </label>
            <input type="text" placeholder="Enter your name"/>
            
            <label>Email Address</label>
            <input type="email" placeholder="Enter your email"/>

            <label>Phone Number</label>
            <input type="tel" placeholder="Enter your phone number"/>
        </div>
    )
}

function ImageUpload() {
    return (
        <div className={styles.imgContainer}>
            <h2>Upload Image</h2>
            <img 
                src="./cameraIcon.png" 
                alt="camera"
                className={styles.img}
            />
        </div>
    )
}


export default function LostPetReport() {
    return (
        <div className={styles.pageContainer}>
            <h1 className={styles.title}>
                Lost Pet Report
            </h1>

            <p className={styles.subtext}>
                We are sorry that your pet is missing. We hope that you will be able to bring them back home soon
            </p>

            <div className={styles.reportContent}>
                <div className={styles.leftContent}>   
                    <PetInformation/>
                    <OwnerInformation/>
                </div>
                <div className={styles.rightContent}>
                    <ImageUpload/>
                </div>
            </div>
            
            <button className={styles.reportButton}>
                Create Report
            </button>
        </div>
    )
}