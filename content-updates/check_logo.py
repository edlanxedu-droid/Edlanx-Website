from PIL import Image
import os

base = r"C:\Users\Rajkumar\OneDrive\Desktop"
for f in ["Black text png.png", "White text png.png"]:
    path = os.path.join(base, f)
    im = Image.open(path)
    print(f, im.size, im.mode)
