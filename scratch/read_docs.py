import docx2txt
import os
import sys

# Force utf-8 for printing
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

folder = r"c:\Hagag 2026\Kids\الدروس ال 4"
for filename in os.listdir(folder):
    if filename.endswith(".docx"):
        try:
            print(f"\n--- {filename} ---")
            text = docx2txt.process(os.path.join(folder, filename))
            # Clean up the text a bit
            clean_text = "\n".join([line.strip() for line in text.split("\n") if line.strip()])
            print(clean_text[:2000]) # Print first 2000 chars
        except Exception as e:
            print(f"Error processing {filename}: {e}")
