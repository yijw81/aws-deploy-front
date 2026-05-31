<template>
  <div>
    <p class="text-xs text-gray-500 mb-1">{{ label }}</p>
    <a v-if="link && displayValue" :href="href || value" target="_blank" rel="noopener"
      class="text-sm text-orange-400 hover:text-orange-300 transition-colors break-all">
      {{ displayValue }}
    </a>
    <span v-else-if="displayValue" :class="mono ? 'font-mono text-xs' : 'text-sm'" class="text-gray-200 break-all">
      {{ displayValue }}
    </span>
    <span v-else class="text-sm text-gray-600 italic">Not set</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: String,
  value: String,
  link: Boolean,
  href: String,
  mono: Boolean,
})

const displayValue = computed(() => props.value || '')
</script>
