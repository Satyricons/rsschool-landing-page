let list = []
let countPages, pix, page

fetch('data.json')
  .then(response => {
    if (!response.ok) throw new Error(`Ошибка: ${response.status}`)
    return response.json()
  })
  .then(data => {
    list = data

    // Заполняем контейнер
    for (let i = 0; i < list.length; i++) {
      document.querySelector('.slides_our_pets').insertAdjacentHTML(
        'beforeend',
        `<div class="slide_pets">
                    <div class="img_slide"><img src="${list[i].img}" alt="${list[i].name} — ${list[i].breed}"></div>
                    <h3 class="name_slide">${list[i].name}</h3>
                    <button class="button_slide" type="button">Learn more</button>
                </div>`
      )
    }

    // Инициализация
    reinit()

    // Делегирование кликов
    initDelegatedHandlers()
  })
  .catch(error => {
    console.error('Ошибка:', error)
  })

/* ========== ИНИЦИАЛИЗАЦИЯ ========== */

function reinit () {
  const container = document.querySelector('.container_slides_our_pets')
  if (container) container.style.transform = `translate(0px)`

  page = 0
  setPage(page)
  buttonStatus('prev', 'inactive')
  buttonStatus('next_end', 'active')

  // Кол-во страниц относительно размера экрана:
  countPages =
    window.innerWidth >= 1280
      ? list.length / 8
      : window.innerWidth >= 768
      ? list.length / 6
      : window.innerWidth >= 320
      ? list.length / 3
      : 1

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
    // Клик по "Learn more" в карточке
    if (event.target.classList.contains('button_slide')) {
      const slide = event.target.closest('.slide_pets')
      if (slide) {
        const slides = Array.from(document.querySelectorAll('.slide_pets'))
        showPet(slides.indexOf(slide))
      }
      return
    }

    if (event.target.closest('.next')) { next(); return }
    if (event.target.closest('.prev')) { prev(); return }
    if (event.target.closest('.next_end')) { next_end(); return }
    if (event.target.closest('.prev_start')) { prev_start(); return }
    if (event.target.closest('.burger')) { openBurger(); return }
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
    document.querySelector(
      '.container_slides_our_pets'
    ).style.transform = `translate(${pix * page}px)`
    if (page + 1 === countPages) buttonStatus('next_end', 'inactive')
  } else reinit()
}

function next_end () {
  if (page < countPages) {
    pix = -(document.querySelector('.container_show_our_pets').clientWidth + 40)
    page = Math.round(countPages) - 1
    setPage(page)
    buttonStatus('prev', 'active')
    document.querySelector(
      '.container_slides_our_pets'
    ).style.transform = `translate(${pix * page}px)`

    buttonStatus('next_end', 'inactive')
  }
}

function prev () {
  if (page > 0) {
    page--
    setPage(page)
    buttonStatus('next_end', 'active')
    document.querySelector(
      '.container_slides_our_pets'
    ).style.transform = `translate(${pix * page}px)`
    if (page < 1) buttonStatus('prev', 'inactive')
  }
}

function prev_start () {
  reinit()
}

/* ========== RESIZE ========== */

let lastWidth = window.innerWidth
window.addEventListener('resize', () => {
  const currentWidth = window.innerWidth
  if (currentWidth !== lastWidth) {
    reinit()
    lastWidth = currentWidth
  }
})

/* ========== МОДАЛЬНОЕ ОКНО ========== */

function showPet (id) {
  document.body.insertAdjacentHTML(
    'beforeend',
    `<div class="container_modal">
  <div class="full_modal">
  <button class="close_modal" type="button" aria-label="Close modal">
    <img src="./img/modal_close_button.png" alt="">
  </button>
    <div class="modal">
    <img src="${list[id].img}" alt="${list[id].name} — ${list[id].breed}">
    <div class="modal_content">
    
    <div class="modal_content_one">
    <div class="modal_name_pets">${list[id].name}</div>
    <div class="modal_type_pets">${list[id].type} - ${list[id].breed}</div>
    <div class="modal_description_pets">${list[id].description}</div>
    </div>
    
    <div class="modal_content_two">
    <div class="modal_specifications_pets">    
    <ul>   
    <li><b>Age: </b>${list[id].age}
    </li>    
    <li><b>Inoculations: </b>${list[id].inoculations.join(', ')}
    </li>
    <li><b>Diseases: </b>${list[id].diseases.join(', ')}
    </li>
    <li><b>Parasites: </b>${list[id].parasites.join(', ')}
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
  document.querySelector('.container_modal').remove()
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