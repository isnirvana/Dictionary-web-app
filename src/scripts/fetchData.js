const notFound = document.querySelector(".not-found")
const keyword = document.querySelector(".keyword")

export async function fetchData(URL) {
  try {
    const res = await fetch(URL)
    if (!res.ok) throw new Error(`HTTP Error! Status: ${res.status}`)
    return await res.json()
  } catch (error) {
    notFound.style.display = "flex"
    keyword.style.display = "none"
    console.error("API Fetch Error:", error)
    return { results: [] }
  }
}
