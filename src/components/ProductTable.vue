<template>
  <div class="bg-white p-6 rounded-2xl shadow-xl">
    <div class="flex flex-col md:flex-row items-center gap-4 mb-6">
      <input
        v-model="store.searchQuery"
        placeholder="Search by title..."
        class="border p-3 rounded-xl w-full md:w-1/2"
      />
      <select v-model="store.filterPriceRange" class="border p-3 rounded-xl w-full md:w-1/4">
        <option value="">All Prices</option>
        <option value="1-100">1 to 100</option>
        <option value=">100">More than 100</option>
      </select>
    </div>

    <table class="w-full border-collapse text-left">
      <thead class="bg-gray-100">
        <tr>
          <th class="p-3 cursor-pointer" @click="toggleSort">Title ⬍</th>
          <th class="p-3">Description</th>
          <th class="p-3">Price</th>
          <th class="p-3">Image</th>
          <th class="p-3">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="product in paginatedProducts"
          :key="product.Id"
          class="border-t hover:bg-gray-50 transition"
        >
          <td class="p-3">{{ product.Title }}</td>
          <td class="p-3">{{ product.Description }}</td>
          <td class="p-3">{{ product.Price }}</td>
          <td class="p-3">
            <img :src="product.Image" alt="img" class="w-16 h-16 object-cover rounded-md border" />
          </td>
          <td class="p-3 space-x-2">
            <button
              @click="store.setEditProduct(product)"
              class="text-blue-600 hover:underline flex items-center gap-1"
            >
              ✏️ <span>Edit</span>
            </button>
            <button
              @click="confirmDelete(product.Id)"
              class="text-red-600 hover:underline flex items-center gap-1"
            >
              🗑️ <span>Delete</span>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="flex justify-center mt-6 gap-2">
      <button
        @click="store.currentPage = Math.max(1, store.currentPage - 1)"
        :disabled="store.currentPage === 1"
        class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
      >
        Prev
      </button>
      <button
        v-for="page in totalPages"
        :key="page"
        @click="store.currentPage = page"
        :class="[
          'px-3 py-1 rounded',
          store.currentPage === page ? 'bg-purple-600 text-white' : 'bg-gray-200 hover:bg-gray-300',
        ]"
      >
        {{ page }}
      </button>
      <button
        @click="store.currentPage = Math.min(totalPages, store.currentPage + 1)"
        :disabled="store.currentPage === totalPages"
        class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useProductStore } from '../stores/useProductStore'

const store = useProductStore()
onMounted(() => store.fetchProducts())

const filteredProducts = computed(() => {
  const query = store.searchQuery.toLowerCase()
  const priceRange = store.filterPriceRange

  const sorted = [...store.products]
    .filter((p) => p && p.Title)
    .sort((a, b) =>
      store.sortAsc ? a.Title.localeCompare(b.Title) : b.Title.localeCompare(a.Title),
    )

  return sorted.filter((p) => {
    const matchesTitle = p.Title.toLowerCase().includes(query)
    let matchesPrice = true
    if (priceRange === '1-100') matchesPrice = p.Price >= 1 && p.Price <= 100
    else if (priceRange === '>100') matchesPrice = p.Price > 100
    return matchesTitle && matchesPrice
  })
})

const paginatedProducts = computed(() => {
  const start = (store.currentPage - 1) * store.itemsPerPage
  const end = start + store.itemsPerPage
  return filteredProducts.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredProducts.value.length / store.itemsPerPage))

const toggleSort = () => {
  store.sortAsc = !store.sortAsc
}

const confirmDelete = (id) => {
  if (confirm('Are you sure you want to delete this product?')) {
    store.deleteProduct(id)
  }
}
</script>
