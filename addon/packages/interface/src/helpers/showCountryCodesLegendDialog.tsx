import CountryCodesLegendTable from "../components/CountryCodesLegendTable";
import { store } from "../store/store";

export function showCountryCodesLegendDialog() {
    const actions = store.getActions();
    actions.userDialog.setUserDialog({
        title: "Country Codes Legend",
        message: <CountryCodesLegendTable />,
        confirmActionText: "Close",
        showConfirmationModal: false,
        maxWidth: 400,
    });
}
