import { rowData } from '../assets/data/data.js'

// Function to initialize the page
const initializePage = () => {
   createHeader()
   createMain()
   createButtons()
   createLogoSW()
   createFooter()
}

// Variables to manage pagination
let currentPage = 1
let itemsPerPage = 10
let totalPages = 1

// Function to create the header section
const createHeader = () => {
   const header = document.createElement('header')
   const div = document.createElement('div')
   const character = createElement(
      'p',
      'Write <span class="hero">VADER</span> or <span class="hero">YODA</span>. You should be amazed!!!',
      'character',
      'character',
   )
   const divToggle = document.createElement('div')
   const checkbox = createCheckbox()
   const label = document.createElement('label')
   const moonIcon = document.createElement('i')
   const sunIcon = document.createElement('i')
   const orb = document.createElement('div')

   div.classList.add('header-container')
   checkbox.classList.add('checkbox-theme')
   label.classList.add('label')
   moonIcon.classList.add('fa-moon', 'fas')
   sunIcon.classList.add('fa-sun', 'fas')
   orb.classList.add('orb')

   // Set the ID and htmlFor attribute for the checkbox and label
   checkbox.id = 'themeSwitch'
   label.htmlFor = 'themeSwitch'

   label.append(moonIcon, sunIcon, orb)
   divToggle.append(checkbox, label)
   div.append(character, divToggle)
   header.appendChild(div)
   document.body.appendChild(header)

   // Add an event listener to the checkbox to change the theme
   checkbox.addEventListener('click', changeTheme)
   // Set the initial theme to light
   document.documentElement.setAttribute('data-theme', 'light')
}

// Function to change the theme
const changeTheme = () => {
   const themeSwitch = document.querySelector('#themeSwitch')
   // Determine the theme based on the checkbox state
   const theme = themeSwitch.checked ? 'dark' : 'light'
   document.documentElement.setAttribute('data-theme', theme)
}

// To hear something type 'vader' or 'yoda'
// Initialize variables to store the typed word and the current audio being played
let typedWord = ''
let currentAudio = null
document.addEventListener('keydown', event => {
   // Create new Audio objects for the Vader and Yoda sounds
   const vaderAudio = new Audio('./assets/audio/darth_vader.mp3')
   const yodaAudio = new Audio('./assets/audio/Yoda_Yoda.mp3')
   // Append the pressed key to the typedWord variable
   typedWord = `${typedWord}` + event.key.toLowerCase()
   // Check if the typed word includes 'vader' or 'yoda' and play the corresponding audio
   if (typedWord.includes('vader')) {
      playAudio(vaderAudio)
   } else if (typedWord.includes('yoda')) {
      playAudio(yodaAudio)
   }
})

// Function to play the audio
const playAudio = audio => {
   // Pause and reset the current audio if it is playing
   if (currentAudio) {
      currentAudio.pause()
      currentAudio.currentTime = 0
   }
   // Play the new audio and set it as the current audio
   audio.play()
   currentAudio = audio
   // Reset the typedWord variable after playing the sound
   typedWord = ''
}

// Function to create the main section
const createMain = () => {
   const main = document.createElement('main')
   document.body.appendChild(main)
}

// Function to create buttons based on the keys of the rowData object
const createButtons = () => {
   // Get the keys from the rowData object
   const keys = Object.keys(rowData)
   const main = document.querySelector('main')
   const buttonContainer = document.createElement('div')
   buttonContainer.classList.add('button-container')
   // Document fragment for better performance
   // https://developer.mozilla.org/en-US/docs/Web/API/Document/createDocumentFragment
   const fragment = document.createDocumentFragment()
   // Iterate over each key to create a button
   keys.forEach(key => {
      const button = createButton(`${key.toUpperCase()}`, 'sw-button')
      button.setAttribute('data-category', key)
      fragment.appendChild(button)
      button.addEventListener('click', handleButtonClick)
   })
   buttonContainer.appendChild(fragment)
   main.appendChild(buttonContainer)
}

// Function to handle button click
const handleButtonClick = e => {
   removeLogo()
   const main = document.querySelector('main')
   // Get the clicked button and category name from the button
   const clickedButton = e.target
   const category = e.target.getAttribute('data-category')
   // Get data for the selected category
   const movieData = rowData[category]
   const table = createTable(movieData, category)

   // Remove previous table, pagination elements and filters (if they exist)
   document.querySelector('table')?.remove()
   document.querySelector('.pagination')?.remove()
   document.querySelector('.search-input-container')?.remove()
   // Remove "is-active" class from all buttons and add it to the clicked button
   document.querySelectorAll('.sw-button').forEach(button => button.classList.remove('is-active'))
   clickedButton.classList.add('is-active')

   main.appendChild(table)
   createSearchInput(category)
   displayPage(1, 10)
   createPageNavigation()
   updateArrowButtons(currentPage, totalPages)
}

