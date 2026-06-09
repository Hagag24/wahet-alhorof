import docx2txt
import os
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

folder = r"c:\Hagag 2026\Kids\الدروس ال 4"
for filename in os.listdir(folder):
    if filename.endswith(".docx"):
        text = docx2txt.process(os.path.join(folder, filename))
        if "أميرة" in text or "اميرة" in text:
            print(f"FOUND IN: {filename}")
            # Find the sentence containing Amira
            start_idx = text.find("أميرة") if "أميرة" in text else text.find("اميرة")
            print(text[max(0, start_idx-100):start_idx+500])
