# 0. Lời nói đầu
- Đây là script cho thiết bị [[Y80C]] web UI documentation

---

# 1. Mục lục
- [0. Lời nói đầu](#0-lời-nói-đầu)
- [1. Mục lục](#1-mục-lục)
- [2. Nội dung](#2-nội-dung)
  - [2.1 Scope](#21-scope)
  - [2.2 Audience](#22-audience)
  - [2.3 Cài đặt ban đầu](#23-cài-đặt-ban-đầu)
  - [2.4 Tổng quan giao diện ](#24-tổng-quan-giao-diện)
    - [2.4.1 Khối tạo giao dịch thanh toán](#241-khối-tạo-giao-dịch-thanh-toán)
    - [2.4.2 Giả lập thanh toán thành công](#242-giả-lập-thanh-toán-thành-công)
    - [2.4.3 Khối các chức năng hệ thống](#243-khối-các-chức-năng-hệ-thống)
    - [2.4.4 Khối hiển thị tuỳ chọn trên màn hình](#244-khối-hiển-thị-tuỳ-chọn-trên-màn-hình)
- [3. Tóm tắt](#3-tóm-tắt)

---

# 2. Nội dung
## 2.1 Scope
- Tài liệu này hướng dẫn sử dụng WEB UI để điều khiển Tingee Box thiết bị Y80C
- Tài liệu hướng dẫn người dùng cách sử dụng WEB UI và cơ chế nạp lệnh vào thiết bị để chạy các tính năng đã được định sẵn (hiển thị ảnh, văn bản, phát âm thanh). Tài liệu **không bao gồm** việc hướng dẫn sửa các tham số mặc định của tính năng này.

## 2.2 Audience
- Tài liệu dành cho chuyên viên kỹ thuật của ngân hàng, giả sử người đọc đã có kiến thức về JavaScript.
- Người dùng **bắt buộc cần** phải đọc [[Y80C Instructions set]], web UI cung cấp giao diện trực quan để người dùng điều khiển, bản chất là nạp các lệnh thông qua cáp vào thiết bị.
- Hàm giúp nạp lệnh sang thiết bị và ghi lại log![[Pasted image 20250705093623.png]]

## 2.3 Cài đặt ban đầu
- Kết nối thiết bị với máy tính qua cáo USB **có thể truyền dữ liệu**, lúc này, máy tính và thiết bị sẽ giao tiếp với nhau qua USB Serial Protocol
- Tại WEB UI, chọn "Kết nối thiết bị"
- Nếu thành công, thanh trạng thái sẽ hiện "Đã kết nối" và chuyển sang màu xanh"
- Yêu cầu trình duyệt có hỗ trợ Web Serial API: Chrome (ver 89+) hoặc Edge (ver 90+)

## 2.4 Tổng quan giao diện 
- Giao diện web có các chức năng:
    - Khối tạo giao dịch thanh toán:
        - Gửi đến POS và hiển thị QR lên màn hình
        - Giả lập cho việc người dùng thanh toán thành công (để kiểm thử)
    - Khối chức năng, cài đặt:
        - Kiểm tra phiên bản: Xem phiên bản firmware hiện tại của thiết bị
        - Khởi động lại: Khởi động lại thiết bị
        - Xoá màn hình: Xoá toàn bộ màn hình đang hiển thị (thay bằng màu trắng)
        - Khôi phục cài đặt gốc: Đặt lại thiết bị
    - Khối điều khiển hiển thị: Thay đổi thông tin màn hình
        - Hiển thị mã QR: Hiển thị QR tuỳ chọn
        - Hiển thị văn bản: Hiển thị văn bản tuỳ chọn
        - Hiển thị hình ảnh: Hiển thị các hình ảnh mặc định
        - Hiển thị ảnh: Hiển thị các ảnh 0: logo khởi động, 1: ảnh thành công, 2: ảnh thất bại
    - Khối âm thanh:
        - Kiểm tra âm lượng tích hợp: Phát các âm lượng mặc định
        - Điều chỉnh âm lượng: Cài đặt 3 mức âm lượng: bé nhất, trung bình, lớn nhất
        - Phát tệp âm thanh tuỳ chỉnh: phát âm thanh khác
    - Khối log phản hồi từ thiết bị: Xem trạng thái thực thi của các lệnh
    - Ở phần dưới khi break down code sẽ gộp khối âm thanh vào 1.4.3 và 1.4.2 do mã nguồn giống nhau
![[Pasted image 20250705091952.png]]

### 2.4.1 Khối tạo giao dịch thanh toán
![[Pasted image 20250705094113.png]]
- Ta chia hàm này thành các khối nhỏ:
    - Đọc số tài khoản và số tiền, gọi API đến vietqr.io để tạo mã QR tương ứng![[Pasted image 20250705094237.png]]
    - Hiển thị lên màn hình và đọc thông báo mã sẽ hết hạn sau 60 giây: Sử dụng các lệnh AT+DISPLAY_CLEAR, AT+STR_DISPLAY, AT+QR_DISPLAY, AT+PLAY_AUDIO đã nêu trong [[Y80C Instructions set]]![[Pasted image 20250705094503.png]]
    - Nếu quá 60 giây vẫn chưa nhận được tiền, hiển thị thông báo giao dịch thất bại và phát ra loa![[Pasted image 20250705094603.png]]

### 2.4.2 Giả lập thanh toán thành công
- Nếu thanh toán thành công, hiển thị giao diện thanh toán thành công và đọc số tiền đã được thanh toán![[Pasted image 20250705094756.png]]

### 2.4.3 Khối các chức năng hệ thống
- Mỗi nút được gắn 1 chức năng, khi ấn sẽ tự gửi command tương ứng đến thiết bị![[Pasted image 20250705095256.png]]
- Các command được liệt kê tương ứng:![[Pasted image 20250705095342.png]]![[Pasted image 20250705100037.png]]

### 2.4.4 Khối hiển thị tuỳ chọn trên màn hình
- Cho phép hiển thị mã QR, văn bản và hình ảnh tuỳ chọn lên màn hình, các hàm sẽ nhận tham số là dữ liệu trong input box, sau đó tạo command rồi gửi đến thiết bị![[Pasted image 20250705100317.png]]

---

# 3. Tóm tắt