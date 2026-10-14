import cover from './assets/cover.webp';

// Provisional title and caption describe the supplied photo only.
// Ownership, ceramic status, dimensions, CAD, and finished-work status are unverified.
export const project = {
  number: '08',
  id: 'sudoku-pencil',
  title: '숫자와 연필',
  name: 'Photo 09',
  description: '숫자 칸 위에 놓인 연필의 사진' + '. 작품 정보와 제작 기록은 아직 입력되지 않았습니다.',
  status: 'unconfirmed',
  tone: '#F7F7F7',
  cover,
  assets: { photo: [{ src: cover, alt: '숫자 칸 위에 놓인 연필의 사진' }], sketch: [], cad: [], render: [], actual: [] },
};
