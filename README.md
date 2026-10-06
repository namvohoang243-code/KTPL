# CAREER MAP — Khám Phá Tính Cách, Tìm Ra Hướng Nghề Nghiệp

Một nền tảng EdTech / Career Discovery hiện đại bằng tiếng Việt, được xây dựng theo phong cách **Modern EdTech + Futuristic + Minimal + Premium**.

Ứng dụng giúp học sinh thực hiện bài đánh giá 20 câu hỏi dựa trên mô hình **RIASEC / Holland**, phân tích tính cách đa chiều, trực quan hóa bằng biểu đồ Radar & Breakdown thanh tiến độ, gợi ý nhóm nghề tương thích cao và cung cấp **Class Insight Dashboard** tổng hợp dữ liệu lớp học với thống kê trực quan và quản trị CSV.

---

## 🌟 Tính Năng Nổi Bật

### 1. Landing Page (Trang chủ)
- **Hero Section**: Badge "CAREER DISCOVERY • 2026", tiêu đề lớn "Hiểu chính mình. Chọn đúng tương lai.", kèm visual abstract tương tác nối liền 3 tầng: *Personality → Strengths → Career*.
- **Mô hình RIASEC 6 nhóm**: Tab tương tác trực quan cho 6 nhóm (R - Người thực tế, I - Người khám phá, A - Người sáng tạo, S - Người hỗ trợ, E - Người dẫn dắt, C - Người tổ chức) với mô tả, điểm mạnh, môi trường phù hợp và ví dụ nghề nghiệp.
- **Section "Bạn sẽ khám phá được gì?"**: 3 thẻ trình diễn lộ trình nhận thức bản thân.

### 2. Giới Thiệu & Thể Lệ Test (`/intro`)
- 3 bước rõ ràng: Làm bài test (5–7 phút) → Phân tích tính cách → Khám phá nghề nghiệp.
- Nhấn mạnh tính bảo mật: không thu thập thông tin cá nhân (họ tên, email, SĐT).
- Disclaimer rõ ràng: công cụ khám phá xu hướng sở thích, không phải chẩn đoán tâm lý.

### 3. Bài Test 20 Câu Hỏi Chuẩn Hóa (`/quiz`)
- **Question Engine**: Tách rời dữ liệu và UI; hỗ trợ phân loại 1 hoặc nhiều nhóm RIASEC, hỗ trợ câu hỏi chấm điểm đảo ngược (*reverse scoring*), chuẩn hóa điểm theo tỷ lệ % từ 0 đến 100.
- **Thang đo 5 mức Likert**: Từ *1 — Hoàn toàn không giống tôi* đến *5 — Rất giống tôi*.
- **Điều hướng mượt mà**: Có nút "Trước" / "Tiếp", không cho phép bỏ trống, hỗ trợ phím tắt số `1`–`5` và phím mũi tên.
- **Màn hình Analyzing (1.7s)**: Loading animation cao cấp, mô phỏng quá trình chuẩn hóa câu trả lời và so khớp nghề nghiệp trước khi chuyển hướng sang trang kết quả.

### 4. Kết Quả Khám Phá & Đề Xuất Nghề Nghiệp (`/result`)
- **Personality Badge**: Huy hiệu nhóm tính cách chủ đạo lớn (Ví dụ: INVESTIGATIVE / I-R-C) với vòng tròn vẽ động.
- **Personality Radar Chart**: Biểu đồ mạng nhện 6 trục RIASEC với hiệu ứng vẽ mượt bằng Recharts.
- **Top 3 Nhóm & 6 Thanh Tiến Độ (Score Bars)**: Hiệu ứng đếm số (Count-up animation) và thanh tiến độ màu sắc đặc trưng từng nhóm.
- **"Điều gì nổi bật ở bạn?"**: Các thẻ phân tích thế mạnh được **sinh động theo điểm số thực tế** của người dùng (tính toán dựa trên khoảng cách giữa các nhóm và bộ insight riêng của từng nhóm).
- **Gợi Ý Nghề Nghiệp (Career Recommendation)**: Tính toán % độ tương thích (*Compatibility score*) dựa trên thuật toán so khớp mã Holland và điểm số người dùng.
- **Career Detail Modal**: Xem chi tiết từng nghề (mô tả, độ khớp, kỹ năng cần thiết, môi trường làm việc).
- **Your Career Profile**: Tóm tắt hồ sơ và nút chia sẻ ẩn danh vào dữ liệu lớp.

