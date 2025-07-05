# Tóm tắt bộ lệnh AT cho thiết bị

| Lệnh                               | Chức năng                            | Ví dụ                         |
| :--------------------------------- | :----------------------------------- | :---------------------------- |
| `AT+VER`                           | Truy vấn phiên bản firmware.         | `AT+VER`                      |
| `AT+RESET`                         | Khởi động lại thiết bị.              | `AT+RESET`                    |
| `AT+FORMAT`                        | Khôi phục cài đặt gốc.               | `AT+FORMAT`                   |
| `AT+VOL=<Level>`                   | Cài đặt âm lượng (mức 0-7).          | `AT+VOL=5`                    |
| `AT+DISPLAY_CLEAR`                 | Xóa toàn bộ màn hình.                | `AT+DISPLAY_CLEAR`            |
| `AT+STR_DISPLAY=<Y>,<Size>,<Text>` | Hiển thị văn bản (cỡ 16, 24, 32).    | `AT+STR_DISPLAY=0,24,"Hello"` |
| `AT+QR_DISPLAY=0,<String>`         | Hiển thị mã QR từ chuỗi/URL.         | `AT+QR_DISPLAY=0,"tingee.vn"` |
| `AT+PIC_DISPLAY=9999,<Index>`      | Hiển thị ảnh có sẵn (index 0, 1, 2). | `AT+PIC_DISPLAY=9999,2`       |
| `AT+AUDIO_TEST=<Number>`           | Phát âm thanh có sẵn (số 0-6).       | `AT+AUDIO_TEST=2`             |
| `AT+PLAY_AUDIO=<FileName>`         | Phát âm thanh theo tên tệp.          | `AT+PLAY_AUDIO="sound.mp3"`   |