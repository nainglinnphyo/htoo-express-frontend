import { AuthCheck } from "./AuthCheck";


export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
	return (
		<AuthCheck redirectTo="/login" shouldBeAuthenticated={true}>
			{children}
		</AuthCheck>
	)
}

