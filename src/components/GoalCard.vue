<template>
  <div class="card h-100 border-0 shadow-sm goal-card" :class="priorityClass">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-start mb-3">
        <div>
          <h5 class="card-title mb-1">{{ goal.title }}</h5>
          <div class="d-flex gap-2 mb-2">
            <span class="badge bg-light text-dark">{{ goal.category }}</span>
            <span class="badge" :class="priorityBadgeClass">{{ goal.priority }}</span>
            <span class="badge bg-success" v-if="goal.isCompleted">
              <i class="bi bi-check-lg me-1"></i>Completed
            </span>
          </div>
        </div>
        <div class="dropdown">
          <button
            class="btn btn-sm btn-outline-secondary dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
          >
            <i class="bi bi-three-dots"></i>
          </button>
          <ul class="dropdown-menu">
            <li>
              <a class="dropdown-item" href="#" @click.prevent="$emit('edit', goal)">
                <i class="bi bi-pencil me-2"></i>Edit
              </a>
            </li>
            <li>
              <a class="dropdown-item text-danger" href="#" @click.prevent="$emit('delete', goal.id)">
                <i class="bi bi-trash me-2"></i>Delete
              </a>
            </li>
          </ul>
        </div>
      </div>
      
      <p class="card-text text-muted small mb-3" v-if="goal.description">
        {{ goal.description }}
      </p>
      
      <div class="mb-3">
        <div class="d-flex justify-content-between mb-2">
          <span class="small fw-semibold">Progress</span>
          <span class="small">{{ progress?.completedDays }}/{{ progress?.totalDays }} days</span>
        </div>
        <div class="progress" style="height: 8px;">
          <div
            class="progress-bar"
            :class="progressBarClass"
            :style="{ width: progress?.progressPercentage + '%' }"
          ></div>
        </div>
      </div>
      
      <div class="row text-center">
        <div class="col-4">
          <div class="small text-muted">Streak</div>
          <div class="fw-bold">{{ progress?.currentStreak || 0 }}</div>
        </div>
        <div class="col-4">
          <div class="small text-muted">Remaining</div>
          <div class="fw-bold">{{ Math.max(0, (progress?.totalDays || 0) - (progress?.completedDays || 0)) }}</div>
        </div>
        <div class="col-4">
          <div class="small text-muted">Completion</div>
          <div class="fw-bold">{{ Math.round(progress?.progressPercentage || 0) }}%</div>
        </div>
      </div>
    </div>
    
    <div class="card-footer bg-transparent border-0 pt-0">
      <div class="d-flex gap-2">
        <button
          class="btn btn-sm flex-fill"
          :class="progress?.isCompletedToday ? 'btn-success' : 'btn-outline-primary'"
          @click="toggleTodayProgress"
          :disabled="goal.isCompleted"
        >
          <i class="bi" :class="progress?.isCompletedToday ? 'bi-check-circle-fill' : 'bi-circle'"></i>
          {{ progress?.isCompletedToday ? 'Completed Today' : 'Mark as Done' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { format } from 'date-fns';
import type { Goal } from '../types/Goal';

const props = defineProps<{
  goal: Goal;
  progress: {
    completedDays: number;
    totalDays: number;
    progressPercentage: number;
    currentStreak: number;
    isCompletedToday: boolean;
  } | null;
}>();

const emit = defineEmits<{
  edit: [goal: Goal];
  delete: [goalId: string];
  toggleDay: [goalId: string, date: string, completed: boolean];
}>();

const priorityClass = computed(() => {
  switch (props.goal.priority) {
    case 'high': return 'border-danger border-2';
    case 'medium': return 'border-warning border-2';
    default: return '';
  }
});

const priorityBadgeClass = computed(() => {
  switch (props.goal.priority) {
    case 'high': return 'bg-danger';
    case 'medium': return 'bg-warning';
    default: return 'bg-secondary';
  }
});

const progressBarClass = computed(() => {
  if (props.goal.isCompleted) return 'bg-success';
  if ((props.progress?.progressPercentage || 0) > 75) return 'bg-success';
  if ((props.progress?.progressPercentage || 0) > 50) return 'bg-warning';
  return 'bg-primary';
});

const toggleTodayProgress = () => {
  const today = format(new Date(), 'yyyy-MM-dd');
  const isCompleted = props.progress?.isCompletedToday || false;
  emit('toggleDay', props.goal.id, today, !isCompleted);
};
</script>

<style scoped>
.goal-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.goal-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}
</style>