<script setup>
import { ref } from 'vue';

const urls = ref('');
const selectedDevice = ref('desktop');
const emit = defineEmits(['analyze']);
const props = defineProps(['isAnalyzing'])

const handleSubmit = () => {
  const urlList = urls.value.split('\n').filter(url => url.trim());
  emit('analyze', urlList, selectedDevice.value);
};
</script>

<template>
  <div class="input-section">
    <label for="urls">Enter URLs (one per line):</label>
    <textarea
      id="urls"
      v-model="urls"
      rows="5"
      placeholder="https://example.com&#10;https://another-example.com"
      :disabled="$props.isAnalyzing"
    ></textarea>
    Form Factor : 
    <label class="radioButton">
      <input
        type="radio"
        value="desktop"
        v-model="selectedDevice"
        checked
      />
      Desktop
    </label>
    <label class="radioButton">
      <input
        type="radio"
        value="mobile"
        v-model="selectedDevice"
      />
      Mobile
    </label>
    <button @click="handleSubmit" :disabled="$props.isAnalyzing">
      {{ $props.isAnalyzing ? 'Analyzing...' : 'Analyze URLs' }}
    </button>
  </div>
</template>

<style scoped>
.input-section {
  margin-bottom: 2rem;
}

textarea {
  width: 100%;
  margin: 1rem 0;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  width: 100%;
  margin-top: 1rem;
}

.radioButton {
  cursor: pointer;
} 
</style>