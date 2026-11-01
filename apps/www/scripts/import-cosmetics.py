import json
from pathlib import Path
import re
import xml.etree.ElementTree as ET

APP = Path(__file__).resolve().parents[1]
ROOT = APP.parents[1]
CLIENT = ROOT / "data/android/extracted/v12.06.0/assets/local"
PACKAGES = ROOT / "data/cdn/extracteds/packages"
SERVER = ROOT / "data/resources/v12.06.0"


def read_table(path):
    return {element.get("id"): element.attrib for element in ET.parse(path).iter("ItemSpec")}


def clean_name(value):
    return re.sub(r"[{}]", "", value).split("|")[0].strip()


def import_cosmetics():
    types = json.loads((APP / "src/data/cosmetic-types.json").read_text())
    groups = {
        group.get("id"): group
        for group in ET.parse(CLIENT / "database.local.xml").iter("Group")
    }
    goods = {item.get("id"): item.attrib for item in groups["goods"]}
    statuses = read_table(SERVER / "status.xml")
    lords = read_table(SERVER / "lord_image.xml")
    client_lords = {item.get("id"): item.attrib for item in groups["lord_image"]}
    translations = dict(
        line.split("=", 1)
        for line in (CLIENT / "text_pt.ini").read_text().splitlines()
        if "=" in line
    )
    image_index = {}
    for manifest in sorted(PACKAGES.glob("*/manifest.json")):
        for entry in json.loads(manifest.read_text()).get("entries", []):
            if entry["kind"] != "sprite":
                continue
            name = Path(entry["name"]).name
            if not name.startswith(("avatar_zhanshi_", "g0", "g5", "ico", "item", "frame")):
                continue
            source = manifest.parent / entry["url"]
            if not source.is_file():
                source = manifest.parent / entry["thumb"]
            if source.is_file():
                image_index[name] = str(source.relative_to(ROOT))

    items = []
    seen = set()
    for element in groups["status"]:
        status = element.attrib
        kind = status.get("type2")
        server_status = statuses.get(status["id"], {})
        if kind not in types or server_status.get("type2") != kind:
            continue
        item = goods.get(status.get("itemId"), {})
        art = status.get("effectart") or status.get("frameID") or status.get("subgroup")
        key = (kind, art)
        if key in seen:
            continue
        candidates = [
            f'avatar_zhanshi_{status.get("effectart")}.png',
            f'avatar_zhanshi_{status.get("itemId")}.png',
            item.get("icon", "") + ".png",
        ]
        source = next((image_index[name] for name in candidates if name in image_index), None)
        if not source:
            continue
        name_key = status.get("name") or item.get("name", "")
        name = clean_name(translations.get(name_key, "")) or str(art)
        items.append({
            "id": f'skin-{status["id"]}',
            "name": name,
            "category": "skins",
            "group": types[kind],
            "status": "soon",
            "source": source,
            "reference": status["id"],
            "sourceTable": "status",
            "cosmeticType": int(kind),
            "artCode": art,
            "clientVersion": "12.06.0",
            "description": f'{name} faz parte da coleção de skins de {types[kind].lower()}. Explore esta aparência e personalize sua experiência no reino.',
            "note": "Prévia do cosmético no cliente. Variações de duração da mesma aparência são reunidas em uma ficha. Condições de obtenção serão confirmadas na liberação.",
        })
        seen.add(key)

    missing_lords = []
    for identifier, lord in lords.items():
        code = lord["name"]
        if client_lords.get(identifier, {}).get("name") != code:
            continue
        source = next((
            image_index[name]
            for name in [code + "_bust.png", code + "_middle.png", code + ".png"]
            if name in image_index
        ), None)
        if not source:
            missing_lords.append(code)
            continue
        items.append({
            "id": f"senhor-{code}",
            "name": f"Aparência do senhor · {code}",
            "category": "avatares",
            "group": "Aparência do senhor",
            "status": "soon",
            "source": source,
            "reference": identifier,
            "sourceTable": "lord_image",
            "appearanceCode": code,
            "clientVersion": "12.06.0",
            "description": "A aparência do seu senhor: o personagem que representa você no reino. Escolha o visual da sua próxima história.",
            "note": "Aparência identificada no catálogo de senhores. O código original é preservado porque a tabela não fornece um nome de personagem.",
        })

    path = APP / "src/data/catalog.json"
    current = json.loads(path.read_text())
    preserved = [item for item in current if item["category"] not in ["skins", "avatares"]]
    previous = {item["id"]: item for item in current}
    for item in items:
        if item["id"] in previous:
            item["status"] = previous[item["id"]]["status"]
    result = preserved + items
    identifiers = [item["id"] for item in result]
    if len(set(identifiers)) != len(identifiers):
        raise ValueError("Duplicate cosmetic routes; inspect client subgroups before importing")
    path.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n")
    print(f"Imported {len(items)} verified cosmetics; preserved {len(preserved)} other entries.")
    print("Lord appearances without a complete static image:", ", ".join(missing_lords))


if __name__ == "__main__":
    import_cosmetics()
