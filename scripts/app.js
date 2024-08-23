import { rowData } from '../assets/data/data.js'

// Funkcja inicjalizująca stronę
const initializePage = () => {
   createHeader()
   createMain()
   createButtons()
   createLogoSW()
   createFooter()
}

let currentPage = 1
let itemsPerPage = 10
let totalPages = 1

// Tworzenie nagłówka (section: header)
const createHeader = () => {
   const header = document.createElement('header')
   const div = createElement('div', '', 'header-container', 'header-container')
   const character = createElement(
      'p',
      'Write <span class="hero">VADER</span> or <span class="hero">YODA</span>. You should be amazed!!!',
      'character',
      'character',
   )
   div.appendChild(character)
   header.appendChild(div)
   document.body.appendChild(header)
}

// To hear something type 'vader' or 'yoda'
let typedWord = null
document.addEventListener('keydown', event => {
   const vaderAudio = new Audio('./assets/audio/darth_vader.mp3')
   const yodaAudio = new Audio('./assets/audio/Yoda_Yoda.mp3')
   typedWord = `${typedWord}` + event.key.toLowerCase()
   const playAudio = typedWord.includes('vader') ? vaderAudio : typedWord.includes('yoda') ? yodaAudio : null
   if (playAudio) {
      playAudio.play()
      typedWord = null // Resetuj zmienną po odtworzeniu dźwięku
   }
})

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
   const previousSearchInput = document.querySelector('.search-input-container')
   if (previousTable) {
      previousTable.remove()
      previousPagination?.remove()
      previousSearchInput?.remove()
   }
   // Pobierz nazwę kategorii z przycisku
   const category = e.target.getAttribute('data-category')
   // Pobierz dane na podstawie nazwy przycisku
   const clickedButton = e.target
   const isActive = clickedButton.classList.contains('is-active')
   if (isActive) {
      clickedButton.classList.remove('is-active')
   } else {
      // Usuń klasę "is-active" ze wszystkich przycisków
      const allButtons = document.querySelectorAll('.sw-button')
      allButtons.forEach(button => button.classList.remove('is-active'))
      // Dodaj klasę "is-active" tylko do klikniętego przycisku
      clickedButton.classList.add('is-active')
   }

   const movieData = rowData[category]
   const table = createTable(movieData, category)
   const main = document.querySelector('main')
   main.appendChild(table)
   createSearchInput(category)
   displayPage(1, 10)
   createPageNavigation()
   updateArrowButtons(currentPage, totalPages)
}

// Funkcja do wyświetlania ograniczonej liczby rekordów
const displayPage = (currentPage, itemsPerPage) => {
   const items = document.querySelectorAll('tr[data-row-data]')
   console.log('tr[data-row-data]', items)
   const startIndex = (currentPage - 1) * itemsPerPage
   const endIndex = currentPage * itemsPerPage
   items.forEach((row, index) => {
      if (index >= startIndex && index < endIndex) {
         row.classList.remove('is-hidden') // Pokazujemy wiersze na danej stronie
      } else {
         row.classList.add('is-hidden') // Ukrywamy pozostałe wiersze
      }
   })
}

// Funkcja tworząca input search
const createSearchInput = category => {
   const searchInputContainer = document.createElement('div')
   searchInputContainer.classList.add('search-input-container')
   const visibleRows = document.querySelectorAll('tbody tr[data-row-data]')
   console.log('visibleRows', visibleRows)
   const searchInputId = createInput('number', 'searchInputId', 'search-input-id', 'index', '1', '1000')
   const labelElementId = document.createElement('label')
   labelElementId.textContent = 'Search by index:'
   labelElementId.setAttribute('for', searchInputId.id)
   const amountRecords = createElement(
      'p',
      `Amount of records: <span class="total">${visibleRows.length}</span>`,
      'amount-records',
      'amount-records',
   )
   const totalRecordsFound = createElement(
      'p',
      'Total records found: <span class="total">0</span>',
      'total-records-found',
      'total-records-found',
   )
   const searchInputNameOrTitle = createInput(
      'string',
      'searchInputNameOrTitle',
      'search-input-text',
      category === 'films' ? 'Search by title' : 'Search by name',
      '1',
      '1000',
   )
   const labelElementNameOrTitle = document.createElement('label')
   labelElementNameOrTitle.textContent = 'Search by text:'
   labelElementNameOrTitle.setAttribute('for', searchInputNameOrTitle.id)
   searchInputContainer.append(
      amountRecords,
      labelElementId,
      searchInputId,
      labelElementNameOrTitle,
      searchInputNameOrTitle,
      totalRecordsFound,
   )
   const table = document.querySelector('table')
   table.parentNode.insertBefore(searchInputContainer, table) // Wstaw nowy element przed istniejącym
   searchInputId.addEventListener('input', e => {
      handleSearchInput(e, 'tbody td:nth-child(2n+1)', false)
   })
   searchInputNameOrTitle.addEventListener('input', e => {
      handleSearchInput(e, 'tbody td:nth-child(2n)', true)
   })
}

