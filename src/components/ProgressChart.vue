<template>
  <div class="card border-0 shadow-sm">
    <div class="card-header bg-light border-0">
      <h5 class="card-title mb-0">
        <i class="bi bi-graph-up me-2 text-primary"></i>
        Progress Analytics
      </h5>
    </div>
    <div class="card-body">
      <div class="row mb-4">
        <div class="col-md-6">
          <canvas ref="completionChart"></canvas>
        </div>
        <div class="col-md-6">
          <canvas ref="progressChart"></canvas>
        </div>
      </div>
      
      <div class="row text-center">
        <div class="col-6 col-md-3">
          <div class="stat-card p-3 rounded bg-light">
            <div class="h4 mb-0 text-primary fw-bold">{{ stats.totalGoals }}</div>
            <div class="small text-muted">Total Goals</div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="stat-card p-3 rounded bg-light">
            <div class="h4 mb-0 text-success fw-bold">{{ stats.completedGoals }}</div>
            <div class="small text-muted">Completed</div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="stat-card p-3 rounded bg-light">
            <div class="h4 mb-0 text-warning fw-bold">{{ stats.totalDaysTracked }}</div>
            <div class="small text-muted">Days Tracked</div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="stat-card p-3 rounded bg-light">
            <div class="h4 mb-0 text-info fw-bold">{{ stats.longestStreak }}</div>
            <div class="small text-muted">Longest Streak</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { Chart, registerables } from 'chart.js';
import type { Goal, GoalStats } from '../types/Goal';

Chart.register(...registerables);

const props = defineProps<{
  goals: Goal[];
  stats: GoalStats;
}>();

const completionChart = ref<HTMLCanvasElement>();
const progressChart = ref<HTMLCanvasElement>();

let completionChartInstance: Chart | null = null;
let progressChartInstance: Chart | null = null;

onMounted(() => {
  initCharts();
});

watch(() => [props.goals, props.stats], () => {
  updateCharts();
}, { deep: true });

const initCharts = () => {
  if (completionChart.value) {
    completionChartInstance = new Chart(completionChart.value, {
      type: 'doughnut',
      data: {
        labels: ['Completed', 'Active', 'Not Started'],
        datasets: [{
          data: [
            props.stats.completedGoals,
            props.stats.activeGoals,
            Math.max(0, props.stats.totalGoals - props.stats.completedGoals - props.stats.activeGoals)
          ],
          backgroundColor: [
            '#10B981',
            '#F59E0B',
            '#6B7280'
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true
            }
          },
          title: {
            display: true,
            text: 'Goal Completion Status'
          }
        }
      }
    });
  }

  if (progressChart.value) {
    const categoryData = getCategoryData();
    
    progressChartInstance = new Chart(progressChart.value, {
      type: 'bar',
      data: {
        labels: categoryData.labels,
        datasets: [{
          label: 'Average Progress (%)',
          data: categoryData.data,
          backgroundColor: '#4F46E5',
          borderColor: '#4F46E5',
          borderWidth: 1,
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Progress by Category'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: (value) => value + '%'
            }
          }
        }
      }
    });
  }
};

const updateCharts = () => {
  if (completionChartInstance) {
    completionChartInstance.data.datasets[0].data = [
      props.stats.completedGoals,
      props.stats.activeGoals,
      Math.max(0, props.stats.totalGoals - props.stats.completedGoals - props.stats.activeGoals)
    ];
    completionChartInstance.update();
  }

  if (progressChartInstance) {
    const categoryData = getCategoryData();
    progressChartInstance.data.labels = categoryData.labels;
    progressChartInstance.data.datasets[0].data = categoryData.data;
    progressChartInstance.update();
  }
};

const getCategoryData = () => {
  const categoryMap = new Map<string, { total: number, completed: number }>();
  
  props.goals.forEach(goal => {
    const existing = categoryMap.get(goal.category) || { total: 0, completed: 0 };
    const completedDays = goal.progress.filter(p => p.completed).length;
    const progressPercent = (completedDays / goal.targetDays) * 100;
    
    categoryMap.set(goal.category, {
      total: existing.total + 1,
      completed: existing.completed + progressPercent
    });
  });
  
  const labels: string[] = [];
  const data: number[] = [];
  
  categoryMap.forEach((value, key) => {
    labels.push(key);
    data.push(Math.round(value.completed / value.total));
  });
  
  return { labels, data };
};
</script>

<style scoped>
.stat-card {
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
}
</style>