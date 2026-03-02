
import { useState, useEffect } from "react"

import animalImgs from "./animalImgPath.json"
import styles from "./modules/PetAdoptionHomePage.module.css"

function ImageCarousel() {
    const [currentIdx, setCurrentIdx] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIdx(pCurrentIdx => 
                pCurrentIdx === animalImgs.length - 1 ? 0 : pCurrentIdx + 1
            );
        }, 5000)

        return () => clearInterval(interval);
    }, []);

    return (
        <div className={styles.imageContainer}>
            <img 
                src={animalImgs[currentIdx]} 
                alt="animal image"
                className={styles.carouselImage}
            />
        </div>
    )
}

function ReportButtonCard({ img, title, buttonText }) {
    return (
        <div className={styles.buttonContainer}>
            <div className={styles.buttonImageContainer}>
                <img 
                    src={img}
                    alt="button image"
                    className={styles.buttonImage}
                />
            </div>

            <div className={styles.textAndButton}>
                <h2>{title}</h2>
                <button className={styles.button}>{buttonText}</button>
            </div>
        </div>
    )
}


export default function PetAdoptionHomePage() {
    return (
        <div className={styles.homePageContainer}>
            <div>
                <ImageCarousel/>
            </div>

            <div className={styles.reportContainer}>
                <ReportButtonCard
                    img="./buttonImgs/lostOutline.png"
                    title="Lost a Pet?"
                    buttonText="Report Missing Pet"
                />

                <ReportButtonCard
                    img="./buttonImgs/adoptOutline.png"
                    title="Looking to Adopt?"
                    buttonText="Browse Adoptable Pets"
                />

                <ReportButtonCard
                    img="./buttonImgs/strayOutline.png"
                    title="Found a Stray?"
                    buttonText="Report Stray Animal"
                />
            </div>
        </div>
    )
}