// Funkcja obsługująca zdarzenie wprowadzania id lub tekstu w inpucie
const handleSearchInput = (e, cellIndex, useIncludes) => {
   const inputValue = e.target.value.toLowerCase()
   let foundRow = false
   const tableRows = document.querySelectorAll('tbody tr[data-row-data]')
   const noRowMessage = document.querySelector('.no-row-message')
   if (noRowMessage) {
      noRowMessage.remove()
   }
   tableRows.forEach(row => {
      const cell = row.querySelector(`${cellIndex}`)
      if (cell) {
         const cellValue = cell.textContent.toLowerCase()
         if (
            // prettier-ignore
            useIncludes && cellValue.includes(inputValue) ||
            !useIncludes && cellValue === inputValue ||
            inputValue === ''
         ) {
            row.classList.remove('is-hidden')
            foundRow = true
         } else {
            row.classList.add('is-hidden')
         }
      }
   })
   if (!foundRow) {
      const newNoRowMessage = document.createElement('tr')
      newNoRowMessage.classList.add('no-row-message')
      const noRowCell = document.createElement('td')
      noRowCell.textContent = 'Nie znaleziono pasującego wiersza.'
      noRowCell.colSpan = 7
      newNoRowMessage.appendChild(noRowCell)
      document.querySelector('table').appendChild(newNoRowMessage)
   }
   // Dodaj informację o liczbie znalezionych rekordów
   const visibleRows = document.querySelectorAll('tbody tr:not(.is-hidden)')
   const totalRecords = document.querySelector('.total-records-found')
   if (totalRecords) {
      totalRecords.innerHTML = `Total records found: <span class='total'>${visibleRows.length}</span>`
   }
}

// Funkcja tworząca tabelę
const createTable = (movieData, category) => {
   const table = document.createElement('table')
   const thead = document.createElement('thead')
   // Nagłówki zależne od kategorii przycisku
   const headers = getHeadersForCategory(movieData, category)
   const headerRow = document.createElement('tr')
   for (const header of headers) {
      const th = document.createElement('th')
      th.textContent = `${header.toUpperCase()}`
      headerRow.appendChild(th)
   }
   // Dodatkowy nagłówek dla przycisku Remove All
   const additionalHeader = document.createElement('th')
   additionalHeader.textContent = ''
   // Pobierz ostatni nagłówek
   const lastHeader = headerRow.lastElementChild
   // Wstaw nowy nagłówek przed ostatnim nagłówkiem
   headerRow.insertBefore(additionalHeader, lastHeader)
   thead.appendChild(headerRow)
   const tbody = generateBodyTable(movieData, category)
   table.append(thead, tbody)
   return table
}

