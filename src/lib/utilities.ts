export type Option<T> = T | null;
export type Result<T> = T | Error;

export const parseTokenFromUrl = (urlHash: string): Option<string> => {
	const urlParams = new URLSearchParams(urlHash);
	const urlToken = urlParams.get('#access_token');
	if (!urlToken) {
		return null;
	}
	return urlToken;
};
