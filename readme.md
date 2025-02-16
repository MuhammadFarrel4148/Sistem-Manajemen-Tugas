# Sistem Manajemen Tugas
API sederhana yang digunakan untuk mengelola tugas dengan fitur CRUD (Create, Read, Update, Delete).

## Fitur Utama
- **Task Management**
- Create: Pengguna dapat menambahkan tugas baru
- Read: Pengguna dapat melihat daftar tugas (dengan fitur filter dan sort)
- Update: Pengguna dapat mengedit tugas yang telah dibuat
- Delete: Pengguna dapat menghapus tugas yang tidak dibutuhkan

- **Task Status**
- To-Do, In Progress, dan Completed
- Status dapat diubah oleh pengguna

## Fitur Tambahan
- Mengirim pengingat tugas

## Teknologi yang Digunakan
- **Node.js**: Runtime javascript
- **MySQL**: Database relasional
- **JWT**: Autentikasi
- **Postman**: Testing dan dokumentasi
- **Dotenv**: Mengelola environment variables
- **Nodemailer**: Mengirim pengingat melalui email
- **Docker** (opsional): containerization 
- **GitHub**: Version control dan menyimpan proyek
 
## Struktur Database
### Users Table
```json
{
    "id": "string",
    "name": "string",
    "email": "string",
    "password": "string"
}
```

### Task Collection
```json
{
    "id": "string",
    "userId": "string",
    "title": "string",
    "description": "string",
    "status": "string",
    "deadline": "string",
    "createdAt": "string",
    "updatedAt": "string",
}
```

## Instalasi (Coming Soon)
Download Repositori Sistem Manajemen Tugas
```bash
git clone https://github.com/MuhammadFarrel4148/Sistem-Manajemen-Tugas.git
```
Masuk ke folder Sistem-Manajemen-Tugas
```bash
cd Sistem-Manajemen-Tugas
```
Install package
```bash
npm install
```
Jalankan server
```bash
//npm run start-dev (for development)
//npm run start (for production)
npm run start-dev
```
And yup happy testing!!!
Pengujian dapat dilakukan secara manual atau menggunakan postman dengan file yang sudah disediakan
```bash
Sistem Manajemen Tugas.postman_collection.json
Sistem Manajemen Tugas.postman_environment.json
```

## Endpoint (API Routes)

| HTTP Method | Endpoint             | Deskripsi                                 |
|-------------|----------------------|-------------------------------------------|
| POST        | /register            | Daftar pengguna baru                      |
| POST        | /login               | Login pengguna                            |
| POST        | /forgotpassword      | Mengirimkan kode otorisasi melalui email  |
| POST        | /forgotpasswordsec   | Validasi kode otorisasi & input password baru |
| POST        | /tasks               | Buat tugas baru                           |
| GET         | /tasks               | Ambil daftar tugas dengan filter/sort     |
| GET         | /tasks/{id}          | Ambil detail tugas tertentu               |
| PUT         | /tasks/{id}          | Perbarui tugas berdasarkan ID             |
| DELETE      | /tasks/{id}          | Hapus tugas berdasarkan ID                |


## Penulis
- **Muhammad Farrel Putra Pambudi** 
    - ([GitHub](https://github.com/MuhammadFarrel4148))
    - ([LinkedIn](https://www.linkedin.com/in/farrelputrapambudi/))

