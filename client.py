import asyncio
import aiohttp

password = "6t6wlsicz3hpey626cmczk5c0gx2u5"
account = "timewellwasted007"
channel = "imperialhal"


async def main():
    async with aiohttp.ClientSession() as session:
        async with session.ws_connect("ws://irc-ws.chat.twitch.tv:80") as ws:
            await ws.send_str(f"PASS oauth:{password}")
            await ws.send_str(f"NICK {account}")
            print("joining channel...")
            await ws.send_str(f"JOIN #{channel}")
            # join second channel
            await ws.send_str("JOIN #imperialhal")
            print("reading msgs...")
            async for msg in ws:
                if msg.type == aiohttp.WSMsgType.TEXT:
                    print(msg.data)
                elif msg.type == aiohttp.WSMsgType.ERROR:
                    break


asyncio.run(main())