<!-- app.vue -->
<template>
  <VitePwaManifest />
  <container>
    <!-- Main Card -->
    <card class="overflow-hidden" main>
      <!-- Card Header -->
      <template #header>
        <h1 class="text-2xl font-bold text-gray-900">Baby Kicks Tracker</h1>
        <span class="text-2xl">👶</span>
      </template>

      <!-- Card Content -->
      <template #default>
        <timeline :kicks="kicks" />

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
          Last kick: {{ lastKickTime || "No kicks recorded yet" }}
        </div>
      </template>
    </card>

    <!-- History Section -->
    <card class="mt-4">
      <h2 class="text-lg font-semibold mb-4 text-gray-900">History</h2>

      <div v-if="user" class="space-y-2 text-gray-900">
        <!-- Add history items here -->
        History items
      </div>
      <div v-else class="text-gray-600">Log in to save history</div>
    </card>

    <card class="mt-4">
      <!-- If the user is logged in -->
      <template v-if="user" #default>
        <button
          class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-2 rounded-lg text-xl transition-colors duration-200 flex items-center justify-center"
          @click="signOutFb"
        >
          Sign out
        </button>
      </template>
      <!-- If the user is logged out -->
      <template v-else #default>
        <button
          class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-2 rounded-lg text-xl transition-colors duration-200 flex items-center justify-center"
          @click="signInGooglePopup"
        >
          Sign in with Google
        </button>
      </template>
    </card>
  </container>
</template>

<script setup lang="ts">
const lastKickTime = ref<String | null>(null);
const { signInGooglePopup, user, signOutFb } = useFirebaseAuth(); // auto-imported
const kicks = ref<Array<Kick>>([]);

// Check for existing kicks data
onMounted(() => {
  const storedKicks = getKicksData();
  if (storedKicks) {
    kicks.value = storedKicks;

    console.log("stored kicks", storedKicks);
    if (
      (storedKicks[storedKicks.length - 1] as Kick) &&
      (storedKicks[storedKicks.length - 1] as Kick).date
    ) {
      lastKickTime.value = (storedKicks[storedKicks.length - 1] as Kick).date;
    }
  }
});

function recordKick() {
  // TODO store full date for displaying history data
  let date = new Date();
  // NOTE this is just used for the last kick visual
  lastKickTime.value = date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
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

function saveKicksData(kicksData: Array<Kick>) {
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
  // @ts-expect-error TODO fix error
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
