#!/usr/bin/env python3
"""Generate Pringle Info app icons (PNG) from scratch with Pillow.
Run:  python3 make_icons.py
Outputs: icon-192.png, icon-512.png, icon-maskable-512.png, apple-touch-icon.png
"""
from PIL import Image, ImageDraw, ImageFilter

SIGNAL = (193, 47, 30, 255)   # fire-signal red
CREAM = (243, 239, 228, 255)  # paper bone


def phone_handset(s=1.0):
    """Classic handset lying on the anti-diagonal, drawn in 512 space."""
    img = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    C = lambda v: 256 + (v - 256) * s
    r = 20 * s
    d.rounded_rectangle([C(384), C(40), C(424), C(220)], radius=r, fill=CREAM)  # earpiece
    d.rounded_rectangle([C(88), C(292), C(128), C(472)], radius=r, fill=CREAM)  # mouthpiece
    d.rounded_rectangle([C(210), C(232), C(302), C(280)], radius=24 * s, fill=CREAM)  # handle
    img = img.rotate(-45, center=(256, 256), resample=Image.Resampling.BICUBIC)
    return img


def render(size, radius, scale, output):
    img = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    if radius:
        d.rounded_rectangle([0, 0, 511, 511], radius=radius, fill=SIGNAL)
    else:
        d.rectangle([0, 0, 511, 511], fill=SIGNAL)
    img.alpha_composite(phone_handset(scale))
    if size != 512:
        img = img.resize((size, size), Image.Resampling.LANCZOS)
    img.save(output)
    print("wrote", output)


render(512, 108, 1.0, "icon-512.png")
render(192, 42, 1.0, "icon-192.png")
render(180, 38, 1.0, "apple-touch-icon.png")
render(512, 0, 0.82, "icon-maskable-512.png")
