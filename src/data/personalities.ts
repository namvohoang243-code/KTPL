import type { Personality, PersonalityCode } from '@/types'

/**
 * RIASEC / Holland personality groups.
 * To add a new group: extend `PersonalityCode` in types, add an entry here and the UI/engine pick it up.
 */
export const PERSONALITIES: Personality[] = [
  {
    code: 'R',
    name: 'Realistic',
    title: 'Người thực tế',
    tagline: 'Bạn có xu hướng thích hành động, làm việc với đồ vật, máy móc và những kết quả nhìn thấy được.',
    description:
      'Nhóm Realistic thích những công việc cụ thể, thực hành và có kết quả rõ ràng. Họ thường thoải mái với công cụ, máy móc, kỹ thuật hoặc không gian ngoài trời hơn là những công việc thuần giao tiếp.',
    traits: ['Practical', 'Hands-on', 'Resilient'],
    strengths: ['Thao tác kỹ thuật', 'Giải quyết vấn đề thực tế', 'Kiên trì, bình tĩnh', 'Làm việc độc lập'],
    environments: ['Xưởng & phòng thí nghiệm', 'Công trường', 'Ngoài trời', 'Nhà máy công nghệ'],
    examples: ['Kỹ sư cơ khí', 'Kỹ thuật viên điện tử', 'Phi công', 'Kiến trúc sư công trình'],
    support: 'bổ sung khả năng biến ý tưởng thành sản phẩm thực sự chạy được',
    color: '#E0A030',
    icon: 'wrench',
    insights: [
      { icon: 'hammer', title: 'Thích làm bằng tay', text: 'Bạn học tốt nhất khi được thao tác thật và thấy ngay kết quả của việc mình làm.' },
      { icon: 'target', title: 'Thực tế & hiệu quả', text: 'Bạn ưu tiên những giải pháp dùng được ngay hơn là những lý thuyết dài dòng.' },
      { icon: 'compass', title: 'Gắn với không gian thật', text: 'Máy móc, dụng cụ hay không gian ngoài trời giúp bạn tập trung và có thêm năng lượng.' },
      { icon: 'shield', title: 'Đáng tin cậy', text: 'Bạn kiên trì, bình tĩnh khi xử lý những việc đòi hỏi sự chắc chắn và an toàn.' },
    ],
  },
  {
    code: 'I',
    name: 'Investigative',
    title: 'Người khám phá',
    tagline: 'Bạn có xu hướng tò mò, thích khám phá vấn đề và tìm hiểu cách mọi thứ hoạt động.',
    description:
      'Nhóm Investigative bị cuốn hút bởi tri thức, phân tích và những câu hỏi "vì sao". Họ thích quan sát, nghiên cứu, thử nghiệm và tự mình tìm ra lời giải cho các vấn đề phức tạp.',
    traits: ['Analytical', 'Curious', 'Systematic'],
    strengths: ['Tư duy logic', 'Phân tích dữ liệu', 'Học sâu & tự học', 'Giải quyết vấn đề phức tạp'],
    environments: ['Phòng nghiên cứu', 'Công ty công nghệ', 'Trường đại học', 'Viện khoa học'],
    examples: ['Nhà khoa học dữ liệu', 'Kỹ sư phần mềm', 'Nhà nghiên cứu', 'Bác sĩ'],
    support: 'bổ sung chiều sâu phân tích và thói quen tìm hiểu bản chất vấn đề',
    color: '#2F5BFF',
    icon: 'microscope',
    insights: [
      { icon: 'brain', title: 'Tư duy phân tích', text: 'Bạn có xu hướng thích tìm hiểu nguyên nhân và giải quyết vấn đề một cách có hệ thống.' },
      { icon: 'search', title: 'Tò mò khám phá', text: 'Bạn thường muốn hiểu "vì sao" thay vì chỉ biết "cái gì" — và sẵn sàng đào sâu để tìm câu trả lời.' },
      { icon: 'cog', title: 'Thích hệ thống', text: 'Bạn có xu hướng hứng thú với cách các hệ thống, quy luật và mô hình vận hành.' },
      { icon: 'lightbulb', title: 'Học sâu, nghĩ rộng', text: 'Bạn thích dành thời gian tìm hiểu một chủ đề đến nơi đến chốn thay vì lướt qua bề mặt.' },
    ],
  },
  {
    code: 'A',
    name: 'Artistic',
    title: 'Người sáng tạo',
    tagline: 'Bạn có xu hướng giàu trí tưởng tượng, thích tự do thể hiện bản thân và tạo ra những điều mới mẻ.',
    description:
      'Nhóm Artistic coi trọng sự độc đáo, thẩm mỹ và tự do biểu đạt. Họ thích những môi trường linh hoạt, ít khuôn mẫu, nơi ý tưởng và cảm xúc được trân trọng.',
    traits: ['Imaginative', 'Expressive', 'Original'],
    strengths: ['Tư duy ý tưởng', 'Thẩm mỹ & thiết kế', 'Kể chuyện', 'Nhìn vấn đề từ góc mới'],
    environments: ['Studio sáng tạo', 'Agency truyền thông', 'Không gian làm việc linh hoạt', 'Sân khấu & truyền thông'],
    examples: ['Nhà thiết kế UX/UI', 'Đạo diễn', 'Kiến trúc sư', 'Content creator'],
    support: 'bổ sung óc sáng tạo và cách nhìn khác biệt cho mọi việc bạn làm',
    color: '#E1705C',
    icon: 'palette',
    insights: [
      { icon: 'palette', title: 'Trí tưởng tượng phong phú', text: 'Bạn dễ hình dung những khả năng chưa tồn tại và biến chúng thành ý tưởng cụ thể.' },
      { icon: 'sparkles', title: 'Dấu ấn riêng', text: 'Bạn có xu hướng muốn sản phẩm của mình mang màu sắc cá nhân thay vì làm theo khuôn mẫu.' },
      { icon: 'wand', title: 'Nhìn khác biệt', text: 'Bạn hay đặt câu hỏi "nếu làm theo cách khác thì sao?" và thường tìm ra lối đi mới.' },
      { icon: 'feather', title: 'Nhạy cảm thẩm mỹ', text: 'Bạn chú ý đến cảm xúc, hình ảnh và trải nghiệm — những thứ khiến một sản phẩm "có hồn".' },
    ],
  },
  {
    code: 'S',
    name: 'Social',
    title: 'Người hỗ trợ',
    tagline: 'Bạn có xu hướng quan tâm đến con người, thích hỗ trợ, hướng dẫn và kết nối với người khác.',
    description:
      'Nhóm Social tìm thấy ý nghĩa khi giúp đỡ, giảng dạy và đồng hành cùng người khác. Họ giỏi lắng nghe, giao tiếp và tạo ra bầu không khí hợp tác.',
    traits: ['Empathetic', 'Supportive', 'Collaborative'],
    strengths: ['Lắng nghe & thấu cảm', 'Giao tiếp', 'Làm việc nhóm', 'Hướng dẫn người khác'],
    environments: ['Trường học', 'Bệnh viện & trung tâm chăm sóc', 'Tổ chức cộng đồng', 'Doanh nghiệp xã hội'],
    examples: ['Giáo viên', 'Chuyên viên tư vấn', 'Điều dưỡng', 'Nhân viên công tác xã hội'],
    support: 'bổ sung sự thấu cảm và khả năng kết nối, giúp bạn làm việc nhóm hiệu quả hơn',
    color: '#14B8A6',
    icon: 'heart',
    insights: [
      { icon: 'heart', title: 'Thấu cảm tự nhiên', text: 'Bạn dễ nhận ra cảm xúc của người khác và biết cách phản hồi một cách tinh tế.' },
      { icon: 'users', title: 'Sức mạnh làm việc nhóm', text: 'Bạn có xu hướng cảm thấy tràn năng lượng khi cùng nhóm hướng tới một mục tiêu chung.' },
      { icon: 'message', title: 'Giao tiếp ấm áp', text: 'Bạn biết cách giải thích, lắng nghe và làm cho người đối diện thấy thoải mái.' },
      { icon: 'sprout', title: 'Giúp người khác tiến bộ', text: 'Bạn có xu hướng thấy ý nghĩa khi người khác trưởng thành nhờ sự đồng hành của mình.' },
    ],
  },
  {
    code: 'E',
    name: 'Enterprising',
    title: 'Người dẫn dắt',
    tagline: 'Bạn có xu hướng chủ động, thích dẫn dắt, thuyết phục và biến ý tưởng thành hành động.',
    description:
      'Nhóm Enterprising thích đặt mục tiêu, thuyết phục người khác và đưa ra quyết định. Họ hứng thú với kinh doanh, lãnh đạo, đàm phán và những môi trường có nhịp độ nhanh.',
    traits: ['Driven', 'Persuasive', 'Confident'],
    strengths: ['Lãnh đạo', 'Thuyết phục & đàm phán', 'Ra quyết định', 'Tư duy kinh doanh'],
    environments: ['Startup', 'Doanh nghiệp', 'Tổ chức sự kiện', 'Công ty tư vấn'],
    examples: ['Doanh nhân', 'Quản lý sản phẩm', 'Chuyên viên marketing', 'Luật sư'],
    support: 'bổ sung sự chủ động và khả năng thuyết phục để đưa ý tưởng đến với nhiều người hơn',
    color: '#0E2A57',
    icon: 'rocket',
    insights: [
      { icon: 'rocket', title: 'Tinh thần khởi xướng', text: 'Bạn có xu hướng muốn bắt đầu điều gì đó mới thay vì chờ người khác giao việc.' },
      { icon: 'flag', title: 'Sẵn sàng dẫn dắt', text: 'Khi nhóm cần một người quyết định, bạn thường là người dám đứng ra nhận trách nhiệm.' },
      { icon: 'megaphone', title: 'Thuyết phục tự nhiên', text: 'Bạn biết cách truyền cảm hứng và kéo người khác cùng tin vào một ý tưởng.' },
      { icon: 'trending', title: 'Hướng tới mục tiêu', text: 'Bạn bị thu hút bởi thử thách, cạnh tranh lành mạnh và những kết quả đo đếm được.' },
    ],
  },
  {
    code: 'C',
    name: 'Conventional',
    title: 'Người tổ chức',
    tagline: 'Bạn có xu hướng thích sự rõ ràng, chính xác và cách làm việc có hệ thống, có quy trình.',
    description:
      'Nhóm Conventional coi trọng trật tự, độ chính xác và sự đáng tin cậy. Họ giỏi quản lý thông tin, theo dõi chi tiết và vận hành mọi thứ trơn tru theo kế hoạch.',
    traits: ['Organized', 'Precise', 'Reliable'],
    strengths: ['Quản lý thông tin', 'Chú ý chi tiết', 'Lập kế hoạch', 'Tuân thủ quy trình'],
    environments: ['Văn phòng có cấu trúc', 'Ngân hàng & tài chính', 'Cơ quan nhà nước', 'Doanh nghiệp vận hành'],
    examples: ['Kế toán', 'Kiểm toán viên', 'Quản trị hệ thống', 'Chuyên viên vận hành'],
    support: 'bổ sung sự ngăn nắp, chính xác để công việc luôn đi đến đích đúng hạn',
    color: '#7B8BA8',
    icon: 'clipboard',
    insights: [
      { icon: 'clipboard', title: 'Ngăn nắp có hệ thống', text: 'Bạn có xu hướng biến những việc rối rắm thành quy trình rõ ràng, dễ theo dõi.' },
      { icon: 'listcheck', title: 'Cẩn thận từng chi tiết', text: 'Bạn thường phát hiện ra những sai sót nhỏ mà người khác bỏ qua.' },
      { icon: 'calendar', title: 'Kỷ luật & kế hoạch', text: 'Bạn thoải mái nhất khi biết rõ việc gì cần làm, vào lúc nào và theo thứ tự nào.' },
      { icon: 'shield', title: 'Ổn định, đáng tin cậy', text: 'Mọi người thường yên tâm giao cho bạn những việc cần sự chính xác và nhất quán.' },
    ],
  },
]

export const PERSONALITY_CODES: PersonalityCode[] = PERSONALITIES.map((p) => p.code)

export const PERSONALITY_MAP = Object.fromEntries(PERSONALITIES.map((p) => [p.code, p])) as Record<
  PersonalityCode,
  Personality
>
