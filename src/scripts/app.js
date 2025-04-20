import { fetchData } from "./fetchData"

const input = document.getElementById("search-input")

function sendParams(inputValue) {
  let url = new URL(`${window.location.href}`) // or use a base URL like "https://example.com"
  url.searchParams.set("id", `${inputValue}`)
  window.location.href = url.toString()
}

input.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return
  const inputValue = input.value
  sendParams(inputValue)
  console.log(inputValue)
  input.value = ""
})

async function useData() {
  const data = await fetchData(
    `https://api.dictionaryapi.dev/api/v2/entries/en/nirvana`
  )
  console.log(data)
}

useData()

// ;async () => {
//   console.log(
//     await fetchData(`https://api.dictionaryapi.dev/api/v2/entries/en/nirvana`)
//   )
// }
