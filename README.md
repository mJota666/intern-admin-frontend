# Admin Frontend README

**Demo URL**: [http://minhnguyen28.workspace.opstech.org:8081](http://minhnguyen28.workspace.opstech.org:8081)

## Giới thiệu

Đây là ứng dụng admin-frontend của dự án Intern. Giao diện này dùng cho quản trị viên và editor để quản lý nội dung.

## Mục lục

- [Yêu cầu](#yêu-cầu)
- [Cài đặt và chạy trên máy local](#cài-đặt-và-chạy-trên-máy-local)

  - [1. Clone repository](#1-clone-repository)
  - [2. Cài đặt dependencies](#2-cài-đặt-dependencies)
  - [3. Chạy ứng dụng](#3-chạy-ứng-dụng)

- [Các lệnh thường dùng](#các-lệnh-thường-dùng)
- [Thay đổi cấu hình](#thay-đổi-cấu-hình)
- [License](#license)

## Yêu cầu

- Node.js v20+
- npm hoặc Yarn

## Cài đặt và chạy trên máy local

### 1. Clone repository

```bash
git clone https://github.com/your-org/intern-admin-frontend.git
cd intern-admin-frontend
```

### 2. Cài đặt dependencies

```bash
npm install
# hoặc
# yarn install
```

### 3. Chạy ứng dụng

```bash
npm run dev
# hoặc
# yarn dev
```

Mở trình duyệt và truy cập `http://localhost:8081` (port mặc định có thể khác: tham khảo console).

## Các lệnh thường dùng

- `npm run dev` - Chạy dev server với hot reload
- `npm run build` - Xây dựng gói production vào thư mục `dist`
- `npm run preview` - Xem thử bản build production
- `npm run lint` - Kiểm tra linting

## Thay đổi cấu hình

- Cấu hình Vite nằm ở `vite.config.ts`.
- Biến môi trường `VITE_API_URL` chỉ đến backend, ví dụ:

  ```bash
  export VITE_API_URL=http://localhost:8080
  ```
