const main = document.querySelector(".definitions")

export async function fetchData(URL) {
  try {
    const res = await fetch(URL)
    if (!res.ok) throw new Error(`HTTP Error! Status: ${res.status}`)
    return await res.json()
  } catch (error) {
    // main.textContent = "Internet Error"
    console.error("API Fetch Error:", error)
    return { results: [] }
  }
}
