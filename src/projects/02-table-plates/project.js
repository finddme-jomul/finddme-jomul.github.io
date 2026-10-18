import cover from './assets/cover.webp';

// Provisional title and caption describe the supplied photo only.
// Ownership, ceramic status, dimensions, CAD, and finished-work status are unverified.
export const project = {
  number: '02',
  id: 'table-plates',
  title: '식탁 위 접시',
  name: 'Photo 03',
  description: '음식이 놓인 접시들의 사진' + '. 작품 정보와 제작 기록은 아직 입력되지 않았습니다.',
  status: 'unconfirmed',
  tone: '#F7F7F7',
  cover,
  assets: { photo: [{ src: cover, alt: '음식이 놓인 접시들의 사진' }], sketch: [], cad: [], render: [], actual: [] },
};
