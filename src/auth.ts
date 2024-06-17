import { SvelteKitAuth } from '@auth/sveltekit';
import Twitch from '@auth/sveltekit/providers/twitch';

export const { handle, signIn, signOut } = SvelteKitAuth(async (event) => {
	const authOptions = {
		providers: [Twitch],
		trustHost: true,
		callbacks: {
			async jwt({ token, account }) {
				if (account) {
					token = Object.assign({}, token, { access_token: account.access_token });
				}
				return token;
			},
			async session({ session, token }) {
				if (session) {
					session = Object.assign({}, session, { access_token: token.access_token });
				}
				return session;
			}
		}
	};
	return authOptions;
});
