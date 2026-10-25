# JOMUL · 흙으로 만드는 작은 기록

손스케치에서 설계, 3D 예상도, 실제 기물까지 기록하는 개인 도자기 아카이브.

메인은 프로젝트 이미지와 이름을 스크롤로 탐색하며, 프로젝트 선택 시 기존 상세 페이지를 창으로 엽니다. 전체 목록은 `/list.html`입니다.

## 개발

Vite + vanilla JavaScript/CSS. Node 의존성은 Docker에서 관리한다.

```bash
cd /home/ayaan/dockerfiles/finddme-jomul
docker compose up -d
docker compose exec web npm run build
```

http://localhost:5173 에서 커밋 전 수정도 확인할 수 있다. 최초 환경 설치는 Docker 디렉토리 README를 따른다.

## 프로젝트 관리

프로젝트 원본은 루트 `projects/` 한 곳에서 관리합니다.

```text
projects/00-chess/
  project.json       # 표시 번호, slug, 이름, 대표 이미지 경로
  assets/            # 메인·목록용 이미지
  page/              # 상세 HTML, CAD·3D·사진과 실행 파일
```

폴더명은 `number-slug`와 일치해야 합니다. 번호는 중복 없는 두 자리 이상 문자열이며 숫자순으로 표시합니다. 다음 프로젝트는 `12-*`로 추가합니다. 영문 표시 이름은 `title`, 한국어 이름은 `titleKo`, 대표 이미지는 `cover`에 지정합니다. 이미지 경로는 해당 프로젝트 폴더 기준입니다. 기존 자료의 `id`는 호환용이며, 상세 주소는 `slug`로 정합니다.

`page/assets/project.json`은 CAD·3D 실행에 필요한 생성 규격으로, 상위 `project.json`의 목록 정보와 역할이 다릅니다. 서브 이미지는 같은 프로젝트의 `page/index.html` 마지막 `gallery` 영역에서 자동으로 읽습니다.

개발 서버는 `projects/00-chess/page/`를 `/projects/chess/`로 제공합니다. 빌드도 이를 `dist/projects/chess/`에 복사하므로 기존 URL이 유지됩니다. 대표 이미지는 Vite가 처리합니다. `dist/`는 자동 생성 결과이며 직접 편집하지 않습니다. 기존 `src/projects/`, `public/projects/`는 사용하지 않습니다.

새 상세 페이지 내보내기는 먼저 `projects/NN-slug/project.json`을 등록한 뒤 `scripts/export-project-page.py`를 사용합니다. 기본 출력은 그 폴더의 `page/`입니다. 기존 상세 페이지를 덮어쓰지 않는 보호 규칙과 비교용 `--output` 옵션은 유지됩니다. 스킬의 생성 진입점은 기존과 같습니다.

로컬 계획·도구 현황·검사 결과는 Git에서 제외된 `docs/`에서 관리한다. 민감한 파일이나 로컬 문서를 강제로 커밋하지 않는다.

### 마지막 갤러리 사진 자동 추가

갤러리가 있는 상세 페이지는 `projects/NN-slug/page/assets/`에 `photo-4.png`처럼 파일을 넣으면 개발 서버와 빌드가 자동 반영합니다. 지원 확장자는 WebP, PNG, JPG, JPEG, HEIC, HEIF이며 대소문자를 구분하지 않습니다. 번호순으로 표시하며 `photo-4.png`와 `photo-04.jpg`처럼 번호가 겹치면 오류가 납니다. 삭제도 반영되지만 사진을 모두 없애려면 상세 페이지의 종료 방식 변경이 필요하므로 오류로 안내합니다.

기존 번호 사진 구성이 같으면 승인된 배치를 그대로 유지합니다. 개수가 달라지면 데스크톱·모바일별로 크기와 위치가 불규칙한 자동 배치로 전환됩니다. 사진 영역이 겹치지 않도록 배치하며, 같은 사진 구성에서는 새로고침해도 위치가 유지됩니다. `actual-photo.webp` 등 기존 비번호 사진은 보존합니다. 메인의 서브 이미지도 같은 결과를 읽습니다. 파일명에서 번호만 바꿔도 순서가 바뀝니다.

HEIC·HEIF 원본은 프로젝트 폴더에 보존하고, 기본 이미지 한 장을 WebP로 변환해 제공합니다(긴 변 최대 2400px, 품질 90). 변환 결과는 개발 서버 메모리 또는 `dist/`의 `assets/generated/`에만 생기며 원본 HEIC는 배포 출력에서 제외됩니다. Live Photo 동영상·HDR 표현의 완전한 재현은 지원 범위가 아닙니다. 해독할 수 없는 파일은 파일명과 함께 오류를 표시합니다. 의존성은 `npm ci`로 설치합니다.

이 처리는 스킬 출력 이후 사이트 빌드 단계에 적용됩니다. 스킬 자체의 생성 규칙은 변경하지 않았으며, 동일한 갤러리 구조로 재생성한 상세 페이지에도 적용됩니다. 갤러리가 없는 임시 상세 페이지는 먼저 갤러리 구조를 갖춰야 합니다.
