from pathlib import Path
from PIL import Image

source = Path('/home/ubuntu/upload/IMG_0441.JPG')
target = Path('/home/ubuntu/notificacao-ios/assets/images')
image = Image.open(source).convert('RGB')
image = image.resize((1024, 1024), Image.Resampling.LANCZOS)
for name in ['icon.png', 'splash-icon.png', 'android-icon-foreground.png']:
    image.save(target / name, format='PNG', optimize=True, compress_level=9)
image.resize((512, 512), Image.Resampling.LANCZOS).save(target / 'favicon.png', format='PNG', optimize=True, compress_level=9)
