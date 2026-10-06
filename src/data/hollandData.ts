import type { PersonalityCode } from '@/types'

export interface CareerSector {
  title: string
  careers: string[]
}

export interface HollandTypeDetail {
  code: PersonalityCode
  name: string
  title: string
  hollandName: string
  tagline: string
  color: string
  intro: string
  traits: string
  strengths: string[]
  weaknesses: string[]
  environment: string
  sectors: CareerSector[]
  careers: {
    name: string
    sector: string
    desc: string
    skills: string[]
  }[]
}

export const HOLLAND_TYPES: Record<PersonalityCode, HollandTypeDetail> = {
  R: {
    code: 'R',
    name: 'Người Kiến tạo',
    title: 'THE BUILDER',
    hollandName: 'Realistic',
    tagline: 'Thực hành • Kỹ thuật • Công nghệ • Xây dựng',
    color: '#7ee0c3',
    intro: 'Có xu hướng tư duy thực tế và tiếp thu thông tin tốt nhất thông qua trải nghiệm trực tiếp, công cụ máy móc và hành động cụ thể.',
    traits: 'Khi đối mặt với hệ thống hay thiết bị mới, bạn có bản năng tự mày mò, bóc tách cấu trúc để tìm nguyên nhân và tự tay khắc phục sự cố. Bạn coi trọng tính ứng dụng thực tế của ý tưởng và chỉ thực sự bị thuyết phục bởi những kết quả có thể vận hành, đo lường rõ ràng thay vì các kế hoạch trên giấy.',
    strengths: [
      'Bản năng mày mò, thao tác kỹ thuật và thực hành cực tốt',
      'Điềm tĩnh, thực tế khi giải quyết sự cố công cụ/hệ thống',
      'Kiên trì thử nghiệm đến khi tạo ra sản phẩm vận hành thực tế',
    ],
    weaknesses: [
      'Dễ mất kiên nhẫn với các buổi họp lý thuyết, thủ tục giấy tờ',
      'Đôi khi ngại diễn đạt ý tưởng bằng lời hoặc cảm xúc',
    ],
    environment: 'Xưởng kỹ thuật, phòng lab cơ khí, công trường xây dựng, môi trường công nghệ cao hoặc ngoài trời.',
    sectors: [
      {
        title: 'Kỹ thuật & Công nghệ',
        careers: [
          'Kỹ sư Cơ khí',
          'Kỹ sư Điện / Điện tử',
          'Kỹ sư Xây dựng',
          'Kỹ sư Robotics & Tự động hóa',
          'Kỹ sư Mạng / Phần cứng máy tính',
        ],
      },
      {
        title: 'Sản xuất & Vận hành',
        careers: [
          'Kỹ thuật viên Thiết bị y tế cao cấp (X-quang, Chẩn đoán hình ảnh)',
          'Kỹ thuật viên Kỹ thuật ô tô / Máy bay',
          'Chuyên gia Kỹ thuật Nông nghiệp công nghệ cao',
        ],
      },
      {
        title: 'Lĩnh vực Mở rộng',
        careers: [
          'Kiến trúc sư Cảnh quan',
          'Huấn luyện viên Thể hình / Thể thao',
          'Quản lý Trang trại / Vườn quốc gia',
        ],
      },
    ],
    careers: [
      {
        name: 'Kỹ sư Robotics & Tự động hóa',
        sector: 'Kỹ thuật & Công nghệ',
        desc: 'Thiết kế, lập trình vi điều khiển và tích hợp hệ thống cánh tay robot, dây chuyền thông minh.',
        skills: ['Lập trình PLC', 'Thiết kế CAD/3D', 'Mạch điều khiển'],
      },
      {
        name: 'Kỹ sư Cơ khí / Chế tạo máy',
        sector: 'Kỹ thuật & Công nghệ',
        desc: 'Tính toán động lực học, gia công chính xác và tối ưu hiệu suất vận hành máy móc.',
        skills: ['Tư duy kỹ thuật', 'Gia công CNC', 'Kiểm định độ bền'],
      },
      {
        name: 'Kỹ thuật viên Thiết bị Y tế Cao cấp',
        sector: 'Sản xuất & Vận hành',
        desc: 'Hiệu chuẩn, vận hành và xử lý sự cố hệ thống CT Scanner, MRI, X-quang bệnh viện.',
        skills: ['Chẩn đoán phần cứng', 'An toàn bức xạ', 'Xử lý lỗi khẩn cấp'],
      },
      {
        name: 'Kỹ sư Xây dựng & Kết cấu Hạ tầng',
        sector: 'Kỹ thuật & Công nghệ',
        desc: 'Mô phỏng kết cấu chịu tải, khảo sát địa chất và quản lý chất lượng thi công thực địa.',
        skills: ['Tính toán kết cấu', 'BIM / Revit', 'Giám sát hiện trường'],
      },
      {
        name: 'Kỹ thuật viên Ô tô điện & Hàng không',
        sector: 'Sản xuất & Vận hành',
        desc: 'Bảo dưỡng động cơ phản lực, pack pin xe điện và hệ thống telemetry cảm biến.',
        skills: ['Đo kiểm điện áp cao', 'Đọc schema', 'Kỷ luật an toàn tuyệt đối'],
      },
    ],
  },

  I: {
    code: 'I',
    name: 'Người Khám phá',
    title: 'THE EXPLORER',
    hollandName: 'Investigative',
    tagline: 'Nghiên cứu • Khoa học • Logic • Phân tích',
    color: '#7aa8ff',
    intro: 'Sở hữu tư duy phản biện sắc bén, niềm say mê khám phá bản chất sự vật và nhu cầu tìm kiếm bằng chứng xác thực.',
    traits: 'Không e ngại những vùng thông tin mơ hồ mà ngược lại, thường bị thu hút bởi những câu hỏi hóc búa, hiện tượng chưa có lời giải. Có tư duy logic và sự tò mò, khám phá về bản chất của sự vật, hiện tượng xung quanh.',
    strengths: [
      'Tư duy phản biện sâu sắc, luôn truy tìm nguyên nhân cốt lõi',
      'Đam mê giải mã các bài toán phức tạp mà người khác dễ bỏ cuộc',
      'Khả năng tự nghiên cứu, phân tích dữ liệu và tư duy trừu tượng tốt',
    ],
    weaknesses: [
      'Có xu hướng phân tích quá mức (Overthinking) dẫn đến chậm hành động',
      'Thường đòi hỏi dữ liệu hoàn hảo trước khi đưa ra quyết định',
    ],
    environment: 'Viện nghiên cứu, trung tâm R&D, phòng thí nghiệm y sinh, công ty công nghệ AI/Big Data.',
    sectors: [
      {
        title: 'Khoa học & Dữ liệu',
        careers: [
          'Nhà khoa học dữ liệu (Data Scientist)',
          'Nhà phân tích dữ liệu (BI Analyst)',
          'Chuyên gia phân tích thị trường & kinh tế',
        ],
      },
      {
        title: 'Y sinh & Công nghệ',
        careers: [
          'Bác sĩ chuyên khoa (Nội khoa, Ngoại khoa, Tim mạch...)',
          'Dược sĩ nghiên cứu',
          'Nhà nghiên cứu Sinh học / Công nghệ sinh học',
        ],
      },
      {
        title: 'Phát triển Công nghệ Mũi nhọn',
        careers: [
          'Kỹ sư AI / Machine Learning',
          'Chuyên gia An toàn thông tin (Cybersecurity)',
          'Chuyên gia Nghiên cứu trải nghiệm người dùng (UX Researcher)',
        ],
      },
    ],
    careers: [
      {
        name: 'Nhà khoa học dữ liệu (Data Scientist)',
        sector: 'Khoa học & Dữ liệu',
        desc: 'Xây dựng mô hình toán thống kê, khai phá quy luật ẩn sâu trong các tập dữ liệu khổng lồ.',
        skills: ['Python / R', 'Thống kê toán', 'Machine Learning'],
      },
      {
        name: 'Kỹ sư Trí tuệ Nhân tạo (AI Engineer)',
        sector: 'Phát triển Công nghệ',
        desc: 'Nghiên cứu kiến trúc Deep Learning, xử lý ngôn ngữ tự nhiên (LLM) và thị giác máy tính.',
        skills: ['PyTorch / TensorFlow', 'Đại số tuyến tính', 'Thiết kế giải thuật'],
      },
      {
        name: 'Bác sĩ / Dược sĩ Nghiên cứu Y sinh',
        sector: 'Y sinh & Công nghệ',
        desc: 'Tìm hiểu cơ chế bệnh sinh, thử nghiệm lâm sàng và phát triển công thức dược phẩm mới.',
        skills: ['Hóa sinh phân tử', 'Phương pháp nghiên cứu', 'Đạo đức y khoa'],
      },
      {
        name: 'Chuyên gia An ninh mạng (Cybersecurity)',
        sector: 'Phát triển Công nghệ',
        desc: 'Điều tra lỗ hổng bảo mật, truy vết mã độc và bảo vệ các hạ tầng thông tin trọng yếu.',
        skills: ['Reverse Engineering', 'Phân tích mạng', 'Kiểm thử thâm nhập'],
      },
      {
        name: 'Chuyên gia Nghiên cứu UX (UX Researcher)',
        sector: 'Phát triển Công nghệ',
        desc: 'Thiết kế thí nghiệm hành vi người dùng, phỏng vấn sâu và kiểm chứng giả thuyết sản phẩm.',
        skills: ['Phương pháp định tính', 'A/B Testing', 'Tâm lý học nhận thức'],
      },
    ],
  },

  A: {
    code: 'A',
    name: 'Người Sáng tạo',
    title: 'THE CREATOR',
    hollandName: 'Artistic',
    tagline: 'Nghệ thuật • Thiết kế • Ngôn ngữ • Ý tưởng',
    color: '#c58bff',
    intro: 'Thích tự do biểu đạt, mong muốn để lại dấu ấn cá nhân và có độ nhạy cảm cao với từ ngữ, hình ảnh và âm thanh.',
    traits: 'Thích làm việc trong môi trường tự do, không chịu áp lực quy tắc cứng nhắc. Có mong muốn để lại dấu ấn cá nhân trong mọi sản phẩm tạo ra. Sở hữu sự nhạy cảm cao với các chi tiết nhỏ trong ngôn ngữ, hình ảnh, âm thanh và có lối tư duy phi tuyến tính, dễ dàng kết nối những mảnh ghép rời rạc thành một ý tưởng mới.',
    strengths: [
      'Trực giác thẩm mỹ sắc sảo, năng khiếu cảm thụ nghệ thuật tự nhiên',
      'Tư duy phi tuyến tính, kết nối những điều không tưởng thành ý tưởng mới',
      'Khao khát tạo ra sản phẩm độc đáo, mang đậm dấu ấn bản sắc riêng',
    ],
    weaknesses: [
      'Cảm xúc dễ bị dao động theo cảm hứng làm việc',
      'Dị ứng với những quy trình cứng nhắc, bảo thủ và rập khuôn',
    ],
    environment: 'Studio thiết kế, công ty quảng cáo/sáng tạo, nhà xuất bản, phim trường hoặc làm việc tự do (Freelance).',
    sectors: [
      {
        title: 'Thiết kế & Mỹ thuật',
        careers: [
          'Nhà thiết kế đồ họa (Graphic Designer)',
          'Nhà thiết kế Nội thất / Thời trang',
          'Đạo diễn hình ảnh & Nghệ thuật (Art Director)',
          'Biên kịch / Nhà văn',
        ],
      },
      {
        title: 'Truyền thông & Sáng tạo nội dung',
        careers: [
          'Chuyên viên sáng tạo nội dung (Content Creator / Copywriter)',
          'Giám đốc Sáng tạo chiến dịch (Creative Director)',
          'Biên tập viên Báo chí / Xuất bản',
        ],
      },
      {
        title: 'Nghệ thuật & Công nghệ số',
        careers: [
          'Thiết kế Giao diện ứng dụng (UI/UX Designer)',
          'Họa sĩ Game 3D / Concept Artist',
          'Nhạc sĩ / Nhà sản xuất âm thanh (Music Producer)',
        ],
      },
    ],
    careers: [
      {
        name: 'Giám đốc Sáng tạo (Creative Director)',
        sector: 'Truyền thông & Sáng tạo',
        desc: 'Định hình concept thị giác, chỉ đạo ngôn ngữ nghệ thuật cho thương hiệu và chiến dịch lớn.',
        skills: ['Tư duy ý tưởng (Ideation)', 'Kể chuyện (Storytelling)', 'Thẩm mỹ thị giác'],
      },
      {
        name: 'Thiết kế UI/UX Sản phẩm số',
        sector: 'Nghệ thuật & Công nghệ',
        desc: 'Thiết kế giao diện đẹp mắt, tương tác trực quan và trải nghiệm thị giác cuốn hút cho ứng dụng.',
        skills: ['Figma / Design Systems', 'Visual Branding', 'Thiết kế tương tác'],
      },
      {
        name: 'Nhà thiết kế Nội thất / Không gian',
        sector: 'Thiết kế & Mỹ thuật',
        desc: 'Phối trộn ánh sáng, chất liệu và hình khối để tạo nên không gian sống đậm chất nghệ thuật.',
        skills: ['Mô phỏng 3ds Max/Blender', 'Phối màu vật liệu', 'Cảm thụ không gian'],
      },
      {
        name: 'Biên kịch & Kể chuyện Đa phương tiện',
        sector: 'Thiết kế & Mỹ thuật',
        desc: 'Sáng tác kịch bản phim ảnh, game narrative hoặc podcast với chiều sâu tâm lý nhân vật.',
        skills: ['Cấu trúc kịch bản', 'Ngôn ngữ biểu cảm', 'Nhạy cảm tâm lý'],
      },
      {
        name: 'Họa sĩ Concept Game / Hoạt hình',
        sector: 'Nghệ thuật & Công nghệ',
        desc: 'Kiến tạo thế giới ảo, phục trang và diện mạo nhân vật từ trang giấy phác thảo ban đầu.',
        skills: ['Digital Painting', 'Giải phẫu tạo hình', 'Ánh sáng & Phối cảnh'],
      },
    ],
  },

  S: {
    code: 'S',
    name: 'Người Kết nối',
    title: 'THE CONNECTOR',
    hollandName: 'Social',
    tagline: 'Con người • Giáo dục • Tâm lý • Cộng đồng',
    color: '#ff8fb1',
    intro: 'Lấy con người làm trung tâm, giàu lòng trắc ẩn, thấu hiểu cảm xúc và đam mê nâng đỡ sự phát triển của người khác.',
    traits: 'Thích giúp đỡ, giảng dạy, huấn luyện, chữa lành hoặc cung cấp dịch vụ cho con người. Tinh tế để mắt đến những thành viên yếu thế khi làm việc chung; coi trọng việc giúp người khác tự thấu hiểu bản thân để tiến bộ hơn là tìm cách tranh cãi hay ép họ phải đồng thuận với ý kiến của mình. Có khả năng nhận diện tốt các chuyển biến cảm xúc ở đối phương.',
    strengths: [
      'Trí tuệ cảm xúc (EQ) cao, lắng nghe tích cực và thấu cảm sâu sắc',
      'Khả năng truyền cảm hứng, giải thích vấn đề phù hợp từng người nghe',
      'Kiên nhẫn và tận tâm đồng hành vì sự tiến bộ của người khác',
    ],
    weaknesses: [
      'Dễ bị kiệt sức cảm xúc (Burnout) khi gánh vác quá nhiều nỗi niềm của người khác',
      'Đôi khi ngại đưa ra các quyết định kỷ luật cứng rắn vì sợ làm tổn thương',
    ],
    environment: 'Trường học, trung tâm đào tạo, bệnh viện, phòng tham vấn tâm lý, tổ chức phi chính phủ (NGO), bộ phận nhân sự.',
    sectors: [
      {
        title: 'Giáo dục & Đào tạo',
        careers: [
          'Giáo viên / Giảng viên Đại học',
          'Chuyên gia Đào tạo Doanh nghiệp (L&D Specialist)',
          'Quản lý Giáo dục & Phát triển Chương trình',
        ],
      },
      {
        title: 'Y tế & Sức khỏe tinh thần',
        careers: [
          'Chuyên gia Tâm lý học Lâm sàng / Tư vấn học đường',
          'Bác sĩ Trị liệu Tâm lý',
          'Chuyên viên Công tác Xã hội & Phát triển Cộng đồng',
        ],
      },
      {
        title: 'Quản trị Con người',
        careers: [
          'Chuyên viên Hướng nghiệp / Tuyển dụng',
          'Đối tác Nhân sự (HRBP)',
          'Chuyên viên Quan hệ Khách hàng / Chăm sóc Khách hàng',
        ],
      },
    ],
    careers: [
      {
        name: 'Chuyên gia Tâm lý học & Tư vấn Học đường',
        sector: 'Y tế & Sức khỏe tinh thần',
        desc: 'Lắng nghe, đánh giá tâm lý và hỗ trợ học sinh/thân chủ vượt qua khủng hoảng tinh thần.',
        skills: ['Kỹ năng lắng nghe sâu', 'Tham vấn tâm lý', 'Bảo mật thông tin'],
      },
      {
        name: 'Chuyên gia Đào tạo & Phát triển (L&D Specialist)',
        sector: 'Giáo dục & Đào tạo',
        desc: 'Thiết kế khóa học, dẫn dắt workshop và phát triển năng lực làm việc cho nhân sự.',
        skills: ['Thiết kế trải nghiệm học tập', 'Thuyết trình truyền cảm hứng', 'Huấn luyện (Coaching)'],
      },
      {
        name: 'Đối tác Nhân sự Doanh nghiệp (HRBP)',
        sector: 'Quản trị Con người',
        desc: 'Xây dựng văn hóa gắn kết, giải quyết xung đột nội bộ và hoạch định lộ trình thăng tiến.',
        skills: ['Giao tiếp liên văn hóa', 'Quản trị xung đột', 'Hiểu tâm lý tổ chức'],
      },
      {
        name: 'Giảng viên / Giáo viên Truyền cảm hứng',
        sector: 'Giáo dục & Đào tạo',
        desc: 'Truyền tải tri thức với phương pháp sinh động, đánh thức tiềm năng tự học ở học viên.',
        skills: ['Sư phạm hiện đại', 'Kiên nhẫn', 'Tạo động lực'],
      },
      {
        name: 'Chuyên gia Hướng nghiệp & Cố vấn Nghề nghiệp',
        sector: 'Quản trị Con người',
        desc: 'Giúp bạn trẻ khai phá điểm mạnh bản thân và định hướng chọn ngành nghề phù hợp.',
        skills: ['Thấu hiểu thị trường lao động', 'Trắc nghiệm tâm lý', 'Đồng hành cá nhân hóa'],
      },
    ],
  },

  E: {
    code: 'E',
    name: 'Người Dẫn đầu',
    title: 'THE LEADER',
    hollandName: 'Enterprising',
    tagline: 'Lãnh đạo • Kinh doanh • Thuyết phục • Chiến lược',
    color: '#ffc27a',
    intro: 'Có tố chất thủ lĩnh tự nhiên, dám mạo hiểm vì mục tiêu lớn, thích thuyết phục và dẫn dắt tập thể tiến lên.',
    traits: 'Có xu hướng chủ động đề xuất hướng đi đầu tiên cho nhóm khi mọi người đang lúng túng. Bạn dám đưa ra quyết định và chấp nhận rủi ro ngay cả khi thông tin chưa đầy đủ, miễn là mục tiêu đó lớn và xứng đáng. Bạn không sợ bị phản đối nếu tin mình có lý do chính đáng, thích thuyết phục người khác hành động và muốn tự quyết định hướng đi của công việc.',
    strengths: [
      'Quyết đoán, chủ động đứng mũi chịu sào trong các thời khắc then chốt',
      'Khả năng đàm phán, truyền lửa và thuyết phục người khác cùng hành động',
      'Tư duy nhạy bén về cơ hội kinh doanh, mục tiêu và hiệu quả quy mô',
    ],
    weaknesses: [
      'Dễ trở nên áp đặt nếu thiếu lắng nghe các phản hồi trái chiều',
      'Có xu hướng nhanh chán những việc mang tính chi tiết tỉ mỉ vụn vặt',
    ],
    environment: 'Doanh nghiệp kinh doanh, startup khởi nghiệp, sàn giao dịch tài chính, cơ quan hoạch định chiến lược.',
    sectors: [
      {
        title: 'Quản trị & Kinh doanh',
        careers: [
          'Giám đốc Điều hành (CEO) / Quản lý Dự án (Project Manager)',
          'Chuyên viên Phát triển Kinh doanh (Business Development)',
          'Nhà Khởi nghiệp (Entrepreneur / Founder)',
        ],
      },
      {
        title: 'Marketing & Bán hàng',
        careers: [
          'Quản lý Thương hiệu (Brand Manager)',
          'Trưởng phòng Kinh doanh (Sales Director)',
          'Chuyên gia Môi giới Bất động sản / Tài chính Cao cấp',
        ],
      },
      {
        title: 'Lĩnh vực Công chúng',
        careers: [
          'Luật sư Tranh tụng / Cố vấn Pháp lý Doanh nghiệp',
          'Chuyên gia Quan hệ Công chúng (PR Manager)',
          'Chuyên gia Đàm phán Thương mại Quốc tế',
        ],
      },
    ],
    careers: [
      {
        name: 'Nhà Khởi nghiệp / Founder Doanh nghiệp',
        sector: 'Quản trị & Kinh doanh',
        desc: 'Nhìn thấy cơ hội thị trường chưa ai khai phá, quy tụ nhân tài và dẫn dắt startup vượt bão.',
        skills: ['Tầm nhìn chiến lược', 'Chấp nhận rủi ro', 'Huy động nguồn lực'],
      },
      {
        name: 'Giám đốc Thương hiệu (Brand Manager)',
        sector: 'Marketing & Bán hàng',
        desc: 'Định vị sản phẩm trên thị trường, dẫn dắt các chiến dịch marketing lớn tăng trưởng doanh số.',
        skills: ['Phân tích thị trường', 'Chiến lược truyền thông', 'Lãnh đạo đội ngũ'],
      },
      {
        name: 'Quản lý Dự án Trọng điểm (Project Manager)',
        sector: 'Quản trị & Kinh doanh',
        desc: 'Điều phối nhân sự, ngân sách và tiến độ để bàn giao dự án phức tạp đúng cam kết.',
        skills: ['Quản lý tiến độ', 'Đàm phán các bên', 'Giải quyết sự cố'],
      },
      {
        name: 'Chuyên viên Phát triển Đối tác (BD Manager)',
        sector: 'Quản trị & Kinh doanh',
        desc: 'Tìm kiếm cơ hội hợp tác chiến lược, chốt các hợp đồng thương mại mang lại doanh thu lớn.',
        skills: ['Thuyết phục đỉnh cao', 'Networking', 'Nhận diện giá trị'],
      },
      {
        name: 'Luật sư Tranh tụng & Cố vấn Pháp lý',
        sector: 'Lĩnh vực Công chúng',
        desc: 'Lập luận sắc bén trước tòa hoặc trong bàn đàm phán để bảo vệ quyền lợi tối cao của thân chủ.',
        skills: ['Tư duy tranh biện', 'Pháp lý doanh nghiệp', 'Bản lĩnh áp lực'],
      },
    ],
  },

  C: {
    code: 'C',
    name: 'Người Tổ chức',
    title: 'THE ORGANIZER',
    hollandName: 'Conventional',
    tagline: 'Chính xác • Hệ thống • Dữ liệu • Kỷ luật',
    color: '#93c5fd',
    intro: 'Chuộng sự rõ ràng, ngăn nắp, làm việc chuẩn xác với dữ liệu và quy trình để đảm bảo hệ thống vận hành trơn tru.',
    traits: 'Thích làm việc với dữ liệu, số liệu, văn bản. Làm việc hiệu quả nhất khi công việc được chia nhỏ thành các bước, có quy trình và tiêu chuẩn rõ ràng. Có tính kỷ luật cao, tỉ mỉ nên rất dễ phát hiện các lỗi sai nhỏ khi làm việc.',
    strengths: [
      'Độ chính xác và tính kỷ luật cực cao, không bao giờ bỏ sót tiểu tiết',
      'Tài năng sắp xếp dữ liệu, thiết lập trật tự cho những gì hỗn độn',
      'Đáng tin cậy trong việc tuân thủ quy chuẩn, pháp lý và bảo mật số liệu',
    ],
    weaknesses: [
      'Khá bối rối hoặc dè dặt khi phải làm việc trong tình huống bất định, không quy tắc',
      'Có xu hướng quá cầu toàn trong việc tuân thủ từng câu chữ quy trình',
    ],
    environment: 'Công ty kiểm toán, ngân hàng, cơ quan thuế, trung tâm dữ liệu, bộ phận vận hành logistics, hành chính pháp chế.',
    sectors: [
      {
        title: 'Tài chính - Kế toán',
        careers: [
          'Kiểm toán viên (Auditor)',
          'Kế toán trưởng / Kế toán Thuế',
          'Chuyên viên Phân tích Rủi ro Tín dụng & Ngân hàng',
          'Giao dịch viên Ngân hàng Cao cấp',
        ],
      },
      {
        title: 'Hệ thống & Dữ liệu',
        careers: [
          'Chuyên viên Quản trị Cơ sở Dữ liệu (Database Administrator)',
          'Chuyên viên Tối ưu hóa Quy trình Vận hành (Operations Specialist)',
          'Kỹ sư Đảm bảo Chất lượng Quy trình (QA/QC Specialist)',
        ],
      },
      {
        title: 'Hành chính & Quản trị Văn bản',
        careers: [
          'Chuyên viên C&B (Lương thưởng & Chính sách Nhân sự)',
          'Thư ký Pháp lý / Trợ lý Điều hành Cấp cao',
          'Chuyên viên Quản trị Chuỗi Cung ứng & Logistics (Kho bãi, Chứng từ)',
        ],
      },
    ],
    careers: [
      {
        name: 'Kiểm toán viên Chuyên nghiệp (Auditor)',
        sector: 'Tài chính - Kế toán',
        desc: 'Soát xét báo cáo tài chính, kiểm chứng tính trung thực của dòng tiền theo chuẩn mực IFRS/VAS.',
        skills: ['Kiểm tra đối chiếu', 'Chuẩn mực kế toán', 'Độc lập khách quan'],
      },
      {
        name: 'Chuyên viên Quản trị Dữ liệu (Database Administrator)',
        sector: 'Hệ thống & Dữ liệu',
        desc: 'Thiết kế cấu trúc bảng, bảo mật sao lưu và tối ưu truy vấn dữ liệu vận hành cho tổ chức.',
        skills: ['SQL nâng cao', 'Sao lưu & Phục hồi', 'Bảo mật dữ liệu'],
      },
      {
        name: 'Chuyên gia Tối ưu Quy trình (Operations Specialist)',
        sector: 'Hệ thống & Dữ liệu',
        desc: 'Phân tích chuỗi công việc, loại bỏ các mắt xích lãng phí và tự động hóa báo cáo định kỳ.',
        skills: ['Phương pháp Lean / Kaizen', 'Lưu đồ quy trình', 'Theo dõi KPI'],
      },
      {
        name: 'Chuyên viên Quản trị Chuỗi Cung ứng & Logistics',
        sector: 'Hành chính & Quản trị',
        desc: 'Kiểm soát chứng từ xuất nhập khẩu, lịch trình luân chuyển hàng hóa và tồn kho chính xác.',
        skills: ['Chứng từ ngoại thương', 'ERP / SAP', 'Độ tỉ mỉ cao'],
      },
      {
        name: 'Chuyên gia Lương thưởng & Phúc lợi (C&B Specialist)',
        sector: 'Hành chính & Quản trị',
        desc: 'Thiết kế bảng lương, tính toán thuế thu nhập cá nhân và bảo hiểm xã hội chuẩn xác 100%.',
        skills: ['Luật lao động', 'Excel xử lý số liệu', 'Bảo mật thông tin lương'],
      },
    ],
  },
}