// Funkcja zwracająca nagłówki na podstawie kategorii
const getHeadersForCategory = (movieData, category) => {
   const headersCreatedActions = ['CREATED', 'ACTIONS']
   const keyMapping = {
      vehicles: [
         'ID',
         Object.keys(movieData[0])[0], // NAME
         Object.keys(movieData[0])[1], // MODEL
         Object.keys(movieData[0])[2], // MANUFACTURER
         ...headersCreatedActions,
      ],
      starships: [
         'ID',
         Object.keys(movieData[0])[0], // NAME
         Object.keys(movieData[0])[1], // MODEL
         Object.keys(movieData[0])[2], // MANUFACTURER
         ...headersCreatedActions,
      ],
      species: [
         'ID',
         Object.keys(movieData[0])[0], // NAME
         Object.keys(movieData[0])[1], // CLASSIFICATION
         Object.keys(movieData[0])[2], // DESIGNATION
         ...headersCreatedActions,
      ],
      planets: [
         'ID',
         Object.keys(movieData[0])[0], // NAME
         Object.keys(movieData[0])[1].split('_').join(' '), // ROTATION PERIOD
         Object.keys(movieData[0])[2].split('_').join(' '), // 'ORBITAL PERIOD'
         ...headersCreatedActions,
      ],
      people: [
         'ID',
         Object.keys(movieData[0])[0], // NAME
         Object.keys(movieData[0])[1], // HEIGHT
         Object.keys(movieData[0])[2], // MASS
         ...headersCreatedActions,
      ],
      films: [
         'ID',
         Object.keys(movieData[0])[0], // TITLE
         Object.keys(movieData[0])[1].split('_').join(' '), // 'EPISODE ID
         Object.keys(movieData[0])[2].split('_').join(' '), // 'OPENING CRAWL'
         ...headersCreatedActions,
      ],
   }
   return keyMapping[category] || []
}

// Funkcja generująca tbody na podstawie obiektu movieData
const generateBodyTable = (movieData, category) => {
   const tbody = document.createElement('tbody')
   tbody.innerHTML = ''
   if (movieData.length === 0) {
      displayNoDataMessage(tbody)
      return
   }
   movieData.forEach((item, index) => {
      const row = document.createElement('tr')
      const idCell = document.createElement('td')
      idCell.textContent = `${index + 1}`
      row.appendChild(idCell)
      // Wybierz dowolne 3 klucze (np. 'name', 'birth_year', 'gender')
      // Wybierz odpowiednie klucze w zależności od kategorii
      const categoryToKeysMap = {
         // 'NAME', 'MODEL', 'MANUFACTURER'
         vehicles: [Object.keys(item)[0], Object.keys(item)[1], Object.keys(item)[2]],
         // 'NAME', 'MODEL', 'MANUFACTURER'
         starships: [Object.keys(item)[0], Object.keys(item)[1], Object.keys(item)[2]],
         // 'NAME', 'CLASSIFICATION', 'DESIGNATION'
         species: [Object.keys(item)[0], Object.keys(item)[1], Object.keys(item)[2]],
         // 'NAME', 'ROTATION_PERIOD', 'ORBITAL_PERIOD'
         planets: [Object.keys(item)[0], Object.keys(item)[1], Object.keys(item)[2]],
         // 'NAME', 'HEIGHT', 'MASS'
         people: [Object.keys(item)[0], Object.keys(item)[1], Object.keys(item)[2]],
         // 'TITLE', 'EPISODE_ID', 'OPENING_CRAWL'
         films: [Object.keys(item)[0], Object.keys(item)[1], Object.keys(item)[2]],
      }
      const keysToShow = categoryToKeysMap[category] || []
      for (const keyToShow of keysToShow) {
         const cell = createBasicStarWarsCell(item[keyToShow])
         row.appendChild(cell)
      }
      // Pozostałe komórki (CREATED i ACTIONS)
      // Created cell
      const createdCell = document.createElement('td')
      createdCell.textContent = `${formatDate(item.created)}`
      row.appendChild(createdCell)
      // Button cell for Remove All
      const buttonCell = document.createElement('td')
      row.appendChild(buttonCell)
      // Actions Cell
      const actionsCell = createActionsCell(row)
      row.dataset.rowData = JSON.stringify(item) // Przypisz dane wiersza
      row.appendChild(actionsCell)
      tbody.appendChild(row)
   })
   return tbody
}

