import { isDevMode } from "../helpers/getSetDevMode";
import { URL_DOCUMENTATION_DEV, URL_DOCUMENTATION_PROD } from "./constants";

export const DOCS_URL_WEBAPP_DOCUMENTATION = isDevMode() ? URL_DOCUMENTATION_DEV : URL_DOCUMENTATION_PROD;
