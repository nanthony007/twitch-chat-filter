<section>
	<div class="flex h-screen w-screen justify-center items-center">
		<a
			class="block text-center mx-auto my-auto max-w-sm max-h-sm px-20 py-12 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
			href={import.meta.env.VITE_PUBLIC_AUTH_URL}
		>
			<h5 class="mb-2 text-2xl font-bold tracking-tight text-colored">Login with Twitch</h5>

			<div
				class="flex flex-row space-x-1 justify-center items-center border-slate-700 text-colored"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					fill="currentColor"
					class="bi bi-twitch"
					viewBox="0 0 16 16"
				>
					<path
						d="M3.857 0 1 2.857v10.286h3.429V16l2.857-2.857H9.57L14.714 8V0zm9.714 7.429-2.285 2.285H9l-2 2v-2H4.429V1.143h9.142z"
					/>
					<path d="M11.857 3.143h-1.143V6.57h1.143zm-3.143 0H7.571V6.57h1.143z" />
				</svg>
				<span class="text-colored">Connect with Twitch</span>
			</div>
		</a>
	</div>
</section>
