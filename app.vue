<!-- app.vue -->
<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <div class="max-w-md mx-auto">
      <!-- Main Card -->
      <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        <!-- Card Header -->
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h1 class="text-2xl font-bold text-gray-900">Baby Kicks Tracker</h1>
            <div class="text-blue-500">
              <!-- You can add an icon here if you want -->
               <!-- TODO make the icon customizable -->
              <span class="text-2xl">👶</span>
            </div>
          </div>
        </div>

        <!-- Card Content -->
        <div class="p-6">
          <!-- TODO make it a timeline of kicks and intensities rather than a COUNT -->
          <!-- Today's Count -->
          <div class="text-center mb-8">
            <div class="text-5xl font-bold text-blue-500">0</div>
            <div class="text-gray-600 mt-2">Kicks Today</div>
          </div>

          <!-- Main Button -->
          <button 
            class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-8 px-4 rounded-lg text-xl transition-colors duration-200 flex items-center justify-center"
            @click="recordKick"
          >
            <span class="mr-2">+</span>
            Record Kick
          </button>

          <!-- Last Kick Time -->
          <div class="mt-6 text-center text-gray-600 text-sm">
            Last kick: {{ lastKickTime || 'No kicks recorded yet' }}
          </div>
        </div>
      </div>

      <!-- History Section (Optional) -->
      <div class="mt-4 bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-lg font-semibold mb-4">Today's History</h2>
        <div class="space-y-2">
          <!-- Add history items here -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const lastKickTime = ref(null)

function recordKick() {
  lastKickTime.value = new Date().toLocaleTimeString()
  // Add your kick recording logic here
}
</script>

<style>
/* Add any custom styles here */
</style>