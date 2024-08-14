import { rowData } from '../assets/data/data.js'

// Funkcja inicjalizująca stronę
const initializePage = () => {
   createHeader()
   createMain()
   createButtons()
   createLogoSW()
   createFooter()
}

// Tworzenie nagłówka (section: header)
const createHeader = () => {
   const header = document.createElement('header')
   const title = document.createElement('h1')
   title.textContent = 'Moja Strona Star Wars'
   header.appendChild(title)
   document.body.appendChild(header)
}

// Tworzenie sekcji głównej (section: main)
const createMain = () => {
   const main = document.createElement('main')
   document.body.appendChild(main)
}

// Tworzenie przycisków na podstawie kluczy obiektu rowData
const createButtons = () => {
   const keys = Object.keys(rowData)
   const buttonContainer = document.createElement('div') // Dodaj kontener dla przycisków
   buttonContainer.classList.add('button-container') // Dodaj klasę do stylizacji wszystkich przycisków
   for (const key of keys) {
      const button = document.createElement('button')
      button.textContent = key.toUpperCase()
      button.classList.add('sw-button') // Dodaj klasę do stylizacji pojedynczego przycisku
      button.id = `button-${key}`
      button.setAttribute('data-category', key)
      buttonContainer.appendChild(button) // Dodaj przyciski do kontenera
      button.addEventListener('click', handleButtonClick)
   }
   const main = document.querySelector('main')
   main.appendChild(buttonContainer) // Dodaj kontener do sekcji głównej
}

// Funkcja obsługująca kliknięcie przycisku
const handleButtonClick = e => {
   removeLogo()
   // Usuń poprzednią tabelkę i elementy paginacji (jeśli istnieją)
   const previousTable = document.querySelector('table')
   const previousPagination = document.querySelector('.pagination')
   if (previousTable) {
      previousTable.remove()
      previousPagination.remove()
   }
   // Pobierz nazwę kategorii z przycisku
   const category = e.target.getAttribute('data-category')
   // Pobierz dane na podstawie nazwy przycisku
   const movieData = rowData[category]
   const table = createTable(movieData, category)
   const main = document.querySelector('main')
   main.appendChild(table)
   displayDataInTable(movieData, category)
   createPageNavigation(movieData, category)
}

// Funkcja tworząca tabelę
const createTable = (movieData, category) => {
   const table = document.createElement('table')
   const thead = document.createElement('thead')
   const tbody = document.createElement('tbody')
   // Nagłówki zależne od kategorii przycisku
   const headers = getHeadersForCategory(movieData, category)
   const headerRow = document.createElement('tr')
   for (const header of headers) {
      const th = document.createElement('th')
      th.textContent = `${header}`
      headerRow.appendChild(th)
   }
   thead.appendChild(headerRow)
   table.appendChild(thead)
   table.appendChild(tbody)
   return table
}

// Funkcja zwracająca nagłówki na podstawie kategorii
const getHeadersForCategory = (movieData, category) => {
   switch (category) {
      case 'vehicles':
         return [
            'ID',
            Object.keys(movieData[0])[0].toUpperCase(), // NAME
            Object.keys(movieData[0])[1].toUpperCase(), // MODEL
            Object.keys(movieData[0])[2].toUpperCase(), // MANUFACTURER
            'CREATED',
            'ACTIONS',
         ]
      case 'starships':
         return [
            'ID',
            Object.keys(movieData[0])[0].toUpperCase(), // NAME
            Object.keys(movieData[0])[1].toUpperCase(), // MODEL
            Object.keys(movieData[0])[2].toUpperCase(), // MANUFACTURER
            'CREATED',
            'ACTIONS',
         ]
      case 'species':
         return [
            'ID',
            Object.keys(movieData[0])[0].toUpperCase(), // NAME
            Object.keys(movieData[0])[1].toUpperCase(), // CLASSIFICATION
            Object.keys(movieData[0])[2].toUpperCase(), // DESIGNATION
            'CREATED',
            'ACTIONS',
         ]
      case 'planets':
         return [
            'ID',
            Object.keys(movieData[0])[0].toUpperCase(), // NAME
            Object.keys(movieData[0])[1].toUpperCase().split('_').join(' '), // ROTATION PERIOD
            Object.keys(movieData[0])[2].toUpperCase().split('_').join(' '), // 'ORBITAL PERIOD'
            'CREATED',
            'ACTIONS',
         ]
      case 'people':
         return [
            'ID',
            Object.keys(movieData[0])[0].toUpperCase(), // NAME
            Object.keys(movieData[0])[1].toUpperCase(), // HEIGHT
            Object.keys(movieData[0])[2].toUpperCase(), // MASS
            'CREATED',
            'ACTIONS',
         ]
      case 'films':
         return [
            'ID',
            Object.keys(movieData[0])[0].toUpperCase(), // TITLE
            Object.keys(movieData[0])[1].toUpperCase().split('_').join(' '), // 'EPISODE ID
            Object.keys(movieData[0])[2].toUpperCase().split('_').join(' '), // 'OPENING CRAWL'
            'CREATED',
            'ACTIONS',
         ]
      default:
         return [] // Zwracamy pustą tablicę dla nieznanej kategorii
   }
}

