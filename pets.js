let list = []            // все питомцы из data.json
let filteredList = []    // отфильтрованные по категории
let currentCategory = 'All'
let countPages, pix, page

fetch('data.json')
  .then(response => {
    if (!response.ok) throw new Error(`Ошибка: ${response.status}`)
    return response.json()
  })
  .then(data => {
    list = data
    filteredList = [...list]

    // Рендер карточек
    renderCards()

    // Инициализация пагинации
    reinit()

    // Делегирование кликов
    initDelegatedHandlers()
  })
  .catch(error => {
    console.error('Ошибка:', error)
  })

/* ========== РЕНДЕР КАРТОЧЕК ========== */

function renderCards () {
  const container = document.querySelector('.slides_our_pets')
  container.innerHTML = ''

  const perPage =
    window.innerWidth >= 1280 ? 8 :
    window.innerWidth >= 768  ? 6 :
    3

  const total = filteredList.length
  const lastPageCount = total % perPage
  const needPad = lastPageCount !== 0 ? perPage - lastPageCount : 0

  // Основные карточки
  filteredList.forEach((pet, index) => {
    container.insertAdjacentHTML('beforeend', cardTemplate(pet, index))
  })

  // Доборные карточки (первые из filteredList) — только если нужно
  for (let i = 0; i < needPad; i++) {
    const pet = filteredList[i]
    if (pet) container.insertAdjacentHTML('beforeend', cardTemplate(pet, i))
  }
}

function cardTemplate (pet, index) {
  return `<div class="slide_pets" data-index="${index}">
    <div class="img_slide">
      <img src="${pet.img}" alt="${pet.name} — ${pet.breed}">
    </div>
    <h3 class="name_slide">${pet.name}</h3>
    <button class="button_slide" type="button">Learn more</button>
  </div>`
}

/* ========== ФИЛЬТРАЦИЯ ПО КАТЕГОРИЯМ ========== */

function filterByCategory (category) {
  currentCategory = category

  if (category === 'All') {
    filteredList = [...list]
  } else {
    const type = category === 'Dogs' ? 'Dog' : 'Cat'
    filteredList = list.filter(item => item.type === type)
  }

  // Перерисовать карточки
  renderCards()

  // Обновить активную кнопку
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.classList.toggle('category-btn--active', btn.textContent.trim() === category)
  })

  // Сбросить пагинацию
  reinit()
}

/* ========== ИНИЦИАЛИЗАЦИЯ ========== */

function reinit () {
  const container = document.querySelector('.container_slides_our_pets')
  if (container) container.style.transform = `translate(0px)`

  page = 0
  setPage(page)
  buttonStatus('prev', 'inactive')
  buttonStatus('next_end', 'active')

  // Кол-во страниц — от filteredList, с округлением вверх
  const perPage =
    window.innerWidth >= 1280 ? 8 :
    window.innerWidth >= 768  ? 6 :
    3

  countPages = Math.max(1, Math.ceil(filteredList.length / perPage))

  initMobileMenu()
}

function initMobileMenu () {
  if (!document.querySelector('.container_modal_menu') && window.innerWidth <= 768) {
    document.body.insertAdjacentHTML(
      'beforeend',
      `<div class="container_modal_menu" id="inactive">
        <nav class="mob_nav-menu_pets">
          <ul>
            <li><a href="./index.html#about">About the shelter</a></li>
            <li class="nav-link--active"><a href="./pets.html#pets">Our pets</a></li>
            <li><a href="./index.html#help">Help the shelter</a></li>
            <li><a href="./pets.html#contacts">Contacts</a></li>
          </ul>
        </nav>
      </div>`
    )
    document
      .querySelector('.container_modal_menu')
      .addEventListener('click', closeBurger)
  } else if (document.querySelector('.container_modal_menu')) {
    document.querySelector('.container_modal_menu').setAttribute('id', 'inactive')
  }
}

/* ========== ДЕЛЕГИРОВАНИЕ КЛИКОВ ========== */

function initDelegatedHandlers () {
  document.addEventListener('click', (event) => {
    // Категории
    if (event.target.classList.contains('category-btn')) {
      filterByCategory(event.target.textContent.trim())
      return
    }

    // "Learn more" в карточке
    if (event.target.classList.contains('button_slide')) {
      const slide = event.target.closest('.slide_pets')
      if (!slide) return

      const index = Number(slide.dataset.index)
      const pet = filteredList[index]

      if (pet) showPet(pet)
      return
    }

    // Модалка
    if (event.target.closest('.close_modal')) { closePet(); return }

    // Пагинация
    if (event.target.closest('.next')) { next(); return }
    if (event.target.closest('.prev')) { prev(); return }
    if (event.target.closest('.next_end')) { next_end(); return }
    if (event.target.closest('.prev_start')) { prev_start(); return }

    // Бургер
    if (event.target.closest('.burger')) { openBurger(); return }
  })

  // Esc — закрыть модалку / меню
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closePet()
      closeBurger()
    }
  })
}

