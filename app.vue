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
          Last kick:
          {{
            lastKickTime ? timeFromDate(lastKickTime) : "No kicks recorded yet"
          }}
        </div>
      </template>
    </card>

    <!-- History Section -->
    <card class="mt-4">
      <h2 class="text-lg font-semibold mb-4 text-gray-900">History</h2>

      <div v-if="loggedIn" class="space-y-2 text-gray-900">
        <!-- Add history items here -->
        History items
      </div>
      <div v-else class="text-gray-600">Log in to save history</div>
    </card>

    <card class="mt-4">
      <!-- If the user is logged in -->
      <template v-if="loggedIn" #default>
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
const lastKickTime = ref<Date | null>(null);
const { signInGooglePopup, user, signOutFb } = useFirebaseAuth(); // auto-imported
const kicks = ref<Array<Kick>>([]);
const { addKick, getKicks, uploadKicksToFirestore } = useKickStore();
const { saveKicksLocal, getKicksLocal } = useLocalStore();

const loggedIn = computed(() => {
  return user.value ? true : false;
});

// Check for existing kicks data
onMounted(async () => {
  const storedKicks: Array<Kick> = loggedIn.value
    ? await getKicks()
    : getKicksLocal();

  if (storedKicks && Array.isArray(storedKicks) && storedKicks.length > 0) {
    updateKicksFromStorage(storedKicks);
  }
});

// TODO move to helpers file
function timeFromDate(date: Date) {
  return date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
}

async function recordKick() {
  if (loggedIn.value) {
    // If user is logged in, record a kick in Firebase
    try {
      const kick = await addKick();
      console.info("Kick registered!");
      if (kick) {
        // NOTE we assume here there is no need to sync dynamically (user adding from 2 devices at the same time)
        kicks.value.push(kick);
        lastKickTime.value = kick.date;
      }
    } catch (error) {
      console.error(error);
      console.info("Failed to register kick.");
    }
  } else {
    const date = new Date();
    kicks.value.push({ date: date });
    lastKickTime.value = date;

    // Save in local storage
    saveKicksLocal(kicks.value);
  }
}

watch(loggedIn, async (newValue, oldValue) => {
  // FIXME required?
  // Clear local storage when user signs out
  // if (oldValue && !newValue) {
  //   kicks.value = [];
  // }

  if (newValue && !oldValue) {
    try {
      // Upload any locally stored kicks to firebase
      const localKicks = getKicksLocal();
      if (localKicks) {
        uploadKicksToFirestore(localKicks);
        // Clear local storage after successful upload
        localStorage.removeItem("kicksData");
      }
      // Load all kicks from firebase storage
      const storedKicks = await getKicks();
      updateKicksFromStorage(storedKicks);
      // NOTE this does not sync dynamically with other devices,
      // assuming user will be using one device at a time / refresh when needed
    } catch (error) {
      console.error("Failed to sync kicks data to database");
    }
  }
});

function updateKicksFromStorage(storedKicks: Array<Kick>) {
  if (storedKicks && Array.isArray(storedKicks) && storedKicks.length > 0) {
    kicks.value = storedKicks;

    // Filter dates and get the most recent kicks from date attribute
    lastKickTime.value = storedKicks.reduce((latest, current) => {
      return current.date > latest.date ? current : latest;
    }).date;
  }
}

// FIXME just testing
watch(kicks, () => {
  console.dir(kicks.value);
});
</script>
