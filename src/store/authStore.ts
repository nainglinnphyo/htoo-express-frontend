import { BACK_END_URL } from "@/utils";
import axios from "axios";
import { create } from "zustand";
import { persist, createJSONStorage, devtools } from "zustand/middleware";

interface User {
	id: string;
	name: string;
	email: string;
	role?: Role | null;
}

interface Role {
	name: string;
	tabsPermission: any;
	tablesPermission: any;
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
						const response = await fetch(`${BACK_END_URL}auth/login`, {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({ email, password }),
						});
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
						const response = await axios.get(`${BACK_END_URL}auth/me`, {
							headers: {
								Authorization: `Bearer ${get().token}`,
							},
						});

						const authState = JSON.parse(
							localStorage.getItem("auth-storage") || "{}"
						);
						if (!authState.state?.token) {
							throw new Error("No token found");
						}

						if (response.data) {
							const data = await response.data;
							// console.log(data._data.user.userRole.roleOnPermission);
							set({
								user: {
									email: data._data.user.email,
									id: data._data.user.id,
									name: data._data.user.email,
									role: !data._data.user.userRole
										? null
										: {
												name: data._data.user.userRole.name,
												tablesPermission:
													data._data.user.userRole.roleOnPermission.map(
														(d: any) => {
															return {
																tableName:
																	d.permissionResource.permissionColumn,
															};
														}
													),
												tabsPermission:
													data._data.user.userRole?.roleOnPermission.map(
														(d: any) => {
															return {
																tabName: d.permissionResource.permissionTab,
															};
														}
													),
										  },
								},
							});
						} else {
							throw new Error("Failed to fetch user");
						}
					} catch (error) {
						console.error("Error fetching user:", error);
						// await get().logout();
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
