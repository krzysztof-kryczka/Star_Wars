import { rowData } from '../assets/data/data.js'

/**
 * Initializes the page by creating the header, main section, buttons, logo, and footer.
 */
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
let filteredRows = [] // Stores filtered results

/**
 * Creates the header section of the page.
 */
const createHeader = () => {
   const header = document.createElement('header')
   const div = createContainer('header-container')
   const character = createTextElement(
      'p',
      ['character'],
      'Write <span class="hero">VADER</span> or <span class="hero">YODA</span>. You should be amazed!!!',
   )
   const divToggle = createContainer('container-theme')
   const checkbox = createCheckbox('checkbox-theme')
   const label = createTextElement('label', ['label'])
   const moonIcon = createTextElement('i', ['fa-moon', 'fas'])
   const sunIcon = createTextElement('i', ['fa-sun', 'fas'])
   const orb = createContainer('orb')

   // Set the ID and htmlFor attribute for the checkbox and label
   checkbox.id = 'themeSwitch'
   label.setAttribute('for', checkbox.id)

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

/**
 * Changes the theme of the page between light and dark.
 */
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
   typedWord = `${typedWord}` + event.key
   // Check if the typed word includes 'vader' or 'yoda' and play the corresponding audio
   if (typedWord.includes('vader')) {
      playAudio(vaderAudio)
   } else if (typedWord.includes('yoda')) {
      playAudio(yodaAudio)
   }
})

/**
 * Plays the given audio, pausing any currently playing audio.
 *
 * @param {HTMLAudioElement} audio - The audio element to play.
 */
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

/**
 * Creates the main section of the page.
 */
const createMain = () => {
   const main = document.createElement('main')
   document.body.appendChild(main)
}

/**
 * Creates buttons based on the keys of the rowData object.
 */
const createButtons = () => {
   // Get the keys from the rowData object
   const keys = Object.keys(rowData)
   const main = document.querySelector('main')
   const buttonContainer = createContainer('button-container')
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

/**
 * Handles the click event for category buttons.
 *
 * @param {Event} e - The click event.
 */
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
   displayPage(currentPage, itemsPerPage, null, false)
   createPageNavigation()
   updateArrowButtons(currentPage, totalPages)
}

/**
 * Displays a specific page of items in a table.
 *
 * @param {number} currentPage - The current page number to display.
 * @param {number} itemsPerPage - The number of items to display per page.
 * @param {Array} [filteredRows=null] - An optional array of filtered rows to display.
 * @param {boolean} [useFilter=false] - A flag indicating whether to use the filtered rows.
 */
const displayPage = (currentPage, itemsPerPage, filteredRows = null, useFilter = false) => {
   const items = useFilter ? filteredRows : document.querySelectorAll('tr[data-row-data]')
   const startIndex = (currentPage - 1) * itemsPerPage
   const endIndex = currentPage * itemsPerPage
   items.forEach((row, index) => {
      if (index >= startIndex && index < endIndex) {
         row.classList.remove('is-hidden')
      } else {
         row.classList.add('is-hidden')
      }
   })
}

/**
 * Creates and inserts a search input container for filtering table rows.
 *
 * @param {string} category - The category to determine the search input placeholder text.
 */
const createSearchInput = category => {
   const searchInputContainer = createContainer('search-input-container')
   const visibleRows = document.querySelectorAll('tbody tr[data-row-data]')
   const searchInputId = createInput('number', 'searchInputId', 'search-input-id', 'index', '1', '1000')
   const labelElementId = createTextElement('label', ['lbl-search-id'], 'Search by index:')
   const labelElementNameOrTitle = createTextElement('label', ['lbl-search-text'], 'Search by text:')
   const amountRecords = createTextElement(
      'p',
      ['amount-records'],
      `Amount of records: <span class="total">${visibleRows.length}</span>`,
   )
   const totalRecordsFound = createTextElement(
      'p',
      ['total-records-found'],
      'Total records found: <span class="total">0</span>',
   )
   const searchInputNameOrTitle = createInput(
      'string',
      'searchInputNameOrTitle',
      'search-input-text',
      category === 'films' ? 'Search by title' : 'Search by name',
      '1',
      '1000',
   )
   // Set the 'for' attribute for the labels to link them with the corresponding inputs
   labelElementId.setAttribute('for', searchInputId.id)
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
   table.parentNode.insertBefore(searchInputContainer, table)

   searchInputId.addEventListener('input', e => {
      handleSearchInput(e, 'tbody td:nth-child(2n+1)', false)
   })
   searchInputNameOrTitle.addEventListener('input', e => {
      handleSearchInput(e, 'tbody td:nth-child(2n)', true)
   })
}

