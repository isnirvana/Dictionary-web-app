import { fetchData } from "./fetchData"

const input = document.getElementById("search-input")
const main = document.querySelector("main")
const body = document.querySelector("body")
const toggle = document.querySelector(".toggle-mode")
const playIcon = document.querySelector(".play-icon")

function sendParams(inputValue) {
  let url = getPageURL()
  url.searchParams.set("id", `${inputValue}`)
  window.location.href = url.toString()
}

async function getData() {
  let pageURL = getPageURL()
  const keyword = pageURL.searchParams.get("id")
  const data = await fetchData(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${keyword}`
  )
  console.log(data)

  return data
}

async function renderOnPage() {
  const data = await getData()

  const keyword = document.querySelector(".keyword__word")
  const phonetic = document.querySelector(".keyword__pronunciation")

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
}

renderOnPage()

function getPageURL() {
  return new URL(`${window.location.href}`)
}

function createElement(element) {
  return document.createElement(element)
}

input.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return
  const inputValue = input.value
  sendParams(inputValue)
  console.log(inputValue)
  input.value = ""
})

toggle.addEventListener("click", () => {
  if (!toggle.classList.contains("light")) {
    toggle.classList.add("light")
    input.classList.add("light")
    body.classList.add("light")
  } else {
    toggle.classList.remove("light")
    input.classList.remove("light")
    body.classList.remove("light")
  }
})

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

getData()
