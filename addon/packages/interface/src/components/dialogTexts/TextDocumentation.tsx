import { DOCS_URL_WEBAPP_DOCUMENTATION } from "../../constants/constants";
import { isDevMode } from "../../helpers/getSetDevMode";

const TextDocumentation = () => {
    const urlProd = new URL(DOCS_URL_WEBAPP_DOCUMENTATION);
    const urlDev = new URL(urlProd.pathname, "http://localhost:5175");
    const src = isDevMode() ? urlDev.href : urlProd.href;
    return (
        <>
            <div style={{ width: "100%", height: "480vh" }}>
                <iframe
                    src={src}
                    title="Documentation"
                    style={{ width: "100%", height: "100%", border: "1px solid #fff1", borderRadius: "18px" }}
                    sandbox="allow-same-origin allow-scripts"
                />
            </div>
        </>
    );
};

export default TextDocumentation;
