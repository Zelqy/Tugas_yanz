kamus ={
    "pisang": "buah berwarna kuning",
    "strawberry": "kaya akan vitamin C",
    "alpukat": "kaya akan asam lemak sehat"
}

kata = input("masukkan kata yang ingin dicari artinya:").lower()

if kata in kamus:
    print(f"Arti dari'[pisang]'adalah:"
         "[pisang[buah berwarna kuning]}")
    
kata = input("masukkan kata yang ingin dicari artinya:").lower()

if kata in kamus:
    print(f"Arti dari'[strawberry]'adalah:"
         "[strawberry[kaya akan vitamin C]}")
    
kata = input("masukkan kata yang ingin dicari artinya:").lower()

if kata in kamus:
    print(f"Arti dari'[alpukat]'adalah:"
         "[alpukat[kaya akan asam lemak sehat]}")
else:
    print(f"Maaf,arti dari'[kata]'tidak ditemukan dalam kamus).")
