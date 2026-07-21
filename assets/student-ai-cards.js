(function () {
  "use strict";

  // Replace this sample-only array with consented, public member-system data later.
  const samples = [
    {
      id: "daily-note",
      name: "하루의 생활노트",
      type: "생활 콘텐츠형",
      role: "생활 기록을 콘텐츠로 정리하는 사람",
      intro: "매일의 생활 아이디어를 짧은 이미지와 소개글로 차분하게 남깁니다.",
      focus: "생활 콘텐츠 · 정리 · 짧은 기록",
      visual: "living",
      tags: ["이미지", "소개글", "쇼츠", "AI 작업노트"],
      bio: "바쁜 일상에서 발견한 작은 아이디어를 보기 쉽게 정리하는 연습을 했습니다. 수업에서는 한 장의 이미지와 짧은 글이 자연스럽게 이어지도록 개인 콘텐츠 흐름을 만들었습니다.",
      outputs: ["생활 주제 이미지 3종", "30초 쇼츠 아이디어", "소개글 초안", "작업 순서 메모"],
      prompt: "생활 속 한 장면을 따뜻하고 정돈된 분위기의 콘텐츠 이미지로 표현해 주세요.",
      learned: "하나의 주제를 이미지, 소개글, 짧은 영상 아이디어로 나누어 정리하는 방법을 익혔습니다.",
      next: "계절별 생활 기록 시리즈를 더 만들어 보고 싶습니다.",
      links: [],
    },
    {
      id: "mono-studio",
      name: "모노 홍보 스튜디오",
      type: "홍보 이미지형",
      role: "작은 브랜드의 이야기를 시각적으로 정리하는 프리랜서",
      intro: "서비스의 장점을 한 장의 홍보 이미지와 쉬운 문장으로 풀어냅니다.",
      focus: "브랜드 소개 · 홍보 이미지 · 콘텐츠 기획",
      visual: "studio",
      tags: ["이미지", "소개글", "AI 작업노트", "개인 AI 지침"],
      bio: "무엇을 보여줄지부터 정리한 뒤, 브랜드 분위기에 맞는 이미지와 소개 문장을 연결했습니다. 반복해서 쓰는 기준은 개인 AI 지침으로 정리했습니다.",
      outputs: ["서비스 소개 이미지", "한 줄 가치 제안", "홍보 문장 초안", "개인 작업 지침"],
      prompt: "작은 브랜드의 신뢰감을 보여주는 단정한 홍보 이미지 구성을 제안해 주세요.",
      learned: "이미지 만들기 전 핵심 문장과 대상 고객을 먼저 정하면 결과물의 방향이 또렷해진다는 점을 배웠습니다.",
      next: "한 가지 서비스를 여러 채널에 맞게 소개하는 이미지 묶음을 만들고 싶습니다.",
      links: [],
    },
    {
      id: "office-flow",
      name: "오피스 플로우 기록실",
      type: "업무 소개형",
      role: "반복 업무를 더 이해하기 쉽게 설명하는 직장인",
      intro: "복잡한 업무 흐름을 동료가 바로 이해할 수 있는 자료로 정리합니다.",
      focus: "업무 정리 · 문서 자동화 · 팀 커뮤니케이션",
      visual: "office",
      tags: ["소개글", "AI 작업노트", "개인 AI 지침", "쇼츠"],
      bio: "반복 업무를 단계별로 나누고, 설명 문장과 작업 메모를 다시 쓸 수 있는 형식으로 정리했습니다. 개인 AI 지침에는 업무 맥락을 안전하게 요약하는 기준을 담았습니다.",
      outputs: ["업무 소개 페이지", "반복 업무 체크리스트", "짧은 설명 영상 아이디어", "개인 AI 지침 초안"],
      prompt: "업무 흐름을 처음 보는 동료도 이해할 수 있게 세 단계로 설명해 주세요.",
      learned: "AI에게 요청하기 전에 업무의 목적, 입력값, 확인 기준을 분리하면 설명과 문서가 더 일관된다는 점을 배웠습니다.",
      next: "팀에서 함께 쓰는 업무 안내 페이지를 더 다듬고 싶습니다.",
      links: [],
    },
  ];

  const escapeHtml = (value) => String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

  const tags = (items) => items.map((item) => `<span class="student-tag">${escapeHtml(item)}</span>`).join("");

  const visual = (student, expanded) => `
    <div class="student-card-visual student-card-visual--${escapeHtml(student.visual)}${expanded ? " student-card-visual--expanded" : ""}" role="img" aria-label="${escapeHtml(student.name)} 대표 이미지 자리">
      <span class="student-card-visual-kicker">AI CARD</span>
      <strong>${escapeHtml(student.type)}</strong>
      <span>${escapeHtml(student.focus.split(" · ")[0])}</span>
    </div>`;

  const list = document.querySelector("[data-student-card-list]");
  const detail = document.querySelector("[data-student-card-detail]");
  if (!list || !detail) return;

  const renderDetail = (student) => {
    detail.innerHTML = `
      <div class="student-detail-grid">
        ${visual(student, true)}
        <div>
          <p class="section-label">${escapeHtml(student.type)} · 가상 예시</p>
          <h2 class="headline mt-4 text-3xl md:text-4xl">${escapeHtml(student.name)}</h2>
          <p class="mt-4 text-lg font-bold text-neutral-700">${escapeHtml(student.role)}</p>
          <p class="mt-4 text-neutral-500">${escapeHtml(student.intro)}</p>
          <div class="student-tag-list mt-6">${tags(student.tags)}</div>
        </div>
      </div>
      <div class="student-detail-content mt-10 grid gap-8 lg:grid-cols-2">
        <section>
          <h3>소개글</h3>
          <p>${escapeHtml(student.bio)}</p>
        </section>
        <section>
          <h3>내가 하는 일 · 관심 분야</h3>
          <p>${escapeHtml(student.focus)}</p>
        </section>
        <section>
          <h3>강의에서 만든 결과물</h3>
          <ul>${student.outputs.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        </section>
        <section>
          <h3>사용한 프롬프트 일부</h3>
          <p class="student-prompt">${escapeHtml(student.prompt)}</p>
        </section>
        <section>
          <h3>배운 점</h3>
          <p>${escapeHtml(student.learned)}</p>
        </section>
        <section>
          <h3>다음에 만들고 싶은 것</h3>
          <p>${escapeHtml(student.next)}</p>
        </section>
      </div>
      <p class="student-consent-note mt-10">이 화면의 인물·활동명·결과물은 모두 가상 예시입니다. 실제 수강생 결과물은 공개 전 별도 동의와 운영자 검수를 거쳐야 합니다.</p>`;
  };

  const select = (id) => {
    const student = samples.find((item) => item.id === id) || samples[0];
    list.querySelectorAll("[data-student-id]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.studentId === student.id));
    });
    renderDetail(student);
  };

  list.innerHTML = samples.map((student, index) => `
    <button class="student-card soft-card card-lift" type="button" data-student-id="${escapeHtml(student.id)}" aria-pressed="${index === 0 ? "true" : "false"}">
      ${visual(student, false)}
      <span class="student-card-body">
        <span class="chip">${escapeHtml(student.type)} · 가상 예시</span>
        <strong class="student-card-name">${escapeHtml(student.name)}</strong>
        <span class="student-card-role">${escapeHtml(student.role)}</span>
        <span class="student-card-intro">${escapeHtml(student.intro)}</span>
        <span class="student-tag-list">${tags(student.tags)}</span>
        <span class="student-card-action">명함 보기 <span aria-hidden="true">→</span></span>
      </span>
    </button>`).join("");

  list.addEventListener("click", (event) => {
    const button = event.target.closest("[data-student-id]");
    if (button) select(button.dataset.studentId);
  });

  select(samples[0].id);
})();