// Funkcja wyświetlająca dane w tabeli
const displayDataInTable = (movieData, category) => {
   const tbody = document.querySelector('tbody')
   tbody.innerHTML = '' // Wyczyść zawartość tbody
   movieData.forEach((item, index) => {
      const row = document.createElement('tr')
      const idCell = document.createElement('td')
      idCell.textContent = `${index + 1}`
      row.appendChild(idCell)
      console.log(item)
      // Wybierz dowolne 3 klucze (np. 'name', 'birth_year', 'gender')
      // Wybierz odpowiednie klucze w zależności od kategorii
      let keysToShow = []
      if (category === 'vehicles') {
         keysToShow = [
            Object.keys(item)[0], // NAME
            Object.keys(item)[1], // MODEL
            Object.keys(item)[2], // MANUFACTURER
         ]
      } else if (category === 'starships') {
         keysToShow = [
            Object.keys(item)[0], // NAME
            Object.keys(item)[1], // MODEL
            Object.keys(item)[2], // MANUFACTURER
         ]
      } else if (category === 'species') {
         keysToShow = [
            Object.keys(item)[0], // NAME
            Object.keys(item)[1], // CLASSIFICATION
            Object.keys(item)[2], // DESIGNATION
         ]
      } else if (category === 'planets') {
         keysToShow = [
            Object.keys(item)[0], // NAME
            Object.keys(item)[1], // ROTATION_PERIOD
            Object.keys(item)[2], // ORBITAL_PERIOD
         ]
      } else if (category === 'people') {
         keysToShow = [
            Object.keys(item)[0], // NAME
            Object.keys(item)[1], // HEIGHT
            Object.keys(item)[2], // MASS
         ]
      } else if (category === 'films') {
         keysToShow = [
            Object.keys(item)[0], // TITLE
            Object.keys(item)[1], // EPISODE_ID
            Object.keys(item)[2], // OPENING_CRAWL
         ]
      }
      for (const keyToShow of keysToShow) {
         const cell = document.createElement('td')
         cell.textContent = `${item[keyToShow]}`
         // Usuń znaki specjalne \r i \n z tekstu w cell.textContent
         const cleanedText = cell.textContent.split(/\\r|\\n/).join('')
         cell.textContent = cleanedText
         row.appendChild(cell)
      }
      // Pozostałe komórki (CREATED i ACTIONS)
      const createdCell = document.createElement('td')
      // Formatowanie daty do stylu: day-month-year
      const date = new Date(item.created)
      const day = date.getDate()
      const month = date.getMonth() + 1
      const year = date.getFullYear()
      createdCell.textContent = `${day}-${month}-${year}`
      row.appendChild(createdCell)
      const actionsCell = document.createElement('td')
      const trashButton = createButton('REMOVE')
      const infoButton = createButton('INFO')
      const checkbox = createCheckbox()
      actionsCell.appendChild(trashButton)
      actionsCell.appendChild(infoButton)
      actionsCell.appendChild(checkbox)
      row.appendChild(actionsCell)
      tbody.appendChild(row)
   })
}

const createPageNavigation = () => {
   const currentPage = 1
   const totalPages = 1
   const main = document.querySelector('main')
   const navBottomContainer = document.createElement('div')
   navBottomContainer.classList.add('pagination')
   // lewa strzałka
   const leftArrowButton = createButton('⬅️', 'leftArrowButton')
   navBottomContainer.appendChild(leftArrowButton)
   // input
   const currentPageInput = createInput('number', 'currentPageInput', '1', '1', totalPages)
   navBottomContainer.appendChild(currentPageInput)
   // bieżąca strona
   const currentPageInfo = document.createElement('span')
   currentPageInfo.textContent = `Strona ${currentPage} z ${totalPages}`
   currentPageInfo.id = 'currentPageInfo'
   navBottomContainer.appendChild(currentPageInfo)
   // prawa strzałka
   const rightArrowButton = createButton('➡️', 'rightArrowButton')
   navBottomContainer.appendChild(rightArrowButton)
   // select
   const selectOptions = [10, 20]
   const selectElement = createSelect(selectOptions)
   navBottomContainer.appendChild(selectElement)
   main.appendChild(navBottomContainer)
}

// Dodawanie logo Star Wars
const createLogoSW = () => {
   const logoContainer = document.createElement('div')
   logoContainer.classList.add('logo-container')
   const starWarsLogo = document.createElement('img')
   starWarsLogo.classList.add('sw-image')
   starWarsLogo.src = './assets/images/starwars_logo.jpg'
   starWarsLogo.alt = 'Star Wars Logo'
   const main = document.querySelector('main')
   logoContainer.appendChild(starWarsLogo)
   main.appendChild(logoContainer)
}

// Usuwanie logo Star Wars z drzewa DOM
const removeLogo = () => {
   const logoContainer = document.querySelector('.logo-container')
   if (logoContainer) {
      logoContainer.remove() // Usuń kontener z drzewa DOM
   }
}

// Tworzenie stopki (section: footer)
const createFooter = () => {
   const footer = document.createElement('footer')
   const authorInfo = document.createElement('p')
   authorInfo.textContent = '© Projekt i realizacja strony: Krzysztof Kryczka - 2024'
   footer.appendChild(authorInfo)
   document.body.appendChild(footer)
}

/// Funkcje pomocnicze

const createButton = (text, className) => {
   const button = document.createElement('button')
   button.innerHTML = `${text}`
   button.classList.add(className)
   return button
}

const createCheckbox = () => {
   const checkbox = document.createElement('input')
   checkbox.type = 'checkbox'
   return checkbox
}

function createSelect(options) {
   const select = document.createElement('select')
   for (const optionValue of options) {
      const option = document.createElement('option')
      option.textContent = `${optionValue} na stronę`
      option.value = `${optionValue}`
      select.appendChild(option)
   }
   return select
}

function createInput(type, id, placeholder = 1, min = 1, max = 1) {
   const input = document.createElement('input')
   input.type = `${type}`
   input.placeholder = `${placeholder}`
   input.id = `${id}`
   input.min = `${min}`
   input.max = `${max}`
   return input
}

// Wywołanie funkcji inicjalizującej po załadowaniu strony
window.addEventListener('load', initializePage)