### 5. Thống Kê Lớp Học (`/class`)
- **Class Overview**: Thống kê số lượng người tham gia, số nhóm tính cách, số nhóm nghề và nhóm dẫn đầu với hiệu ứng đếm số.
- **Donut Chart**: Tỷ lệ phân bố nhóm tính cách chủ đạo trong lớp, hover hiển thị số lượng và phần trăm.
- **Bar Chart Điểm Trung Bình Lớp**: So sánh mức điểm trung bình cả lớp ở cả 6 nhóm RIASEC.
- **Horizontal Bar Chart**: Các nhóm nghề nghiệp được học sinh quan tâm nhiều nhất.
- **Personality × Career Heatmap Matrix**: Ma trận nhiệt trực quan hóa mối liên hệ giữa nhóm tính cách và nhóm nghề, hover để xem số lượng học sinh tại từng giao điểm.
- **Class Insight (AI-style)**: Đúc kết tự động từ dữ liệu thật của lớp (nhóm dẫn đầu, xu hướng phân tích vs xã hội, độ đa dạng của lớp...).
- **So Sánh Cá Nhân (Student Comparison)**: So sánh hồ sơ cá nhân với mức trung bình lớp (radar overlay & thanh đối sánh song song).

### 6. Quản Trị & Import Dữ Liệu (`/admin`)
- Kéo thả file CSV điểm RIASEC của học sinh.
- Kiểm tra tính hợp lệ của file CSV: phát hiện cột thiếu, dòng lỗi, điểm số ngoài thang đo, tự động loại bỏ cột nhạy cảm (tên, email, SĐT).
- Xem trước bảng dữ liệu trước khi import.
- Hỗ trợ 2 chế độ: *Thay thế toàn bộ* hoặc *Thêm vào danh sách*.
- Tải file CSV mẫu (`template.csv`) và Xuất dữ liệu hiện tại ra file CSV.
- Nút "Khôi phục dữ liệu mẫu (30 học sinh demo)".

---

## 🛠️ Công Nghệ Sử Dụng

- **Frontend**: React 19, TypeScript (Strict mode)
- **Bundler & Dev Server**: Vite 8
- **Styling**: Tailwind CSS v4, Vanilla CSS Design System Tokens
- **Icons**: Lucide Icons
- **Animation**: Framer Motion
- **Data Visualization**: Recharts
- **Accessible Components**: Radix UI Dialog

---

## 🚀 Hướng Dẫn Chạy Dự Án

### Yêu cầu
- Đã cài đặt **Node.js** (khuyến nghị phiên bản LTS v20+ hoặc v24+).

### Cài đặt và khởi chạy:
```bash
# Di chuyển vào thư mục dự án
cd d:\webKTPL

# Cài đặt dependencies (nếu chưa cài)
npm install

# Khởi chạy server phát triển
npm run dev
```

Server sẽ chạy tại địa chỉ: **http://127.0.0.1:5173/**

### Kiểm tra kiểu dữ liệu & Build:
```bash
# Kiểm tra TypeScript
npm run typecheck

# Build bundle phục vụ production
npm run build
```

---

## 📁 Cấu Trúc Dự Án

```
d:/webKTPL/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── career/          # CareerCard, CareerDetail modal, CareerGrid
│   │   ├── class/           # ClassOverview, Donut, BarChart, Heatmap, AI Insights, Comparison
│   │   ├── home/            # Hero, HeroVisual node diagram, PersonalityExplorer, CtaBand
│   │   ├── layout/          # Navbar (blur on scroll, mobile menu), Footer
│   │   ├── quiz/            # QuizCard, ProgressBar, AnalyzingScreen
│   │   ├── result/          # ResultHeader, PersonalityRadar, ScoreBars, StrengthsSection, TopThree
│   │   ├── shared/          # CountUp, Reveal, SectionHeading, Disclaimer, TooltipCard, ErrorBoundary
│   │   └── ui/              # Button, Badge, Dialog
│   ├── data/
│   │   ├── careers.ts       # 12 Career clusters + 48 Occupations chi tiết
│   │   ├── demoStudents.ts  # Dataset 30 học sinh chuẩn (seeded PRNG)
│   │   ├── personalities.ts # 6 nhóm RIASEC (mô tả, đặc điểm, màu sắc, insights)
│   │   └── questions.ts     # 20 câu hỏi đánh giá kèm mã nhóm & reverse scoring
│   ├── engine/
│   │   ├── classInsights.ts # Bộ sinh nhận xét AI-style từ số liệu thống kê lớp
│   │   ├── classStats.ts    # Tính toán toàn bộ chỉ số, phân bố và ma trận lớp
│   │   ├── csv.ts           # Trình phân tích & xuất CSV, kiểm tra an toàn dữ liệu
│   │   ├── matching.ts      # Thuật toán tính % tương thích nghề nghiệp (Holland match)
│   │   ├── scoring.ts       # Chuẩn hóa điểm 0-100% cho 6 nhóm RIASEC
│   │   └── strengths.ts     # Sinh báo cáo phân tích điểm mạnh cá nhân hóa
│   ├── services/
│   │   └── storage.ts       # Storage Repository abstraction (LocalStorage / sẵn sàng mở rộng)
│   ├── store/
│   │   └── AppContext.tsx   # React Context quản lý state toàn cục
│   ├── types/
│   │   └── index.ts         # TypeScript domain types
│   ├── App.tsx              # Router & layout transitions
│   ├── index.css            # Design tokens, color palette, custom animations
│   ├── main.tsx             # Entry point
│   └── vite-env.d.ts
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts
```