/**
 * Handles the input event for search functionality.
 *
 * @param {Event} e - The input event.
 * @param {string} cellIndex - The CSS selector for the table cell to search within.
 * @param {boolean} useIncludes - Whether to use the includes method for matching.
 */
const handleSearchInput = (e, cellIndex, useIncludes) => {
   const inputValue = e.target.value.toLowerCase()
   const tableRows = document.querySelectorAll('tbody tr[data-row-data]')
   document.querySelector('.no-row-message')?.remove()

   filteredRows = Array.from(tableRows).filter(row => {
      const cell = row.querySelector(`${cellIndex}`)
      if (cell) {
         const cellValue = cell.textContent.toLowerCase()
         if (
            // prettier-ignore
            useIncludes && cellValue.includes(inputValue) ||
            !useIncludes && cellValue === inputValue ||
            inputValue === ''
         ) {
            return true
         }
      }
      return false
   })

   // Hide all rows initially
   tableRows.forEach(row => row.classList.add('is-hidden'))

   if (filteredRows.length > 0) {
      currentPage = 1
      displayPage(currentPage, itemsPerPage, filteredRows, true) // Display first page of filtered rows
   } else {
      tableRows.forEach(row => row.classList.add('is-hidden'))
      const newNoRowMessage = document.createElement('tr')
      const noRowCell = createCell('Nie znaleziono pasującego wiersza.')
      newNoRowMessage.classList.add('no-row-message')
      noRowCell.colSpan = tableRows[0].children.length
      newNoRowMessage.appendChild(noRowCell)
      document.querySelector('table tbody').appendChild(newNoRowMessage)
   }

   // Update the total records found information
   const totalRecords = document.querySelector('.total-records-found')
   if (totalRecords) {
      totalRecords.innerHTML = `Total records found: <span class='total'>${filteredRows.length}</span>`
   }

   // Update pagination based on the filtered rows
   updatePagination(filteredRows.length > 0 ? filteredRows : [])
}

/**
 * Creates a table element with headers and body rows based on the provided movie data and category.
 *
 * @param {Array} movieData - The data to populate the table rows.
 * @param {string} category - The category to determine the table headers.
 * @returns {HTMLTableElement} - The created table element.
 */
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

/**
 * Returns an array of headers based on the provided movie data and category.
 *
 * @param {Array} movieData - The data to determine the headers.
 * @param {string} category - The category to determine the specific headers.
 * @returns {Array} - An array of headers for the specified category.
 */
const getHeadersForCategory = (movieData, category) => {
   const headersCreatedActions = ['CREATED', 'ACTIONS']
   const keys = Object.keys(movieData[0]).slice(0, 3) // First three keys from movieData[0]
   const formattedKeys = keys.map(key => key.split('_').join(' '))
   const keyMapping = {
      // ['ID', 'NAME', 'MODEL', 'MANUFACTURER', 'CREATED', 'ACTIONS']
      vehicles: ['ID', ...keys, ...headersCreatedActions],
      // ['ID', 'NAME', 'MODEL', 'MANUFACTURER', 'CREATED', 'ACTIONS']
      starships: ['ID', ...keys, ...headersCreatedActions],
      // ['ID', 'NAME', 'CLASSIFICATION', 'DESIGNATION', 'CREATED', 'ACTIONS']
      species: ['ID', ...keys, ...headersCreatedActions],
      // ['ID', 'NAME', 'ROTATION PERIOD', 'ORBITAL PERIOD', 'CREATED', 'ACTIONS']
      planets: ['ID', keys[0], formattedKeys[1], formattedKeys[2], ...headersCreatedActions],
      // ['ID', 'NAME', 'HEIGHT', 'MASS', 'CREATED', 'ACTIONS']
      people: ['ID', ...keys, ...headersCreatedActions],
      // ['ID', 'TITLE', 'EPISODE ID', 'OPENING CRAWL', 'CREATED', 'ACTIONS']
      films: ['ID', keys[0], formattedKeys[1], formattedKeys[2], ...headersCreatedActions],
   }
   return keyMapping[category] || []
}

/**
 * Generates the table body rows based on the provided movie data and category.
 *
 * @param {Array} movieData - The data to populate the table rows.
 * @param {string} category - The category to determine the table structure.
 * @returns {HTMLTableSectionElement} - The created table body element.
 */
