"""Генерирует icon-192.png и icon-512.png — гантель на тёмном фоне. Без зависимостей."""
import struct, zlib

BG = (15, 23, 42)      # #0f172a
FG = (56, 189, 248)    # #38bdf8

def make(size, path):
    s = size / 512
    def rect(px, x0, y0, x1, y1):
        x0, x1, y0, y1 = [int(v * s) for v in (x0, x1, y0, y1)]
        for y in range(max(0, y0), min(size, y1)):
            row = px[y]
            for x in range(max(0, x0), min(size, x1)):
                row[x] = FG

    px = [[BG] * size for _ in range(size)]
    rect(px, 100, 240, 412, 272)   # гриф
    rect(px, 150, 176, 195, 336)   # большой блин слева
    rect(px, 317, 176, 362, 336)   # большой блин справа
    rect(px, 105, 216, 150, 296)   # малый блин слева
    rect(px, 362, 216, 407, 296)   # малый блин справа

    raw = b"".join(b"\x00" + b"".join(bytes(p) for p in row) for row in px)

    def chunk(tag, data):
        return struct.pack(">I", len(data)) + tag + data + struct.pack(">I", zlib.crc32(tag + data))

    png = (b"\x89PNG\r\n\x1a\n"
           + chunk(b"IHDR", struct.pack(">IIBBBBB", size, size, 8, 2, 0, 0, 0))
           + chunk(b"IDAT", zlib.compress(raw, 9))
           + chunk(b"IEND", b""))
    with open(path, "wb") as f:
        f.write(png)
    print(path, len(png), "bytes")

make(192, "icon-192.png")
make(512, "icon-512.png")
