import os

target_words = ["أميرة", "اميرة", "أمير", "امير"]

folder = r"c:\Hagag 2026\Kids"
for root, dirs, files in os.walk(folder):
    for file in files:
        if file.endswith((".ts", ".tsx", ".json", ".txt", ".md")):
            path = os.path.join(root, file)
            try:
                with open(path, "r", encoding="utf-8") as f:
                    content = f.read()
                    for word in target_words:
                        if word in content:
                            print(f"FOUND '{word}' IN: {path}")
            except:
                pass
