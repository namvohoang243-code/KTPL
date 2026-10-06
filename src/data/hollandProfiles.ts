import type { PersonalityCode } from '@/types'

export interface PersonalityArchetype {
  title: string
  subtitle: string
  thinkStyle: string
  socialStyle: string
  innerDrive: string
  pitfall: string
  idealEnvironment: string
  examBlocks: string[]
  recommendedMajors: string[]
  naturalFits: {
    title: string
    reason: string
    matchPct: number
  }[]
  futureFits: {
    title: string
    reason: string
    trend: string
  }[]
  cautionRoles: {
    title: string
    reason: string
  }[]
}

export const HOLLAND_ARCHETYPES: Record<PersonalityCode, PersonalityArchetype> = {
  R: {
    title: 'Người Kiến tạo & Thực thi',
    subtitle: 'Thực tế • Trực quan • Kiên trì • Vận hành',
    thinkStyle: 'Tư duy cơ học, tiếp thu nhanh nhất qua sơ đồ, mẫu vật và thao tác thực nghiệm.',
    socialStyle: 'Thẳng thắn, tôn trọng sự minh bạch; thích dùng kết quả thực tế để chứng minh hơn tranh luận bằng lời.',
    innerDrive: 'Cảm giác thỏa mãn khi biến một bản vẽ trên giấy thành sản phẩm thực tế cầm nắm và vận hành được.',
    pitfall: 'Dễ chán ngắt khi phải ngồi họp lý thuyết kéo dài hoặc xử lý thủ tục giấy tờ hành chính rườm rà.',
    idealEnvironment: 'Xưởng công nghệ cao, phòng lab thử nghiệm, công trường hiện đại, trung tâm robotics.',
    examBlocks: ['A00 (Toán, Lý, Hóa)', 'A01 (Toán, Lý, Anh)', 'B00 (Toán, Hóa, Sinh)'],
    recommendedMajors: [
      'Kỹ thuật Cơ điện tử & Robotics',
      'Kỹ thuật Điện - Điện tử',
      'Khoa học Máy tính & Kỹ thuật Mạng',
      'Kỹ thuật Xây dựng & Giao thông',
      'Công nghệ Nông nghiệp Công nghệ cao',
    ],
    naturalFits: [
      {
        title: 'Kỹ sư Cơ khí / Robotics & Tự động hóa',
        reason: 'Phát huy tối đa bản năng bóc tách máy móc và tối ưu hóa hệ thống vận hành.',
        matchPct: 98,
      },
      {
        title: 'Kỹ sư Hạ tầng Mạng & Phần cứng Viễn thông',
        reason: 'Sự kết hợp giữa công nghệ hiện đại và kiểm soát thiết bị vật lý trực tiếp.',
        matchPct: 94,
      },
      {
        title: 'Kỹ thuật viên Thiết bị Y tế Chẩn đoán Hình ảnh',
        reason: 'Vận hành các hệ thống máy móc y khoa tinh vi (MRI, CT, X-quang) cứu chữa người bệnh.',
        matchPct: 92,
      },
    ],
    futureFits: [
      {
        title: 'Kỹ sư Vận hành Xe tự hành & Drone Công nghiệp',
        reason: 'Làn sóng giao thông thông minh và giám sát tự động hóa đòi hỏi kỹ năng vận hành công cụ cấp tiến.',
        trend: 'Tăng trưởng 35%/năm',
      },
      {
        title: 'Chuyên gia Nông nghiệp Chính xác (Smart AgriTech)',
        reason: 'Ứng dụng cảm biến IoT và thiết bị bay tự động để kiểm soát trang trại quy mô lớn.',
        trend: 'Xu hướng bền vững ESG',
      },
    ],
    cautionRoles: [
      {
        title: 'Chuyên viên Hành chính / Lưu trữ Văn bản',
        reason: 'Công việc ngồi yên một chỗ, thủ tục lặp lại thiếu tính tương tác vật lý dễ gây bức bối.',
      },
      {
        title: 'Tư vấn Tài chính qua điện thoại (Telesales)',
        reason: 'Đòi hỏi kỹ năng thuyết phục bằng lời liên tục và không tạo ra sản phẩm hữu hình.',
      },
    ],
  },

  I: {
    title: 'Nhà Khám phá & Nghiên cứu',
    subtitle: 'Logic • Phản biện • Mổ xẻ nguyên nhân • Tò mò',
    thinkStyle: 'Tư duy quy nạp sắc bén, luôn đòi hỏi bằng chứng xác thực và không chấp nhận các kết luận hời hợt.',
    socialStyle: 'Độc lập, điềm tĩnh, thích làm việc với các chuyên gia có cùng chiều sâu tư duy hơn là đám đông ồn ào.',
    innerDrive: 'Khao khát tìm ra lời giải cho những bài toán hóc búa và giải mã bản chất các hiện tượng mơ hồ.',
    pitfall: 'Dễ sa đà vào việc nghiên cứu quá sâu (Over-analyzing) mà chậm đưa ra quyết định hành động thực tế.',
    idealEnvironment: 'Viện nghiên cứu, phòng R&D, trung tâm phân tích dữ liệu, bệnh viện tuyến đầu, công ty công nghệ AI.',
    examBlocks: ['A00 (Toán, Lý, Hóa)', 'A01 (Toán, Lý, Anh)', 'B00 (Toán, Hóa, Sinh)', 'D07 (Toán, Hóa, Anh)'],
    recommendedMajors: [
      'Khoa học Dữ liệu (Data Science) & Trí tuệ Nhân tạo',
      'Y Đa khoa & Dược học Nghiên cứu',
      'Công nghệ Sinh học & Y sinh (Biotechnology)',
      'An toàn Thông tin & An ninh Mạng',
      'Kinh tế Học & Phân tích Tài chính Định lượng',
    ],
    naturalFits: [
      {
        title: 'Nhà Khoa học Dữ liệu (Data Scientist)',
        reason: 'Khai phá các quy luật ẩn sâu trong hàng triệu dòng dữ liệu để dự báo xu hướng.',
        matchPct: 99,
      },
      {
        title: 'Bác sĩ Chuyên khoa Nội / Y học Thực chứng',
        reason: 'Năng lực chẩn đoán dựa trên phân tích triệu chứng và bằng chứng lâm sàng tinh tế.',
        matchPct: 96,
      },
      {
        title: 'Kỹ sư Nghiên cứu Thuật toán AI / Machine Learning',
        reason: 'Thỏa mãn niềm đam mê giải mã các mô hình toán học phức tạp cho máy tính học tập.',
        matchPct: 95,
      },
    ],
    futureFits: [
      {
        title: 'Chuyên gia Bảo mật AI & Phòng chống Gian lận Số',
        reason: 'Sự bùng nổ của tội phạm mạng đòi hỏi tư duy điều tra logic và truy vết nguyên nhân.',
        trend: 'Nhu cầu nhân lực toàn cầu',
      },
      {
        title: 'Nhà Nghiên cứu Sinh học Phân tử & Gene',
        reason: 'Kỷ nguyên y học cá thể hóa mở ra cơ hội đột phá trong điều trị bệnh nan y.',
        trend: 'Đột phá thế kỷ 21',
      },
    ],
    cautionRoles: [
      {
        title: 'Nhân viên Bán hàng Trực tiếp (Sales)',
        reason: 'Áp lực chỉ số doanh số tức thì và việc phải chiều lòng cảm xúc khách hàng ngắn hạn.',
      },
      {
        title: 'Quản lý Sự kiện / Hậu cần Lễ hội',
        reason: 'Môi trường quá ồn ào, biến số phi logic và thiếu không gian tĩnh lặng để suy ngẫm.',
      },
    ],
  },

  A: {
    title: 'Nhà Sáng tạo & Kiến tạo Bản sắc',
    subtitle: 'Độc bản • Trực giác • Thẩm mỹ • Phi tuyến tính',
    thinkStyle: 'Tư duy liên tưởng đa chiều, kết nối những yếu tố tưởng như không liên quan thành ý tưởng mới mẻ.',
    socialStyle: 'Cởi mở, biểu cảm, trân trọng cá tính riêng; ghét sự bắt chước hoặc ép buộc theo khuôn mẫu.',
    innerDrive: 'Khao khát tạo ra các tác phẩm/sản phẩm có chiều sâu cảm xúc và mang đậm dấu ấn cá nhân.',
    pitfall: 'Tâm trạng dễ dao động theo cảm hứng (mood-driven); đôi khi gặp khó khăn với kỷ luật thời hạn (deadlines).',
    idealEnvironment: 'Studio sáng tạo, agency truyền thông, xưởng thiết kế, công ty game, không gian làm việc tự do.',
    examBlocks: ['H00 (Văn, Vẽ 1, Vẽ 2)', 'V00 (Toán, Lý, Vẽ)', 'D01 (Toán, Văn, Anh)', 'D14 (Văn, Sử, Anh)'],
    recommendedMajors: [
      'Thiết kế Đồ họa (Graphic Design) & Mỹ thuật Số',
      'Thiết kế Trải nghiệm Người dùng (UI/UX Design)',
      'Truyền thông Đa phương tiện & Sản xuất Phim',
      'Thiết kế Nội thất & Thời trang',
      'Biên kịch, Báo chí & Sáng tạo Nội dung Số',
    ],
    naturalFits: [
      {
        title: 'Giám đốc Nghệ thuật (Art Director) / UI-UX Designer',
        reason: 'Kết hợp gu thẩm mỹ đỉnh cao với khả năng thấu hiểu hành vi thị giác người xem.',
        matchPct: 98,
      },
      {
        title: 'Chuyên gia Sáng tạo Nội dung (Creative Lead / Copywriter)',
        reason: 'Sức mạnh ngôn từ và góc nhìn độc lạ giúp thương hiệu chạm tới cảm xúc khán giả.',
        matchPct: 95,
      },
      {
        title: 'Thiết kế Trò chơi & Hiệu ứng Hình ảnh (Game Artist / VFX)',
        reason: 'Không gian vô hạn để xây dựng thế giới ảo sống động từ trí tưởng tượng.',
        matchPct: 93,
      },
    ],
    futureFits: [
      {
        title: 'Nhà Thiết kế Thế giới Ảo (Virtual World & XR Designer)',
        reason: 'Môi trường thực tế ảo (VR/AR) đang khát khao những nhà sáng tạo không gian và trải nghiệm giác quan.',
        trend: 'Kỷ nguyên Thực tế Mở rộng',
      },
      {
        title: 'Đạo diễn Nghệ thuật Trí tuệ Nhân tạo (AI Art Director)',
        reason: 'Dẫn dắt các công cụ AI tạo sinh (GenAI) bằng tư duy mỹ thuật độc bản và ngôn ngữ thị giác.',
        trend: 'Nghề mới đón đầu 2026+',
      },
    ],
    cautionRoles: [
      {
        title: 'Kiểm toán viên Tuân thủ (Compliance Auditor)',
        reason: 'Mọi thao tác phải bám sát 100% điều luật khắt khe, hoàn toàn triệt tiêu tính sáng tạo cá nhân.',
      },
      {
        title: 'Nhập liệu Kế toán Kho vận',
        reason: 'Sự lặp lại máy móc sẽ nhanh chóng làm thui chột năng lượng sáng tạo.',
      },
    ],
  },

  S: {
    title: 'Người Kết nối & Nâng đỡ Con người',
    subtitle: 'Thấu cảm • Tận tâm • Lắng nghe • Giáo dục',
    thinkStyle: 'Tư duy lấy con người làm trung tâm (Human-centered), luôn cân nhắc cảm xúc và tác động đến người khác.',
    socialStyle: 'Ấm áp, nhẫn nại, có năng khiếu giải tỏa căng thẳng và khơi gợi tiềm năng ở người đối diện.',
    innerDrive: 'Cảm giác hạnh phúc và ý nghĩa khi chứng kiến một người khác tiến bộ, vui vẻ và tự tin hơn.',
    pitfall: 'Dễ ôm đồm cảm xúc tiêu cực của người khác; đôi khi ngại từ chối dẫn đến quá tải tinh thần.',
    idealEnvironment: 'Trường học, trung tâm tư vấn tâm lý, tổ chức phi chính phủ (NGO), bệnh viện, phòng nhân sự.',
    examBlocks: ['D01 (Toán, Văn, Anh)', 'C00 (Văn, Sử, Địa)', 'B00 (Toán, Hóa, Sinh)', 'D14 (Văn, Sử, Anh)'],
    recommendedMajors: [
      'Tâm lý học Lâm sàng & Tham vấn Học đường',
      'Sư phạm & Quản trị Giáo dục',
      'Quản trị Nhân sự & Đào tạo Phát triển (L&D)',
      'Công tác Xã hội & Phát triển Cộng đồng',
      'Điều dưỡng & Chăm sóc Sức khỏe Cộng đồng',
    ],
    naturalFits: [
      {
        title: 'Chuyên gia Tâm lý Học đường / Trị liệu Tâm lý',
        reason: 'Khả năng lắng nghe không phán xét giúp người khác chữa lành và hiểu rõ bản thân.',
        matchPct: 98,
      },
      {
        title: 'Giảng viên / Chuyên viên Đào tạo Doanh nghiệp (L&D)',
        reason: 'Truyền cảm hứng học tập và kiên nhẫn dẫn dắt người học từ chưa biết đến thành thạo.',
        matchPct: 96,
      },
      {
        title: 'Đối tác Nhân sự (HR Business Partner)',
        reason: 'Cầu nối gắn kết giữa mục tiêu công ty và sự phát triển hạnh phúc của nhân viên.',
        matchPct: 94,
      },
    ],
    futureFits: [
      {
        title: 'Chuyên gia Chăm sóc Sức khỏe Tinh thần Số (Digital Well-being)',
        reason: 'Áp lực thời đại số khiến nhu cầu hỗ trợ tâm lý từ xa và cân bằng cuộc sống tăng vọt.',
        trend: 'Tăng trưởng cấp số nhân',
      },
      {
        title: 'Quản lý Trải nghiệm Khách hàng & Cộng đồng (Community Lead)',
        reason: 'Xây dựng mối quan hệ tin cậy bền vững giữa thương hiệu và cộng đồng người dùng trung thành.',
        trend: 'Xu hướng doanh nghiệp hiện đại',
      },
    ],
    cautionRoles: [
      {
        title: 'Kỹ sư Vi mạch / Lập trình Độc lập cô lập',
        reason: 'Làm việc thời gian dài không có tương tác con người sẽ khiến bạn cảm thấy cạn kiệt năng lượng.',
      },
      {
        title: 'Thẩm phán / Trọng tài Cạnh tranh khốc liệt',
        reason: 'Phải đưa ra các phán quyết cứng rắn không khoan nhượng dễ gây xung đột nội tâm.',
      },
    ],
  },

  E: {
    title: 'Nhà Tiên phong & Dẫn dắt Cơ hội',
    subtitle: 'Bản lĩnh • Thuyết phục • Chiến lược • Mục tiêu lớn',
    thinkStyle: 'Tư duy chiến lược, nhạy bén với cơ hội thị trường và khả năng nhìn ra bức tranh tổng thể.',
    socialStyle: 'Tự tin, quyết đoán, có sức hút lôi cuốn tự nhiên; dám đứng mũi chịu sào trước tập thể.',
    innerDrive: 'Khát khao chinh phục những thử thách lớn, kiến tạo tầm ảnh hưởng và đạt kết quả vượt trội.',
    pitfall: 'Đôi khi nóng vội với các chi tiết tỉ mỉ; có thể áp đặt ý kiến lên người khác nếu thiếu kiên nhẫn.',
    idealEnvironment: 'Doanh nghiệp khởi nghiệp, tập đoàn đa quốc gia, phòng kinh doanh chiến lược, sàn giao dịch, công ty luật.',
    examBlocks: ['A01 (Toán, Lý, Anh)', 'D01 (Toán, Văn, Anh)', 'D07 (Toán, Hóa, Anh)', 'A00 (Toán, Lý, Hóa)'],
    recommendedMajors: [
      'Quản trị Kinh doanh & Khởi nghiệp Đổi mới',
      'Marketing & Quản trị Thương hiệu (Brand Management)',
      'Thương mại Quốc tế & Kinh doanh Số (E-Commerce)',
      'Luật Kinh tế & Đàm phán Quốc tế',
      'Tài chính - Ngân hàng & Quản lý Đầu tư',
    ],
    naturalFits: [
      {
        title: 'Nhà Khởi nghiệp (Founder) / Quản lý Dự án (Project Manager)',
        reason: 'Khả năng định hình tầm nhìn, huy động nguồn lực và thúc đẩy toàn đội tiến lên.',
        matchPct: 98,
      },
      {
        title: 'Giám đốc Thương hiệu (Brand Manager) / Marketing Director',
        reason: 'Truyền thông bùng nổ, định vị vị thế dẫn đầu trên thị trường cạnh tranh.',
        matchPct: 95,
      },
      {
        title: 'Luật sư Kinh tế / Chuyên gia Đàm phán Hợp đồng',
        reason: 'Sự sắc sảo trong lập luận và bản lĩnh bảo vệ lợi ích chiến lược cho khách hàng.',
        matchPct: 92,
      },
    ],
    futureFits: [
      {
        title: 'Giám đốc Tăng trưởng Sản phẩm Số (Product Growth Lead)',
        reason: 'Tối ưu hóa phễu tăng trưởng người dùng và doanh thu cho các ứng dụng công nghệ.',
        trend: 'Mức đãi ngộ top đầu thị trường',
      },
      {
        title: 'Chuyên gia Chiến lược Chuyển đổi Số (Digital Transformation)',
        reason: 'Tái cấu trúc các mô hình kinh doanh truyền thống sang vận hành số hóa.',
        trend: 'Trọng tâm phát triển kinh tế',
      },
    ],
    cautionRoles: [
      {
        title: 'Chuyên viên Nghiên cứu Lưu trữ Tài liệu',
        reason: 'Môi trường thụ động, thiếu tính cạnh tranh và cơ hội dẫn dắt sẽ làm bạn mất động lực.',
      },
      {
        title: 'Kiểm toán Chi tiết Sổ sách',
        reason: 'Bị bó buộc trong những con số quá khứ thay vì tìm kiếm cơ hội tương lai.',
      },
    ],
  },

  C: {
    title: 'Nhà Tổ chức & Chuẩn hóa Hệ thống',
    subtitle: 'Chuẩn xác • Kỷ luật • Ngăn nắp • Ổn định',
    thinkStyle: 'Tư duy cấu trúc và logic tuần tự; xuất sắc trong việc phát hiện sai lệch và tối ưu hóa quy trình.',
    socialStyle: 'Đúng giờ, đáng tin cậy, tôn trọng cam kết; làm việc minh bạch theo đúng tiêu chuẩn đề ra.',
    innerDrive: 'Cảm giác an tâm khi biến một mớ hỗn độn thành quy trình trật tự, chuẩn xác và kiểm soát được.',
    pitfall: 'Khá thận trọng trước những thay đổi đột ngột; có xu hướng lo lắng khi thiếu thông tin rõ ràng.',
    idealEnvironment: 'Hệ thống ngân hàng, công ty kiểm toán Big 4, phòng quản trị rủi ro, trung tâm dữ liệu, bộ phận logistics.',
    examBlocks: ['A00 (Toán, Lý, Hóa)', 'A01 (Toán, Lý, Anh)', 'D01 (Toán, Văn, Anh)', 'D07 (Toán, Hóa, Anh)'],
    recommendedMajors: [
      'Kiểm toán (Auditing) & Kế toán Tài chính Quốc tế (ACCA/CPA)',
      'Hệ thống Thông tin Quản lý (MIS)',
      'Quản lý Chuỗi Cung ứng & Logistics',
      'Quản trị Rủi ro & Phân tích Tín dụng',
      'Khoa học Dữ liệu & Quản trị Cơ sở Dữ liệu (DBA)',
    ],
    naturalFits: [
      {
        title: 'Kiểm toán viên Độc lập (Auditor - Big 4)',
        reason: 'Mắt nhìn sắc sảo với các con số và tính kỷ luật chuẩn mực nghề nghiệp cao nhất.',
        matchPct: 98,
      },
      {
        title: 'Chuyên gia Quản lý Chuỗi Cung ứng & Kho vận (Supply Chain)',
        reason: 'Tối ưu hóa hàng nghìn mắt xích vận chuyển hàng hóa chính xác đến từng phút.',
        matchPct: 95,
      },
      {
        title: 'Chuyên viên Phân tích Rủi ro Tài chính & Pháp chế',
        reason: 'Lá chắn an toàn bảo vệ tổ chức trước các rủi ro vận hành và sai sót quy định.',
        matchPct: 93,
      },
    ],
    futureFits: [
      {
        title: 'Kiểm toán An ninh Dữ liệu & Tuân thủ AI (AI Governance Auditor)',
        reason: 'Làn sóng trí tuệ nhân tạo cần những chuyên gia thiết lập tiêu chuẩn đạo đức và bảo mật dữ liệu.',
        trend: 'Quy định pháp lý mới toàn cầu',
      },
      {
        title: 'Kiến trúc sư Vận hành Đám mây (Cloud Operations Specialist)',
        reason: 'Duy trì sự ổn định 99.99% cho các hệ thống máy chủ dịch vụ số khổng lồ.',
        trend: 'Xương sống kinh tế số',
      },
    ],
    cautionRoles: [
      {
        title: 'Diễn viên Ngẫu hứng / Nghệ thuật Tự do hoàn toàn',
        reason: 'Môi trường hoàn toàn không có kế hoạch hay tiêu chuẩn rõ ràng sẽ gây căng thẳng cực độ.',
      },
      {
        title: 'Môi giới Bất động sản mạo hiểm',
        reason: 'Thu nhập bấp bênh và rủi ro cao đi ngược lại nhu cầu ổn định và có thể dự đoán.',
      },
    ],
  },
}

