import fs from 'fs'

class ProductManager {
    #products
    #error
    constructor() {
        this.#products = [];
        this.#error = undefined;
    }

    #generateId = () => (this.#products.length === 0) ? 1 : this.#products[this.#products.length - 1].id + 1

    #validateEvent = (title, description, price, thumbnail, code, stock) => {
        if (!title || !description || !price || !thumbnail || !code || !stock){
            this.#error = `ATENCION ( ${title} : Faltan datos )`
        } else {
            const found = this.#products.find(product => product.code === code)
            if(found) this.#error = `ATENCION ( ${title} : El producto ya existe )`
            else this.#error = undefined
        }
    }

    addProduct = async (title, description, price, thumbnail, code, stock) => {
        this.#validateEvent(title, description, price, thumbnail, code, stock)
        if (this.#error === undefined){
            this.#products.push({id: this.#generateId(), title, description, price, thumbnail, code, stock})
            await fs.promises.writeFile('./productos.json', JSON.stringify(this.#products, null, '\t'))
        }
        else {
            console.log(this.#error)
        } 
        }

    getProducts = () => this.#products

    getProductsById(id) {
        const product = this.#products.find(product => product.id === id)
        if (!product) return 'Not Found'
        console.log('Producto encontrado: ')
        return product
    }

}


const productManager = new ProductManager();

console.log("-----------------------------------------------------------------")
console.log(productManager.getProducts()) // muestra array vacio

productManager.addProduct('Producto 1', 'Descripcion 1', 100, 'https://cdn3.iconfinder.com/data/icons/education-209/64/bus-vehicle-transport-school-128.png', 100, 10)

console.log("-----------------------------------------------------------------")
console.log(productManager.getProducts()) // muestra array con un producto

productManager.addProduct('Producto 1', 'Descripcion 1', 100, 'https://cdn3.iconfinder.com/data/icons/education-209/64/bus-vehicle-transport-school-128.png', 100, 10)

console.log("-----------------------------------------------------------------")
console.log(productManager.getProducts()) // muestra array con un producto (no agrega el producto repetido)

productManager.addProduct('Producto 0', 'Descripcion 2', 200, 40, 20)
productManager.addProduct('Producto 2', 'Descripcion 2', 200, 'https://cdn3.iconfinder.com/data/icons/education-209/64/bus-vehicle-transport-school-128.png', 40, 20)
productManager.addProduct('Producto 3', 'Descripcion 2', 200, 'https://cdn3.iconfinder.com/data/icons/education-209/64/bus-vehicle-transport-school-128.png', 40, 20)
productManager.addProduct('Producto 4', 'Descripcion 2', 200, 'https://cdn3.iconfinder.com/data/icons/education-209/64/bus-vehicle-transport-school-128.png', 102, 20)

console.log("-----------------------------------------------------------------")
console.log(productManager.getProducts()) // muestra array con los productos agregados

console.log("-----------------------------------------------------------------")
console.log(productManager.getProductsById(3))  // este id existe
console.log("--------------------------------")
console.log(productManager.getProductsById(70)) // este id no existe
console.log("-----------------------------------------------------------------")