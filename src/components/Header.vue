<template>
  <header class="bg-primary text-white py-4 mb-4">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-md-6">
          <h1 class="h2 mb-0 fw-bold">
            <i class="bi bi-arrow-up-circle-fill me-2"></i>
            Uplify
          </h1>
          <p class="mb-0 opacity-75">Personal Development Tracker</p>
        </div>
        <div class="col-md-6 text-md-end">
          <div class="d-flex justify-content-md-end justify-content-start gap-4 mt-3 mt-md-0">
            <div class="text-center">
              <div class="h4 mb-0 fw-bold">{{ stats.activeGoals }}</div>
              <small class="opacity-75">Active Goals</small>
            </div>
            <div class="text-center">
              <div class="h4 mb-0 fw-bold">{{ stats.currentStreak }}</div>
              <small class="opacity-75">Current Streak</small>
            </div>
            <div class="text-center">
              <div class="h4 mb-0 fw-bold">{{ Math.round(stats.completionRate) }}%</div>
              <small class="opacity-75">Completion</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { GoalStats } from '../types/Goal';

defineProps<{
  stats: GoalStats;
}>();
</script>