/* ========== ПАГИНАЦИЯ ========== */

function setPage (page) {
  document.querySelector('.page_pets').innerHTML = page + 1
}

function buttonStatus (button, status) {
  if (button === 'prev') {
    document.querySelector('.prev').setAttribute('id', status)
    document.querySelector('.prev_start').setAttribute('id', status)
  }
  if (button === 'next_end') {
    document.querySelector('.next_end').setAttribute('id', status)
  }
}

function next () {
  pix = -(document.querySelector('.container_show_our_pets').clientWidth + 40)
  if (page + 1 < countPages) {
    page++
    setPage(page)
    buttonStatus('prev', 'active')
    document.querySelector('.container_slides_our_pets').style.transform = `translate(${pix * page}px)`
    if (page + 1 === countPages) buttonStatus('next_end', 'inactive')
  }
}

function next_end () {
  if (page < countPages - 1) {
    pix = -(document.querySelector('.container_show_our_pets').clientWidth + 40)
    page = countPages - 1
    setPage(page)
    buttonStatus('prev', 'active')
    document.querySelector('.container_slides_our_pets').style.transform = `translate(${pix * page}px)`
    buttonStatus('next_end', 'inactive')
  }
}

function prev () {
  if (page > 0) {
    page--
    setPage(page)
    buttonStatus('next_end', 'active')
    document.querySelector('.container_slides_our_pets').style.transform = `translate(${pix * page}px)`
    if (page < 1) buttonStatus('prev', 'inactive')
  }
}

function prev_start () {
  const container = document.querySelector('.container_slides_our_pets')
  if (container) container.style.transform = `translate(0px)`
  page = 0
  setPage(page)
  buttonStatus('prev', 'inactive')
  buttonStatus('next_end', 'active')
}

/* ========== RESIZE ========== */

let lastWidth = window.innerWidth
window.addEventListener('resize', () => {
  const currentWidth = window.innerWidth
  if (currentWidth !== lastWidth) {
    renderCards()
    reinit()
    lastWidth = currentWidth
  }
})

/* ========== МОДАЛЬНОЕ ОКНО ========== */

function showPet (pet) {
  document.body.insertAdjacentHTML(
    'beforeend',
    `<div class="container_modal">
  <div class="full_modal">
  <button class="close_modal" type="button" aria-label="Close modal">
    <img src="./img/modal_close_button.png" alt="">
  </button>
    <div class="modal">
    <img src="${pet.img}" alt="${pet.name} — ${pet.breed}">
    <div class="modal_content">
    
    <div class="modal_content_one">
    <div class="modal_name_pets">${pet.name}</div>
    <div class="modal_type_pets">${pet.type} - ${pet.breed}</div>
    <div class="modal_description_pets">${pet.description}</div>
    </div>
    
    <div class="modal_content_two">
    <div class="modal_specifications_pets">    
    <ul>   
    <li><b>Age: </b>${pet.age}
    </li>    
    <li><b>Inoculations: </b>${pet.inoculations.join(', ')}
    </li>
    <li><b>Diseases: </b>${pet.diseases.join(', ')}
    </li>
    <li><b>Parasites: </b>${pet.parasites.join(', ')}
    </li>
    </ul>
    </div>
    </div>

    </div>

    </div>
     
    </div>
   
    </div>`
  )
  document
    .querySelector('.close_modal')
    .addEventListener('click', closePet)
}

function closePet () {
  const modal = document.querySelector('.container_modal')
  if (modal) modal.remove()
}

/* ========== БУРГЕР-МЕНЮ ========== */

function openBurger () {
  const menu = document.querySelector('.container_modal_menu')
  const burger = document.querySelector('.burger')
  if (!menu || !burger) return

  const isOpen = menu.getAttribute('id') === 'active_menu'

  if (isOpen) {
    menu.setAttribute('id', 'inactive_menu')
    burger.classList.remove('burger_active')
    burger.setAttribute('aria-expanded', 'false')
  } else {
    menu.setAttribute('id', 'active_menu')
    burger.classList.add('burger_active')
    burger.setAttribute('aria-expanded', 'true')
  }
}

function closeBurger () {
  const menu = document.querySelector('.container_modal_menu')
  const burger = document.querySelector('.burger')
  if (!menu) return

  menu.setAttribute('id', 'inactive_menu')
  if (burger) {
    burger.classList.remove('burger_active')
    burger.setAttribute('aria-expanded', 'false')
  }
}