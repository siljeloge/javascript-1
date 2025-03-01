//API-fetching all products//

const container = document.querySelector("#container")

const BASE_URL = "https://v2.api.noroff.dev/rainy-days"

async function fetchProducts() {
    try{
        const response = await fetch(BASE_URL)
        const data = await response.json()
        const products = data.data
        
products.forEach(product => {
    const card = document.createElement ("div")
    const image = document.createElement ("img")
    const content = document.createElement ("div")
    const title = document.createElement ("h2")
    const price = document.createElement ("p")

    card.className = 'card'
    image.className = 'card-image'
    content.className = 'card-content'
    title.className = 'card-title'
    price.className = 'card-price'

    image.src = product.image.url
    image.alt = product.image.alt
    title.textContent = product.title
    price.textContent = product.price
    
    content.appendChild(title)
    content.appendChild(price)
    card.appendChild(image)
    card.appendChild(content)

    container.appendChild(card)
})
    } catch (error) {
        console.error(error)
    }
}

fetchProducts()





