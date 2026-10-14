import cover from './assets/cover.webp';

// Provisional title and caption describe the supplied photo only.
// Ownership, ceramic status, dimensions, CAD, and finished-work status are unverified.
export const project = {
  number: '03',
  id: 'workshop-table',
  title: '작업대의 물건들',
  name: 'Photo 04',
  description: '여러 기물과 도구가 놓인 작업대 사진' + '. 작품 정보와 제작 기록은 아직 입력되지 않았습니다.',
  status: 'unconfirmed',
  tone: '#F7F7F7',
  cover,
  assets: { photo: [{ src: cover, alt: '여러 기물과 도구가 놓인 작업대 사진' }], sketch: [], cad: [], render: [], actual: [] },
};
