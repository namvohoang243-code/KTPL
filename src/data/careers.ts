import type { CareerCluster, Occupation, PersonalityCode } from '@/types'

/**
 * Career clusters. Add a cluster here and (optionally) occupations below —
 * recommendations, class statistics and matrices pick it up automatically.
 */
export const CAREER_CLUSTERS: CareerCluster[] = [
  { id: 'technology', name: 'Công nghệ & Phần mềm', shortLabel: 'Technology', code: ['I', 'R', 'C'], icon: 'code', description: 'Xây dựng sản phẩm số, hệ thống thông minh và hạ tầng công nghệ cho đời sống hiện đại.' },
  { id: 'engineering', name: 'Kỹ thuật & Chế tạo', shortLabel: 'Engineering', code: ['R', 'I', 'C'], icon: 'ruler', description: 'Thiết kế, chế tạo và vận hành máy móc, công trình, hệ thống kỹ thuật.' },
  { id: 'science', name: 'Khoa học & Nghiên cứu', shortLabel: 'Science', code: ['I', 'A', 'R'], icon: 'flask', description: 'Đặt câu hỏi, thiết kế thí nghiệm và mở rộng ranh giới hiểu biết của con người.' },
  { id: 'data', name: 'Phân tích & Dữ liệu', shortLabel: 'Data', code: ['I', 'C', 'E'], icon: 'chart', description: 'Biến dữ liệu thành hiểu biết giúp tổ chức đưa ra quyết định tốt hơn.' },
  { id: 'business', name: 'Kinh doanh & Quản trị', shortLabel: 'Business', code: ['E', 'C', 'S'], icon: 'briefcase', description: 'Dẫn dắt đội nhóm, xây dựng sản phẩm, thị trường và các mối quan hệ kinh doanh.' },
  { id: 'design', name: 'Thiết kế & Sáng tạo', shortLabel: 'Design', code: ['A', 'I', 'E'], icon: 'brush', description: 'Tạo ra hình ảnh, trải nghiệm và sản phẩm có tính thẩm mỹ, giàu cảm xúc.' },
  { id: 'education', name: 'Giáo dục & Đào tạo', shortLabel: 'Education', code: ['S', 'A', 'E'], icon: 'graduation', description: 'Truyền cảm hứng, hướng dẫn và đồng hành cùng người học trên hành trình phát triển.' },
  { id: 'healthcare', name: 'Y tế & Chăm sóc sức khỏe', shortLabel: 'Healthcare', code: ['S', 'I', 'R'], icon: 'stethoscope', description: 'Chăm sóc, chẩn đoán và hỗ trợ sức khỏe thể chất, tinh thần của cộng đồng.' },
  { id: 'media', name: 'Truyền thông & Nội dung', shortLabel: 'Media', code: ['A', 'E', 'S'], icon: 'newspaper', description: 'Kể chuyện, xây dựng thương hiệu và kết nối thông điệp với đúng đối tượng.' },
  { id: 'law', name: 'Pháp lý & Dịch vụ công', shortLabel: 'Public Service', code: ['E', 'S', 'C'], icon: 'scale', description: 'Bảo vệ quyền lợi, xây dựng chính sách và phục vụ cộng đồng.' },
  { id: 'finance', name: 'Tài chính & Vận hành', shortLabel: 'Finance', code: ['C', 'E', 'I'], icon: 'landmark', description: 'Quản lý dòng tiền, rủi ro và quy trình để tổ chức vận hành chính xác, bền vững.' },
  { id: 'environment', name: 'Nông nghiệp & Môi trường', shortLabel: 'Environment', code: ['R', 'I', 'S'], icon: 'sprout', description: 'Bảo vệ hệ sinh thái, phát triển nông nghiệp và nguồn tài nguyên bền vững.' },
]

const occ = (
  id: string,
  name: string,
  clusterId: string,
  code: PersonalityCode[],
  description: string,
  skills: string[],
  environments: string[],
): Occupation => ({ id, name, clusterId, code, description, skills, environments })

