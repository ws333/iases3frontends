type Props = {
    fetchError: string;
};

function LoadingContacts({ fetchError }: Props) {
    return (
        <>
            <div>Loading contact lists...</div>
            {fetchError && <div style={{ color: "orange", marginTop: "1rem" }}>{fetchError}</div>}
        </>
    );
}

export default LoadingContacts;
