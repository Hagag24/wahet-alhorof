import asyncio
import edge_tts
from pathlib import Path
import sys

async def main():
    # الإعدادات
    text = "أَهْلًا بِكُمْ يَا أَصْدِقَائِي، هَيَّا نَبْدَأُ رِحْلَتَنَا الْجَمِيلَةَ."
    voice = "ar-EG-ShakirNeural"
    output_file = "test_output.mp3"
    rate = "-5%"
    pitch = "+0Hz"
    volume = "+0%"

    print("Checking edge-tts...")
    
    try:
        print("Generating audio...")
        communicate = edge_tts.Communicate(
            text=text,
            voice=voice,
            rate=rate,
            pitch=pitch,
            volume=volume
        )
        
        await communicate.save(output_file)
        
        # التأكد من إنشاء الملف
        file_path = Path(output_file)
        if file_path.exists() and file_path.stat().st_size > 0:
            print(f"Created: {output_file}")
        else:
            raise FileNotFoundError(f"Failed to create file: {output_file}")
            
    except Exception as e:
        print(f"\n[!] Error occurred: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        pass
