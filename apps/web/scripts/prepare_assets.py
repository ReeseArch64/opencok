#!/usr/bin/env python3

import argparse
from pathlib import Path
import shutil
import zipfile

APP = Path(__file__).resolve().parents[1]
ROOT = APP.parents[1]
parser = argparse.ArgumentParser(description="Prepare the three local images used by the web loading screen")
parser.add_argument('--assets-root', type=Path, default=Path('/mnt/storage/cok-assets'))
parser.add_argument('--loading', type=Path, help='Optional standalone loading background')
parser.add_argument('--logo', type=Path, default=ROOT / 'assets/imgs/logo.png')
parser.add_argument('--apk', type=Path, default=ROOT / 'android/install/split_InstallPack.apk')
args = parser.parse_args()

frame = args.assets_root / ('packages/dr_face_race_4c80f41d5aeb40dd6865a2c8b9b450be1_android/'
                          'sprites/dresource/face_race_4/Loading/Loading_2.plist/loading_bar_BG.png.png')
background = args.loading or args.assets_root / 'client/v12.06.0/assets/opencok_branding/loading.jpg'
if background.is_file():
    loading = background.read_bytes()
else:
    if args.loading:
        raise SystemExit(f'Loading image not found: {args.loading}')
    if not args.apk.is_file():
        raise SystemExit('Provide --loading <image.jpg> or a branded APK with --apk <split.apk>')
    with zipfile.ZipFile(args.apk) as apk:
        loading = apk.read('assets/opencok_branding/loading.jpg')

for path in [args.logo, frame]:
    if not path.is_file():
        raise SystemExit(f'Required image not found: {path}')

dest = APP / 'assets'
dest.mkdir(exist_ok=True)
(dest / 'loading.jpg').write_bytes(loading)
shutil.copyfile(args.logo, dest / 'logo.png')
shutil.copyfile(frame, dest / 'progress-frame.png')
print('Prepared loading.jpg, logo.png and progress-frame.png in apps/web/assets (Git ignored)')
