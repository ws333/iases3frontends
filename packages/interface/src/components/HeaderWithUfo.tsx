import icon from "../../../thunderbird-extension/public/skin/icon64.png";
import Header from "./Header";
import "./HeaderWithUfo.css";

function HeaderWithUfo() {
    return (
        <>
            <div className="icon-section-header">
                <img
                    className="iases3-icon hovering-ufo"
                    src={icon}
                    alt="Interstellar Alliance Social Experiment Step 3 icon"
                />
            </div>
            <Header />
        </>
    );
}

export default HeaderWithUfo;
