<template>
  <!-- TIMELINE -->
  <div class="relative w-full mb-12">
    <!-- Horizontal Timeline Bar -->
    <div class="bg-blue-400 rounded-lg h-3 w-full relative"></div>

    <!-- Timestamps -->
    <div class="relative">
      <div
        v-for="(time, index) in timestamps"
        :key="index"
        :style="{
          left: `${
            index == 1 || index == timestamps.length - 1
              ? 5 + (index / (timestamps.length - 1)) * 90
              : (index / (timestamps.length - 1)) * 100
          } %`,
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
      :style="{ left: `${getPosition(kick.date)}%` }"
      class="absolute top-0 -translate-y-1/2"
    >
      <UIcon name="mingcute:foot-fill" class="w-7 h-7 text-blue-950" />
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
  // Return a percentage of the day to the nearest hour

  const timeInHours =
    (date.getHours() * 60 + date.getMinutes() + date.getSeconds() / 60) / 60;
  return Math.round(timeInHours / 24) * 100;
}
</script>
