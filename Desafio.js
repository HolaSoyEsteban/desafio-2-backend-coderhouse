import fs from 'fs'

class ProductManager {
    #products
    #error
    #path
    constructor() {
        this.#products = [];
        this.#error = undefined;
        this.#path = './productos.json';
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
            await fs.promises.writeFile(this.#path, JSON.stringify(this.#products, null, '\t'))
        }
        else {
            console.log(this.#error)
        } 
    }

    getProducts = async () => {
        const existe = fs.existsSync(this.#path)
        if (!existe) {
            await fs.promises.writeFile(this.#path, JSON.stringify(this.#products, null, '\t'))
            console.log("-----------------------------------------------------------------")
            console.log("El archivo de productos no existia, se acaba de crear")
        }
        console.log("-----------------------------------------------------------------")
        const contenido = await fs.promises.readFile(this.#path, 'utf-8');
        return JSON.parse(contenido);
    }

    getProductById = async (id) => {
        const products = await this.getProducts();
        const product = await products.find(p => p.id === id);
        console.log("------------------------ Busqueda por Id -----------------------------")
        console.log('ID ingresado: ' + id);
        if (!product) return 'Not Found';
        console.log('Producto encontrado: ');
        return product;
    }

    updateProduct = async (id, updatedFields) => {
        console.log("------------------------ Actualizacion de producto -----------------------------")
        const products = await this.getProducts();
        const productIndex = products.findIndex(p => p.id === id);
        if (productIndex === -1) {
            console.log(`Producto con id ${id} no encontrado`);
            return;
        }
        const updatedProduct = { ...products[productIndex], ...updatedFields };
        products[productIndex] = updatedProduct;
        await fs.promises.writeFile(this.#path, JSON.stringify(products, null, '\t'));
        console.log(`Producto con id ${id} actualizado`);
    }

    deleteProduct = async (id) => {
        console.log("------------------------ Eliminación de producto -----------------------------")
        const products = await this.getProducts();
        const productIndex = products.findIndex(p => p.id === id);
        if (productIndex === -1) {
            console.log(`Producto con id ${id} no encontrado`);
            return false;
        }
        products.splice(productIndex, 1);
        await fs.promises.writeFile(this.#path, JSON.stringify(products, null, '\t'));
        console.log(`Producto con id ${id} eliminado`);
        return true;
    }

}

const productManager = new ProductManager();

console.log("----------------------------- Arranca el programa ------------------------------------")

console.log(await productManager.getProducts()) // muestra array vacio, a menos que el archivo productos.json ya tenga productos

await productManager.addProduct('producto prueba', 'Este es un producto prueba', 200, 'Sin imagen', 'abc123', 25) // agrega un producto
console.log(await productManager.getProducts()) // muestra array con un producto

await productManager.addProduct('Segundo producto de prueba', 'Este es un producto prueba', 200, 'Sin imagen', 'xyz456', 25) // agrega un producto nuevo para tener 2 productos y corroborar que no se repitan los ID

console.log(await productManager.getProductById(1)) // este id existe
console.log(await productManager.getProductById(10)) // este id no existe

await productManager.updateProduct(1, { title: 'Producto actualizado', price: 300 }); // actualiza el producto con id 1, solo su nombre y precio
console.log(await productManager.getProducts()); // muestra el array con el producto actualizado

console.log(await productManager.deleteProduct(1)) // elimina el producto con id 1
console.log(await productManager.deleteProduct(10)) // no existe un producto con id 10, devuelve false
console.log(await productManager.getProducts()) // muestra el array sin el producto que ya se eliminó


