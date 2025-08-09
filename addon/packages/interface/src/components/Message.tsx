import { useStoreState } from "../store/store";

function Message() {
    const message = useStoreState((state) => state.userMessage.message);

    return (
        <div className="container_message">
            {message.split("\n").map((line, idx) => (
                <p key={idx}>{line}</p>
            ))}
        </div>
    );
}

export default Message;