// Funkcja do wyświetlania ograniczonej liczby rekordów
const displayPage = (currentPage, itemsPerPage) => {
   const items = document.querySelectorAll('tr[data-row-data]')
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
   const tableRows = document.querySelectorAll('tbody tr[data-row-data]')
   const noRowMessage = document.querySelector('.no-row-message')
   let foundRow = false
   noRowMessage?.remove()
   tableRows.forEach(row => {
      const cell = row.querySelector(`${cellIndex}`)
      if (cell) {
         const cellValue = cell?.textContent.toLowerCase()
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
      noRowCell.colSpan = tableRows[0].children.length
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

// Function that creates a table
const createTable = (movieData, category) => {
   const table = document.createElement('table')
   const thead = document.createElement('thead')
   // Get headers based on category
   const headers = getHeadersForCategory(movieData, category)
   const headerRow = document.createElement('tr')
   headers.forEach(header => {
      const th = document.createElement('th')
      th.textContent = `${header.toUpperCase()}`
      headerRow.appendChild(th)
   })
   // Additional header for 'Remove All' and 'Select All' buttons
   const additionalHeader = document.createElement('th')
   additionalHeader.textContent = ''
   const lastHeader = headerRow.lastElementChild
   headerRow.insertBefore(additionalHeader, lastHeader)
   thead.appendChild(headerRow)
   const tbody = generateBodyTable(movieData, category)
   table.append(thead, tbody)
   return table
}

// Function to generate a list of headers based on the category
const getHeadersForCategory = (movieData, category) => {
   const headersCreatedActions = ['CREATED', 'ACTIONS']
   const keys = Object.keys(movieData[0]).slice(0, 3) // First three keys from movieData[0]
   const keyMapping = {
      // ['ID', 'NAME', 'MODEL', 'MANUFACTURER', 'CREATED', 'ACTIONS']
      vehicles: ['ID', ...keys, ...headersCreatedActions],
      // ['ID', 'NAME', 'MODEL', 'MANUFACTURER', 'CREATED', 'ACTIONS']
      starships: ['ID', ...keys, ...headersCreatedActions],
      // ['ID', 'NAME', 'CLASSIFICATION', 'DESIGNATION', 'CREATED', 'ACTIONS']
      species: ['ID', ...keys, ...headersCreatedActions],
      // ['ID', 'NAME', 'ROTATION PERIOD', 'ORBITAL PERIOD', 'CREATED', 'ACTIONS']
      planets: ['ID', keys[0], keys[1].split('_').join(' '), keys[2].split('_').join(' '), ...headersCreatedActions],
      // ['ID', 'NAME', 'HEIGHT', 'MASS', 'CREATED', 'ACTIONS']
      people: ['ID', ...keys, ...headersCreatedActions],
      // ['ID', 'TITLE', 'EPISODE ID', 'OPENING CRAWL', 'CREATED', 'ACTIONS']
      films: ['ID', keys[0], keys[1].split('_').join(' '), keys[2].split('_').join(' '), ...headersCreatedActions],
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
      row.appendChild(createCell(`${index + 1}`))
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
      keysToShow.forEach(key => row.appendChild(createBasicStarWarsCell(item[key])))

      // Created Date cell
      row.appendChild(createCell(`${formatDate(item.created)}`))
      // Button cell for Remove All , Select All
      row.appendChild(createCell(''))
      // Actions Cell
      row.appendChild(createActionsCell(row))
      // Assign the JSON string to the rowData property of the dataset object of the row element
      row.dataset.rowData = JSON.stringify(item)
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

// Function to create a div element
const createContainer = (className, text = '') => {
   const div = document.createElement('div')
   div.textContent = `${text}`
   div.classList.add(className)
   return div
}

// Funkcja do tworzenia elementów takich jak span, p
const createElement = (tagName, text, id, className) => {
   const element = document.createElement(tagName)
   element.innerHTML = `${text}`
   element.id = `${id}`
   element.classList.add(className)
   return element
}

// Function to create table cells with SW API
const createBasicStarWarsCell = text => {
   const cell = document.createElement('td')
   // Remove special characters \r and \n from text in cell.textContent Category FILMS
   cell.textContent = `${text}`
   const cleanedText = cell.textContent.split(/\\r|\\n/).join(' ')
   cell.textContent = cleanedText
   return cell
}

// Function to create a table cell element
const createCell = row => {
   const cell = document.createElement('td')
   cell.textContent = `${row}`
   return cell
}

// Function to create a cell with action buttons and a checkbox
const createActionsCell = row => {
   const createdCell = document.createElement('td')
   const buttonContainer = createContainer('buttons-td')
   const trashButton = createButton('<i class="fa-solid fa-trash-can"></i>', 'remove-button')
   const infoButton = createButton('<i class="fa-solid fa-plus"></i>', 'info-button')
   const checkbox = createCheckbox()

   infoButton.setAttribute('data-target', 'data-modal-open')
   checkbox.classList.add('checkbox')

   // Add an event listener to the trash button to remove the row when clicked
   trashButton.addEventListener('click', () => removeRows([row]))
   // Add an event listener to the info button to show a modal with row data when clicked
   infoButton.addEventListener('click', () => handleInfoButtonClick(row))
   // Add an event listener to the checkbox to handle changes
   checkbox.addEventListener('change', handleCheckboxChange)

   buttonContainer.append(trashButton, infoButton, checkbox)
   createdCell.appendChild(buttonContainer)
   return createdCell
}

// Function to handle the checkbox change event
const handleCheckboxChange = () => {
   const checkboxes = document.querySelectorAll('.checkbox')
   // Filter the checkboxes to find the ones that are checked
   const checkedCheckboxes = [...checkboxes].filter(cb => cb.checked)
   const removeAllButton = document.querySelector('.remove-all-button')
   const selectAllButton = document.querySelector('.select-all-button')
   // Check if any checkboxes are checked
   if (checkedCheckboxes.length > 0) {
      // If there are checked checkboxes and the 'Remove All' button doesn't exist, create the buttons
      if (!removeAllButton) {
         createRemoveSelectAllButton()
      }
   } else if (checkedCheckboxes.length === 0) {
      // If no checkboxes are checked, remove the 'Remove All' and 'Select All' buttons if they exist
      removeAllButton?.remove()
      selectAllButton?.remove()
   }
}

// Function to handle the info button click event
const handleInfoButtonClick = row => {
   const { rowData } = row.dataset
   const parsedData = JSON.parse(rowData)
   showModal(parsedData)
}

// Function creates and adds "Remove all" and "Select all" buttons to the first visible row in the table
const createRemoveSelectAllButton = () => {
   const firstRow = document.querySelector('tbody tr[data-row-data]:not(.is-hidden)')
   const buttonCell = firstRow.querySelector('td:nth-child(6)')
   const buttonContainer = createContainer('buttons-td')
   const removeAllButton = createButton('Remove all', 'remove-all-button')
   const selectAllButton = createButton('Select all', 'select-all-button')
   removeAllButton.addEventListener('click', handleRemoveAllButton)
   selectAllButton.addEventListener('click', handleSelectAllButton)
   buttonContainer.append(removeAllButton, selectAllButton)
   buttonCell.appendChild(buttonContainer)
}

// Function to remove selected rows
const handleRemoveAllButton = () => {
   const checkboxes = document.querySelectorAll('.checkbox')
   const selectedRows = []
   checkboxes.forEach(checkbox => {
      if (checkbox.checked) {
         // For each checked checkbox, find its closest parent <tr> tag
         const row = checkbox.closest('tr')
         selectedRows.push(row)
      }
   })
   removeRows(selectedRows)
}

// Main function to delete rows
const removeRows = rowsToRemove => {
   const tbody = document.querySelector('tbody')
   rowsToRemove.forEach(row => tbody.removeChild(row))
   handleCheckboxChange()
   updatePagination()
   checkEmptyTable()
   updateSearchInput()
}

// Function to select all rows
const handleSelectAllButton = () => {
   const checkboxes = document.querySelectorAll('.checkbox')
   const checkedCheckboxes = [...checkboxes].filter(cb => cb.checked)
   const visibleRows = document.querySelectorAll('tbody tr[data-row-data]:not(.is-hidden)')
   checkboxes.forEach(cb => {
      const closestRow = cb.closest('tr')
      if (closestRow && Array.from(visibleRows).includes(closestRow)) {
         cb.checked = true
         checkedCheckboxes.push(cb)
      }
   })
}

// Function that displays the message "No items to display"
const displayNoDataMessage = tbody => {
   const noDataMessage = document.createElement('tr')
   const previousSearchInput = document.querySelector('.search-input-container')
   const previousPagination = document.querySelector('.pagination')
   noDataMessage.innerHTML = '<td colspan="7">Brak elementów do wyświetlenia</td>'
   noDataMessage.classList.add('no-row-message')
   tbody.appendChild(noDataMessage)
   previousSearchInput?.remove()
   previousPagination?.remove()
}

// Function to check if a table is empty
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

// Function to format the date
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
      const urlArray = text.toString().split(',').join(',\n')
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
}

// Funkcja do zamykania okna modalnego
const closeModal = modal => {
   if (modal) {
      modal.remove() // Usuń element z drzewa DOM
   }
}

// Wywołanie funkcji inicjalizującej po załadowaniu strony
window.addEventListener('load', initializePage)
