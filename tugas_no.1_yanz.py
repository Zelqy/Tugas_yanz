data_karyawan = (
    (2124001, "Andi", "IT", "Rp.5000000"),
    (2124002, "Reno", "HR", "Rp.4500000"),
    (2124003, "Citra", "Finance", "Rp.5500000")
)

for dk in data_karyawan:
    print(f"ID: {dk[0]}, Nama: {dk[1]}, Departemen: {dk[2]}, Gaji: {dk[3]}")
    
