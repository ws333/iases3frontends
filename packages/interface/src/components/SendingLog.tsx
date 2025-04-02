type Props = {
    logMessages: string[];
};

function SendingLog({ logMessages }: Props) {
    return (
        <section className="section_emails_sent_log">
            <h2>Recent activity</h2>
            <div className="container_emails_sent_log">
                {logMessages.map((msg, idx) => (
                    <div key={idx}>{msg}</div>
                ))}
            </div>
        </section>
    );
}

export default SendingLog;
