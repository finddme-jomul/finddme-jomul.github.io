import cover from './assets/cover.webp';

// Provisional title and caption describe the supplied photo only.
// Ownership, ceramic status, dimensions, CAD, and finished-work status are unverified.
export const project = {
  number: '09',
  id: 'coffee-cup',
  title: '커피잔',
  name: 'Photo 10',
  description: '테이블 위 커피잔을 내려다본 사진' + '. 작품 정보와 제작 기록은 아직 입력되지 않았습니다.',
  status: 'unconfirmed',
  tone: '#F7F7F7',
  cover,
  assets: { photo: [{ src: cover, alt: '테이블 위 커피잔을 내려다본 사진' }], sketch: [], cad: [], render: [], actual: [] },
};
