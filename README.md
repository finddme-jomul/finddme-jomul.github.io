# JOMUL · 흙으로 만드는 작은 기록

손스케치에서 설계, 3D 예상도, 실제 기물까지 기록하는 개인 도자기 아카이브.

현재 메인은 사진 12장을 각각 하나의 프로젝트로 보여 주는 회전 갤러리다. 작품명은 사진 내용을 바탕으로 한 가제이며 제작 여부·CAD·3D 렌더 정보는 아직 확인되지 않았다. 프로젝트 선택은 현재 사진 미리보기를 연다.

## 개발

Vite + vanilla JavaScript/CSS. Node 의존성은 Docker에서 관리한다.

```bash
cd /home/ayaan/dockerfiles/finddme-jomul
docker compose up -d
docker compose exec web npm run build
```

http://localhost:5173 에서 커밋 전 수정도 확인할 수 있다. 최초 환경 설치는 Docker 디렉토리 README를 따른다.

프로젝트 목록: `src/projects/index.js`. 사진별 프로젝트 데이터와 대표 이미지는 `src/projects/00-*`부터 번호가 붙은 폴더에 모은다. 다음 작품은 `12-*`로 추가하고 이후에도 `13-*`, `14-*`처럼 번호를 계속 붙인다. 각 `project.js`의 `number`가 목록 순서를 정하며, `100` 이후에도 같은 방식이다. 메인 궤도에는 번호순 앞의 12개만 표시하고, 중앙 `View all`은 전체 프로젝트가 나오는 `/list.html`로 이동한다. 이전 임시 렌더는 `public/vessels/`에 보관되어 있으나 갤러리에서 사용하지 않는다.

## 현재 범위

- 12장 회전 궤도와 별도 전체 목록 페이지, 스크롤·버튼·키보드 탐색
- 반응형 화면, 움직임 감소 설정, 프로젝트 미리보기
- 프로덕션 빌드와 Chromium 데스크톱·모바일 에뮬레이션 검사 완료
- 작품별 CAD·3D 렌더·고유 상세 페이지와 GitHub Pages 배포는 후속 작업

로컬 계획·도구 현황·검사 결과는 Git에서 제외된 `docs/`에서 관리한다. 민감한 파일이나 로컬 문서를 강제로 커밋하지 않는다.
