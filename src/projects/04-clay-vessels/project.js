import cover from './assets/cover.webp';

// Provisional title and caption describe the supplied photo only.
// Ownership, ceramic status, dimensions, CAD, and finished-work status are unverified.
export const project = {
  number: '04',
  id: 'clay-vessels',
  title: '밝은 기물들',
  name: 'Photo 05',
  description: '다양한 형태의 밝은 기물들이 모인 사진' + '. 작품 정보와 제작 기록은 아직 입력되지 않았습니다.',
  status: 'unconfirmed',
  tone: '#F7F7F7',
  cover,
  assets: { photo: [{ src: cover, alt: '다양한 형태의 밝은 기물들이 모인 사진' }], sketch: [], cad: [], render: [], actual: [] },
};
