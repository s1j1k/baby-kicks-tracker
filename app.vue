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

        <div v-if="loaded">
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
              lastKickTime
                ? timeFromDate(lastKickTime)
                : "No kicks recorded yet"
            }}
          </div>
        </div>

        <!-- Skeleton Loader -->
        <div v-else>
          <!-- Overall Skeleton -->
          <USkeleton class="h-[150px] w-full rounded-md mb-4" />
        </div>
      </UCard>

      <!-- Pattern Section -->
      <UCard class="mt-4">
        <div v-if="loaded">
          <h2 class="text-lg font-semibold mb-4">Activity Patterns</h2>
          <div v-if="loggedIn" class="space-y-2 text-gray-900">
            <div class="h-64">
              <chart-line :chartData="chartData" :chartOptions="chartOptions" />
            </div>
          </div>
          <div v-else class="text-gray-600">
            Log in to see activity patterns
          </div>
        </div>

        <div v-else>
          <USkeleton class="h-[68px] w-full rounded-md" />
        </div>
      </UCard>

      <!-- History Section -->
      <UCard class="mt-4">
        <div v-if="loaded">
          <h2 class="text-lg font-semibold mb-4">History</h2>
          <div v-if="loggedIn" class="space-y-2 text-gray-900">
            <!-- Add history items here -->
            <UTable
              :rows="historyItems"
              :progress="{ color: 'primary', animation: 'carousel' }"
            />
            <div
              class="flex justify-center px-3 py-3.5 border-t border-gray-200 dark:border-gray-700"
            >
              <UPagination
                v-model="page"
                :page-count="pageCount"
                :total="kicks.length"
              />
            </div>
          </div>
          <div v-else class="text-gray-600">Log in to save history</div>
        </div>

        <div v-else>
          <USkeleton class="h-[68px] w-full rounded-md" />
        </div>
      </UCard>

      <UCard class="mt-4 mb-4">
        <div v-if="loaded">
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
        </div>

        <div v-else>
          <USkeleton class="h-11 w-full rounded-lg mb-5" />
          <USkeleton class="h-11 w-full rounded-lg" />
        </div>
      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
const lastKickTime = ref<Date | null>(null);
const { user, signOutFb } = useFirebaseAuth();
const kicks = ref<Array<Kick>>([]);
const { addKick, getKicks, uploadKicksToFirestore } = useKickStore();
const { saveKicksLocal, getKicksLocal } = useLocalStore();

const loaded = ref(false);

const loggedIn = computed(() => {
  return user.value ? true : false;
});

const openLoginModal = ref(false);
const openCreateAccModal = ref(false);

const isReady = useState("firebaseReady");

// Check for existing kicks data when firebase is loaded (in case firebase login exists)
watch(isReady, async (newVal, oldVal) => {
  if (newVal === true) {
    const storedKicks: Array<Kick> = loggedIn.value
      ? await getKicks()
      : getKicksLocal();

    if (storedKicks && Array.isArray(storedKicks) && storedKicks.length > 0) {
      updateKicksFromStorage(storedKicks);
    }

    loaded.value = true;
  }
});

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
  // Clear local storage when user signs out
  if (oldValue && !newValue) {
    kicks.value = [];
    lastKickTime.value = null;
  }

  if (newValue && !oldValue) {
    loaded.value = false;
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
      loaded.value = true;
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

const historyItems = computed(() => {
  // Sort kicks by date in descending order (most recent first)
  kicks.value.sort((a, b) => {
    if (a.date > b.date) {
      return -1;
    }
    if (a.date < b.date) {
      return 1;
    }
    return 0;
  });

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

  return kicks.value.filter(
    (kick) => kick.date >= today && kick.date < tomorrow
  );
});

const times = [
  "12 AM",
  "",
  "",
  "3 AM",
  "",
  "",
  "6 AM",
  "",
  "",
  "9 AM",
  "",
  "",
  "12 PM",
  "",
  "",
  "3 PM",
  "",
  "",
  "6 PM",
  "",
  "",
  "9 PM",
  "",
  "",
];

const chartData = computed(() => {
  // Take the kicks.value and take the simple average across each day for each 1-hour time bucket

  const now = new Date();
  const last10DaysData = new Array(times.length).fill(0);
  const todayData = new Array(now.getHours() + 1).fill(null);

  // TODO check if there aren't 10 days in history - then hide this section or provide partial results?

  kicks.value.map((kick) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayMinus10Days = new Date();
    todayMinus10Days.setDate(-10);

    if (kick.date < today && kick.date >= todayMinus10Days) {
      // Get kicks average by hour across last 10 days
      const index = kick.date.getHours();
      if (last10DaysData[index]) {
        last10DaysData[index] += 1 / 10;
      } else {
        last10DaysData[index] = 1 / 10;
      }
    } else if (kick.date >= today) {
      // Get kicks by hour for today
      const index = kick.date.getHours();
      if (todayData[index]) {
        todayData[index]++;
      } else {
        todayData[index] = 1;
      }
    }
  });

  // Fill the data before the latest kick today with 0s to allow interpolation
  const lastDataIndex = todayData.findLastIndex((i) => {
    return i !== null;
  });

  const todayDataPadded = todayData.map((value, index) => {
    if (index < lastDataIndex && value === null) {
      return 0;
    } else {
      return value;
    }
  });

  return {
    labels: times,
    datasets: [
      {
        label: "Today",
        backgroundColor: "#FACC15",
        borderColor: "#FACC15",
        data: todayDataPadded,
        // Provide a little dot when there is only one element in the data array (no interpolation)
        pointRadius: lastDataIndex === 0 ? 3 : 0,
      },
      {
        label: "Last 10 Days",
        backgroundColor: "#3B82F6",
        borderColor: "#3B82F6",
        data: last10DaysData,
        pointRadius: 0,
      },
    ],
  };

  // TODO use a linear regression or other simple ML algorithm
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  datasets: {
    line: {
      tension: 0.3,
    },
  },
  scales: {
    x: {
      ticks: {
        autoSkip: false,
      },
      grid: {
        display: false,

        // ticks: {
        //   callback: function (value: string, index: number, values: Array<string>) {
        //     if (index % 3 === 0) {
        //       return value;
        //     } else {
        //       return "";
        //     }
        //   },
        // },
      },
    },
    y: {
      // ticks: {
      //   display: false,
      // },
      ticks: {
        callback: function (value: number) {
          if (value % 1 === 0) {
            return value;
          }
        },
      },
      grid: {
        display: false,
      },
    },
  },
};
</script>
