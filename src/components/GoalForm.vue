<template>
  <div class="card border-0 shadow-sm mb-4">
    <div class="card-header bg-light border-0">
      <h5 class="card-title mb-0">
        <i class="bi bi-plus-circle me-2 text-primary"></i>
        {{ editingGoal ? 'Edit Goal' : 'Create New Goal' }}
      </h5>
    </div>
    <div class="card-body">
      <form @submit.prevent="handleSubmit">
        <div class="row">
          <div class="col-md-8">
            <div class="mb-3">
              <label for="title" class="form-label fw-semibold">Goal Title</label>
              <input
                type="text"
                class="form-control"
                id="title"
                v-model="form.title"
                placeholder="e.g., Study English daily"
                required
              />
            </div>
            
            <div class="mb-3">
              <label for="description" class="form-label fw-semibold">Description</label>
              <textarea
                class="form-control"
                id="description"
                v-model="form.description"
                placeholder="Describe your goal and what you want to achieve..."
                rows="3"
              ></textarea>
            </div>
          </div>
          
          <div class="col-md-4">
            <div class="mb-3">
              <label for="category" class="form-label fw-semibold">Category</label>
              <select class="form-select" id="category" v-model="form.category" required>
                <option value="">Select category</option>
                <option value="Learning">Learning</option>
                <option value="Health">Health</option>
                <option value="Fitness">Fitness</option>
                <option value="Habits">Habits</option>
                <option value="Skills">Skills</option>
                <option value="Personal">Personal</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div class="mb-3">
              <label for="targetDays" class="form-label fw-semibold">Target Days</label>
              <input
                type="number"
                class="form-control"
                id="targetDays"
                v-model.number="form.targetDays"
                min="1"
                max="365"
                required
              />
            </div>
            
            <div class="mb-3">
              <label for="priority" class="form-label fw-semibold">Priority</label>
              <select class="form-select" id="priority" v-model="form.priority" required>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
        </div>
        
        <div class="d-flex gap-2">
          <button type="submit" class="btn btn-primary">
            <i class="bi bi-check-lg me-1"></i>
            {{ editingGoal ? 'Update Goal' : 'Create Goal' }}
          </button>
          <button
            type="button"
            class="btn btn-outline-secondary"
            @click="resetForm"
            v-if="editingGoal"
          >
            <i class="bi bi-x-lg me-1"></i>
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';
import type { Goal } from '../types/Goal';

const props = defineProps<{
  editingGoal?: Goal | null;
}>();

const emit = defineEmits<{
  submit: [goal: Omit<Goal, 'id' | 'createdAt' | 'progress' | 'isCompleted'>];
  cancel: [];
}>();

const form = reactive({
  title: '',
  description: '',
  category: '',
  targetDays: 30,
  priority: 'medium' as 'low' | 'medium' | 'high'
});

const resetForm = () => {
  form.title = '';
  form.description = '';
  form.category = '';
  form.targetDays = 30;
  form.priority = 'medium';
  emit('cancel');
};

watch(() => props.editingGoal, (newGoal) => {
  if (newGoal) {
    form.title = newGoal.title;
    form.description = newGoal.description;
    form.category = newGoal.category;
    form.targetDays = newGoal.targetDays;
    form.priority = newGoal.priority;
  } else {
    resetForm();
  }
}, { immediate: true });

const handleSubmit = () => {
  emit('submit', { ...form });
  if (!props.editingGoal) {
    resetForm();
  }
};
</script>