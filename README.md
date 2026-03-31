<div align="center">
  <img src="https://github.com/user-attachments/assets/ec6106f5-7438-4027-b0ca-9983e094a445" width="200" alt="palette로고" />

  # 팔레트 (Palette)
  > **나의 여행 성향을 발견하고, 취향이 맞는 여행자들과 이야기를 나누는 공간**
</div>

## 소개

팔레트는 여행 성향 테스트를 통해 사용자의 여행 스타일을 분석하고, AI 기반 장소 추천과 커뮤니티 기능을 제공하는 모바일 웹 애플리케이션입니다.

---

## 📺 데모 및 발표 자료

<div align="center">
  <h3>🎥 기능 구현 데모 / 📄 프로젝트 발표 자료</h3>
  
  <table border="0" cellpadding="0" cellspacing="0" align="center" style="border: none !important;">
    <tr>
      <td style="padding: 10px; text-align: center; vertical-align: middle; border: none !important;">
        <video src="https://github.com/user-attachments/assets/b568db91-50d0-4dd9-bce5-7777e579e5fa" width="200" height="auto" controls muted autoplay loop style="object-fit: contain;">
          브라우저가 비디오 태그를 지원하지 않습니다.
        </video>
        <p><em>(영상을 전체화면으로 확인하세요)</em></p>
      </td>
      <td style="padding: 10px; text-align: center; vertical-align: middle; border: none !important;">
        <a href="https://github.com/user-attachments/files/26368477/palette.pdf">
          <img src="https://github.com/user-attachments/assets/d0c398a8-9238-495d-a178-db8c83d7f169" width="1000" height="auto" alt="Palette 발표 자료 PDF 다운로드" style="object-fit: contain; border-radius: 8px;" />
        </a>
        <p><strong>💡 그림 클릭시 PDF 다운로드</strong></p>
      </td>
    </tr>
  </table>
  
  <br />
</div>

---



> 💡 위 링크를 클릭하면 상세한 기획 배경과 아키텍처 설명을 확인하실 수 있습니다.

## 주요 기능


- **여행 성향 테스트** — 성향 기반 질문으로 6가지 여행 타입 중 나의 타입을 발견
- **AI 장소 추천** — Gemini AI를 활용한 성향 맞춤 여행지 추천
- **커뮤니티** — 여행 경험 공유, 게시물 작성 및 댓글
- **카카오 로그인** — 카카오 OAuth 간편 로그인
- **마이페이지** — 프로필 관리 및 북마크

### 여행 타입

| 타입 | 설명 |
|------|------|
| HEALING | 힐링·휴식 중심 여행자 |
| CALM | 조용하고 여유로운 여행자 |
| SHOPPING | 쇼핑을 즐기는 여행자 |
| FOOD | 먹방 탐험가 |
| PHOTO | 사진·감성 여행자 |
| EXPLORER | 탐험·액티비티 여행자 |

## 기술 스택

| 분류 | 기술 |
|------|------|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS, Framer Motion, Emotion |
| Backend / DB | Supabase (PostgreSQL + Auth) |
| AI | Google Gemini API |
| Map | Kakao Maps SDK |
| 배포 | Vercel |

## 시작하기

### 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 아래 값을 입력합니다.

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_KAKAO_API_KEY=your_kakao_api_key
```

### 설치 및 실행

```bash
npm install
npm install @google/genai
npm install react-kakao-maps-sdk
npm install -D kakao.maps.d.ts
npm run dev
```

### 빌드

```bash
npm run build
npm run preview   # 빌드 결과 로컬 미리보기
```

## 프로젝트 구조

```
src/
├── assets/          # 이미지 및 아이콘
├── components/      # 공통 UI 컴포넌트
│   ├── shared/      # 네비게이션, 로딩 등
│   └── ui/          # Button, Card, ProgressBar 등
├── contexts/        # React Context (인증)
├── data/            # 데이터 모델 및 목업
├── lib/             # Supabase 클라이언트
├── pages/           # 페이지 컴포넌트
│   ├── Home/
│   ├── Test/
│   ├── Community/
│   └── MyPage/
└── services/        # API 서비스 레이어
```

## 페이지 구성

| 경로 | 설명 |
|------|------|
| `/` | 홈 — 테스트 소개 및 여행 타입 미리보기 |
| `/test` | 여행 성향 테스트 |
| `/result/:type` | 테스트 결과 및 AI 장소 추천 |
| `/community` | 커뮤니티 피드 |
| `/create-post` | 게시물 작성 |
| `/community/:postId` | 게시물 상세 |
| `/login` | 카카오 로그인 |
| `/my` | 마이페이지 |
| `/my/edit-profile` | 프로필 수정 |
