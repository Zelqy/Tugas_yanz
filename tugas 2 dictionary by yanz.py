kontak = {
    "bapak": {
        "nama": "bapak",
        "nomer": "087757311870"
    },
    "riyan": {
        "nama": "riyan",
        "nomer": "081939753812"
    },
    "ibu": {
        "nama kontak": "ibu",
        "nomer": "085941307923"
    }
}

nama = input("masukkan nama kontak: ")
if nama in kontak:
    print(f"nama: {kontak[nama]['nama']}")
    print(f"nomor telepon: {kontak[nama]['nomer']}")
else:
    print("kontak tidak ditemukan")
