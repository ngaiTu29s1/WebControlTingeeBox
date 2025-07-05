// Khai báo biến toàn cục
let port;
let writer;
let reader;

// Lấy các element từ DOM
const connectButton = document.getElementById('connect-button');
const disconnectButton = document.getElementById('disconnect-button');
const statusDiv = document.getElementById('connection-status');
const logArea = document.getElementById('log');
const createPaymentButton = document.getElementById('create-payment-button');

// --- CÁC HÀM XỬ LÝ CHÍNH ---

// Hàm sleep để tạo độ trễ giữa các lệnh
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Hàm kết nối thiết bị
async function connectDevice() {
    try {
        port = await navigator.serial.requestPort();
        await port.open({ baudRate: 115200 });
        statusDiv.textContent = 'Đã kết nối';
        statusDiv.className = 'status-connected';
        
        const textEncoder = new TextEncoderStream();
        textEncoder.readable.pipeTo(port.writable);
        writer = textEncoder.writable.getWriter();
        
        const textDecoder = new TextDecoderStream();
        port.readable.pipeTo(textDecoder.writable);
        reader = textDecoder.readable.getReader();

        listenForData();
    } catch (error) {
        statusDiv.textContent = `Lỗi: ${error.message}`;
        statusDiv.className = 'status-disconnected';
    }
}

// Hàm ngắt kết nối
async function disconnectDevice() {
    if (!port) return;
    try {
        if (reader) {
            await reader.cancel();
            reader = null;
        }
        if (writer) {
            await writer.close();
            writer = null;
        }
        await port.close();
        port = null;
        statusDiv.textContent = 'Chưa kết nối';
        statusDiv.className = 'status-disconnected';
        logToScreen("Đã ngắt kết nối.\n");
    } catch (error) {
         logToScreen(`Lỗi khi ngắt kết nối: ${error.message}\n`);
    }
}

// Vòng lặp đọc dữ liệu từ thiết bị
async function listenForData() {
    logToScreen("Bắt đầu lắng nghe dữ liệu...\n");
    try {
        while (port && port.readable) {
            const { value, done } = await reader.read();
            if (done) break;
            logToScreen(`NHẬN: ${value}`);
        }
    } catch (error) {
        logToScreen(`Lỗi khi đọc dữ liệu: ${error.message}\n`);
        disconnectDevice();
    }
}

// Hàm gửi lệnh AT
async function sendATCommand(command) {
    if (!port || !writer) {
        alert("Vui lòng kết nối với thiết bị trước!");
        return;
    }
    const commandToSend = `${command}\r\n`;
    await writer.write(commandToSend);
    logToScreen(`GỬI: ${commandToSend}`);
}

// Hàm ghi log ra màn hình
function logToScreen(message) {
    logArea.value += message;
    logArea.scrollTop = logArea.scrollHeight;
}


// --- GÁN SỰ KIỆN CHO CÁC NÚT ---

// Nút kết nối / ngắt kết nối
connectButton.addErntListener('click', connectDevice);
disconnectButton.addEventListener('click', disconnectDevice);

// Các nút có lệnh AT cố định (data-command)
document.querySelectorAll('button[data-command]').forEach(button => {
    button.addEventListener('click', () => {
        sendATCommand(button.dataset.command);
    });
});

// Nút tạo giao dịch thanh toán
createPaymentButton.addEventListener('click', async () => {
    const accountNumber = document.getElementById('account-number').value;
    const amount = document.getElementById('payment-amount').value;

    if (!accountNumber || !amount) {
        alert("Vui lòng nhập đầy đủ Số tài khoản và Số tiền.");
        return;
    }
    if (!port) {
        alert("Vui lòng kết nối với thiết bị trước!");
        return;
    }

    const formattedAmount = new Intl.NumberFormat('vi-VN').format(amount) + ' VND';
    const qrString = `https://api.vietqr.io/v2/generate?accountNo=${accountNumber}&accountName=TEN CHU KHOAN&acqId=970415&amount=${amount}&addInfo=Thanh toan don hang`;

    logToScreen("--- Bắt đầu gửi lệnh giao dịch ---\n");
    
    await sendATCommand('AT+DISPLAY_CLEAR');
    await sleep(200); 
    await sendATCommand(`AT+STR_DISPLAY=0,24, Quét mã QR để thanh toán`);
    await sleep(200);
    await sendATCommand(`AT+QR_DISPLAY=0,${qrString}`);
    await sleep(200);
    await sendATCommand(`AT+STR_DISPLAY=260,24, Số tiền: ${formattedAmount}`);
    await sleep(200);
    await sendATCommand(`AT+STR_DISPLAY=280,16, STK: ${accountNumber}`);
    await sleep(200);
    await sendATCommand('AT+PLAY_AUDIO=warning_1min.mp3'); 

    logToScreen("--- Đã gửi xong lệnh giao dịch. Bắt đầu đếm ngược 60s ---\n");

    // ================= SỬA LỖI TẠI ĐÂY =================
    setTimeout(async () => { // Thêm async ở đây
        if (!port) {
            logToScreen("--- Hết giờ nhưng thiết bị đã ngắt kết nối ---\n");
            return;
        }
        logToScreen("--- Hết 60s, gửi lệnh hết hạn ---\n");

        // Thực hiện các lệnh tuần tự, có độ trễ
        await sendATCommand('AT+DISPLAY_CLEAR');
        await sleep(200);

        // Hiển thị ảnh thất bại (index 1). Nếu muốn về logo chính, dùng index 0
        await sendATCommand('AT+PIC_DISPLAY=9999,0'); 
        await sleep(200);

        // Chỉ phát âm thanh hết hạn tùy chỉnh, bỏ lệnh thừa
        await sendATCommand('AT+PLAY_AUDIO=timeout.mp3');

    }, 60000); // 60000 milliseconds = 60 seconds
    // ===================================================
});

