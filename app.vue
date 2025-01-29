<!-- app.vue -->
<template>
  <VitePwaManifest />
  <UContainer>
    <div class="min-h-screen bg-grey-100 max-w-md pt-4">
      <UCard class="overflow-hidden">
        <template #header>
          <div class="flex items-center justify-between">
            <h1 class="text-2xl font-bold">Baby Kicks Tracker</h1>
            <span class="text-2xl">👶</span>
          </div>
        </template>

        <timeline :kicks="todayKicks" />
        <!-- Main Button -->
        <UButton
          icon="material-symbols:add-rounded"
          label="Record Kick"
          block
          size="xl"
          @click="recordKick"
        />

        <!-- Last Kick Time -->
        <div class="mt-6 text-center text-gray-600 text-sm">
          Last kick:
          {{
            lastKickTime ? timeFromDate(lastKickTime) : "No kicks recorded yet"
          }}
        </div>
      </UCard>

      <!-- History Section -->
      <UCard class="mt-4">
        <h2 class="text-lg font-semibold mb-4">History</h2>
        <div v-if="loggedIn" class="space-y-2 text-gray-900">
          <!-- Add history items here -->
          History items
          <UTable :rows="historyItems" :sort="sort" />
          <div
            class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700"
          >
            <UPagination
              v-model="page"
              :page-count="pageCount"
              :total="kicks.length"
            />
          </div>
        </div>
        <div v-else class="text-gray-600">Log in to save history</div>
      </UCard>

      <!-- FIXME make it not on a card, just buttons for login -->
      <UCard class="mt-4">
        <div v-if="loggedIn" class="space-y-4">
          <button
            class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-2 rounded-lg text-xl transition-colors duration-200 flex items-center justify-center"
            @click="signOutFb"
          >
            Sign out
          </button>
        </div>
        <!-- If the user is logged out -->
        <div v-else class="space-y-4">
          <UButton
            label="Login"
            @click="openLoginModal = true"
            block
            size="xl"
          />
          <login-modal v-model="openLoginModal" />

          <UButton
            label="Create Account"
            @click="openCreateAccModal = true"
            block
            size="xl"
            variant="outline"
          />
          <create-acc-modal v-model="openCreateAccModal" />
        </div>
      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
const lastKickTime = ref<Date | null>(null);
const {
  signInGooglePopup,
  user,
  signOutFb,
  signInEmailPassword,
  registerUser,
} = useFirebaseAuth();
const kicks = ref<Array<Kick>>([]);
const { addKick, getKicks, uploadKicksToFirestore } = useKickStore();
const { saveKicksLocal, getKicksLocal } = useLocalStore();

const loggedIn = computed(() => {
  return user.value ? true : false;
});

const openLoginModal = ref(false);
const openCreateAccModal = ref(false);

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

function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    day: "numeric",
    month: "short",
  };
  const datePart = new Intl.DateTimeFormat("en-US", options).format(date);
  const timePart = date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  return `${datePart} at ${timePart}`;
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

const page = ref(1);
const pageCount = 5;

const sort = ref({
  column: 'date',
  direction: 'desc' as "desc" | "asc"
})

const historyItems = computed(() => {
  const historyItems = kicks.value.slice(
    (page.value - 1) * pageCount,
    page.value * pageCount
  );

  return historyItems.map((kick) => {
    return { ...kick, date: formatDate(kick.date) };
  });
});

// TODO allow to view the timeline for previous days
const todayKicks = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date();
  tomorrow.setHours(24, 0, 0, 0);

  return kicks.value.filter((kick) => kick.date >= today && kick.date < tomorrow);
})
</script>
