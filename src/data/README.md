# Dữ liệu môn Cơ Sở Dữ Liệu

## 1. Phương thức khai thác
- Khai thác bằng **API** được cung cấp bởi: [https://open-meteo.com/](https://open-meteo.com/)

## 2. Khoảng thời gian khai thác 
- Từ **01/01/2019** đến **22/09/2025**

## 3. Thông tin dữ liệu

## 3.0 Thông tin chung
- Hiện tại đang khai thác 3 dữ liệu chính là **Độ ẩm**, **Lượng mưa**, **Nhiệt độ**
- **Ngoài ra** [https://open-meteo.com/](https://open-meteo.com/) có cung cấp rất nhiều thông tin khác như **Tốc độ gió**, **Nhiệt độ mặt đất**, **Chỉ số UV**

### 3.1. Độ ẩm
- **File**: `humidity_data.json`  
- **Mô tả**: Thông tin độ ẩm trong ngày các khu vực  
- **Đơn vị đo**: `%/ngày`

---

### 3.2. Lượng mưa
- **File**: `precipitation_data.json`  
- **Mô tả**: Thông tin lượng mưa trong ngày các khu vực  
- **Đơn vị đo**: `mm/ngày`

---

### 3.3. Nhiệt độ
- **File**: `temperature_data.json`  
- **Mô tả**: Thông tin nhiệt độ trong ngày các khu vực  
- **Đơn vị đo**: `°C/ngày`  
- **Thông tin khác**: Bao gồm nhiệt độ **cao nhất**, **thấp nhất**, và **trung bình** trong ngày

---

### 3.4. Khu vực
- **File**: `regions_list.json`  
- **Mô tả**: Thông tin các khu vực dùng để khai thác dữ liệu  
- **Thông tin khác**: Bao gồm **kinh độ**, **vĩ độ**, **tên thành phố**, **châu lục** (hiện tại có thông tin của 26 khu vực)
