import { Anchor, Box, Text, Title } from "@mantine/core";
import classes from "./layout.module.css";
import { AuthCheck } from "@/components/Auth/AuthCheck";

interface Props {
	children: React.ReactNode;
}

export default function AuthLayout({ children }: Props) {
	return (
		<AuthCheck redirectTo="/dashboard" shouldBeAuthenticated={false}>
			<Box className={classes.wrapper}>
				{/* <Title order={1} fw="bolder">
					Mantine Admin
				</Title> */}
				<Box w={400}>{children}</Box>
			</Box>
		</AuthCheck>
	);
}
