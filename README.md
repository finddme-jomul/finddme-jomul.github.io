# Clay Orbit · 흙의 궤도

손스케치에서 설계, 3D 예상도, 실제 기물까지 기록하는 개인 도자기 아카이브.

현재 메인은 스크롤에 반응하는 회전 갤러리다. Blender 임시 형태 스터디 6종으로 화면을 구성했으며 실제 제작 작품은 아직 등록하지 않았다. 프로젝트 선택은 임시 미리보기를 연다.

## 개발

Vite + vanilla JavaScript/CSS. Node 의존성은 Docker에서 관리한다.

```bash
cd /home/ayaan/dockerfiles/finddme-clay
docker compose up -d
docker compose exec web npm run build
```

http://localhost:5173 에서 커밋 전 수정도 확인할 수 있다. 최초 환경 설치는 Docker 디렉토리 README를 따른다.

프로젝트 데이터: `src/projects.js`. 임시 렌더: `public/vessels/`.

## 현재 범위

- 회전·목록 보기, 스크롤·버튼·키보드 탐색
- 반응형 화면, 움직임 감소 설정, 프로젝트 미리보기
- 프로덕션 빌드와 Chromium 데스크톱·모바일 에뮬레이션 검사 완료
- 실제 기물 설계·고유 상세 페이지와 GitHub Pages 배포는 후속 작업

로컬 계획·도구 현황·검사 결과는 Git에서 제외된 `docs/`에서 관리한다. 민감한 파일이나 로컬 문서를 강제로 커밋하지 않는다.
