import { PERSONALITY_MAP } from '@/data/personalities'
import { rankCodes } from '@/engine/scoring'
import type { PersonalityCode, ScoreMap } from '@/types'

export interface CollegeMajor {
  name: string
  clusters: string[]
  examSubjects: string[] // e.g. ["A00 (Toán, Lý, Hóa)", "A01 (Toán, Lý, Anh)"]
  careers: string[]
  description: string
  topUniversities: string[]
}

export interface RoadmapStep {
  phase: string
  ageGroup: string
  title: string
  actionItems: string[]
  keyMilestone: string
}

export interface DeepPersonalityAnalysis {
  headline: string
  archetype: string
  executiveSummary: string
  // 1. Động lực & Tâm lý học hành vi
  intrinsicDrivers: {
    energizers: string[]
    drainers: string[]
  }
  // 2. Môi trường làm việc & Văn hóa tổ chức
  workplaceFit: {
    idealCulture: string
    teamDynamics: string
    preferredPace: string
  }
  // 3. Ma trận điểm mạnh & Điểm mù (Blind spots)
  competitiveEdge: string[]
  blindSpots: {
    pitfall: string
    remedy: string
  }[]
  // 4. Định hướng thi THPT & Đại học Việt Nam
  collegeMajors: CollegeMajor[]
  // 5. Lộ trình phát triển 4 giai đoạn
  roadmap: RoadmapStep[]
}

/**
 * Ngân hàng khối ngành và chuyên ngành đại học tại Việt Nam gắn với mã Holland
 */
