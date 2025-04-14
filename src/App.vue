<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6 text-center text-purple-700">🛒 Product Manager</h1>
    <ProductForm />
    <ProductTable />
  </div>
</template>

<script setup>
import ProductForm from './components/ProductForm.vue'
import ProductTable from './components/ProductTable.vue'
</script>