// Các nút có tham số tùy chỉnh
document.getElementById('qr-button').addEventListener('click', () => {
    const text = document.getElementById('qr-text').value;
    if (text) sendATCommand(`AT+QR_DISPLAY=0,${text}`);
    else alert("Vui lòng nhập text hoặc URL cho mã QR.");
});

document.getElementById('text-button').addEventListener('click', () => {
    const text = document.getElementById('text-display').value;
    const y = document.getElementById('text-y').value;
    const size = document.getElementById('text-size').value;
    if (text) sendATCommand(`AT+STR_DISPLAY=${y},${size},${text}`);
    else alert("Vui lòng nhập văn bản cần hiển thị.");
});

document.getElementById('audio-button').addEventListener('click', () => {
    const filename = document.getElementById('audio-filename').value;
    if (filename) sendATCommand(`AT+PLAY_AUDIO=${filename}`);
    else alert("Vui lòng nhập tên tệp âm thanh.");
});

document.getElementById('image-index-button').addEventListener('click', () => {
    const index = document.getElementById('image-index').value;
    if (index !== '' && !isNaN(index)) sendATCommand(`AT+PIC_DISPLAY=9999,${index}`);
    else alert("Vui lòng nhập một chỉ số hợp lệ (ví dụ: 0, 1, hoặc 2).");
});

// Kiểm tra ban đầu xem Web Serial có được hỗ trợ không
if (!("serial" in navigator)) {
    alert("Trình duyệt của bạn không hỗ trợ Web Serial API. Vui lòng sử dụng Chrome hoặc Edge phiên bản mới nhất.");
    connectButton.disabled = true;
    disconnectButton.disabled = true;
}

// --- BẮT ĐẦU PHẦN MÃ MỚI ---

// Lấy element của nút giả lập
const simulateSuccessButton = document.getElementById('simulate-success-button');

// Gán sự kiện click cho nút giả lập thanh toán thành công
simulateSuccessButton.addEventListener('click', async () => {
    // Lấy số tiền từ ô nhập liệu
    const amount = document.getElementById('payment-amount').value;

    // Kiểm tra điều kiện đầu vào
    if (!amount) {
        alert("Vui lòng nhập Số tiền trước khi giả lập.");
        return;
    }
    if (!port) {
        alert("Vui lòng kết nối với thiết bị trước!");
        return;
    }
    
    logToScreen("--- Giả lập thanh toán thành công ---\n");
    
    // Bắt đầu chuỗi lệnh tuần tự
    // 1. Xóa màn hình
    await sendATCommand('AT+DISPLAY_CLEAR');
    await sleep(200);
    
    // 2. Hiển thị ảnh thành công (index 2)
    await sendATCommand('AT+PIC_DISPLAY=9999,2');
    await sleep(200);
    
    // 3. Hiển thị dòng chữ "Thanh toán thành công"
    await sendATCommand('AT+STR_DISPLAY=0,24, Thanh toán thành công');
    await sleep(200);

    await sendATCommand(`AT+STR_DISPLAY=260,24, Số tiền: ${formattedAmount}`);
    await sleep(200);

    // 4. Gửi lệnh đọc số tiền trực tiếp đến firmware
    await sendATCommand(`AT+PAY_AUDIO=${amount}`);
});

// --- KẾT THÚC PHẦN MÃ MỚI ---