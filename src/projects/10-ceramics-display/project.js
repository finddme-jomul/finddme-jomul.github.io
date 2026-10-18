import cover from './assets/cover.webp';

// Provisional title and caption describe the supplied photo only.
// Ownership, ceramic status, dimensions, CAD, and finished-work status are unverified.
export const project = {
  number: '10',
  id: 'ceramics-display',
  title: '전시된 기물들',
  name: 'Photo 11',
  description: '여러 기물이 놓인 전시 장면' + '. 작품 정보와 제작 기록은 아직 입력되지 않았습니다.',
  status: 'unconfirmed',
  tone: '#F7F7F7',
  cover,
  assets: { photo: [{ src: cover, alt: '여러 기물이 놓인 전시 장면' }], sketch: [], cad: [], render: [], actual: [] },
};
