import docx2txt
import os
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

folder = r"c:\Hagag 2026\Kids\الدروس ال 4"
target = "انتاج الدرس الثاني اميرة واسرتها السعيدة.docx"
text = docx2txt.process(os.path.join(folder, target))
print(text[2000:])
