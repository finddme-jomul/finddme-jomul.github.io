import cover from './assets/cover.webp';

// Provisional title and caption describe the supplied photo only.
// Ownership, ceramic status, dimensions, CAD, and finished-work status are unverified.
export const project = {
  number: '07',
  id: 'plant-pot',
  title: '작은 화분',
  name: 'Photo 08',
  description: '작은 식물이 심어진 화분 사진' + '. 작품 정보와 제작 기록은 아직 입력되지 않았습니다.',
  status: 'unconfirmed',
  tone: '#F7F7F7',
  cover,
  assets: { photo: [{ src: cover, alt: '작은 식물이 심어진 화분 사진' }], sketch: [], cad: [], render: [], actual: [] },
};
