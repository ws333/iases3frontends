type EmailsSentLogProps = {
    logMessages: string[];
};

function EmailsSentLog({ logMessages }: EmailsSentLogProps) {
    return (
        <section className="section_emails_sent_log">
            <h2>Sending Log</h2>
            <div className="container_emails_sent_log">
                {logMessages.map((msg, idx) => (
                    <div key={idx}>{msg}</div>
                ))}
            </div>
        </section>
    );
}

export default EmailsSentLog;
