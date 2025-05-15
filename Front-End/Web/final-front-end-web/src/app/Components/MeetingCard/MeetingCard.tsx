import styles from "./MeetingCard.module.css"
export function MeetingCard(props:{hostName:string, timeStart: string, dateStart: string, timeEnd: string | undefined, address: string}){
    const {hostName, timeStart, dateStart, timeEnd, address} = props

    return(
        <div className={styles.page}>
            <h1>{hostName}</h1>
            <h1>{timeStart}</h1>
            <h1>{dateStart}</h1>
            <h1>{timeEnd}</h1>
            <h1>{address}</h1>
        </div>
    )
}