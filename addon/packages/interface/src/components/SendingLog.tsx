import { useStoreState } from "../store/store";

function SendingLog() {
    const log = useStoreState((state) => state.sendingLog.log);

    return (
        <section className="section_emails_sent_log">
            <h2>Recent activity</h2>
            <div className="container_emails_sent_log">
                {log.length ? log.map((msg, idx) => <div key={idx}>{msg}</div>) : "No activity to display yet"}
            </div>
        </section>
    );
}

export default SendingLog;
