daftar_belanja=[]

def tambah_item(item):
    daftar_belanja.append(item)
    print(f'"{item}" telah dtambahkan ke daftar belanja. ')
def tampilan_daftar():
    if daftar_belanja:
        print("\nDaftar Belanja:")
        for i, item in enumerate(daftar_belanja, 1):
            print(f"{i}. {item}")
    else:
        print("\nDaftar belanja kosong.")
def hapus_item(index):
    if 0 <= index < len(daftar_belanja):
        item = daftar_belanja.pop(index)
        print(f'"{item}" telah dihapus dari daftar belanja. ')
    else:
        print("indeks tidak valid.")

while True:
    print("1. tambah item")
    print("2. lihat daftar belanja")
    print("3. hapus item")
    print("4. keluar")


    pilihan = input("pilih menu (1-4): ")


    if pilihan == "1":
        item = input("masukkan nama item: ")
        tambah_item(item)
    elif pilihan == "2":
        tampilkan_daftar()
    elif pilihan == "3":
        tampilkan_daftar()
        index = int(input("masukkan nomor item yang ingin dihapus ")) -1
        hapus_item(index)
    elif pilihan == "4":
        print("terima kasih! program selesai.")
        break
    else:
        print("pilihan tidak valid, silahkan coba lagi.")
    
    
        
        
