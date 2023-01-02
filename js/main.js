import ipads from "../data/ipads.js";
import navigations  from "../data/navigations.js";

/* =============== 장바구니 =============== */
const basketStarterEl = document.querySelector("header .basket-starter");

// document 전체에서 찾을 게 아니라 .basket이 .basket-starter 안에 있으므로 이렇게 바로 찾는 게 더 나으므로
// basketStarterEl는 장바구니 버튼이고, basketEl는 버튼을 누르면 나타날 메뉴 영역들
const basketEl = basketStarterEl.querySelector(".basket");
// const basketEl = document.querySelector('haeder .basket')

basketStarterEl.addEventListener("click", function (event) {
  event.stopPropagation(); // click 이벤트가 window까지 전파되는 걸 막는다. 여기까지만 click 이벤트가 유효하도록
  if (basketEl.classList.contains("show")) {
    hideBasket();
  } else {
    showBasket();
  }
});
// // basketEl가 basketStarterEl의 자식 요소인데, 얘를 클릭하면 basketStarterEl로 click 이벤트가 전파되잖아.
// // 근데 우리는 basketStarterEl를 클릭했을 때만 remove/add를 하고 싶으니까 이벤트 전파를 막아야 해.
basketEl.addEventListener("click", function (event) {
  event.stopPropagation();
});

// 화면 전체를 클릭한다는 건 window를 클릭한다는 의미
window.addEventListener("click", function () {
  hideBasket();
});

// 단순히 basketEl.classList.add('show') 코드 자체로 의미를 파악하기 어려워.
// 근데 이걸 함수에 담고, 그 함수에 이름을 붙이면, 우리가 그 기능을 쉽게 알 수 있어.
// 이걸 복잡한 로직을 하나의 함수 이름으로 '추상화'했다고 볼 수 있다.
function showBasket() {
  basketEl.classList.add("show");
}
function hideBasket() {
  basketEl.classList.remove("show");
}

/* =============== 검색 =============== */
const headerEl = document.querySelector("header");
// querySelectorAll은 forEach만 쓸수 있으므로 배열로 묶어주는 작업을 한다.
const headerMenuEls = [...headerEl.querySelectorAll("ul.menu > li")];
const searchWrapEl = headerEl.querySelector(".search-wrap");
const searchStarterEl = headerEl.querySelector(".search-starter"); // 장바구니 버튼을 누르면 ul.menu > li를 지워줘야 하므로
const searchCloserEl = searchWrapEl.querySelector(".search-closer"); // 닫기 버튼 누르면 끌 수 있게
const searchShadowEl = searchWrapEl.querySelector(".shadow");
const searchInputEl = searchWrapEl.querySelector("input");
const searchDelayEls = [...searchWrapEl.querySelectorAll("li")];

// searchStarterEl.addEventListener('click', function() {
//   showSearch()
// })
// 위처럼 익명함수를 쓸 필요 없음.
searchStarterEl.addEventListener("click", showSearch);
searchCloserEl.addEventListener("click", hideSearch);
// 바깥 부분을 눌러도 검색창이 닫혀야 하므로 .shadow를 클릭해도 닫힐 수 있게
searchShadowEl.addEventListener("click", hideSearch);

function showSearch() {
  headerEl.classList.add("searching");
  // document.body면 body 태그, document.head면 head 태그
  // documentElement는 html 문서의 최상위 요소 === html 태그
  document.documentElement.classList.add("fixed");

  // 검색창을 보여줄 때 메뉴 목록을 오른쪽부터 지워야 한다 == 오른쪽이면 index가 끝에서 시작하므로
  headerMenuEls.reverse().forEach(function (el, idx) {
    // 이거 쓰려면 ul.menu > li에 transition 속성이 있는지 확인해보고 없으면 추가해주기
    el.style.transitionDelay = (idx * 0.4) / headerMenuEls.length + "s";
  });

  // 검색 창 내부 애니메이션 (열 때)
  searchDelayEls.forEach(function (el, idx) {
    el.style.transitionDelay = (idx * 0.4) / searchDelayEls.length + "s";
  });

  // input 창 포커싱
  // 왜 타이머를 사용했냐면, 애니메이션 때문에 0.6초 뒤에 검색창이 뜨는데, 타이머를 안 쓰고
  // 바로 적용하면 있지도 않은 검색창에 focus를 하라고 명령하는 꼴이므로 이렇게 타이머를 써야 한다
  setTimeout(function () {
    searchInputEl.focus();
  }, 600);
}