export const VIETNAM_MAJORS: CollegeMajor[] = [
  {
    name: 'Khoa học Máy tính & Kỹ thuật Phần mềm',
    clusters: ['I', 'R', 'C'],
    examSubjects: ['A00 (Toán, Lý, Hóa)', 'A01 (Toán, Lý, Anh)', 'D07 (Toán, Hóa, Anh)'],
    careers: ['Software Engineer', 'AI Research Engineer', 'Data Scientist', 'DevOps Architect'],
    description: 'Nghiên cứu cấu trúc dữ liệu, thuật toán và kiến trúc hệ thống phần mềm quy mô lớn.',
    topUniversities: ['ĐH Bách Khoa', 'ĐH Công nghệ (VNU)', 'ĐH CNTT (VNU-HCM)', 'ĐH FPT'],
  },
  {
    name: 'Trí tuệ Nhân tạo & Khoa học Dữ liệu',
    clusters: ['I', 'C', 'E'],
    examSubjects: ['A00 (Toán, Lý, Hóa)', 'A01 (Toán, Lý, Anh)', 'D01 (Toán, Văn, Anh)'],
    careers: ['Machine Learning Engineer', 'Data Analyst', 'Business Intelligence Consultant'],
    description: 'Ứng dụng toán thống kê, học máy và dữ liệu lớn để tự động hóa và ra quyết định thông minh.',
    topUniversities: ['ĐH Bách Khoa', 'ĐH Kinh tế Quốc dân', 'ĐH Khoa học Tự nhiên', 'VinUniversity'],
  },
  {
    name: 'Kỹ thuật Cơ điện tử & Robot thông minh',
    clusters: ['R', 'I', 'C'],
    examSubjects: ['A00 (Toán, Lý, Hóa)', 'A01 (Toán, Lý, Anh)'],
    careers: ['Robotics Engineer', 'Kỹ sư tự động hóa PLC', 'Kỹ sư thiết kế vi mạch'],
    description: 'Giao thoa giữa cơ khí chính xác, mạch điện tử và phần mềm điều khiển thế hệ mới.',
    topUniversities: ['ĐH Bách Khoa Hà Nội/HCM', 'ĐH Sư phạm Kỹ thuật', 'ĐH Bách Khoa Đà Nẵng'],
  },
  {
    name: 'Thiết kế Đồ họa & Trải nghiệm Số (UI/UX)',
    clusters: ['A', 'I', 'E'],
    examSubjects: ['H00 (Văn, Vẽ 1, Vẽ 2)', 'V00 (Toán, Lý, Vẽ)', 'D01 (Toán, Văn, Anh)'],
    careers: ['Product Designer', 'Creative Director', '3D Visual Artist', 'Design System Lead'],
    description: 'Sáng tạo ngôn ngữ thị giác, thiết kế tương tác người-máy và trải nghiệm sản phẩm số.',
    topUniversities: ['ĐH Mỹ thuật Công nghiệp', 'ĐH Kiến trúc', 'ĐH RMIT', 'ĐH Hoa Sen'],
  },
  {
    name: 'Tài chính - Fintech & Phân tích Đầu tư',
    clusters: ['C', 'E', 'I'],
    examSubjects: ['A00 (Toán, Lý, Hóa)', 'A01 (Toán, Lý, Anh)', 'D01 (Toán, Văn, Anh)'],
    careers: ['Financial Analyst', 'Quantitative Trader', 'Chuyên viên thẩm định rủi ro'],
    description: 'Mô hình hóa dòng tiền, công nghệ blockchain/tài chính số và quản trị tài sản tổ chức.',
    topUniversities: ['ĐH Kinh tế Quốc dân (NEU)', 'ĐH Ngoại Thương (FTU)', 'ĐH Kinh tế TP.HCM (UEH)'],
  },
  {
    name: 'Quản trị Kinh doanh & Khởi nghiệp Đổi mới',
    clusters: ['E', 'S', 'C'],
    examSubjects: ['A01 (Toán, Lý, Anh)', 'D01 (Toán, Văn, Anh)', 'D07 (Toán, Hóa, Anh)'],
    careers: ['Product Manager', 'Business Development Lead', 'Nhà sáng lập Startup'],
    description: 'Chiến lược phát triển thị trường, đàm phán thương mại và quản trị đội ngũ hiệu suất cao.',
    topUniversities: ['ĐH Ngoại Thương', 'ĐH Kinh tế Quốc dân', 'RMIT Vietnam', 'ĐH Kinh tế - Luật'],
  },
  {
    name: 'Y Đa khoa & Dược học Lâm sàng',
    clusters: ['I', 'S', 'R'],
    examSubjects: ['B00 (Toán, Hóa, Sinh)'],
    careers: ['Bác sĩ điều trị', 'Dược sĩ nghiên cứu', 'Chuyên gia dịch tễ học'],
    description: 'Chẩn đoán, điều trị cứu người và nghiên cứu sinh học phân tử phục vụ y tế hiện đại.',
    topUniversities: ['ĐH Y Hà Nội', 'ĐH Y Dược TP.HCM', 'Học viện Quân Y'],
  },
  {
    name: 'Tâm lý học Ứng dụng & Tham vấn Giáo dục',
    clusters: ['S', 'I', 'A'],
    examSubjects: ['C00 (Văn, Sử, Địa)', 'D01 (Toán, Văn, Anh)', 'D14 (Văn, Sử, Anh)'],
    careers: ['Chuyên viên tư vấn tâm lý học đường', 'Tư vấn hướng nghiệp', 'HR Talent Partner'],
    description: 'Nghiên cứu động lực hành vi con người, tham vấn tinh thần và phát triển nguồn nhân lực.',
    topUniversities: ['ĐH Khoa học Xã hội & Nhân văn', 'ĐH Sư phạm Hà Nội/TP.HCM'],
  },
  {
    name: 'Truyền thông Đa phương tiện & Quan hệ Công chúng',
    clusters: ['A', 'E', 'S'],
    examSubjects: ['D01 (Toán, Văn, Anh)', 'C00 (Văn, Sử, Địa)', 'A01 (Toán, Lý, Anh)'],
    careers: ['Brand Communications Strategist', 'Nhà sản xuất nội dung số', 'Chuyên gia PR'],
    description: 'Chiến lược truyền thông thương hiệu, quản trị khủng hoảng và kể chuyện đa nền tảng.',
    topUniversities: ['Học viện Báo chí & Tuyên truyền', 'ĐH Ngoại Thương', 'ĐH Khoa học Xã hội & Nhân văn'],
  },
]

/**
 * Động cơ suy luận AI chuyên sâu: Phân tích đa chiều dựa trên phân phối điểm RIASEC
 */
