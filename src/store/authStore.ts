import { create } from "zustand";
import { persist, createJSONStorage, devtools } from "zustand/middleware";

interface User {
	id: string;
	name: string;
	email: string;
}

interface AuthState {
	user: User | null;
	token: string | null;
	isLoading: boolean;
	isAuthenticated: () => boolean;
	login: (credentials: { email: string; password: string }) => Promise<void>;
	logout: () => Promise<void>;
	fetchUser: () => Promise<void>;
	hasStoredToken: () => boolean;
}

const useAuthStore = create<AuthState>()(
	devtools(
		persist(
			(set, get) => ({
				user: null,
				token: null,
				isLoading: false,

				isAuthenticated: () => {
					const state = get();
					return !!state.user && !!state.token;
				},

				hasStoredToken: () => {
					const authState = JSON.parse(
						localStorage.getItem("auth-storage") || "{}"
					);
					return !!authState.state?.token;
				},

				login: async ({ email, password }) => {
					set({ isLoading: true });
					try {
						const response = await fetch(
							`${process.env.NEXT_PUBLIC_API_URL}auth/login`,
							{
								method: "POST",
								headers: { "Content-Type": "application/json" },
								body: JSON.stringify({ email, password }),
							}
						);
						if (response.ok) {
							const data = await response.json();
							set({
								user: {
									email: data._data.user.email,
									id: data._data.user.id,
									name: data._data.user.email,
								},
								token: data._data.token,
							});
						} else {
							throw new Error("Login failed");
						}
					} catch (error) {
						console.error("Error during login:", error);
						throw error;
					} finally {
						set({ isLoading: false });
					}
				},

				logout: async () => {
					try {
						// await fetch("/api/logout", {
						//   method: "POST",
						//   credentials: "include",
						// });
					} catch (error) {
						console.error("Error during logout:", error);
					} finally {
						set({ user: null, token: null });
					}
				},

				fetchUser: async () => {
					set({ isLoading: true });
					try {
						// const response = await fetch("/api/me", {
						//   credentials: "include",
						//   headers: {
						//     Authorization: `Bearer ${get().token}`,
						//   },
						// });
						const authState = JSON.parse(
							localStorage.getItem("auth-storage") || "{}"
						);
						if (!authState.state?.token) {
							throw new Error("No token found");
						}

						set({
							user: { name: "admin", email: "admin", id: "1" },
							token: authState.state.token,
						});
						// if (response.ok) {
						//   const data = await response.json();
						//   set({ user: data });
						// } else {
						//   throw new Error("Failed to fetch user");
						// }
					} catch (error) {
						console.error("Error fetching user:", error);
						await get().logout();
					} finally {
						set({ isLoading: false });
					}
				},
			}),
			{
				name: "auth-storage",
				storage: createJSONStorage(() => localStorage),
				partialize: (state) => ({ token: state.token }),
			}
		)
	)
);

export default useAuthStore;
