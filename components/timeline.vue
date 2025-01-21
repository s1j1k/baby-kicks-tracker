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
          :style="{ left: `${(index / (timestamps.length - 1)) * 100}%` }"
          class="absolute top-1 -translate-x-1/2 text-gray-500 text-xs"
        >
          {{ time }}
        </div>
      </div>

      <!-- Foot Icons -->
    <div 
      v-for="(kick, index) in kicks" 
      :key="index" 
      :style="{ left: `${kick.position}%` }"
      class="absolute top-0 -translate-y-1/2"
    >
      <UIcon name="mingcute:foot-fill" class="w-7 h-7 text-blue-950" />
    </div>
    </div>
  </template>
  
  <script setup lang="ts">
  const timestamps = [
    "12 AM",
    // "3 AM",
    "6 AM",
    // "9 AM",
    "12 PM",
    // "3 PM",
    "6 PM",
    // "9 PM",
    "12 AM",
  ];

  // TODO take kicks data as a param
  // Example kicks data (positions are percentages along the timeline)
const kicks = [
  { time: "7:15 AM", position: 30 }, // Example: 30% along the timeline
  { time: "2:45 PM", position: 70 },
];
  </script>
  