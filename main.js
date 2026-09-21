let list = []

fetch('data.json')
  .then(response => {
    if (!response.ok) throw new Error(`Ошибка: ${response.status}`)
    return response.json()
  })
  .then(data => {
    list = data

    // Формируем весь список живности
    for (let i = 0; i < list.length; i++) {
      document.querySelector('.slides').insertAdjacentHTML(
        'beforeend',
        `<div class="slide">
                    <div class="img_slide"><img src="${list[i].img}" alt="${list[i].name} — ${list[i].breed}"></div>
                    <h3 class="name_slide">${list[i].name}</h3>
                    <button class="button_slide" type="button">Learn more</button>
                </div>`
      )
    }

    document.querySelector('.slides').addEventListener('click', function (event) {
      if (event.target.classList.contains('button_slide')) {
        showPet(
          Array.from(document.querySelectorAll('.slide')).indexOf(
            event.target.closest('.slide')
          )
        )
      }
    })
  })
  .catch(error => {
    console.error('Ошибка:', error)
  })

buttonStatus('inactive')
function buttonStatus (status) {
  document.querySelector('.prev').setAttribute('id', status)
}

// Инициализация мобильного меню

if (
  !document.querySelector('.container_modal_menu') &&
  window.innerWidth <= 768
) {
  document.body.insertAdjacentHTML(
    'beforeend',
    `<div class="container_modal_menu">
    <nav class="mob_nav-menu_pets">
          <ul>
            <li class="nav-link--active"><a href="./index.html#about">About the shelter</a></li>
            <li><a href="./pets.html#pets">Our pets</a></li>
            <li><a href="./index.html#help">Help the shelter</a></li>
            <li><a href="./pets.html#contacts">Contacts</a></li>
          </ul>
        </nav>    
    </div>`
  )
  document
    .querySelector('.container_modal_menu')
    .addEventListener('click', closeBurger)
} else if (window.innerWidth <= 768) {
  document.querySelector('.container_modal_menu').setAttribute('id', 'inactive')
}

// Модальное окно при нажатии кнопки
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

// Сдвиг слайдеров

let page = 0
let pix = 0
document.querySelector('.next').addEventListener('click', next)
document.querySelector('.prev').addEventListener('click', prev)
document.querySelector('.burger').addEventListener('click', openBurger)

function next () {
  window.innerWidth >= 1280
    ? (pix = -(document.querySelector('.slides').parentElement.clientWidth + 90))
    : (pix = -(document.querySelector('.slides').parentElement.clientWidth + 40))

  let countPages =
    window.innerWidth >= 1280
      ? list.length / 3
      : window.innerWidth >= 768
      ? list.length / 2
      : window.innerWidth >= 320
      ? list.length / 1
      : 1

  if (page + 1 < countPages) {
    page++
    buttonStatus('active')
    document.querySelector('.slides').style.transform = `translate(${
      pix * page
    }px)`
  } else {
    page = 0
    document.querySelector('.slides').style.transform = `translate(0px)`
    buttonStatus('inactive')
  }
}

function prev () {
  if (window.innerWidth >= 1280) {
    pix = -(document.querySelector('.slides').parentElement.clientWidth + 90)
  } else if (window.innerWidth >= 768) {
    pix = -(document.querySelector('.slides').parentElement.clientWidth + 40)
  } else {
    pix = -(document.querySelector('.slides').parentElement.clientWidth + 40)
  }
  if (page > 0) {
    page--
    document.querySelector('.slides').style.transform = `translate(${
      pix * page
    }px)`
    if (page < 1) buttonStatus('inactive')
  }
}

// Отследить событие изменения окна
let lastWidth = window.innerWidth
window.addEventListener('resize', () => {
  const currentWidth = window.innerWidth
  if (currentWidth !== lastWidth) {
    document.querySelector('.slides').style.transform = `translate(0px)`
    page = 0
    buttonStatus('inactive')
    lastWidth = currentWidth
  }
})

// Открываем и закрываем мобильное меню
function openBurger () {
  !document.getElementById('active_menu')
    ? document
        .querySelector('.container_modal_menu')
        .setAttribute('id', 'active_menu')
    : document
        .querySelector('.container_modal_menu')
        .setAttribute('id', 'inactive_menu')

  document.querySelector('.burger')
    ? document.querySelector('.burger').setAttribute('class', 'burger_active')
    : document.querySelector('.burger_active').setAttribute('class', 'burger')
}

// Если нажать на мобильное окно, то оно закроется
function closeBurger () {
  document
    .querySelector('.container_modal_menu')
    .setAttribute('id', 'inactive_menu')
  document.querySelector('.burger_active').setAttribute('class', 'burger')
}