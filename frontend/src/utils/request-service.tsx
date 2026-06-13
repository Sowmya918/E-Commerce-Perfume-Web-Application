import axios, { Method } from "axios";
import { API_BASE_URL } from "../constants/urlConstants";

class RequestService {
    get(url: string, isAuthRequired: boolean = false, contentType: string = "application/json") {
        return createRequest("GET", url, null, isAuthRequired, contentType);
    }

    post(url: string, body: any, isAuthRequired: boolean = false, contentType: string = "application/json") {
        return createRequest("POST", url, body, isAuthRequired, contentType);
    }

    put(url: string, body: any, isAuthRequired: boolean = false, contentType: string = "application/json") {
        return createRequest("PUT", url, body, isAuthRequired, contentType);
    }

    delete(url: string, isAuthRequired: boolean = false, contentType: string = "application/json") {
        return createRequest("DELETE", url, null, isAuthRequired, contentType);
    }
}

const createRequest = (method: Method, url: string, body: any, isAuthRequired: boolean, contentType: string) => {
    const headers: any = {};

    if (contentType !== "multipart/form-data") {
        headers["Content-Type"] = contentType;
    }

    if (isAuthRequired) {
        const token = localStorage.getItem("token");

        console.log("TOKEN =", token);

        if (token) {
            headers["Authorization"] = "Bearer " + token;
        }
    }

    return axios({
        method,
        url: API_BASE_URL + url,
        data: body,
        headers
    });
};

export default new RequestService();
