import docx2txt
import os
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

folder = r"c:\Hagag 2026\Kids\الدروس ال 4"
output_file = r"c:\Hagag 2026\Kids\scratch\full_content.txt"

with open(output_file, "w", encoding="utf-8") as f:
    for filename in os.listdir(folder):
        if filename.endswith(".docx"):
            f.write(f"\n\n========================================\n")
            f.write(f"FILE: {filename}\n")
            f.write(f"========================================\n")
            text = docx2txt.process(os.path.join(folder, filename))
            f.write(text)

print(f"Done! Written to {output_file}")
