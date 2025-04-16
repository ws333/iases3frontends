import { COUNTRYCODE_QUERY, COUNTRYCODE_URL, ERROR_FETCHING_COUNTRYCODE, IPINFO_URL } from "../constants/constants";
import { fetchWithTimeout } from "./fetchWithTimeout";

type CountryCode = {
    status: "success" | "fail";
    countryCode: string;
};

/**
 * - Get country code by IP address
 * - Docs at https://ip-api.com/docs/api:json
 */
export async function getCountryCodeByIP() {
    const errorMessage = ERROR_FETCHING_COUNTRYCODE;
    try {
        const responsePublicIP = await fetchWithTimeout({ url: IPINFO_URL, errorMessage });
        const publicIP = await responsePublicIP.text();
        if (!publicIP) return "";

        const countryCodeUrl = `${COUNTRYCODE_URL}${publicIP}${COUNTRYCODE_QUERY}`;
        const response = await fetchWithTimeout({ url: countryCodeUrl, errorMessage });
        const respJson = (await response.json()) as CountryCode;
        return respJson.status === "success" ? respJson.countryCode : "";
    } catch (error) {
        console.log("*Debug* -> getCountryCodeByIP error:", error);
        return "";
    }
}
