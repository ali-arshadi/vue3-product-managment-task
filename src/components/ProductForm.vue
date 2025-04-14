<template>
  <form @submit.prevent="onSubmit" class="mb-8 bg-white p-6 rounded-2xl shadow-xl">
    <div class="grid grid-cols-2 gap-4">
      <input v-model="form.Title" placeholder="Title" class="border p-3 rounded-xl" required />
      <input
        v-model="form.Description"
        placeholder="Description"
        class="border p-3 rounded-xl"
        required
      />
      <input
        v-model.number="form.Price"
        placeholder="Price"
        type="number"
        class="border p-3 rounded-xl"
        required
      />
      <input v-model="form.Image" placeholder="Image URL" class="border p-3 rounded-xl" required />
    </div>
    <div class="mt-6 flex justify-end gap-4">
      <button
        type="submit"
        class="bg-purple-600 hover:bg-purple-700 transition text-white px-5 py-2 rounded-xl"
      >
        {{ editing ? 'Update' : 'Add' }} Product
      </button>
      <button type="button" @click="clearForm" class="text-gray-500 hover:text-black">Clear</button>
    </div>
  </form>
</template>

<script setup>
import { reactive, watch, computed } from 'vue'
import { useProductStore } from '../stores/useProductStore'

const store = useProductStore()
const form = reactive({ Title: '', Description: '', Price: 0, Image: '' })
const editing = computed(() => !!store.editingProduct)

watch(
  () => store.editingProduct,
  (newVal) => {
    if (newVal) Object.assign(form, newVal)
  },
)

const onSubmit = () => {
  if (!form.Title || !form.Description || !form.Image || form.Price <= 0) {
    alert('Please fill in all fields correctly.')
    return
  }

  if (editing.value) {
    store.updateProduct(store.editingProduct.Id, form)
  } else {
    store.addProduct(form)
  }
  clearForm()
}

const clearForm = () => {
  Object.assign(form, { Title: '', Description: '', Price: 0, Image: '' })
  store.clearEdit()
}
</script>