export function generateDeepAIAnalysis(scores: ScoreMap): DeepPersonalityAnalysis {
  const ranked = rankCodes(scores)
  const top1 = ranked[0]!
  const top2 = ranked[1]!
  const top3 = ranked[2]!

  const p1 = PERSONALITY_MAP[top1]
  const p2 = PERSONALITY_MAP[top2]

  // Xác định Archetype nghề nghiệp độc bản
  let archetype = `${p1.name} - ${p2.name} Hybrid`
  let headline = `Nhà tư duy chiến lược hệ thống (${top1}-${top2}-${top3})`

  if (top1 === 'I' && top2 === 'R') {
    archetype = 'The Systematic Builder (Kỹ sư Giải pháp Chuyên sâu)'
    headline = 'Sức mạnh giao thoa giữa Trí tuệ Phân tích và Năng lực Kiến tạo Thực tế'
  } else if (top1 === 'I' && top2 === 'A') {
    archetype = 'The Visionary Investigator (Nhà Khám phá Đổi mới)'
    headline = 'Khả năng tư duy trừu tượng sắc bén kết hợp trực giác sáng tạo độc đáo'
  } else if (top1 === 'E' && top2 === 'I') {
    archetype = 'The Strategic Decision Maker (Nhà Lãnh đạo Chiến lược)'
    headline = 'Tư duy logic làm nền tảng cho sự quyết đoán và tầm nhìn kinh doanh'
  } else if (top1 === 'S' && top2 === 'E') {
    archetype = 'The Empathetic Leader (Nhà Dẫn dắt Khơi nguồn Cảm hứng)'
    headline = 'Tạo dựng giá trị con người bằng kỹ năng giao tiếp và khả năng tập hợp đội ngũ'
  } else if (top1 === 'A' && top2 === 'E') {
    archetype = 'The Creative Entrepreneur (Nhà Sáng tạo Khởi nghiệp)'
    headline = 'Biến những ý tưởng thẩm mỹ đột phá thành các sản phẩm có sức ảnh hưởng'
  } else if (top1 === 'C' && top2 === 'I') {
    archetype = 'The Precision Architect (Kiến trúc sư Vận hành & Dữ liệu)'
    headline = 'Khả năng chuẩn hóa quy trình tuyệt vời cùng sự nhạy cảm với dữ liệu phức tạp'
  }

  // Tóm tắt điều hành
  const executiveSummary = `Hồ sơ của bạn thuộc phổ tính cách kết hợp ${p1.name} (${scores[top1]}%) và ${p2.name} (${scores[top2]}%). Bạn không chỉ có xu hướng đào sâu vào bản chất vấn đề mà còn có năng lực định hình cấu trúc rõ ràng. Đây là hình mẫu lý tưởng cho những vị trí đòi hỏi cả chuyên môn sâu lẫn khả năng giải quyết các bài toán chưa có lời giải sẵn.`

  // Phân tích Môi trường & Động lực nội tại
  const intrinsicDrivers = {
    energizers: [
      `Được trao quyền chủ động giải quyết các bài toán phức tạp mà người khác hay nản lòng.`,
      `Làm việc cùng những đồng đội có tiêu chuẩn cao, tôn trọng chuyên môn và tư duy logic.`,
      `Thấy rõ tác động thực tế của giải pháp do mình phân tích và thiết kế.`,
      `Môi trường khuyến khích học tập liên tục, tiếp cận công nghệ mới và dữ liệu thực tế.`,
    ],
    drainers: [
      `Các quy trình rập khuôn, thủ tục hành chính vô lý làm nghẽn tiến độ.`,
      `Môi trường thiếu minh bạch, đánh giá công việc dựa trên cảm tính thay vì số liệu thực tế.`,
      `Những công việc mang tính lặp đi lặp lại đơn điệu mà không có cơ hội tối ưu tự động hóa.`,
      `Bị thúc ép đưa ra quyết định mà chưa có đủ dữ kiện cần thiết để kiểm chứng.`,
    ],
  }

  const workplaceFit = {
    idealCulture: `Văn hóa 'Meritocracy' (Tôn trọng năng lực thực chất), đề cao sự độc lập, minh bạch và tinh thần cầu tiến.`,
    teamDynamics: `Thích hợp làm việc trong các 'Cross-functional Squad' (nhóm tinh gọn đa chuyên môn) với vai trò chuyên gia phân tích/kỹ thuật dẫn đường.`,
    preferredPace: `Nhịp độ ổn định có chiều sâu, ưu tiên chất lượng và tính bền vững của giải pháp hơn là sự vội vã đối phó.`,
  }

  // Ma trận Lợi thế cạnh tranh & Cảnh báo điểm mù
  const competitiveEdge = [
    `Khả năng 'Debug' vấn đề: Dễ dàng nhìn thấy mắt xích yếu nhất trong một chuỗi sự kiện hoặc hệ thống phức tạp.`,
    `Tốc độ làm chủ công cụ mới: Không ngại tài liệu kỹ thuật, tự tin thử nghiệm các nền tảng công nghệ cao.`,
    `Độ tin cậy trong nhận định: Kết luận luôn đi kèm dữ liệu chứng minh và tư duy phản biện vững chắc.`,
    `Khả năng tự định hướng: Hoạt động bền bỉ, tập trung cao độ ngay cả khi không có người giám sát liên tục.`,
  ]

  const blindSpots = [
    {
      pitfall: 'Hội chứng "Phân tích quá mức dẫn đến bế tắc" (Analysis Paralysis).',
      remedy: 'Áp dụng nguyên lý Pareto 80/20: Khi đã nắm được 70-80% dữ liệu then chốt, hãy hành động thử nghiệm (MVP) thay vì đợi 100% sự hoàn hảo.',
    },
    {
      pitfall: 'Đôi khi đánh giá thấp yếu tố cảm xúc và giao tiếp chính trị nội bộ.',
      remedy: 'Rèn luyện thêm kỹ năng "Stakeholder Management" — học cách trình bày vấn đề phức tạp thành câu chuyện dễ hiểu cho người không chuyên.',
    },
    {
      pitfall: 'Khuynh hướng tự mình giải quyết hết mọi việc vì sợ người khác làm sai.',
      remedy: 'Tập chia sẻ việc và xây dựng bộ tiêu chí nghiệm thu (Checklist) để người khác cùng hỗ trợ bạn hiệu quả.',
    },
  ]

  // Gợi ý ngành đào tạo tại Việt Nam
  const userLetters = [top1, top2, top3]
  const collegeMajors = VIETNAM_MAJORS.filter((m) =>
    m.clusters.some((c) => userLetters.slice(0, 2).includes(c as PersonalityCode)),
  ).slice(0, 4)

  // Lộ trình 4 giai đoạn
  const roadmap: RoadmapStep[] = [
    {
      phase: 'Giai đoạn 1: Chuẩn bị & Bứt phá',
      ageGroup: 'Lớp 10 – Lớp 12',
      title: 'Tối ưu tổ hợp xét tuyển & Xây dựng hồ sơ năng lực',
      actionItems: [
        `Tập trung cao độ vào tổ hợp môn thế mạnh (${collegeMajors[0]?.examSubjects[0]?.slice(0, 3) || 'A00/A01/D01'}).`,
        `Đạt chứng chỉ ngoại ngữ (IELTS 6.5+ hoặc chứng chỉ tương đương) để mở rộng cánh cửa xét tuyển sớm.`,
        `Tham gia ít nhất 1 câu lạc bộ học thuật, STEM hoặc dự án nghiên cứu khoa học kỹ thuật cấp trường.`,
      ],
      keyMilestone: 'Trúng tuyển vào trường Đại học Top đầu ngành mong muốn.',
    },
    {
      phase: 'Giai đoạn 2: Tích lũy chuyên sâu',
      ageGroup: 'Đại học (Năm 1 – Năm 3)',
      title: 'Làm chủ kiến thức nền tảng & Dự án thực chiến',
      actionItems: [
        'Xây dựng Portfolio dự án cá nhân (GitHub, Behance hoặc bài báo nghiên cứu sinh viên).',
        'Tìm kiếm cố vấn (Mentor) là các anh chị đi trước trong ngành từ năm 2.',
        'Tham gia thực tập sớm tại các doanh nghiệp hoặc phòng thí nghiệm R&D.',
      ],
      keyMilestone: 'Có sản phẩm thực tế chạy được và nhận lời mời thực tập chính thức.',
    },
    {
      phase: 'Giai đoạn 3: Gia nhập thị trường',
      ageGroup: 'Tốt nghiệp – 2 năm đầu sự nghiệp',
      title: 'Định vị giá trị cốt lõi & Tăng tốc học hỏi',
      actionItems: [
        'Đạt vị trí Junior/Specialist tại môi trường chuyên nghiệp có quy trình đào tạo tốt.',
        'Luyện tập kỹ năng giao tiếp công sở, quản lý kỳ vọng của cấp trên và cộng tác nhóm.',
        'Thiết lập mạng lưới quan hệ đồng nghiệp chuyên môn trong ngành.',
      ],
      keyMilestone: 'Trở thành mắt xích quan trọng trong nhóm, sẵn sàng nhận nhiệm vụ phức tạp độc lập.',
    },
    {
      phase: 'Giai đoạn 4: Chuyên gia & Bứt phá',
      ageGroup: '3 – 5 năm tiếp theo',
      title: 'Chuyên gia đầu ngành hoặc Quản lý kỹ thuật',
      actionItems: [
        'Định hình thương hiệu cá nhân qua các bài chia sẻ chuyên môn hoặc dự án quy mô lớn.',
        'Xem xét học các chứng chỉ quốc tế nâng cao hoặc chương trình Thạc sĩ chuyên ngành.',
        'Đảm nhận vai trò Tech Lead, Product Manager hoặc Khởi nghiệp dự án riêng.',
      ],
      keyMilestone: 'Tự do lựa chọn dự án, đạt mức thu nhập và sự công nhận cao trong ngành.',
    },
  ]

  return {
    headline,
    archetype,
    executiveSummary,
    intrinsicDrivers,
    workplaceFit,
    competitiveEdge,
    blindSpots,
    collegeMajors,
    roadmap,
  }
}
