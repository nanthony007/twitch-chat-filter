import { SvelteKitAuth } from '@auth/sveltekit';
import Twitch from '@auth/sveltekit/providers/twitch';

export const { handle, signIn, signOut } = SvelteKitAuth(async (event) => {
	const authOptions = {
		providers: [
			Twitch({
				clientId: event.platform.env.AUTH_TWITCH_ID,
				clientSecret: event.platform.env.AUTH_TWITCH_SECRET
			})
		],
		secret: event.platform.env.AUTH_SECRET,
		trustHost: true
	};
	return authOptions;
});
