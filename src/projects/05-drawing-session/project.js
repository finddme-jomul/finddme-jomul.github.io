import cover from './assets/cover.webp';

// Provisional title and caption describe the supplied photo only.
// Ownership, ceramic status, dimensions, CAD, and finished-work status are unverified.
export const project = {
  number: '05',
  id: 'drawing-session',
  title: '연필과 스케치',
  name: 'Photo 06',
  description: '연필을 쥐고 종이를 바라보는 장면' + '. 작품 정보와 제작 기록은 아직 입력되지 않았습니다.',
  status: 'unconfirmed',
  tone: '#F7F7F7',
  cover,
  assets: { photo: [{ src: cover, alt: '연필을 쥐고 종이를 바라보는 장면' }], sketch: [], cad: [], render: [], actual: [] },
};
