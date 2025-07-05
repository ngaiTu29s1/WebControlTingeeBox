# Y80C Web UI Documentation

Tài liệu hướng dẫn sử dụng Web UI để điều khiển thiết bị Tingee Box Y80C.

---

## Mục lục

- [Y80C Web UI Documentation](#y80c-web-ui-documentation)
  - [Mục lục](#mục-lục)
  - [1. Giới thiệu](#1-giới-thiệu)
  - [2. Đối tượng sử dụng](#2-đối-tượng-sử-dụng)
  - [3. Cài đặt ban đầu](#3-cài-đặt-ban-đầu)
  - [4. Tổng quan giao diện](#4-tổng-quan-giao-diện)
    - [Khối tạo giao dịch thanh toán](#khối-tạo-giao-dịch-thanh-toán)
    - [Khối chức năng và cài đặt](#khối-chức-năng-và-cài-đặt)
    - [Khối điều khiển hiển thị](#khối-điều-khiển-hiển-thị)
    - [Khối âm thanh](#khối-âm-thanh)
    - [Khối log phản hồi từ thiết bị](#khối-log-phản-hồi-từ-thiết-bị)
    - [4.1 Khối tạo giao dịch thanh toán](#41-khối-tạo-giao-dịch-thanh-toán)
      - [Tạo mã QR thanh toán](#tạo-mã-qr-thanh-toán)
      - [Hiển thị mã QR và thông báo](#hiển-thị-mã-qr-và-thông-báo)
      - [Xử lý timeout](#xử-lý-timeout)
    - [4.2 Giả lập thanh toán thành công](#42-giả-lập-thanh-toán-thành-công)
    - [4.3 Khối các chức năng hệ thống](#43-khối-các-chức-năng-hệ-thống)
    - [4.4 Khối hiển thị tuỳ chọn trên màn hình](#44-khối-hiển-thị-tuỳ-chọn-trên-màn-hình)
  - [5. Tóm tắt](#5-tóm-tắt)

---

## 1. Giới thiệu

Tài liệu này hướng dẫn sử dụng Web UI để điều khiển thiết bị Tingee Box Y80C. 

Web UI cung cấp giao diện trực quan để người dùng điều khiển thiết bị, bản chất là nạp các lệnh thông qua cáp USB vào thiết bị để chạy các tính năng đã được định sẵn như:
- Hiển thị ảnh, văn bản
- Phát âm thanh
- Hiển thị mã QR

**Lưu ý:** Tài liệu này **không bao gồm** việc hướng dẫn sửa các tham số mặc định của các tính năng.

## 2. Đối tượng sử dụng

- Tài liệu dành cho chuyên viên kỹ thuật của ngân hàng
- Giả sử người đọc đã có kiến thức về JavaScript
- Người dùng **bắt buộc cần** phải đọc tài liệu [Y80C Instruction set](/instructions
- .md) trước khi sử dụng

Hàm giúp nạp lệnh sang thiết bị và ghi lại log:

![Hàm nạp lệnh](img/Pasted%20image%2020250705093623.png)

## 3. Cài đặt ban đầu

1. Kết nối thiết bị với máy tính qua cáp USB **có thể truyền dữ liệu**
2. Máy tính và thiết bị sẽ giao tiếp với nhau qua USB Serial Protocol
3. Tại Web UI, chọn "Kết nối thiết bị"
4. Nếu thành công, thanh trạng thái sẽ hiện "Đã kết nối" và chuyển sang màu xanh

**Yêu cầu hệ thống:**
- Trình duyệt có hỗ trợ Web Serial API: Chrome (ver 89+) hoặc Edge (ver 90+)

## 4. Tổng quan giao diện

Giao diện web bao gồm các khối chức năng chính:

### Khối tạo giao dịch thanh toán
- Gửi đến POS và hiển thị QR lên màn hình
- Giả lập cho việc người dùng thanh toán thành công (để kiểm thử)

### Khối chức năng và cài đặt
- **Kiểm tra phiên bản:** Xem phiên bản firmware hiện tại của thiết bị
- **Khởi động lại:** Khởi động lại thiết bị
- **Xoá màn hình:** Xoá toàn bộ màn hình đang hiển thị (thay bằng màu trắng)
- **Khôi phục cài đặt gốc:** Đặt lại thiết bị

### Khối điều khiển hiển thị
- **Hiển thị mã QR:** Hiển thị QR tuỳ chọn
- **Hiển thị văn bản:** Hiển thị văn bản tuỳ chọn
- **Hiển thị hình ảnh:** Hiển thị các hình ảnh mặc định
- **Hiển thị ảnh:** Hiển thị các ảnh (0: logo khởi động, 1: ảnh thành công, 2: ảnh thất bại)

### Khối âm thanh
- **Kiểm tra âm lượng tích hợp:** Phát các âm lượng mặc định
- **Điều chỉnh âm lượng:** Cài đặt 3 mức âm lượng (bé nhất, trung bình, lớn nhất)
- **Phát tệp âm thanh tuỳ chỉnh:** Phát âm thanh khác

### Khối log phản hồi từ thiết bị
- Xem trạng thái thực thi của các lệnh

![Tổng quan giao diện](img/Pasted%20image%2020250705091952.png)

### 4.1 Khối tạo giao dịch thanh toán

![Khối tạo giao dịch thanh toán](img/Pasted%20image%2020250705094113.png)

Chức năng này được chia thành các khối nhỏ:

#### Tạo mã QR thanh toán
- Đọc số tài khoản và số tiền từ giao diện
- Gọi API đến vietqr.io để tạo mã QR tương ứng

![Tạo mã QR](img/Pasted%20image%2020250705094237.png)

#### Hiển thị mã QR và thông báo
- Hiển thị mã QR lên màn hình thiết bị
- Phát thông báo âm thanh: "Mã sẽ hết hạn sau 60 giây"
- Sử dụng các lệnh: `AT+DISPLAY_CLEAR`, `AT+STR_DISPLAY`, `AT+QR_DISPLAY`, `AT+PLAY_AUDIO`

![Hiển thị mã QR](img/Pasted%20image%2020250705094503.png)

#### Xử lý timeout
- Nếu quá 60 giây vẫn chưa nhận được thanh toán
- Hiển thị thông báo giao dịch thất bại
- Phát âm thanh thông báo lỗi

![Xử lý timeout](img/Pasted%20image%2020250705094603.png)

### 4.2 Giả lập thanh toán thành công

Chức năng này cho phép kiểm thử giao diện thanh toán thành công:
- Hiển thị giao diện thanh toán thành công
- Phát âm thanh thông báo số tiền đã được thanh toán

![Giả lập thanh toán thành công](img/Pasted%20image%2020250705094756.png)

### 4.3 Khối các chức năng hệ thống

Mỗi nút được gắn với một chức năng hệ thống, khi nhấn sẽ tự động gửi command tương ứng đến thiết bị:

![Khối chức năng hệ thống](img/Pasted%20image%2020250705095256.png)

Các command được liệt kê tương ứng:

![Danh sách commands 1](img/Pasted%20image%2020250705095342.png)

![Danh sách commands 2](img/Pasted%20image%2020250705100037.png)

### 4.4 Khối hiển thị tuỳ chọn trên màn hình

Cho phép hiển thị mã QR, văn bản và hình ảnh tuỳ chọn lên màn hình:
- Các hàm sẽ nhận tham số từ input box
- Tạo command và gửi đến thiết bị

![Khối hiển thị tuỳ chọn](img/Pasted%20image%2020250705100317.png)

---

## 5. Tóm tắt

Web UI Y80C cung cấp giao diện điều khiển trực quan cho thiết bị Tingee Box Y80C với các chức năng chính:

1. **Tạo và quản lý giao dịch thanh toán** - Tích hợp VietQR API
2. **Điều khiển hiển thị** - QR code, văn bản, hình ảnh
3. **Quản lý âm thanh** - Điều chỉnh âm lượng và phát âm thanh
4. **Chức năng hệ thống** - Kiểm tra phiên bản, khởi động lại, reset
5. **Giám sát** - Log phản hồi từ thiết bị

Tất cả các chức năng đều thông qua việc gửi AT commands qua USB Serial Protocol đến thiết bị Y80C.
