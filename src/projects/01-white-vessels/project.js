import cover from './assets/cover.webp';

// Provisional title and caption describe the supplied photo only.
// Ownership, ceramic status, dimensions, CAD, and finished-work status are unverified.
export const project = {
  number: '01',
  id: 'white-vessels',
  title: '하얀 기물들',
  name: 'Photo 02',
  description: '흰색 둥근 기물들이 모인 사진' + '. 작품 정보와 제작 기록은 아직 입력되지 않았습니다.',
  status: 'unconfirmed',
  tone: '#F7F7F7',
  cover,
  assets: { photo: [{ src: cover, alt: '흰색 둥근 기물들이 모인 사진' }], sketch: [], cad: [], render: [], actual: [] },
};
