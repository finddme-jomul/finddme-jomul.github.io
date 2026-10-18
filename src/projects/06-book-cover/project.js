import cover from './assets/cover.webp';

// Provisional title and caption describe the supplied photo only.
// Ownership, ceramic status, dimensions, CAD, and finished-work status are unverified.
export const project = {
  number: '06',
  id: 'book-cover',
  title: '책의 표지',
  name: 'Photo 07',
  description: '손에 든 책 표지가 담긴 사진' + '. 작품 정보와 제작 기록은 아직 입력되지 않았습니다.',
  status: 'unconfirmed',
  tone: '#F7F7F7',
  cover,
  assets: { photo: [{ src: cover, alt: '손에 든 책 표지가 담긴 사진' }], sketch: [], cad: [], render: [], actual: [] },
};
