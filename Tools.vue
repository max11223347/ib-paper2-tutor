<template>
  <div class="tools">
    <header class="page-header">
      <h2>🔧 写作辅助工具</h2>
      <p>提升写作效率，贴合IB评分标准</p>
    </header>

    <section class="tools-tabs">
      <button
        v-for="tool in toolList"
        :key="tool.id"
        :class="['tool-tab', { active: activeTool === tool.id }]"
        @click="activeTool = tool.id"
      >
        {{ tool.icon }} {{ tool.name }}
      </button>
    </section>

    <section class="tool-content">
      <div v-if="activeTool === 'citation'" class="citation-tool card">
        <h3>📖 文本引用格式生成</h3>
        <p class="tool-description">按IB MLA格式要求生成规范引用</p>
        <div class="citation-form">
          <div class="form-group">
            <label>作者姓名</label>
            <input v-model="citation.author" placeholder="例如：张三" />
          </div>
          <div class="form-group">
            <label>作品名称</label>
            <input v-model="citation.workTitle" placeholder="例如：《故乡》" />
          </div>
          <div class="form-group">
            <label>出版物信息</label>
            <input v-model="citation.publisher" placeholder="例如：人民文学出版社" />
          </div>
          <div class="form-group">
            <label>出版年份</label>
            <input v-model="citation.year" placeholder="例如：1921" />
          </div>
          <div class="form-group">
            <label>页码（可选）</label>
            <input v-model="citation.page" placeholder="例如：23" />
          </div>
          <button @click="generateCitation" class="btn btn-primary">生成引用</button>
        </div>
        <div v-if="citationResult" class="citation-result">
          <h4>生成结果：</h4>
          <div class="result-box">
            <p>{{ citationResult }}</p>
            <button @click="copyCitation" class="btn btn-secondary btn-small">复制</button>
          </div>
        </div>
      </div>

      <div v-if="activeTool === 'thesis'" class="thesis-tool card">
        <h3>💡 论点检查工具</h3>
        <p class="tool-description">检查你的Thesis Statement是否明确、贴合题干、有对比/分析角度</p>
        <div class="thesis-form">
          <div class="form-group">
            <label>你的Thesis Statement</label>
            <textarea
              v-model="thesisStatement"
              placeholder="在这里输入你的thesis statement..."
              rows="4"
            ></textarea>
          </div>
          <div class="form-group">
            <label>题目要求（可选）</label>
            <textarea
              v-model="questionContext"
              placeholder="在这里粘贴题目要求（如果有的话）..."
              rows="3"
            ></textarea>
          </div>
          <button @click="checkThesis" class="btn btn-primary">检查论点</button>
        </div>
        <div v-if="thesisFeedback" class="thesis-feedback">
          <h4>检查结果：</h4>
          <div class="feedback-item">
            <span class="feedback-icon">{{ thesisFeedback.clarity.score >= 3 ? '✅' : '⚠️' }}</span>
            <div>
              <strong>明确性</strong>
              <p>{{ thesisFeedback.clarity.comment }}</p>
              <p class="score">得分：{{ thesisFeedback.clarity.score }}/5</p>
            </div>
          </div>
          <div class="feedback-item">
            <span class="feedback-icon">{{ thesisFeedback.relevance.score >= 3 ? '✅' : '⚠️' }}</span>
            <div>
              <strong>贴合度</strong>
              <p>{{ thesisFeedback.relevance.comment }}</p>
              <p class="score">得分：{{ thesisFeedback.relevance.score }}/5</p>
            </div>
          </div>
          <div class="feedback-item">
            <span class="feedback-icon">{{ thesisFeedback.analysis.score >= 3 ? '✅' : '⚠️' }}</span>
            <div>
              <strong>分析角度</strong>
              <p>{{ thesisFeedback.analysis.comment }}</p>
              <p class="score">得分：{{ thesisFeedback.analysis.score }}/5</p>
            </div>
          </div>
          <div class="overall-score">
            <strong>总分：{{ thesisFeedback.total }}/15</strong>
          </div>
          <div class="suggestions" v-if="thesisFeedback.suggestions.length > 0">
            <h5>改进建议：</h5>
            <ul>
              <li v-for="(suggestion, idx) in thesisFeedback.suggestions" :key="idx">
                {{ suggestion }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div v-if="activeTool === 'checklist'" class="checklist-tool card">
        <h3>📋 IB评分标准自查表</h3>
        <p class="tool-description">对照Paper2五项评分标准检查你的论文</p>

        <div class="criteria-sections">
          <div
            v-for="(criteria, key) in ibCriteria"
            :key="key"
            class="criteria-section"
          >
            <h4>{{ criteria.nameCn }} - {{ criteria.name }}</h4>
            <p class="criteria-desc">{{ criteria.description }}</p>
            <div class="checklist-items">
              <div
                v-for="(item, idx) in criteria.checklist"
                :key="idx"
                class="checklist-item"
              >
                <input
                  type="checkbox"
                  v-model="checklistStatus[key][idx]"
                  :id="`${key}-${idx}`"
                />
                <label :for="`${key}-${idx}`">{{ item }}</label>
              </div>
            </div>
            <div class="criteria-progress">
              <div class="progress-bar">
                <div
                  class="progress-fill"
                  :style="{ width: getProgress(checklistStatus[key]) + '%' }"
                ></div>
              </div>
              <span>{{ Math.round(getProgress(checklistStatus[key])) }}% 完成</span>
            </div>
          </div>
        </div>

        <div class="overall-progress">
          <h4>总体完成度</h4>
          <div class="progress-bar large">
            <div class="progress-fill" :style="{ width: overallProgress + '%' }"></div>
          </div>
          <span>{{ Math.round(overallProgress) }}%</span>
        </div>
      </div>

      <div v-if="activeTool === 'timer'" class="timer-tool card">
        <h3>⏱️ 写作计时器</h3>
        <p class="tool-description">模拟IB Paper2考试时间（90分钟）</p>
        <div class="timer-display">
          <div class="time-remaining">
            {{ formatTime(timeRemaining) }}
          </div>
          <div class="timer-controls">
            <button
              v-if="!timerRunning"
              @click="startTimer"
              class="btn btn-primary"
            >
              开始计时
            </button>
            <button
              v-if="timerRunning"
              @click="pauseTimer"
              class="btn btn-secondary"
            >
              暂停
            </button>
            <button @click="resetTimer" class="btn btn-secondary">
              重置
            </button>
          </div>
        </div>
        <div class="timer-presets">
          <h4>预设时间：</h4>
          <div class="preset-buttons">
            <button
              v-for="preset in timerPresets"
              :key="preset.minutes"
              @click="setTimer(preset.minutes)"
              class="btn btn-secondary"
            >
              {{ preset.label }}
            </button>
          </div>
        </div>
        <div v-if="showTimerAlert" class="timer-alert">
          <span v-if="timeRemaining === 0">⏰ 时间到！</span>
          <span v-else-if="timeRemaining <= 300">⚠️ 还剩5分钟！</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { ibCriteria } from '@/data/outlineTemplates'

const activeTool = ref('citation')

const toolList = [
  { id: 'citation', name: '引用格式', icon: '📖' },
  { id: 'thesis', name: '论点检查', icon: '💡' },
  { id: 'checklist', name: '评分自查', icon: '📋' },
  { id: 'timer', name: '写作计时', icon: '⏱️' }
]

const citation = reactive({
  author: '',
  workTitle: '',
  publisher: '',
  year: '',
  page: ''
})
const citationResult = ref('')

const thesisStatement = ref('')
const questionContext = ref('')
const thesisFeedback = ref(null)

const checklistStatus = reactive({
  A: [],
  B: [],
  C: [],
  D: [],
  E: []
})

Object.keys(ibCriteria).forEach(key => {
  checklistStatus[key] = new Array(ibCriteria[key].checklist.length).fill(false)
})

const timeRemaining = ref(90 * 60)
const timerRunning = ref(false)
let timerInterval = null
const showTimerAlert = ref(false)

const timerPresets = [
  { minutes: 30, label: '30分钟' },
  { minutes: 60, label: '60分钟' },
  { minutes: 90, label: '90分钟' },
  { minutes: 120, label: '120分钟' }
]

const overallProgress = computed(() => {
  const allValues = Object.values(checklistStatus).flat()
  const checkedCount = allValues.filter(v => v).length
  return (checkedCount / allValues.length) * 100
})

const generateCitation = () => {
  if (!citation.author || !citation.workTitle) {
    alert('请至少填写作者和作品名称')
    return
  }

  let result = `${citation.author}. `

  if (citation.workTitle) {
    result += `*${citation.workTitle}*. `
  }
  if (citation.publisher) {
    result += `${citation.publisher}, `
  }
  if (citation.year) {
    result += `${citation.year}`
  }
  if (citation.page) {
    result += `, p. ${citation.page}`
  }
  result += '.'

  citationResult.value = result
}

const copyCitation = async () => {
  if (citationResult.value) {
    try {
      await navigator.clipboard.writeText(citationResult.value)
    } catch (err) {
      console.error('复制失败:', err)
    }
  }
}

const checkThesis = () => {
  if (!thesisStatement.value.trim()) {
    alert('请输入thesis statement')
    return
  }

  const thesis = thesisStatement.value.trim()
  const hasQuestion = questionContext.value.trim()

  let clarityScore = 3
  let clarityComment = 'Thesis基本明确'

  if (thesis.length < 20) {
    clarityScore = 1
    clarityComment = 'Thesis过于简短，建议增加更多细节来明确你的论点'
  } else if (thesis.length < 50) {
    clarityScore = 2
    clarityComment = 'Thesis可以更具体一些，明确说明你的核心观点'
  } else if (thesis.split('但').length > 1 || thesis.split('然而').length > 1 || thesis.split('虽然').length > 1) {
    clarityScore = 5
    clarityComment = 'Thesis包含对比维度，分析角度清晰'
  }

  let relevanceScore = 3
  let relevanceComment = 'Thesis与题目有一定关联'

  if (hasQuestion) {
    const thesisLower = thesis.toLowerCase()
    const questionLower = hasQuestion.toLowerCase()
    const sharedWords = thesisLower.split(/\s+/).filter(word => questionLower.includes(word))
    if (sharedWords.length > 3) {
      relevanceScore = 5
      relevanceComment = 'Thesis紧密贴合题目要求'
    }
  }

  let analysisScore = 2
  let analysisComment = 'Thesis分析角度可以加强'

  const hasAnalysisMarkers = thesis.includes('通过') || thesis.includes('揭示') || thesis.includes('呈现') || thesis.includes('反映')
  const hasContrast = thesis.includes('但') || thesis.includes('然而') || thesis.includes('相比')
  const hasInterpretation = thesis.includes('表明') || thesis.includes('说明') || thesis.includes('意味着')

  if (hasAnalysisMarkers && hasContrast) {
    analysisScore = 5
    analysisComment = 'Thesis包含对比和分析角度，非常好'
  } else if (hasAnalysisMarkers || hasContrast) {
    analysisScore = 4
    analysisComment = 'Thesis包含一定的分析角度'
  }

  const suggestions = []
  if (clarityScore < 4) {
    suggestions.push('建议在Thesis中明确说明两篇文本的对比角度')
  }
  if (relevanceScore < 4 && hasQuestion) {
    suggestions.push('尝试使用题目中的关键词来增强相关性')
  }
  if (analysisScore < 4) {
    suggestions.push('考虑加入"通过...揭示/呈现..."等分析性表述')
  }
  if (!hasContrast) {
    suggestions.push('Paper2需要对比分析，建议Thesis包含对比关系（如"但"、"然而"）')
  }

  thesisFeedback.value = {
    clarity: { score: clarityScore, comment: clarityComment },
    relevance: { score: relevanceScore, comment: relevanceComment },
    analysis: { score: analysisScore, comment: analysisComment },
    total: clarityScore + relevanceScore + analysisScore,
    suggestions
  }
}

const getProgress = (items) => {
  const checked = items.filter(v => v).length
  return (checked / items.length) * 100
}

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const startTimer = () => {
  if (timerRunning.value) return
  timerRunning.value = true
  showTimerAlert.value = false
  timerInterval = setInterval(() => {
    if (timeRemaining.value > 0) {
      timeRemaining.value--
      if (timeRemaining.value === 300) {
        showTimerAlert.value = true
      }
    } else {
      pauseTimer()
      showTimerAlert.value = true
    }
  }, 1000)
}

const pauseTimer = () => {
  timerRunning.value = false
  clearInterval(timerInterval)
}

const resetTimer = () => {
  pauseTimer()
  timeRemaining.value = 90 * 60
  showTimerAlert.value = false
}

const setTimer = (minutes) => {
  resetTimer()
  timeRemaining.value = minutes * 60
}
</script>

<style scoped>
.tools {
  padding: 1rem 0;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h2 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.page-header p {
  color: var(--text-secondary);
}

.tools-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.tool-tab {
  padding: 0.75rem 1.5rem;
  border: 1px solid var(--border-color);
  background-color: var(--bg-card);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1rem;
}

.tool-tab:hover {
  background-color: var(--bg-primary);
}

.tool-tab.active {
  background-color: var(--accent-color);
  color: white;
  border-color: var(--accent-color);
}

.tool-content {
  max-width: 800px;
}

.tool-description {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

.citation-form,
.thesis-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
}

.citation-result {
  margin-top: 2rem;
}

.result-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #e8f4f8;
  border-radius: 8px;
  margin-top: 0.5rem;
}

#app.dark-mode .result-box {
  background-color: #1a4a6e;
}