// Funkcja tworząca paginację
const createPageNavigation = () => {
   const myTable = document.querySelectorAll('tr[data-row-data]')
   const main = document.querySelector('main')
   const navBottomContainer = document.createElement('div')
   navBottomContainer.classList.add('pagination')
   // select element
   const selectOptions = [10, 20]
   const selectElement = createSelect(selectOptions)
   itemsPerPage = parseInt(selectElement.value)
   totalPages = Math.ceil(myTable.length / itemsPerPage)
   selectElement.addEventListener('change', () => {
      itemsPerPage = parseInt(selectElement.value)
      switch (itemsPerPage) {
         case 20:
            --currentPage
            if (currentPage === 0) {
               currentPageInput.value = 1
            } else {
               currentPageInput.value = currentPage
            }
            break
         case 10:
            currentPageInput.value = ++currentPage
            break
         default:
            break
      }
      totalPages = Math.ceil(myTable.length / itemsPerPage) // Aktualizacja totalPages
      handlePageChange(currentPage, totalPages, itemsPerPage)
   })
   const prevButton = createButton('<i class="fa-solid fa-chevron-left"></i>', 'prevButton')
   prevButton.addEventListener('click', () => {
      if (currentPage > 1) {
         currentPage--
         currentPageInput.value = currentPage
         handlePageChange(currentPage, totalPages, itemsPerPage)
      }
   })
   // input
   const currentPageInput = createInput('number', 'currentPageInput', 'current-page-input', '1', '1', totalPages)
   // Dodaj obsługę zdarzenia zmiany wartości inputa
   currentPageInput.addEventListener('input', () => {
      const newPage = currentPageInput.value
      handlePageChange(newPage, totalPages, itemsPerPage)
   })
   // bieżąca strona
   const currentPageInfo = createElement('span', ` z ${totalPages}`, 'currentPageInfo', 'current-page-info')
   const nextButton = createButton('<i class="fa-solid fa-chevron-right"></i>', 'nextButton')
   nextButton.addEventListener('click', () => {
      if (currentPage < totalPages) {
         currentPage++
         currentPageInput.value = currentPage
         handlePageChange(currentPage, totalPages, itemsPerPage)
      }
   })
   navBottomContainer.append(prevButton, currentPageInput, currentPageInfo, nextButton, selectElement)
   main.appendChild(navBottomContainer)
}

const handlePageChange = (newPage, totalPages, itemsPerPage) => {
   // let currentPage = null
   // if (newPage < 1) {
   //    currentPage = 1
   // } else if (newPage > totalPages) {
   //    currentPage = totalPages
   // } else {
   //    currentPage = newPage
   // }
   currentPage = Math.min(Math.max(newPage, 1), totalPages)
   updateArrowButtons(currentPage, totalPages)
   updatePageInfo(totalPages)
   displayPage(currentPage, itemsPerPage)
}

const updatePageInfo = totalPages => {
   const currentPageInfo = document.querySelector('#currentPageInfo')
   currentPageInfo.textContent = ` z ${totalPages}`
   const currentPageInput = document.querySelector('#currentPageInput')
   currentPageInput.max = parseInt(totalPages)
   if (currentPageInput.value > totalPages) {
      currentPageInput.value = totalPages
   }
}

// Funkcja aktualizująca stan przycisków strzałek
const updateArrowButtons = (currentPage, totalPages) => {
   const prevButton = document.querySelector('.prevButton ')
   prevButton.disabled = currentPage === 1
   const nextButton = document.querySelector('.nextButton')
   nextButton.disabled = currentPage === totalPages
}

