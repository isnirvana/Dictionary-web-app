import { fetchData } from "./fetchData"

const searchButton = document.querySelector(".fa-magnifying-glass")
const input = document.getElementById("search-input")
const main = document.querySelector("main")
const body = document.querySelector("body")
const toggle = document.querySelector(".toggle-mode")
const fonts = document.querySelector(".fonts")
const playIcon = document.querySelector(".play-icon")
const fontSelect = document.querySelector(".select")
const currentFont = document.querySelector(".current-font")
const fontFamily = document.querySelectorAll(".font")

let isLightMode = false

function loadFromLocalStorage() {
  const theme = getFromLocalStorage("theme")
  const font = getFromLocalStorage("font")

  const fontjson = JSON.parse(font) || "sans-serif"
  const themejson = JSON.parse(theme) || false

  if (fontjson) {
    fontFamily.forEach((font) => {
      font.classList.remove("selected")
      if (font.classList.contains(fontjson)) {
        font.classList.add("selected")
      }
    })
    body.style.fontFamily = fontjson
    if (fontjson === "sans-serif") {
      currentFont.textContent = "Sans Serif"
    } else {
      currentFont.textContent = "Serif"
    }
  }
  if (themejson) {
    toggleFuction()
  }
}

loadFromLocalStorage()

function sendParams(inputValue) {
  let url = getPageURL()
  url.searchParams.set("id", `${inputValue}`)
  window.location.href = url.toString()
}

async function getData() {
  try {
    let pageURL = getPageURL()
    const keyword = pageURL.searchParams.get("id")
    const data = await fetchData(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${keyword}`
    )
    console.log(data)

    return data
  } catch (error) {
    console.log("I can't get")
  }
}

async function renderOnPage() {
  try {
    const data = await getData()

    const keyword = document.querySelector(".keyword__word")
    const phonetic = document.querySelector(".keyword__pronunciation")
    const loader = document.querySelector(".loader")

    loader.style.display = "none"
    main.style.display = "flex"

    keyword.textContent = data[0].word
    phonetic.textContent = data[0].phonetic

    const definition = data[0].meanings

    definition.forEach((meaning) => {
      const el = createElement("div")

      el.innerHTML = `
    <h2 class="definition__part-of-speech heading--2">${meaning.partOfSpeech}</h2>
    <h3 class="definition__meaning-label">Meaning</h3>
    <ul class="definition__meaning-list ${meaning.partOfSpeech}">
      <div></div>
    </ul>
    <div>
      <ul class="definition__synonym-list">
        <h3 class="definition__synonym-label">Synonym: </h3>
      </ul>
    </div>
    <hr />
    <h4 class="definition__source-label">Source</h4>
    <ul class="definition__source-list">
      <li class="definition__source-url">
        <a href="${data[0].sourceUrls}">${data[0].sourceUrls}</a>
      </li>
    </ul>
  `

      const partOfSpeech = document.querySelector(".definitions")

      partOfSpeech.appendChild(el)
      meaning.definitions.forEach((text) => {
        const uls = document.querySelectorAll(`.${meaning.partOfSpeech}`)

        uls.forEach((ul) => {
          const list = createElement("li")
          list.innerHTML = `
        ${text.definition}
        <p class="definition__example">
         ${text.example || ""}
        </p>
        `
          ul.appendChild(list)
        })
      })

      meaning.synonyms.forEach((synonym, index) => {
        if (index < 2) {
          const SynonymContainer = document.querySelectorAll(
            ".definition__synonym-list"
          )

          SynonymContainer.forEach((item) => {
            const url = getPageURL()
            url.searchParams.set("id", `${synonym}`)
            const list = createElement("li")
            list.innerHTML = `
          <a href="${url}">${synonym}</a>
          `
            item.appendChild(list)
          })
        }
      })
    })
  } catch (error) {
    console.log(error)
  }
}

renderOnPage()

function getPageURL() {
  return new URL(`${window.location.href}`)
}

function createElement(element) {
  return document.createElement(element)
}

function saveToLocalStorage(key, item) {
  return localStorage.setItem(key, item)
}

function getFromLocalStorage(key) {
  return localStorage.getItem(key)
}

input.addEventListener("keydown", (e) => search(e))

function search(e) {
  if (e.key !== "Enter") return

  if (!input.value.trim()) {
    alert("Please type word...")
  }
  const inputValue = input.value.trim()
  sendParams(inputValue)
  input.value = ""
}

toggle.addEventListener("click", toggleFuction)

function toggleFuction() {
  const elements = [toggle, input, body, fonts]

  elements.forEach((element) => {
    element.classList.toggle("light")
  })

  if (body.classList.contains("light")) {
    isLightMode = true
    saveToLocalStorage("theme", JSON.stringify(isLightMode))
  } else {
    isLightMode = false
    saveToLocalStorage("theme", JSON.stringify(isLightMode))
  }
}
playIcon.addEventListener("click", async () => {
  const data = await getData()
  const audio = document.querySelector(".audio")
  const phonetics = data[0].phonetics
  let audioURL
  phonetics.forEach((sound) => {
    if (sound.audio) {
      audioURL = sound.audio
    }
  })

  if (audioURL) {
    audio.src = audioURL
    await audio.play()
  } else {
    alert("There is no audio for this word")
  }
  console.log(audioURL)
})

fontSelect.addEventListener("click", (e) => {
  const fontTypes = ["sans-serif", "serif", "monospace"]
  const target = e.target

  if (
    target.classList.contains("current-font") ||
    target.classList.contains("fa-caret-down")
  ) {
    fonts.classList.toggle("show")
  }

  fontTypes.forEach((type) => {
    if (target.classList.contains(type)) {
      fontFamily.forEach((font) => {
        font.classList.remove("selected")
      })
      target.classList.add("selected")
      currentFont.textContent = target.textContent
      body.style.fontFamily = type
      fonts.classList.remove("show")
      saveToLocalStorage("font", JSON.stringify(type))
    }
  })
})

document.addEventListener("click", (e) => {
  const closest = e.target.closest(".select")

  if (closest) return
  if (fonts.classList.contains("show")) {
    fonts.classList.remove("show")
  }

  if (e.target.classList.contains("fa-magnifying-glass")) {
    if (!input.value.trim()) {
      alert("Please type word...")
    }
    const inputValue = input.value.trim()
    sendParams(inputValue)
    input.value = ""
  }
})

getData()
