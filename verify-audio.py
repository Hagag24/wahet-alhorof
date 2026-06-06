import json
import re

# Load manifest
with open('audio-manifest.json', 'r', encoding='utf-8-sig') as f:
    manifest = json.load(f)

# Load mapping
with open('lib/audio-mapping.ts', 'r', encoding='utf-8') as f:
    mapping_content = f.read()

# Extract audio IDs from manifest
manifest_ids = []
for entry in manifest['files']:
    manifest_ids.append(entry['id'])

# Extract audio IDs from mapping using regex
mapping_ids = re.findall(r'"([^"]+)":\s*"([^"]+)"', mapping_content)
mapping_dict = {text: audio_id for text, audio_id in mapping_ids}

print("=" * 60)
print("AUDIO SYSTEM VERIFICATION REPORT")
print("=" * 60)

# Check for duplicate IDs in manifest
manifest_id_counts = {}
for id in manifest_ids:
    manifest_id_counts[id] = manifest_id_counts.get(id, 0) + 1

duplicate_manifest_ids = {id: count for id, count in manifest_id_counts.items() if count > 1}
if duplicate_manifest_ids:
    print("\n❌ DUPLICATE IDs IN MANIFEST:")
    for id, count in duplicate_manifest_ids.items():
        print(f"   {id}: appears {count} times")
else:
    print("\n✅ No duplicate IDs in manifest")

# Check for duplicate audio IDs in mapping (same ID used for different texts)
mapping_id_to_texts = {}
for text, audio_id in mapping_dict.items():
    if audio_id not in mapping_id_to_texts:
        mapping_id_to_texts[audio_id] = []
    mapping_id_to_texts[audio_id].append(text)

duplicate_mapping_ids = {id: texts for id, texts in mapping_id_to_texts.items() if len(texts) > 1}
if duplicate_mapping_ids:
    print("\n❌ DUPLICATE AUDIO IDs IN MAPPING (same ID for different texts):")
    for id, texts in duplicate_mapping_ids.items():
        print(f"   {id}: used for {len(texts)} texts:")
        for text in texts:
            print(f"      - '{text}'")
else:
    print("\n✅ No duplicate audio IDs in mapping")

# Check for duplicate texts in mapping (same text pointing to different IDs)
text_to_ids = {}
for text, audio_id in mapping_dict.items():
    if text not in text_to_ids:
        text_to_ids[text] = []
    text_to_ids[text].append(audio_id)

duplicate_texts = {text: ids for text, ids in text_to_ids.items() if len(ids) > 1}
if duplicate_texts:
    print("\n❌ DUPLICATE TEXTS IN MAPPING (same text pointing to different IDs):")
    for text, ids in duplicate_texts.items():
        print(f"   '{text}': points to {len(ids)} IDs: {ids}")
else:
    print("\n✅ No duplicate texts in mapping")

# Verify all mapping IDs exist in manifest
missing_in_manifest = []
for text, audio_id in mapping_dict.items():
    if audio_id not in manifest_ids:
        missing_in_manifest.append((text, audio_id))

if missing_in_manifest:
    print("\n❌ MAPPING IDs NOT FOUND IN MANIFEST:")
    for text, audio_id in missing_in_manifest:
        print(f"   '{text}' -> {audio_id}")
else:
    print("\n✅ All mapping IDs exist in manifest")

# Check for manifest IDs not used in mapping
unused_manifest_ids = set(manifest_ids) - set(mapping_dict.values())
if unused_manifest_ids:
    print(f"\n⚠️  MANIFEST IDs NOT USED IN MAPPING ({len(unused_manifest_ids)}):")
    for id in sorted(unused_manifest_ids):
        print(f"   {id}")
else:
    print("\n✅ All manifest IDs are used in mapping")

# Summary
print("\n" + "=" * 60)
print("SUMMARY")
print("=" * 60)
print(f"Total entries in manifest: {len(manifest_ids)}")
print(f"Total entries in mapping: {len(mapping_dict)}")
print(f"Unique IDs in manifest: {len(set(manifest_ids))}")
print(f"Unique IDs in mapping: {len(set(mapping_dict.values()))}")
print(f"Duplicate IDs in manifest: {len(duplicate_manifest_ids)}")
print(f"Duplicate audio IDs in mapping: {len(duplicate_mapping_ids)}")
print(f"Duplicate texts in mapping: {len(duplicate_texts)}")
print(f"Mapping IDs missing in manifest: {len(missing_in_manifest)}")
print(f"Unused manifest IDs: {len(unused_manifest_ids)}")

if (len(duplicate_manifest_ids) == 0 and 
    len(duplicate_mapping_ids) == 0 and 
    len(duplicate_texts) == 0 and 
    len(missing_in_manifest) == 0):
    print("\n✅ AUDIO SYSTEM IS CONSISTENT AND ERROR-FREE")
else:
    print("\n❌ AUDIO SYSTEM HAS ERRORS - NEEDS FIXING")