export const OCCUPATIONS: Occupation[] = [
  // Technology
  occ('software-engineer', 'Software Engineer', 'technology', ['I', 'R', 'C'], 'Software Engineer là người thiết kế, xây dựng và duy trì các hệ thống phần mềm.', ['Problem solving', 'Logical thinking', 'Programming', 'Communication'], ['Technology', 'Startup', 'Research', 'Enterprise']),
  occ('data-scientist', 'Data Scientist', 'technology', ['I', 'C', 'R'], 'Data Scientist khai thác dữ liệu lớn bằng thống kê và học máy để trả lời các câu hỏi khó.', ['Statistics', 'Machine learning', 'Python / SQL', 'Storytelling'], ['Technology', 'Research', 'Finance', 'Healthcare']),
  occ('cybersecurity', 'Cybersecurity Specialist', 'technology', ['I', 'R', 'C'], 'Chuyên gia an ninh mạng bảo vệ hệ thống và dữ liệu khỏi các cuộc tấn công.', ['Network security', 'Risk analysis', 'Attention to detail', 'Incident response'], ['Enterprise', 'Government', 'Technology', 'Banking']),
  occ('ai-engineer', 'AI Engineer', 'technology', ['I', 'R', 'A'], 'AI Engineer xây dựng và triển khai các mô hình trí tuệ nhân tạo vào sản phẩm thực.', ['Deep learning', 'Mathematics', 'Programming', 'Experimentation'], ['Technology', 'Research', 'Startup', 'Enterprise']),
  occ('robotics-engineer', 'Robotics Engineer', 'technology', ['R', 'I', 'C'], 'Robotics Engineer thiết kế robot kết hợp cơ khí, điện tử và phần mềm điều khiển.', ['Embedded systems', 'Mechanics', 'Programming', 'Teamwork'], ['Factory', 'Research', 'Startup', 'Laboratory']),
  // Engineering
  occ('mechanical-engineer', 'Mechanical Engineer', 'engineering', ['R', 'I', 'C'], 'Kỹ sư cơ khí thiết kế và cải tiến máy móc, thiết bị và quy trình sản xuất.', ['CAD modelling', 'Physics', 'Problem solving', 'Project planning'], ['Factory', 'Laboratory', 'Manufacturing', 'Field work']),
  occ('civil-engineer', 'Civil Engineer', 'engineering', ['R', 'C', 'E'], 'Kỹ sư xây dựng lên kế hoạch và giám sát các công trình như cầu, đường, nhà cao tầng.', ['Structural analysis', 'Project management', 'Safety awareness', 'Teamwork'], ['Construction site', 'Office', 'Government', 'Consulting']),
  occ('electrical-engineer', 'Electrical Engineer', 'engineering', ['R', 'I', 'C'], 'Kỹ sư điện thiết kế hệ thống điện, mạch điện tử và năng lượng tái tạo.', ['Circuit design', 'Mathematics', 'Troubleshooting', 'Documentation'], ['Energy', 'Factory', 'Laboratory', 'Technology']),
  occ('architect', 'Architect', 'engineering', ['A', 'R', 'E'], 'Kiến trúc sư kết hợp thẩm mỹ, công năng và kỹ thuật để tạo nên không gian sống.', ['Spatial thinking', 'Design software', 'Creativity', 'Client communication'], ['Studio', 'Construction site', 'Consulting', 'Government']),
  // Science
  occ('research-scientist', 'Research Scientist', 'science', ['I', 'A', 'R'], 'Nhà nghiên cứu đặt giả thuyết, thiết kế thí nghiệm và công bố phát hiện mới.', ['Scientific method', 'Critical thinking', 'Academic writing', 'Perseverance'], ['University', 'Laboratory', 'Research institute', 'Industry R&D']),
  occ('biotechnologist', 'Biotechnologist', 'science', ['I', 'R', 'S'], 'Chuyên gia công nghệ sinh học ứng dụng sinh học vào y học, thực phẩm và môi trường.', ['Laboratory skills', 'Data analysis', 'Attention to detail', 'Teamwork'], ['Laboratory', 'Pharma', 'Research institute', 'Agriculture']),
  occ('physicist', 'Physicist', 'science', ['I', 'A', 'C'], 'Nhà vật lý nghiên cứu những quy luật nền tảng của vũ trụ và ứng dụng chúng vào công nghệ.', ['Mathematics', 'Modelling', 'Abstract thinking', 'Experimentation'], ['University', 'Laboratory', 'Technology', 'Space industry']),
  occ('chemist', 'Chemist', 'science', ['I', 'R', 'C'], 'Nhà hóa học phân tích, tổng hợp và kiểm nghiệm các chất cho công nghiệp và đời sống.', ['Lab techniques', 'Analytical thinking', 'Safety', 'Documentation'], ['Laboratory', 'Manufacturing', 'Pharma', 'University']),
  // Data
  occ('data-analyst', 'Data Analyst', 'data', ['I', 'C', 'E'], 'Data Analyst thu thập, làm sạch và trực quan hóa dữ liệu để hỗ trợ quyết định kinh doanh.', ['SQL / Excel', 'Data visualization', 'Business sense', 'Communication'], ['Technology', 'Enterprise', 'E-commerce', 'Consulting']),
  occ('bi-analyst', 'Business Intelligence Analyst', 'data', ['C', 'I', 'E'], 'BI Analyst xây dựng dashboard và báo cáo giúp lãnh đạo theo dõi hiệu suất tổ chức.', ['Dashboard design', 'Data modelling', 'Stakeholder management', 'Accuracy'], ['Enterprise', 'Retail', 'Banking', 'Technology']),
  occ('statistician', 'Statistician', 'data', ['I', 'C', 'R'], 'Nhà thống kê thiết kế khảo sát, phân tích số liệu và đánh giá độ tin cậy của kết luận.', ['Probability', 'Statistical modelling', 'Critical thinking', 'Reporting'], ['Research', 'Government', 'Healthcare', 'Finance']),
  occ('data-engineer', 'Data Engineer', 'data', ['C', 'I', 'R'], 'Data Engineer xây dựng đường ống dữ liệu để thông tin luôn sạch, nhanh và đáng tin cậy.', ['Data pipelines', 'Cloud platforms', 'SQL / Python', 'Reliability'], ['Technology', 'Enterprise', 'Startup', 'Finance']),
  // Business
  occ('product-manager', 'Product Manager', 'business', ['E', 'I', 'A'], 'Product Manager xác định tầm nhìn sản phẩm và điều phối đội nhóm để đưa sản phẩm tới người dùng.', ['Strategic thinking', 'Leadership', 'User empathy', 'Prioritization'], ['Startup', 'Technology', 'Enterprise', 'Consulting']),
  occ('entrepreneur', 'Entrepreneur', 'business', ['E', 'A', 'I'], 'Doanh nhân phát hiện cơ hội, xây dựng doanh nghiệp và chịu trách nhiệm cho tăng trưởng.', ['Risk taking', 'Leadership', 'Sales', 'Resilience'], ['Startup', 'Own business', 'Innovation hubs', 'Social enterprise']),
  occ('marketing-specialist', 'Marketing Specialist', 'business', ['E', 'A', 'S'], 'Chuyên viên marketing nghiên cứu khách hàng và xây dựng chiến dịch thu hút họ.', ['Market research', 'Copywriting', 'Analytics', 'Creativity'], ['Agency', 'Enterprise', 'E-commerce', 'Startup']),
  occ('project-manager', 'Project Manager', 'business', ['E', 'C', 'S'], 'Project Manager lập kế hoạch, điều phối nguồn lực và giữ cho dự án đúng tiến độ, ngân sách.', ['Planning', 'Leadership', 'Risk management', 'Communication'], ['Enterprise', 'Construction', 'Technology', 'Consulting']),
  // Design
  occ('ux-designer', 'UX/UI Designer', 'design', ['A', 'I', 'S'], 'UX/UI Designer thiết kế trải nghiệm số dễ dùng, đẹp và dựa trên hiểu biết về người dùng.', ['User research', 'Prototyping', 'Visual design', 'Empathy'], ['Technology', 'Startup', 'Agency', 'Product teams']),
  occ('graphic-designer', 'Graphic Designer', 'design', ['A', 'E', 'C'], 'Graphic Designer truyền tải thông điệp bằng hình ảnh, bố cục và màu sắc.', ['Typography', 'Visual composition', 'Design tools', 'Attention to detail'], ['Studio', 'Agency', 'Freelance', 'Publishing']),
  occ('industrial-designer', 'Industrial Designer', 'design', ['A', 'R', 'I'], 'Nhà thiết kế công nghiệp tạo ra những sản phẩm vật lý vừa đẹp vừa tiện dụng.', ['Sketching', '3D modelling', 'Materials knowledge', 'Problem solving'], ['Studio', 'Manufacturing', 'Technology', 'Consulting']),
  occ('game-designer', 'Game Designer', 'design', ['A', 'I', 'E'], 'Game Designer xây dựng luật chơi, thế giới và trải nghiệm khiến người chơi gắn bó.', ['Storytelling', 'Systems thinking', 'Prototyping', 'Teamwork'], ['Game studio', 'Startup', 'Technology', 'Entertainment']),
  // Education
  occ('teacher', 'Teacher', 'education', ['S', 'A', 'E'], 'Giáo viên truyền đạt kiến thức, khơi gợi tò mò và đồng hành cùng sự trưởng thành của học sinh.', ['Communication', 'Patience', 'Lesson design', 'Empathy'], ['School', 'University', 'Training centre', 'Online education']),
  occ('school-counselor', 'School Counselor', 'education', ['S', 'I', 'A'], 'Chuyên viên tư vấn học đường hỗ trợ học sinh về học tập, tâm lý và định hướng tương lai.', ['Active listening', 'Empathy', 'Career guidance', 'Confidentiality'], ['School', 'Community centre', 'NGO', 'Education tech']),
  occ('instructional-designer', 'Instructional Designer', 'education', ['A', 'S', 'I'], 'Instructional Designer thiết kế trải nghiệm học tập hấp dẫn và hiệu quả cho người học.', ['Learning science', 'Content design', 'Technology tools', 'Collaboration'], ['Education tech', 'Enterprise', 'University', 'Remote']),
  occ('trainer', 'Corporate Trainer', 'education', ['S', 'E', 'A'], 'Corporate Trainer phát triển kỹ năng cho nhân sự thông qua các chương trình đào tạo thực tiễn.', ['Presentation', 'Facilitation', 'Coaching', 'Adaptability'], ['Enterprise', 'Training centre', 'Consulting', 'Freelance']),
  // Healthcare
  occ('doctor', 'Doctor', 'healthcare', ['I', 'S', 'R'], 'Bác sĩ chẩn đoán, điều trị và theo dõi sức khỏe người bệnh dựa trên bằng chứng khoa học.', ['Clinical reasoning', 'Empathy', 'Decision making', 'Resilience'], ['Hospital', 'Clinic', 'Research', 'Community health']),
  occ('nurse', 'Nurse', 'healthcare', ['S', 'R', 'C'], 'Điều dưỡng chăm sóc trực tiếp, theo dõi tình trạng và hỗ trợ người bệnh hồi phục.', ['Patient care', 'Teamwork', 'Attention to detail', 'Calm under pressure'], ['Hospital', 'Clinic', 'Home care', 'Community health']),
  occ('psychologist', 'Psychologist', 'healthcare', ['S', 'I', 'A'], 'Nhà tâm lý học nghiên cứu hành vi và hỗ trợ con người vượt qua khó khăn tinh thần.', ['Active listening', 'Research methods', 'Empathy', 'Ethics'], ['Clinic', 'School', 'Research', 'Community centre']),
  occ('physiotherapist', 'Physiotherapist', 'healthcare', ['S', 'R', 'I'], 'Chuyên viên vật lý trị liệu phục hồi chức năng vận động và giảm đau cho người bệnh.', ['Anatomy knowledge', 'Hands-on therapy', 'Motivation', 'Patience'], ['Clinic', 'Hospital', 'Sports teams', 'Rehabilitation centre']),
  // Media
  occ('content-creator', 'Content Creator', 'media', ['A', 'E', 'S'], 'Content Creator tạo nội dung số hấp dẫn và xây dựng cộng đồng quanh nó.', ['Storytelling', 'Video / writing', 'Audience insight', 'Consistency'], ['Freelance', 'Agency', 'Media company', 'Own channel']),
  occ('journalist', 'Journalist', 'media', ['A', 'I', 'S'], 'Nhà báo tìm kiếm, xác minh và kể lại sự thật bằng câu chuyện rõ ràng, có trách nhiệm.', ['Investigation', 'Writing', 'Interviewing', 'Ethics'], ['Newsroom', 'Field work', 'Digital media', 'Freelance']),
  occ('pr-specialist', 'PR Specialist', 'media', ['E', 'S', 'A'], 'Chuyên viên PR xây dựng và bảo vệ hình ảnh của tổ chức trong mắt công chúng.', ['Communication', 'Crisis management', 'Networking', 'Writing'], ['Agency', 'Enterprise', 'NGO', 'Government']),
  occ('video-producer', 'Video Producer', 'media', ['A', 'E', 'R'], 'Video Producer điều phối ý tưởng, quay dựng và hoàn thiện sản phẩm video.', ['Storyboarding', 'Editing', 'Project coordination', 'Creativity'], ['Studio', 'Agency', 'Media company', 'Freelance']),
  // Public service
  occ('lawyer', 'Lawyer', 'law', ['E', 'I', 'S'], 'Luật sư tư vấn, đại diện và bảo vệ quyền lợi hợp pháp cho khách hàng.', ['Argumentation', 'Research', 'Negotiation', 'Ethics'], ['Law firm', 'Court', 'Enterprise', 'Government']),
  occ('policy-analyst', 'Policy Analyst', 'law', ['I', 'E', 'C'], 'Policy Analyst nghiên cứu và đề xuất chính sách dựa trên bằng chứng và dữ liệu.', ['Research', 'Writing', 'Data analysis', 'Critical thinking'], ['Government', 'Think tank', 'NGO', 'International orgs']),
  occ('social-worker', 'Social Worker', 'law', ['S', 'E', 'C'], 'Nhân viên công tác xã hội hỗ trợ cá nhân và cộng đồng tiếp cận nguồn lực, quyền lợi.', ['Empathy', 'Case management', 'Communication', 'Advocacy'], ['Community centre', 'NGO', 'Government', 'Hospital']),
  occ('diplomat', 'Diplomat', 'law', ['E', 'S', 'I'], 'Nhà ngoại giao đại diện quốc gia, đàm phán và xây dựng quan hệ hợp tác quốc tế.', ['Negotiation', 'Languages', 'Cultural awareness', 'Strategic thinking'], ['Government', 'Embassy', 'International orgs', 'Global teams']),
  // Finance
  occ('accountant', 'Accountant', 'finance', ['C', 'E', 'I'], 'Kế toán ghi nhận, kiểm soát và báo cáo tài chính chính xác cho tổ chức.', ['Accuracy', 'Financial reporting', 'Spreadsheet skills', 'Compliance'], ['Enterprise', 'Audit firm', 'Government', 'Banking']),
  occ('financial-analyst', 'Financial Analyst', 'finance', ['C', 'I', 'E'], 'Financial Analyst đánh giá khoản đầu tư và xu hướng thị trường để tư vấn quyết định tài chính.', ['Financial modelling', 'Analytical thinking', 'Excel', 'Presentation'], ['Banking', 'Investment firm', 'Enterprise', 'Fintech']),
  occ('auditor', 'Auditor', 'finance', ['C', 'I', 'E'], 'Kiểm toán viên kiểm tra tính trung thực và tuân thủ trong hoạt động tài chính.', ['Attention to detail', 'Risk assessment', 'Integrity', 'Reporting'], ['Audit firm', 'Enterprise', 'Government', 'Banking']),
  occ('operations-manager', 'Operations Manager', 'finance', ['C', 'E', 'R'], 'Operations Manager tối ưu quy trình để tổ chức vận hành trơn tru và tiết kiệm.', ['Process improvement', 'Organization', 'Leadership', 'Problem solving'], ['Enterprise', 'Logistics', 'Manufacturing', 'Retail']),
  // Environment
  occ('environmental-scientist', 'Environmental Scientist', 'environment', ['I', 'R', 'S'], 'Nhà khoa học môi trường theo dõi, đánh giá và đề xuất giải pháp giảm tác động đến thiên nhiên.', ['Field research', 'Data analysis', 'Report writing', 'Systems thinking'], ['Field work', 'Government', 'NGO', 'Consulting']),
  occ('agricultural-engineer', 'Agricultural Engineer', 'environment', ['R', 'I', 'C'], 'Kỹ sư nông nghiệp ứng dụng công nghệ để tăng năng suất và canh tác bền vững.', ['Agritech', 'Mechanics', 'Data analysis', 'Project planning'], ['Farm', 'Laboratory', 'Agritech startup', 'Government']),
  occ('renewable-energy', 'Renewable Energy Engineer', 'environment', ['R', 'I', 'E'], 'Kỹ sư năng lượng tái tạo thiết kế hệ thống điện mặt trời, điện gió và lưu trữ năng lượng.', ['Energy systems', 'Engineering design', 'Sustainability', 'Teamwork'], ['Energy company', 'Field work', 'Research', 'Startup']),
  occ('forester', 'Forest & Wildlife Officer', 'environment', ['R', 'S', 'I'], 'Cán bộ lâm nghiệp bảo vệ rừng, đa dạng sinh học và hỗ trợ cộng đồng quanh vùng rừng.', ['Field skills', 'Ecology', 'Community engagement', 'Resilience'], ['Forest reserve', 'National park', 'Government', 'NGO']),
]

export const CLUSTER_MAP = Object.fromEntries(CAREER_CLUSTERS.map((c) => [c.id, c])) as Record<string, CareerCluster>
export const OCCUPATION_MAP = Object.fromEntries(OCCUPATIONS.map((o) => [o.id, o])) as Record<string, Occupation>

export const occupationsOfCluster = (clusterId: string): Occupation[] =>
  OCCUPATIONS.filter((o) => o.clusterId === clusterId)
