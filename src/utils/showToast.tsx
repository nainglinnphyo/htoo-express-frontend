import { Box, DEFAULT_THEME, rem } from "@mantine/core"
import { notifications } from "@mantine/notifications"
import { InfoCircle, Information, Ranking, Warning2 } from "iconsax-react"

type status = "success" | "error" | "info" | "warning" | undefined

/**
 * Show Toast Noti
 * @param {string} title - The notification title
 * @param {status} status - The notification status
 * @example onClick={() => showToastNoti("Something happens!", "success")}
 */
const showToastNoti = (title: string, status: status = "info") => {
	const theme = DEFAULT_THEME
	let toastColor = "var(--accent-info)"
	let icon = InfoCircle
	if (status === "success") {
		toastColor = "var(--accent-success)"
		icon = Ranking
	} else if (status === "error") {
		toastColor = "var(--accent-danger)"
		icon = Warning2
	} else if (status === "warning") {
		toastColor = "var(--accent-warning)"
		icon = Information
	}

	notifications.show({
		title: title,
		message: "",
		autoClose: 3000,
		icon: <Box component={icon} color="#fff" />,
		styles: {
			root: {
				borderRadius: theme.radius.md,
				padding: rem(12),
				background: toastColor,
				border: toastColor,
			},
			title: {
				fontSize: rem(14),
				textAlign: "center",
				color: theme.white,
				fontWeight: 700,
				lineHeight: 1.75,
			},
			icon: {
				background: toastColor,
			},
			closeButton: {
				color: theme.white,
				background: "transparent",
			},
		},
		style: { width: "auto" },
	})
}

export default showToastNoti
