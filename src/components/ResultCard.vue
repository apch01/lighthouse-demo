<script setup>
import { openViewer as openViewerAndSendData } from  'lighthouse/report/renderer/open-tab';

defineProps({
  result: {
    type: Object,
    required: true
  }
});

const getScoreClass = (score) => {
  if (score >= 90) return 'score-good';
  if (score >= 50) return 'score-average';
  return 'score-poor';
};
</script>

<template>
  <div class="result-card">
    <h3>{{ result.url }} - [<span style="text-transform: capitalize;">&nbsp;{{ result.selectedDevice }}&nbsp;</span>]</h3>
    <div v-if="result.success" class="scores">
      <div class="score">
        <span>Performance</span>
        <span :class="getScoreClass(result.scores.performance)">
          {{ Math.round(result.scores.performance) }}
        </span>
      </div>
      <div class="score">
        <span>Accessibility</span>
        <span :class="getScoreClass(result.scores.accessibility)">
          {{ Math.round(result.scores.accessibility) }}
        </span>
      </div>
      <div class="score">
        <span>SEO</span>
        <span :class="getScoreClass(result.scores.seo)">
          {{ Math.round(result.scores.seo) }}
        </span>
      </div>
      <div class="score">
        <span>Best Practices</span>
        <span :class="getScoreClass(result.scores.bestPractices)">
          {{ Math.round(result.scores.bestPractices) }}
        </span>
      </div>
    </div>
    <button @click="openViewerAndSendData(result.data.lhr)" v-if="result.success" style=" display:block; text-align:center; margin:1em auto 0;">View Full Report</button>
    <div v-else class="error">
      Error: {{ result.error }}
    </div>
  </div>
</template>

<style scoped>
.result-card {
  background: #f3f4f6;
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 8px;
}

.scores {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.score {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: white;
  border-radius: 4px;
}

.score-good {
  color: #059669;
}

.score-average {
  color: #d97706;
}

.score-poor {
  color: #dc2626;
}

.error {
  color: #dc2626;
}
</style>