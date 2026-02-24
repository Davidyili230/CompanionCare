
import styles from "./card.module.css"

export default function Card({ img }) {
    return (
        <div className={styles.cardContainer}>
            <img 
                src={img} 
                alt="animal image"
                className={styles.cardImg}
            />
        
            <button className={styles.cardButton}>
                View Details
            </button>
        </div>
    )
}