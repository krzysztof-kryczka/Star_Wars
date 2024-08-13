import { rowData } from '../assets/data/data.js'

// Funkcja inicjalizująca stronę
const initializePage = () => {
   createHeader()
   createMain()
   createButtons()
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
   for (const key of keys) {
      const button = document.createElement('button')
      button.textContent = key.toUpperCase()
      button.id = `button-${key}`
      button.setAttribute('data-category', key)
      const main = document.querySelector('main')
      main.appendChild(button)
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
