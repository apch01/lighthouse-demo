<script setup>
import { ref } from 'vue';
import UrlInput from './components/UrlInput.vue';
import ResultCard from './components/ResultCard.vue';

const results = ref([]);
const isAnalyzing = ref(false);
const error = ref('');

const analyzeUrls = async (urlList, selectedDevice) => {
  if (urlList.length === 0) {
    error.value = 'Please enter at least one URL';
    return;
  }

  isAnalyzing.value = true;
  error.value = '';
  results.value = [];

  try {
    const response = await fetch('http://localhost:3000/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ urls: urlList, selectedDevice: selectedDevice }),
    });

    if (!response.ok) throw new Error('Analysis failed');
    results.value = await response.json();
  } catch (e) {
    error.value = e.message;
  } finally {
    isAnalyzing.value = false;
  }
};
</script>

<template>
  <div class="container">
    <h1>Lighthouse Batch Analyzer</h1>
    <UrlInput 
      :isAnalyzing="isAnalyzing"
      @analyze="analyzeUrls"
    />
    
    <p v-if="error" class="error">{{ error }}</p>

    <div v-if="results.length" class="results">
      <h2>Results</h2>
      <ResultCard
        v-for="(result, index) in results"
        :key="index"
        :result="result"
      />
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.error {
  color: #dc2626;
  margin-top: 0.5rem;
}
</style>