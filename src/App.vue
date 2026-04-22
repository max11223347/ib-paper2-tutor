<template>
  <div id="app" :class="{ 'dark-mode': isDarkMode }">
    <nav class="main-nav">
      <div class="nav-brand">
        <h1>阿马做的妙妙工具</h1>
      </div>
      <div class="nav-links">
        <router-link to="/">首页</router-link>
        <router-link to="/question-bank">题库</router-link>
        <router-link to="/outlines">大纲</router-link>
        <router-link to="/tools">工具</router-link>
        <router-link to="/feedback">反馈</router-link>
      </div>
      <div class="nav-actions">
        <button @click="toggleDarkMode" class="theme-toggle">
          {{ isDarkMode ? '☀️' : '🌙' }}
        </button>
      </div>
    </nav>
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isDarkMode = ref(false)

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  localStorage.setItem('darkMode', isDarkMode.value)
}

onMounted(() => {
  const savedMode = localStorage.getItem('darkMode')
  if (savedMode === 'true') {
    isDarkMode.value = true
  }
})
</script>

<style scoped>
#app {
  min-height: 100vh;
  background-color: #f5f5f5;
  color: #333;
  transition: background-color 0.3s, color 0.3s;
}

#app.dark-mode {
  background-color: #1a1a2e;
  color: #eee;
}

.main-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background-color: #2c3e50;
  color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

#app.dark-mode .main-nav {
  background-color: #16213e;
}

.nav-brand h1 {
  font-size: 1.5rem;
  margin: 0;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-links a {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.nav-links a:hover {
  background-color: rgba(255,255,255,0.1);
}

.nav-links a.router-link-active {
  background-color: rgba(255,255,255,0.2);
}

.theme-toggle {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}
</style>
