import { Button } from "radzionkit/ui";

type Props = {
    fetchError: string;
};

function LoadingContacts({ fetchError }: Props) {
    function onClick() {
        window.location.reload();
    }

    return (
        <>
            <div>Loading contact lists...</div>
            {fetchError && (
                <div style={{ marginTop: "1rem" }}>
                    <div style={{ color: "orange" }}>{fetchError}</div>
                    <Button onClick={onClick} style={{ marginTop: "1rem" }}>
                        Try Again
                    </Button>
                </div>
            )}
        </>
    );
}

export default LoadingContacts;
