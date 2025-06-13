<template>
  <div class="app">
    <Header :stats="stats" />
    
    <main class="container">
      <GoalForm
        :editing-goal="editingGoal"
        @submit="handleGoalSubmit"
        @cancel="editingGoal = null"
      />
      
      <ProgressChart
        :goals="goals"
        :stats="stats"
        class="mb-4"
        v-if="goals.length > 0"
      />
      
      <div class="row" v-if="goals.length > 0">
        <div class="col-12 mb-3">
          <div class="d-flex justify-content-between align-items-center">
            <h4 class="mb-0">Your Goals</h4>
            <div class="btn-group" role="group">
              <input type="radio" class="btn-check" name="filter" id="all" value="all" v-model="filter" />
              <label class="btn btn-outline-primary" for="all">All</label>
              
              <input type="radio" class="btn-check" name="filter" id="active" value="active" v-model="filter" />
              <label class="btn btn-outline-primary" for="active">Active</label>
              
              <input type="radio" class="btn-check" name="filter" id="completed" value="completed" v-model="filter" />
              <label class="btn btn-outline-primary" for="completed">Completed</label>
            </div>
          </div>
        </div>
      </div>
      
      <div class="row" v-if="filteredGoals.length > 0">
        <div class="col-md-6 col-lg-4 mb-4" v-for="goal in filteredGoals" :key="goal.id">
          <GoalCard
            :goal="goal"
            :progress="getGoalProgress(goal.id)"
            @edit="editGoal"
            @delete="deleteGoal"
            @toggle-day="markDayComplete"
          />
        </div>
      </div>
      
      <div class="text-center py-5" v-else-if="goals.length === 0">
        <div class="empty-state">
          <i class="bi bi-target display-1 text-muted mb-3"></i>
          <h3 class="text-muted">No goals yet</h3>
          <p class="text-muted">Create your first goal to start tracking your personal development journey!</p>
        </div>
      </div>
      
      <div class="text-center py-3" v-else>
        <p class="text-muted">No goals match the current filter.</p>
      </div>
    </main>
    
    <footer class="bg-light py-4 mt-5">
      <div class="container text-center">
        <p class="text-muted mb-0">
          <i class="bi bi-heart-fill text-danger me-1"></i>
          Built with Uplify - Track your progress, achieve your goals
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useGoals } from './composables/useGoals';
import Header from './components/Header.vue';
import GoalForm from './components/GoalForm.vue';
import GoalCard from './components/GoalCard.vue';
import ProgressChart from './components/ProgressChart.vue';
import type { Goal } from './types/Goal';

const {
  goals,
  addGoal,
  updateGoal,
  deleteGoal: removeGoal,
  markDayComplete,
  getGoalProgress,
  stats
} = useGoals();

const editingGoal = ref<Goal | null>(null);
const filter = ref<'all' | 'active' | 'completed'>('all');

const filteredGoals = computed(() => {
  switch (filter.value) {
    case 'active':
      return goals.value.filter(g => !g.isCompleted);
    case 'completed':
      return goals.value.filter(g => g.isCompleted);
    default:
      return goals.value;
  }
});

const handleGoalSubmit = (goalData: Omit<Goal, 'id' | 'createdAt' | 'progress' | 'isCompleted'>) => {
  if (editingGoal.value) {
    updateGoal(editingGoal.value.id, goalData);
    editingGoal.value = null;
  } else {
    addGoal(goalData);
  }
};

const editGoal = (goal: Goal) => {
  editingGoal.value = goal;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const deleteGoal = (goalId: string) => {
  if (confirm('Are you sure you want to delete this goal? This action cannot be undone.')) {
    removeGoal(goalId);
    if (editingGoal.value?.id === goalId) {
      editingGoal.value = null;
    }
  }
};
</script>

<style scoped>
.app {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.empty-state {
  max-width: 400px;
  margin: 0 auto;
}
</style>