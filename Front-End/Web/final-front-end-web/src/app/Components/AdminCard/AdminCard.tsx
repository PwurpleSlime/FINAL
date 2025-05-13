import styles from "./adminCard.module.css"
export function AdminCard(props:{adminName:string}){
    const {adminName} = props
    return (
        <>
        <div className={styles.page}>
            <h1>{adminName}</h1>
        </div>
        </>
    )
}