.result-box p {
  margin: 0;
}

.btn-small {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

.thesis-feedback {
  margin-top: 2rem;
  padding: 1.5rem;
  background-color: var(--bg-primary);
  border-radius: 8px;
}

.feedback-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: var(--bg-card);
  border-radius: 8px;
}

.feedback-icon {
  font-size: 1.5rem;
}

.feedback-item strong {
  display: block;
  margin-bottom: 0.25rem;
}

.feedback-item p {
  margin: 0.25rem 0;
  color: var(--text-secondary);
}

.feedback-item .score {
  color: var(--accent-color);
  font-weight: bold;
}

.overall-score {
  text-align: center;
  padding: 1rem;
  background-color: var(--accent-color);
  color: white;
  border-radius: 8px;
  font-size: 1.2rem;
}

.suggestions {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #fef9e7;
  border-radius: 8px;
}

#app.dark-mode .suggestions {
  background-color: #3d3520;
}

.suggestions h5 {
  margin-bottom: 0.5rem;
}

.suggestions ul {
  padding-left: 1.5rem;
}

.criteria-sections {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.criteria-section {
  padding: 1rem;
  background-color: var(--bg-primary);
  border-radius: 8px;
}

.criteria-section h4 {
  font-size: 1rem;
  color: var(--accent-color);
  margin-bottom: 0.5rem;
}

.criteria-desc {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.checklist-items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.checklist-item {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.checklist-item input[type="checkbox"] {
  width: auto;
  margin-top: 0.25rem;
}

.checklist-item label {
  font-size: 0.95rem;
  line-height: 1.4;
}

.criteria-progress {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background-color: #ddd;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: var(--accent-color);
  transition: width 0.3s;
}

.overall-progress {
  margin-top: 2rem;
  padding: 1.5rem;
  background-color: var(--bg-card);
  border-radius: 8px;
  text-align: center;
}

.overall-progress h4 {
  margin-bottom: 1rem;
}

.progress-bar.large {
  height: 12px;
  margin-bottom: 0.5rem;
}

.timer-display {
  text-align: center;
  padding: 2rem;
  background-color: var(--bg-primary);
  border-radius: 12px;
  margin-bottom: 2rem;
}

.time-remaining {
  font-size: 4rem;
  font-weight: bold;
  font-family: 'Courier New', monospace;
  color: var(--accent-color);
  margin-bottom: 1.5rem;
}

.timer-controls {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.timer-presets h4 {
  margin-bottom: 1rem;
  text-align: center;
}

.preset-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.timer-alert {
  margin-top: 1rem;
  padding: 1rem;
  text-align: center;
  font-size: 1.2rem;
  font-weight: bold;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0.5; }
}
</style>
