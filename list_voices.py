import asyncio
import edge_tts

async def main():
    voices = await edge_tts.VoicesManager.create()
    ar_voices = voices.find(Language="ar")
    for v in ar_voices:
        print(f"{v['ShortName']} - {v['Gender']}")

if __name__ == "__main__":
    asyncio.run(main())