function hideSearch() {
  headerEl.classList.remove("searching");
  document.documentElement.classList.remove("fixed");

  // 검색창을 지울 때 메뉴 목록이 왼쪽부터 등장해야 한다 == 한번 더 뒤집어 주면 된다
  headerMenuEls.reverse().forEach(function (el, idx) {
    el.style.transitionDelay = (idx * 0.4) / headerMenuEls.length + "s";
  });

  // 검색 창 내부 애니메이션 (닫을 때)
  searchDelayEls.reverse().forEach(function (el, idx) {
    el.style.transitionDelay = (idx * 0.4) / searchDelayEls.length + "s";
  });
  // 검색 창 내부의 경우 시작점을 0부터 시작하므로 초기화해줘야 한다.
  searchDelayEls.reverse();
  // 검색 창 입력내용 초기화
  searchInputEl.value = "";
}

/* =============== 요소의 가시성 관찰 =============== */
const io = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (!entry.isIntersecting) {
      return; // 보이지 않을 때는 처리해주지 않아야 하므로 return 처리
    }
    entry.target.classList.add("show");
  });
});
/**
 * info 클래스 가진 애들을 찾아서 infoEls 변수에 할당하고
 * 이 요소들을 forEach로 반복해서 io 객체에 넣어서 관찰해줌.
 */
const infoEls = document.querySelectorAll(".info");
infoEls.forEach(function (el) {
  io.observe(el);
});

/* =============== 비디오 재생 =============== */
const video = document.querySelector(".stage video");
const playBtn = document.querySelector(".stage .controller--play");
const pauseBtn = document.querySelector(".stage .controller--pause");

// play, pause 메서드는 video 태그에서 바로 쓸 수 있음
// play, pause 동작을 제어한 뒤에 hide 클래스로 버튼도 바꿔줘야 함
playBtn.addEventListener("click", function () {
  video.play();
  playBtn.classList.add("hide");
  pauseBtn.classList.remove("hide");
});
pauseBtn.addEventListener("click", function () {
  video.pause();
  playBtn.classList.remove("hide");
  pauseBtn.classList.add("hide");
});

/* =============== '당신에게 맞는 iPad는?' 렌더링 =============== */
const itemsEl = document.querySelector("section.compare .items");

ipads.forEach(function (ipad) {
  const itemEl = document.createElement("div");
  itemEl.classList.add("item");

  let colorList = "";
  ipad.colors.forEach(function (color) {
    colorList += `<li style="background-color: ${color};"></li>`;
  });

  // Comment tagged templates 확장 프로그램 => 아래처럼 쓰면 코드 하이리이팅이 됨
  itemEl.innerHTML = /* html */ `
    <div class="thumbnail">
      <img src="${ipad.thumbnail}" alt="${ipad.name}" />
    </div>
    <ul class="colors">
      ${colorList}
    </ul>
    <h3 class="name">${ipad.name}</h3>
    <p class="tagline">${ipad.tagline}</p>
    <p class="price">₩${ipad.price.toLocaleString("en-US")}부터</p>
    <button class="btn">구입하기</button>
    <a class="link" href="${ipad.url}">더 알아보기</a>
  `;

  itemsEl.append(itemEl);
});

/* =============== 네비게이션 렌더링 =============== */
const navigationEl = document.querySelector('footer .navigations')

navigations.forEach(function (nav) {
  const mapEl = document.createElement('div')
  mapEl.classList.add('map')

  let mapList = ''
  nav.maps.forEach(function (map) {
    mapList += /* html */ `
      <li>
        <a href="${map.url}">${map.name}</a>
      </li>
    `
  })

  mapEl.innerHTML = /* html */ `
    <h3>
      <span class="text">${nav.title}</span>
    </h3>
    <ul>
      ${mapList}
    </ul>
  `
  // 넣어주지 않으면 요소가 메모리 상에만 존재한다. 
  navigationEl.append(mapEl)
})

/* =============== 기타 정보 / this-year =============== */
const thisYearEl = document.querySelector('span.this-year')
thisYearEl.textContent = new Date().getFullYear()