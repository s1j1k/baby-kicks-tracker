<template>
  <!-- TIMELINE LINE -->
  <div class="relative">
    <!-- TODO ensure the timeline is broken clearly into 24 hours intervals -->
    <div class="bg-blue-400 rounded-lg h-3 mb-10">
    </div>
      <!-- Add data points -->
      <!-- TODO use a v-for -->
      <!-- TODO adjust the size/number of icons in a cluster based on the provided metadata (if any) -->

      <!-- TODO add timestamps for today -->

      <!-- TODO allow scrolling -->

      <!-- TODO add current time -->

      <!-- TODO make the timeline a circle? -->
       <!-- TODO look at other apps -->
    <!-- TODO use a library forr the timeline? -->

      <!-- TIMELINE icons -->
      <div class="absolute top-0 left-0 -translate-y-1/4">
        <UIcon name="mingcute:foot-fill" class="w-7 h-7 text-blue-950" />
      </div>

      <!-- TODO add times below -->
       <!-- NOTE can we just use relative to timeline to establish proper spacing? -->
       
    
  </div>
</template>

<script setup lang="ts">
const timestamps = ["12 AM", "3 AM", "6 AM", "9 AM", "12 PM", "3 PM", "6 PM", "9 PM", "12 AM"];

</script>
