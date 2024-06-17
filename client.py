import asyncio
import aiohttp

password = "u09qpp5goh9yjlm9u11gengyhje9ph"
account = "timewellwasted007"
# channel = "timewellwasted007"
channel = "tarik"


async def main():
    async with aiohttp.ClientSession() as session:
        async with session.ws_connect("ws://irc-ws.chat.twitch.tv:80") as ws:
            await ws.send_str(f"PASS oauth:{password}")
            await ws.send_str(f"NICK {account}")
            print("joining channel...")
            await ws.send_str(f"JOIN #{channel}")
            # join second channel
            await ws.send_str("JOIN #tsm_imperialhal")
            print("reading msgs...")
            async for msg in ws:
                if msg.type == aiohttp.WSMsgType.TEXT:
                    print(msg.data)
                elif msg.type == aiohttp.WSMsgType.ERROR:
                    break


asyncio.run(main())
