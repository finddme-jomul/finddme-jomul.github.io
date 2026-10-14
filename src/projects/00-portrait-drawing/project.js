import cover from './assets/cover.webp';

// Provisional title and caption describe the supplied photo only.
// Ownership, ceramic status, dimensions, CAD, and finished-work status are unverified.
export const project = {
  number: '00',
  id: 'portrait-drawing',
  title: '인물 드로잉',
  name: 'Photo 01',
  description: '연필로 그린 인물의 사진' + '. 작품 정보와 제작 기록은 아직 입력되지 않았습니다.',
  status: 'unconfirmed',
  tone: '#F7F7F7',
  cover,
  assets: { photo: [{ src: cover, alt: '연필로 그린 인물의 사진' }], sketch: [], cad: [], render: [], actual: [] },
};
