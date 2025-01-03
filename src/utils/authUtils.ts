interface AuthorizedAction {
	name: string;
	actions: string[];
}

interface AuthorizedTab {
	tabName: AuthorizedAction[];
}

export function isLinkAuthorized(
	link: string,
	authorizedTabs: AuthorizedTab[]
): boolean {
	const linkParts = link.split("/");
	const lastPart = linkParts[linkParts.length - 1];
	console.log(authorizedTabs);
	for (const tab of authorizedTabs) {
		for (const action of tab.tabName) {
			if (
				action.name === `${lastPart}-list` &&
				action.actions.includes("list")
			) {
				return true;
			}
		}
	}

	return false;
}
