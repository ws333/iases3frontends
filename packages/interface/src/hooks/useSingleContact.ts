import { useState } from "react";
import { TEmailComponent } from "../types/types";
import { ContactI3C } from "../types/typesI3C";
import { renderEmail } from "../helpers/renderEmail";

type UseSingleContactArgs = {
    Component: TEmailComponent;
};

function useSingleContact({ Component }: UseSingleContactArgs) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const contact: ContactI3C = {
        uid: Date.now(),
        name,
        email,
        nation: "",
        institution: "",
        subGroup: "",
        sentDate: 0,
        sentCount: 0,
        updatedDate: "",
        deletionDate: 0,
        customBackend01: "",
        customBackend02: "",
        customFrontend01: "",
        customFrontend02: "",
    };

    const emailText = renderEmail(Component, { name: contact.name });

    return {
        name,
        setName,
        email,
        setEmail,
        emailText,
        contact,
    };
}

export { useSingleContact };
