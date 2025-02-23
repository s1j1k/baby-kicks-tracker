<template>
  <!-- TIMELINE -->
  <div class="relative w-full mb-12">
    <!-- Horizontal Timeline Bar -->
    <div class="bg-blue-400 dark:bg-blue-900 rounded-lg h-3 w-full relative"></div>

    <!-- Timestamps -->
    <div class="relative">
      <div
        v-for="(time, index) in timestamps"
        :key="index"
        :style="{
          left: `${5 + (index / (timestamps.length - 1)) * 90}%`,
        }"
        class="absolute top-1 -translate-x-1/2 text-gray-500 text-xs whitespace-nowrap"
      >
        {{ time }}
      </div>
    </div>

    <!-- Foot Icons -->
    <div
      v-for="(kick, index) in kicks"
      :key="index"
      :style="{ left: `${5 + getPosition(kick.date) * 90}%` }"
      class="absolute top-0 -translate-y-1/2 -translate-x-1/2"
    >
      <UIcon name="mingcute:foot-fill" class="w-7 h-7 text-blue-900 dark:text-blue-300" />
    </div>
  </div>
</template>

<script setup lang="ts">
const timestamps = ["12 AM", "6 AM", "12 PM", "6 PM", "12 AM"];

// TODO handle other properties

defineProps({
  kicks: Array<Kick>,
});

function getPosition(date: Date) {
  // Return a fraction of the day to the nearest hour
  const timeInHours = Math.round(
    (date.getHours() * 60 + date.getMinutes() + date.getSeconds() / 60) / 60
  );

  return timeInHours / 24;
}
</script>
