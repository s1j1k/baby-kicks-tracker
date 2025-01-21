<!-- app.vue -->
<template>
  <VitePwaManifest />
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
          <timeline :kicks="kicks" />

          <!-- Main Button -->
          <button
            class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-8 px-4 rounded-lg text-xl transition-colors duration-200 flex items-center justify-center"
            @click="recordKick"
          >
            <span class="mr-2">+</span>
            Record Kick
          </button>

          <!-- TODO add specific logic to customize time, intensity, relative number of kicks -->
          <!-- <UModal v-model="isOpen">
      <div class="p-4">
        <Placeholder class="h-48" />
      </div>
    </UModal> -->

          <!-- Last Kick Time -->
          <div class="mt-6 text-center text-gray-600 text-sm">
            Last kick: {{ lastKickTime || "No kicks recorded yet" }}
          </div>
        </div>
      </div>

      <!-- TODO History Section -->
      <!-- <div class="mt-4 bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-lg font-semibold mb-4">Today's History</h2>
        <div class="space-y-2"> -->
      <!-- Add history items here -->
      <!-- </div> -->
      <!-- </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
const lastKickTime = ref<String>(null);

// TODO add typecheck
const kicks = ref<Array<Kick>>([]);

// Check for existing kicks data
onMounted(() => {
  const storedKicks = getKicksData();
  if (storedKicks) {
    kicks.value = storedKicks;

    console.log("stored kicks", storedKicks)
    if ((storedKicks[storedKicks.length - 1] as Kick) && (storedKicks[storedKicks.length - 1] as Kick).date) {
      lastKickTime.value = (storedKicks[storedKicks.length - 1] as Kick).date;
    }
  }
});

// useHead({
// link: [
//       { rel: 'icon', href: 'https://fav.farm/👶'}
//     ]
// })

function recordKick() {
  // TODO store full date for displaying history data
  let date = new Date();
  // NOTE this is just used for the last kick visual
  lastKickTime.value = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  // Add your kick recording logic here
  // TODO convert to a position on the timeline

  // Convert to a percentage of 24 hours, with a precision of 1 hour
  let position = (100 * date.getHours()) / 24;

  // TODO save to kicks data structure
  // TODO persistent save to kick data structure
  // TODO update chart with new kick

  kicks.value.push({ date: lastKickTime.value, position: position });

  // For MVP just save in local storage
  saveKicksData(kicks.value);
}

function saveKicksData(kicksData) {
  // Get the current date and set the expiration for midnight tonight
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0); // Set to midnight tonight

  // Store the kicks data and the expiration timestamp
  const data = {
    kicks: kicksData,
    expiresAt: midnight.getTime(), // Expiry time in milliseconds
  };

  localStorage.setItem("kicksData", JSON.stringify(data));
}

function getKicksData() {
  const storedData = JSON.parse(localStorage.getItem("kicksData"));

  if (storedData) {
    const now = new Date().getTime();
    // Check if the data has expired
    if (now > storedData.expiresAt) {
      localStorage.removeItem("kicksData"); // Clear expired data
      return null; // No data available
    }
    return storedData.kicks;
  }

  return null; // No data found
}

</script>
