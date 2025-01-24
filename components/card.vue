<template>
  <!-- Main Card -->
  <div class="bg-white rounded-lg shadow-lg">
    <div class="p-6 border-b border-gray-200">
      <div class="flex items-center justify-between"></div>

      <!-- Card Header -->
      <div class="p-6 border-b border-gray-200" v-if="main">
        <div class="flex items-center justify-between">
          <slot name="header"></slot>
        </div>
      </div>

      <!-- Card Content -->
      <div class="p-6">
        <slot></slot>
      </div>

      <footer>
        <!-- We want footer content here -->
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  main: Boolean,
});
</script>
