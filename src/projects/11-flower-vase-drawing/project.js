import cover from './assets/cover.webp';

// Provisional title and caption describe the supplied photo only.
// Ownership, ceramic status, dimensions, CAD, and finished-work status are unverified.
export const project = {
  number: '11',
  id: 'flower-vase-drawing',
  title: '꽃병 드로잉',
  name: 'Photo 12',
  description: '꽃과 얼굴이 그려진 꽃병 드로잉' + '. 작품 정보와 제작 기록은 아직 입력되지 않았습니다.',
  status: 'unconfirmed',
  tone: '#F7F7F7',
  cover,
  assets: { photo: [{ src: cover, alt: '꽃과 얼굴이 그려진 꽃병 드로잉' }], sketch: [], cad: [], render: [], actual: [] },
};
