import { defineStore } from 'pinia'
import axios from 'axios'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    isLoading: false,
    searchQuery: '',
    sortAsc: true,
    editingProduct: null,
    filterPriceRange: '',
    currentPage: 1,
    itemsPerPage: 5,
  }),
  actions: {
    async fetchProducts() {
      this.isLoading = true
      try {
        const res = await axios.get('https://ahuan.ir/api/foods?type=T&cat=test')
        this.products = res.data
      } catch (err) {
        console.error('Fetch Error:', err)
      } finally {
        this.isLoading = false
      }
    },
    async addProduct(product) {
      await axios.post('https://ahuan.ir/api/foods', {
        ...product,
        Category: 'test',
        C_OR_R: 'T',
      })
      this.fetchProducts()
    },
    async updateProduct(id, product) {
      await axios.put(`https://ahuan.ir/api/foods?id=${id}`, {
        ...product,
        Category: 'test',
        C_OR_R: 'T',
      })
      this.fetchProducts()
    },
    async deleteProduct(id) {
      await axios.delete(`https://ahuan.ir/api/foods?id=${id}`)
      this.fetchProducts()
    },
    setEditProduct(product) {
      this.editingProduct = product
    },
    clearEdit() {
      this.editingProduct = null
    },
  },
})