/**
 * Custom synergy decode for 3-letter Holland codes (e.g. ASE, RIA, IEC, IAR, IAE...)
 */
export function getHollandCodeSynergy(code: string): {
  headline: string
  coreDescription: string
  superpower: string
} {
  const norm = code.toUpperCase().replace(/[^RIASEC]/g, '').slice(0, 3)

  const COMBOS: Record<string, { headline: string; coreDescription: string; superpower: string }> = {
    ASE: {
      headline: 'Nhà Truyền thông & Sáng tạo Tiên phong',
      coreDescription: 'Sự giao thoa độc đáo giữa Nghệ thuật (A), Thấu cảm con người (S) và Bản lĩnh lãnh đạo (E). Bạn có khả năng cảm nhận tâm lý đám đông, tạo ra nội dung đột phá và dẫn dắt tập thể lan tỏa thông điệp mạnh mẽ.',
      superpower: 'Biến những ý tưởng giàu tính nhân văn thành các chiến dịch truyền thông có sức lan tỏa rộng khắp.',
    },
    RIA: {
      headline: 'Kỹ sư Thiết kế & Kiến tạo Tương lai',
      coreDescription: 'Kết hợp tư duy Thực hành cơ khí (R), Logic nghiên cứu (I) và Gu thẩm mỹ sáng tạo (A). Bạn không chỉ làm cho cỗ máy vận hành trơn tru mà còn thiết kế nó thật thanh thoát và ấn tượng.',
      superpower: 'Hiện thực hóa các giải pháp công nghệ phức tạp thành sản phẩm công nghiệp hoàn mỹ.',
    },
    IEC: {
      headline: 'Nhà Khoa học Dữ liệu & Chiến lược Chuẩn mực',
      coreDescription: 'Sức mạnh phân tích sâu sắc (I) kết hợp nhãn quan lãnh đạo (E) và tính kỷ luật dữ liệu (C). Bạn đưa ra quyết định kinh doanh hoặc công nghệ dựa trên chứng cứ dữ liệu thuyết phục tuyệt đối.',
      superpower: 'Dùng dữ liệu chính xác để thuyết phục các nhà lãnh đạo và định hình chiến lược dài hạn.',
    },
    IAR: {
      headline: 'Nhà Nghiên cứu Sáng tạo & R&D Ứng dụng',
      coreDescription: 'Sự hòa quyện giữa Trí tò mò khoa học (I), Tư duy sáng tạo độc bản (A) và Khả năng thử nghiệm thực tế (R). Thích hợp cho thiết kế trải nghiệm người dùng (UX), công nghệ y sinh hoặc game khoa học.',
      superpower: 'Giải quyết các bài toán khoa học hóc búa bằng những góc nhìn trực giác độc đáo.',
    },
    IAE: {
      headline: 'Nhà Chiến lược Đổi mới & Chuyển giao Công nghệ',
      coreDescription: 'Tư duy logic (I), óc sáng tạo (A) đi liền với khả năng thương mại hóa (E). Bạn nhìn thấy tiềm năng của những phát minh mới và biết cách đưa chúng ra thị trường thành công.',
      superpower: 'Chuyển hóa các phát minh khoa học phức tạp thành sản phẩm thương mại có giá trị cao.',
    },
  }

  if (COMBOS[norm]) return COMBOS[norm]!

  const [c1 = 'R', c2 = 'I', c3 = 'A'] = norm.split('') as PersonalityCode[]
  const p1 = HOLLAND_ARCHETYPES[c1] || HOLLAND_ARCHETYPES.R
  const p2 = HOLLAND_ARCHETYPES[c2] || HOLLAND_ARCHETYPES.I
  const p3 = HOLLAND_ARCHETYPES[c3] || HOLLAND_ARCHETYPES.A

  return {
    headline: `${p1.title} mang phong cách ${p2.subtitle.split('•')[0]?.trim()} & ${p3.subtitle.split('•')[0]?.trim()}`,
    coreDescription: `Hồ sơ ${norm} cho thấy bạn lấy trọng tâm là ${p1.subtitle.toLowerCase()}, đồng thời được củng cố bởi năng lực ${p2.subtitle.toLowerCase()} và khả năng ${p3.subtitle.toLowerCase()}. Bạn có lợi thế phát triển thành chuyên gia đa năng (T-shaped skill).`,
    superpower: `Cầu nối linh hoạt giữa tư duy ${c1} và thực thi ${c2}-${c3}, dễ dàng thích nghi với các dự án đòi hỏi kỹ năng liên ngành.`,
  }
}
