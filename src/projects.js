// Gallery placeholders, not completed physical works. Replace with real project records.
export const projects = [
  { id: 'moon', title: '달빛을 담은 형태', name: 'Moon', tone: '#F4F5D6', description: '둥근 어깨와 차분한 색. 달빛처럼 부드러운 표면을 상상한 형태 스터디.' },
  { id: 'earth', title: '흙의 온도', name: 'Earth', tone: '#EDE3B2', description: '붉은 흙이 가진 따뜻한 색과 낮고 편안한 비례를 살펴봅니다.' },
  { id: 'moss', title: '초록이 머무는 곳', name: 'Moss', tone: '#B3CB5B', description: '깊은 초록과 길게 뻗은 실루엣. 작은 잎 한 줄기가 놓일 자리를 상상합니다.' },
  { id: 'ink', title: '고요한 먹빛', name: 'Ink', tone: '#90B997', description: '빛이 닿는 면에 따라 달라지는 짙은 표면과 윤곽을 살펴봅니다.' },
  { id: 'sand', title: '모래의 시간', name: 'Sand', tone: '#F4EA8B', description: '넓어진 몸체와 낮은 높이. 모래빛으로 표현한 안정적인 형태의 실험.' },
  { id: 'chalk', title: '비워 둔 여백', name: 'Chalk', tone: '#FBFDF2', description: '작고 담백한 형태에 밝은 색을 얹어, 비어 있는 공간과의 균형을 살펴봅니다.' },
].map((project, index) => ({ ...project, number: String(index + 1).padStart(2, '0'), image: `/vessels/${project.id}.png` }));
