import axios from "axios";
import { BACK_END_URL } from "@/utils";

let token = "";

if (typeof window !== "undefined") {
	// Check if localStorage is available
	const authStorage = localStorage.getItem("auth-storage");
	token = authStorage ? JSON.parse(authStorage).state?.token || "" : "";
}

export default axios.create({ baseURL: BACK_END_URL });

export const authJsonHeader = (file?: boolean) => ({
	"Content-Type": file ? "multipart/form-data" : "Application/json",
	Accept: "application/json",
	Authorization: `Bearer ${token}`,
});
