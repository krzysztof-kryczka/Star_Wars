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
   // Usuń poprzednią tabelkę (jeśli istnieje)
   const previousTable = document.querySelector('table')
   if (previousTable) {
      previousTable.remove()
   }
   // Pobierz nazwę kategorii z przycisku
   const category = e.target.getAttribute('data-category')
   // Pobierz dane na podstawie nazwy przycisku
   const movieData = rowData[category]
   const table = createTable(movieData, category)
   const main = document.querySelector('main')
   main.appendChild(table)
   displayDataInTable(movieData, category)
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
         keysToShow = ['title', 'episode_id', 'opening_crawl']
         keysToShow = [
            Object.keys(item)[0], // TITLE
            Object.keys(item)[1], // EPISODE_ID
            Object.keys(item)[2], // OPENING_CRAWL
         ]
      }
      for (const keyToShow of keysToShow) {
         const cell = document.createElement('td')
         cell.textContent = `${item[keyToShow]}`
         row.appendChild(cell)
      }
      // Pozostałe komórki (CREATED i ACTIONS)
      const createdCell = document.createElement('td')
      createdCell.textContent = `${item.created}`
      row.appendChild(createdCell)
      const actionsCell = document.createElement('td')
      const trashButton = document.createElement('button')
      trashButton.innerHTML = 'REMOVE'
      actionsCell.appendChild(trashButton)
      const infoButton = document.createElement('button')
      infoButton.innerHTML = 'INFO'
      actionsCell.appendChild(infoButton)
      const checkbox = document.createElement('input')
      checkbox.type = 'checkbox'
      actionsCell.appendChild(trashButton)
      actionsCell.appendChild(infoButton)
      actionsCell.appendChild(checkbox)
      row.appendChild(actionsCell)
      tbody.appendChild(row)
   })
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

// Wywołanie funkcji inicjalizującej po załadowaniu strony
window.addEventListener('load', initializePage)
