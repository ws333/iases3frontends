import { countryCodesAlpha2 } from "../constants/countryCodesAlpha2";
import { useStoreState } from "../store/store";

function CountryCodesLegendTable() {
    const nationOptionsFetched = useStoreState((state) => state.contactList.nationOptionsFetched);
    const filteredCountries = countryCodesAlpha2.filter(({ code }) => nationOptionsFetched.includes(code));
    return (
        <table className="country_code_table">
            <thead>
                <tr>
                    <th className="country_code_th">Code</th>
                    <th className="country_code_th country_code_th_name">Country Name</th>
                </tr>
            </thead>
            <tbody>
                {filteredCountries.map(({ name, code }: { name: string; code: string }) => (
                    <tr key={code}>
                        <td className="country_code_td">{code}</td>
                        <td className="country_code_td country_code_td_name">{name}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default CountryCodesLegendTable;
