from pathlib import Path
from PIL import Image

root = Path('/home/ubuntu/notificacao-ios/assets/images')
for name in ['icon.png', 'splash-icon.png', 'favicon.png', 'android-icon-foreground.png']:
    path = root / name
    image = Image.open(path).convert('RGB')
    size = 1024 if name in {'icon.png', 'splash-icon.png', 'android-icon-foreground.png'} else 512
    image.thumbnail((size, size), Image.Resampling.LANCZOS)
    image.save(path, format='PNG', optimize=True, compress_level=9)
