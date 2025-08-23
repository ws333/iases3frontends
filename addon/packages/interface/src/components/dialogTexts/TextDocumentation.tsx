import { URL_DOCUMENTATION_DEV, URL_DOCUMENTATION_PROD } from "../../constants/constants";
import { isDevMode } from "../../helpers/getSetDevMode";

const TextDocumentation = () => {
    const src = isDevMode() ? URL_DOCUMENTATION_DEV : URL_DOCUMENTATION_PROD;
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                height: "480vh",
            }}
        >
            <iframe
                src={src}
                title="Documentation"
                style={{
                    width: "100%",
                    height: "100%",
                    border: "1px solid #fff1",
                    borderRadius: "18px",
                }}
                sandbox="allow-same-origin allow-scripts"
            />
        </div>
    );
};

export default TextDocumentation;