const generateBodyTable = (movieData, category) => {
   const tbody = document.createElement('tbody')
   tbody.innerHTML = ''
   if (movieData.length === 0) {
      displayNoDataMessage(tbody)
      return tbody
   }
   movieData.forEach((item, index) => {
      const row = document.createElement('tr')
      row.appendChild(createCell(`${index + 1}`))

      // Get keys for the given category
      const keys = getHeadersForCategory(movieData, category).slice(1, 4) // Skip 'ID' and 'CREATED', 'ACTIONS'
      keys.forEach(key => row.appendChild(createBasicStarWarsCell(item[key.split(' ').join('_')])))

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

/**
 * Creates and inserts pagination controls for navigating table pages.
 */
const createPageNavigation = () => {
   const myTable = document.querySelectorAll('tr[data-row-data]')
   const main = document.querySelector('main')
   const navBottomContainer = createContainer('pagination')
   const selectOptions = [10, 20] // Define options for items per page
   const selectElement = createSelect(selectOptions)
   const prevButton = createButton('<i class="fa-solid fa-chevron-left"></i>', 'prevButton')
   const nextButton = createButton('<i class="fa-solid fa-chevron-right"></i>', 'nextButton')
   const currentPageInput = createInput('number', 'currentPageInput', 'current-page-input')
   const currentPageInfo = createTextElement('span', ['current-page-info'])

   itemsPerPage = parseInt(selectElement.value)
   totalPages = Math.ceil(myTable.length / itemsPerPage)

   currentPageInput.max = totalPages
   currentPageInfo.textContent = ` z ${totalPages}`
   // Add event listener to update items per page when the select value changes
   selectElement.addEventListener('change', updateItemsPerPage)
   // Add event listener to handle previous button click
   prevButton.addEventListener('click', () => {
      if (currentPage > 1) {
         currentPage--
         currentPageInput.value = currentPage
         handlePageChange(currentPage, totalPages, itemsPerPage)
      }
   })
   // Add event listener to handle input change for the current page input
   currentPageInput.addEventListener('input', () => handlePageChange(currentPageInput.value, totalPages, itemsPerPage))
   // Add event listener to handle next button click
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

/**
 * Updates the number of items displayed per page and adjusts pagination accordingly.
 */
const updateItemsPerPage = () => {
   const currentPageInput = document.querySelector('#currentPageInput')
   const selectElement = document.querySelector('select')
   const oldItemsPerPage = itemsPerPage
   const visibleRows = filteredRows.length > 0 ? filteredRows : document.querySelectorAll('tbody tr[data-row-data]')
   itemsPerPage = parseInt(selectElement.value)
   totalPages = Math.ceil(visibleRows.length / itemsPerPage)
   // Adjust the current page number to maintain the correct position in the new pagination
   currentPage = Math.ceil(((currentPage - 1) * oldItemsPerPage + 1) / itemsPerPage)
   currentPageInput.value = currentPage
   handlePageChange(currentPage, totalPages, itemsPerPage)
}

/**
 * Handles the change of the current page, updating the display and pagination controls.
 *
 * @param {number} newPage - The new page number to display.
 * @param {number} totalPages - The total number of pages available.
 * @param {number} itemsPerPage - The number of items to display per page.
 */
const handlePageChange = (newPage, totalPages, itemsPerPage) => {
   currentPage = Math.min(Math.max(newPage, 1), totalPages)
   updateArrowButtons(currentPage, totalPages)
   updatePageInfo(totalPages)
   const useFilter = filteredRows.length > 0
   displayPage(currentPage, itemsPerPage, filteredRows, useFilter)
}

/**
 * Updates the page information display and adjusts the current page input's maximum value.
 *
 * @param {number} totalPages - The total number of pages available.
 */
const updatePageInfo = totalPages => {
   const currentPageInfo = document.querySelector('.current-page-info')
   const currentPageInput = document.querySelector('#currentPageInput')
   currentPageInfo.textContent = ` z ${totalPages}`
   currentPageInput.max = parseInt(totalPages)
   if (currentPageInput.value > totalPages) {
      currentPageInput.value = totalPages
   }
}

/**
 * Updates the state of the pagination arrow buttons based on the current page and total pages.
 *
 * @param {number} currentPage - The current page number.
 * @param {number} totalPages - The total number of pages available.
 */
const updateArrowButtons = (currentPage, totalPages) => {
   const prevButton = document.querySelector('.prevButton ')
   const nextButton = document.querySelector('.nextButton')
   if (currentPage === 0) {
      document.querySelector('.pagination').classList.add('is-hidden')
   } else {
      document.querySelector('.pagination').classList.remove('is-hidden')
      prevButton.disabled = currentPage === 1
      nextButton.disabled = currentPage === totalPages
   }
}

/**
 * Updates the pagination controls and displays the appropriate page of items.
 *
 * @param {Array} [filteredRows=null] - An optional array of filtered rows to use for pagination.
 */
const updatePagination = (filteredRows = null) => {
   const rows = filteredRows ? filteredRows.length : document.querySelectorAll('tr[data-row-data]').length
   const remainingRows = filteredRows
      ? filteredRows.length
      : document.querySelectorAll('tr[data-row-data]:not(.is-hidden)').length
   const currentPageInfo = document.querySelector('.current-page-info')
   const currentPageInput = document.querySelector('#currentPageInput')

   totalPages = Math.ceil((filteredRows ? remainingRows : rows) / itemsPerPage)

   if (totalPages === 0) {
      currentPage = 0
      currentPageInput.value = currentPage
   } else {
      currentPageInput.value = currentPage
   }

   currentPageInfo.textContent = ` z ${totalPages}`

   // Check if we are on the last page
   if (currentPage > totalPages) {
      currentPage = totalPages === 0 ? 1 : totalPages // Set to the first page if there are no pages, else to the last page
      currentPageInput.value = currentPage // Update the page number input
      displayPage(currentPage, itemsPerPage, filteredRows, !!filteredRows)
      // Check if we are on a page other than the last one
   } else if (currentPage <= totalPages && remainingRows === 0) {
      currentPageInput.value = currentPage
      displayPage(currentPage, itemsPerPage, filteredRows, !!filteredRows)
   }
   updateArrowButtons(currentPage, totalPages)
}

/**
 * Creates and inserts a Star Wars logo into the main element.
 */
const createLogoSW = () => {
   const logoContainer = createContainer('logo-container')
   const starWarsLogo = createImage('sw-image', './assets/images/starwars_logo.jpg', 'Star Wars Logo')
   const main = document.querySelector('main')
   logoContainer.appendChild(starWarsLogo)
   main.appendChild(logoContainer)
}

// Removing the Star Wars logo from the DOM tree
const removeLogo = () => document.querySelector('.logo-container')?.remove()

/**
 * Removes the Star Wars logo container from the DOM tree
 */
const createFooter = () => {
   const footer = document.createElement('footer')
   const authorInfo = createTextElement('p', ['author-info'], '© Projekt i realizacja strony: Krzysztof Kryczka - 2024')
   footer.appendChild(authorInfo)
   document.body.appendChild(footer)
}

/**
 * Creates a button element with specified text and class name.
 *
 * @param {string} text - The text to display inside the button.
 * @param {string} className - The class name to add to the button.
 * @returns {HTMLButtonElement} - The created button element.
 */
const createButton = (text, className) => {
   const button = document.createElement('button')
   button.innerHTML = `${text}`
   button.classList.add(className)
   return button
}

/**
 * Creates a checkbox input element with a specified class name.
 *
 * @param {string} className - The class name to add to the checkbox.
 * @returns {HTMLInputElement} - The created checkbox input element.
 */
const createCheckbox = className => {
   const checkbox = document.createElement('input')
   checkbox.type = 'checkbox'
   checkbox.classList.add(className)
   return checkbox
}

/**
 * Creates a select element with specified options.
 *
 * @param {Array} options - An array of option values to add to the select element.
 * @returns {HTMLSelectElement} - The created select element.
 */
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

/**
 * Creates an input element with specified attributes.
 *
 * @param {string} type - The type of the input element.
 * @param {string} id - The id of the input element.
 * @param {string} className - The class name to add to the input element.
 * @param {string} [placeholder=1] - The placeholder text for the input element.
 * @param {number} [min=1] - The minimum value for the input element.
 * @param {number} [max=1] - The maximum value for the input element.
 * @returns {HTMLInputElement} - The created input element.
 */
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

/**
 * Creates a div container with specified class name and optional text content.
 *
 * @param {string} className - The class name to add to the container.
 * @param {string} [text=''] - The optional text content for the container.
 * @returns {HTMLDivElement} - The created div container.
 */
const createContainer = (className, text = '') => {
   const div = document.createElement('div')
   div.textContent = `${text}`
   div.classList.add(className)
   return div
}

/**
 * Creates a text element with specified tag name, class names, and text content.
 *
 * @param {string} tagName - The tag name for the text element (e.g., 'p', 'span').
 * @param {Array} [className=[]] - An array of class names to add to the text element.
 * @param {string} [text=''] - The text content for the text element.
 * @returns {HTMLElement} - The created text element.
 */
const createTextElement = (tagName, className = [], text = '') => {
   const element = document.createElement(tagName)
   element.innerHTML = `${text}`
   element.classList.add(...className)
   return element
}

/**
 * Creates an image element with specified class name, source URL, and alt text.
 *
 * @param {string} className - The class name to add to the image element.
 * @param {string} src - The source URL for the image.
 * @param {string} alt - The alt text for the image.
 * @returns {HTMLImageElement} - The created image element.
 */
const createImage = (className, src, alt) => {
   const img = document.createElement('img')
   img.classList.add(className)
   img.src = `${src}`
   img.alt = `${alt}`
   return img
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

/**
 * Creates a table cell element with specified text content.
 *
 * @param {string} row - The text content for the cell.
 * @returns {HTMLTableCellElement} - The created table cell element.
 */
const createCell = row => {
   const cell = document.createElement('td')
   cell.textContent = `${row}`
   return cell
}

/**
 * Creates a table cell containing action buttons and a checkbox.
 *
 * @param {HTMLTableRowElement} row - The table row element to associate with the action buttons.
 * @returns {HTMLTableCellElement} - The created table cell with action buttons and a checkbox.
 */
const createActionsCell = row => {
   const createdCell = document.createElement('td')
   const buttonContainer = createContainer('buttons-td')
   const trashButton = createButton('<i class="fa-solid fa-trash-can"></i>', 'remove-button')
   const infoButton = createButton('<i class="fa-solid fa-plus"></i>', 'info-button')
   const checkbox = createCheckbox('checkbox')

   infoButton.setAttribute('data-target', 'data-modal-open')

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

/**
 * Handles changes to checkboxes, updating the state of 'Remove All' and 'Select All' buttons.
 */
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

/**
 * Handles the click event for the info button, showing a modal with row data.
 *
 * @param {HTMLTableRowElement} row - The table row element associated with the info button.
 */
const handleInfoButtonClick = row => {
   const { rowData } = row.dataset
   const parsedData = JSON.parse(rowData)
   showModal(parsedData)
}

/**
 * Creates 'Remove All' and 'Select All' buttons and appends them to the first visible row.
 */
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

/**
 * Handles the click event for the 'Remove All' button, removing all selected rows.
 */
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

/**
 * Removes the specified rows from the table and updates the pagination and search input.
 *
 * @param {Array} rowsToRemove - An array of table row elements to remove.
 */
const removeRows = rowsToRemove => {
   const tbody = document.querySelector('tbody')
   rowsToRemove.forEach(row => tbody.removeChild(row))
   handleCheckboxChange()
   checkEmptyTable()
   updatePagination()
   updateSearchInput()
}

/**
 * Handles the click event for the 'Select All' button, selecting all checkboxes in visible rows.
 */
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

/**
 * Displays a message indicating no data is available in the table.
 *
 * @param {HTMLTableSectionElement} tbody - The table body element to append the message to.
 */
const displayNoDataMessage = tbody => {
   const columnCount = document.querySelector('thead tr').children.length
   const noDataMessage = document.createElement('tr')
   const noDataCell = createCell('Brak elementów do wyświetlenia')
   noDataCell.colSpan = columnCount
   noDataMessage.classList.add('no-row-message')
   noDataMessage.appendChild(noDataCell)
   tbody.appendChild(noDataMessage)
   document.querySelector('.search-input-container')?.remove()
}

/**
 * Checks if the table is empty and displays a "no data" message if it is.
 */
const checkEmptyTable = () => {
   const tbody = document.querySelector('tbody')
   const rows = tbody.querySelectorAll('tr')
   if (rows.length === 0) {
      displayNoDataMessage(tbody)
   }
}

/**
 * Updates the search input by removing the previous one and creating a new one.
 */
const updateSearchInput = () => {
   const previousSearchInput = document.querySelector('.search-input-container')
   if (previousSearchInput) {
      previousSearchInput.remove()
      createSearchInput()
   }
}

/**
 * Formats a date string into a "day-month-year" format.
 *
 * @param {string} dateString - The date string to format.
 * @returns {string} - The formatted date string.
 */
const formatDate = dateString => {
   const date = new Date(dateString)
   const day = date.getDate()
   const month = date.getMonth() + 1
   const year = date.getFullYear()
   return `${day}-${month}-${year}`
}

/**
 * Displays a modal with the provided data.
 *
 * @param {Object} data - The data to display in the modal.
 */
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
      row.append(keyCell, valueCell)
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

/**
 * Closes the modal by removing it from the document.
 *
 * @param {HTMLElement} modal - The modal element to remove.
 */
const closeModal = modal => modal?.remove()

/**
 * Initializes the page when the window loads.
 */
window.addEventListener('load', initializePage)
