
import styles from "./card.module.css"
import { useNavigate } from "react-router-dom"

export default function Card({ img }) {
    const navigate = useNavigate();

    const nextPage = () => {
        navigate("/PetDetails")
    }

    return (
        <div className={styles.cardContainer}>
            <img 
                src={img} 
                alt="animal image"
                className={styles.cardImg}
            />
        
            <button 
                className={styles.cardButton}
                onClick={nextPage}
            >
                View Details
            </button>
        </div>
    )
}