// Funkcja aktualizująca stan paginacji po usuwaniu wierszy
const updatePagination = () => {
   const rows = document.querySelectorAll('tr[data-row-data]')
   totalPages = Math.ceil(rows.length / itemsPerPage)
   const currentPageInfo = document.querySelector('#currentPageInfo')
   currentPageInfo.textContent = ` z ${totalPages}`
   const remainingRows = document.querySelectorAll('tr[data-row-data]:not(.is-hidden)').length
   // Sprawdź, czy jesteśmy na ostatniej stronie
   console.log('currentPage', currentPage)
   console.log('totalPages', totalPages)
   console.log('remainingRows', remainingRows)
   if (currentPage > totalPages && remainingRows === 0) {
      if (totalPages === 0) {
         return
      }
      currentPage-- // Przenieś się na poprzednią stronę
      const currentPageInput = document.querySelector('#currentPageInput')
      currentPageInput.value = currentPage // Zaktualizuj input z numerem strony
      displayPage(currentPage, itemsPerPage)
      // Sprawdź, czy jesteśmy na innej stronie niż ostatnia
   } else if (currentPage <= totalPages && remainingRows === 0) {
      displayPage(currentPage, itemsPerPage)
   }
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

const createSelect = options => {
   const select = document.createElement('select')
   for (const optionValue of options) {
      const option = document.createElement('option')
      option.textContent = `${optionValue} na stronę`
      option.value = `${optionValue}`
      select.appendChild(option)
   }
   return select
}

const createInput = (type, id, className, placeholder = 1, min = 1, max = 1) => {
   const input = document.createElement('input')
   input.type = `${type}`
   input.placeholder = `${placeholder}`
   input.id = `${id}`
   input.classList.add(className)
   input.min = `${min}`
   input.max = `${max}`
   return input
}

// Funkcja do tworzenia elementów takich jak span, p
const createElement = (tagName, text, id, className) => {
   const element = document.createElement(tagName)
   element.innerHTML = `${text}`
   element.id = `${id}`
   element.classList.add(className)
   return element
}

// Funkcja do tworzenia komórek tabeli z API SW
const createBasicStarWarsCell = text => {
   const cell = document.createElement('td')
   // Usuń znaki specjalne \r i \n z tekstu w cell.textContent Category FILMS
   cell.textContent = `${text}`
   const cleanedText = cell.textContent.split(/\\r|\\n/).join(' ')
   cell.textContent = cleanedText
   return cell
}

// Funkcja do tworzenia komórki tabeli Actions
const createActionsCell = row => {
   const createdCell = document.createElement('td')
   const buttonContainer = createElement('div', '', 'buttonsInTD', 'buttons-td')
   const trashButton = createButton('<i class="fa-solid fa-trash-can"></i>', 'remove-button')
   trashButton.addEventListener('click', () => {
      removeRows([row])
   })
   const infoButton = createButton('<i class="fa-solid fa-plus"></i>', 'info-button')
   infoButton.setAttribute('data-target', 'data-modal-open')
   infoButton.addEventListener('click', () => {
      const { rowData } = row.dataset
      const parsedData = JSON.parse(rowData)
      showModal(parsedData)
   })

   const checkbox = createCheckbox()
   checkbox.classList.add('checkbox')
   // Nasłuchuj zmian w checkboxach
   checkbox.addEventListener('change', () => {
      const checkboxes = document.querySelectorAll('.checkbox')
      console.log('checkboxes NodeList', checkboxes)
      // const checkedCheckboxes = Array.from(checkboxes).filter(cb => cb.checked)
      const checkedCheckboxes = [...checkboxes].filter(cb => cb.checked)
      console.log('Array with checkedCheckboxes', checkedCheckboxes)
      // Sprawdź, czy przycisk już istnieje
      const removeAllButton = document.querySelector('.remove-all-button')
      if (checkedCheckboxes.length > 0) {
         // Jeśli przycisk nie istnieje, stwórz go
         if (!removeAllButton) {
            createRemoveAllButton()
         }
      } else {
         // Jeśli checkbox jest odznaczony, usuń przycisk z DOM
         removeAllButton?.remove()
      }
   })
   buttonContainer.append(trashButton, infoButton, checkbox) // Dodaj przyciski do kontenera
   createdCell.appendChild(buttonContainer) // Dodaj kontener do komórki
   return createdCell
}

// Funkcja pomocnicza znajduje pierwszy wiersz i dodaje do 6 komórki przycisk 'Remove All'
function createRemoveAllButton() {
   const firstRow = document.querySelector('tbody tr[data-row-data]:not(.is-hidden)')
   const buttonCell = firstRow.querySelector('td:nth-child(6)')
   const removeAllButton = createButton('Remove all', 'remove-all-button', 'remove-all-button')
   removeAllButton.addEventListener('click', handleRemoveAllButton)
   buttonCell.appendChild(removeAllButton)
}

// Funkcja do usuwania zaznaczonych wierszy
const handleRemoveAllButton = () => {
   const checkboxes = document.querySelectorAll('.checkbox')
   const selectedRows = []
   checkboxes.forEach(checkbox => {
      if (checkbox.checked) {
         // Dla każdego zaznaczonego checkboxa znajdujemy jego najbliższego rodzica o tagu <tr>
         const row = checkbox.closest('tr')
         selectedRows.push(row)
      }
   })
   removeRows(selectedRows)
}

// Główna funkcja do usuwania wierszy
const removeRows = rowsToRemove => {
   const tbody = document.querySelector('tbody')
   rowsToRemove.forEach(row => {
      tbody.removeChild(row)
      console.log('Usunięty wiersz to: ', row)
   })
   const removeAllButton = document.querySelector('.remove-all-button')
   removeAllButton?.remove()
   updatePagination() // Zaktualizuj liczbę stron jeśli trzeba
   checkEmptyTable() // Sprawdź, czy tabela jest pusta
   updateSearchInput() // Zaktualizuj pole wyszukiwania po usunięciu wiersza
}

// Funkcja wyświetlająca komunikat "Brak elementów do wyświetlenia"
const displayNoDataMessage = tbody => {
   const noDataMessage = document.createElement('tr')
   noDataMessage.innerHTML = '<td colspan="7">Brak elementów do wyświetlenia</td>'
   noDataMessage.classList.add('no-row-message')
   tbody.appendChild(noDataMessage)
   const previousSearchInput = document.querySelector('.search-input-container')
   previousSearchInput?.remove()
   const previousPagination = document.querySelector('.pagination')
   previousPagination?.remove()
}

// Funkcja sprawdzająca, czy tabela jest pusta
const checkEmptyTable = () => {
   const tbody = document.querySelector('tbody')
   const rows = tbody.querySelectorAll('tr')
   if (rows.length === 0) {
      displayNoDataMessage(tbody)
   }
}

// Funkcja odświeża widok Search Input po usunięciu wiersza tabeli
const updateSearchInput = () => {
   const previousSearchInput = document.querySelector('.search-input-container')
   if (previousSearchInput) {
      previousSearchInput.remove()
      createSearchInput()
   }
}

// Funkcja do formatowania daty
const formatDate = dateString => {
   const date = new Date(dateString)
   const day = date.getDate()
   const month = date.getMonth() + 1
   const year = date.getFullYear()
   return `${day}-${month}-${year}`
}

// Funkcja do wyświetlania okna modalnego
const showModal = data => {
   const modal = document.createElement('div')
   modal.classList.add('modal')
   modal.id = 'modal'
   modal.innerHTML = ''
   const table = document.createElement('table')
   for (const key in data) {
      const row = document.createElement('tr')
      const keyCell = document.createElement('td')
      const valueCell = document.createElement('td')
      keyCell.textContent = key
      const text = data[key]
      console.log(`text: ${text}`)
      console.log('typeof: ', typeof text)
      const urlArray = text.toString().split(',').join(',\n')
      console.log(`urlArray: ${urlArray}`)
      valueCell.textContent = urlArray
      // valueCell.textContent = data[key]
      row.appendChild(keyCell)
      row.appendChild(valueCell)
      table.appendChild(row)
   }
   modal.appendChild(table)
   const closeButton = createButton('<i class="fa-solid fa-circle-xmark"></i>', 'modal-close-btn')
   closeButton.setAttribute('data-target', 'data-modal-close')
   closeButton.addEventListener('click', () => {
      closeModal(modal)
   })
   modal.appendChild(closeButton)
   document.body.appendChild(modal)
   console.log(`Dane z wiersza: ${data}`)
}

// Funkcja do zamykania okna modalnego
const closeModal = modal => {
   if (modal) {
      modal.remove() // Usuń element z drzewa DOM
   }
}

// Wywołanie funkcji inicjalizującej po załadowaniu strony
window.addEventListener('load', initializePage)
