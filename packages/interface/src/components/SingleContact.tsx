import { validateEmail } from "../helpers/validateEmail";
import { useSingleContact } from "../hooks/useSingleContact";
import "./SingleContact.css";

type SingleContactProps = {
    state: ReturnType<typeof useSingleContact>;
};

function SingleContact({ state }: SingleContactProps) {
    const onBlurName = (e: React.FocusEvent<HTMLInputElement>) => {
        state.setName(e.target.value);
    };

    const onBlurEmail = (e: React.FocusEvent<HTMLInputElement>) => {
        state.setEmail(e.target.value);
    };

    const emailIsValid = validateEmail(state.email);

    return (
        <div className="single-contact-container">
            <label>
                Name
                <input type="text" value={state.name} onChange={onBlurName} required className="single-contact-input" />
                <div className="email-validation-message">{state.name ? "" : "Please type recipient name..."}</div>
            </label>
            <label>
                Email
                <input
                    className={`single-contact-input ${emailIsValid ? "" : "email-not-valid"}`}
                    type="text"
                    value={state.email}
                    onChange={onBlurEmail}
                    required
                />
                <div className="email-validation-message">
                    {emailIsValid ? "" : "Please type recipient email address..."}
                </div>
            </label>
        </div>
    );
}

export default SingleContact;
