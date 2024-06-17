function LoginSection() {
	const clientId = "6qebzd1cvovmig0ou03e0sphnt0yqs";
	const baseUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=http://localhost:3000&response_type=token&scope=chat:read&state=007`;
	const url = encodeURI(baseUrl);
	console.log(url);
	return (
		<div>
			<a href={url}>Connect with Twitch</a>
		</div>
	);
}

export default LoginSection;
