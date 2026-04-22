<template>
  <div class="question-bank">
    <header class="page-header">
      <h2>📚 Paper2 题库</h2>
      <p>浏览近10-15年IB语文Paper2真实考试题目，按分类筛选</p>
    </header>

    <section class="filters">
      <div class="filter-group">
        <label>文本类型</label>
        <select v-model="filters.textType">
          <option value="">全部</option>
          <option value="小说">小说</option>
          <option value="诗歌">诗歌</option>
          <option value="戏剧">戏剧</option>
          <option value="散文">散文</option>
        </select>
      </div>
      <div class="filter-group">
        <label>主题</label>
        <select v-model="filters.theme">
          <option value="">全部</option>
          <option value="身份认同">身份认同</option>
          <option value="文化冲突">文化冲突</option>
          <option value="权力与压迫">权力与压迫</option>
          <option value="爱与失落">爱与失落</option>
          <option value="自由与束缚">自由与束缚</option>
          <option value="社会批判">社会批判</option>
          <option value="传统与现代">传统与现代</option>
          <option value="孤独与隔阂">孤独与隔阂</option>
        </select>
      </div>
      <div class="filter-group">
        <label>搜索</label>
        <input
          type="text"
          v-model="filters.search"
          placeholder="输入关键词搜索..."
        />
      </div>
      <button @click="resetFilters" class="btn btn-secondary">重置筛选</button>
    </section>

    <section class="questions-list">
      <div
        v-for="q in filteredQuestions"
        :key="q.id"
        class="question-card card"
        @click="selectQuestion(q)"
      >
        <div class="question-header">
          <div class="question-meta">
            <span class="badge" :class="getDifficultyClass(q.difficulty)">
              {{ getDifficultyLabel(q.difficulty) }}
            </span>
            <span class="year-tag">{{ q.year }} {{ q.month }}</span>
            <span class="category-tag">{{ q.category }}</span>
          </div>
          <div class="question-tags">
            <span class="tag tag-theme">{{ q.theme }}</span>
            <span class="tag tag-text-type">{{ q.textType }}</span>
          </div>
        </div>
        <div class="question-content">
          <p class="question-text">{{ q.question }}</p>
          <div class="question-texts">
            <strong>涉及文本：</strong>
            <span v-for="(text, idx) in q.texts" :key="idx">
              {{ text }}<span v-if="idx < q.texts.length - 1"> / </span>
            </span>
          </div>
        </div>
        <div class="question-actions">
          <button class="btn btn-primary" @click.stop="selectQuestion(q)">
            查看详情
          </button>
        </div>
      </div>

      <div v-if="filteredQuestions.length === 0" class="no-results">
        <p>没有找到符合条件的题目</p>
        <button @click="resetFilters" class="btn btn-secondary">重置筛选</button>
      </div>
    </section>

    <div v-if="selectedQuestion" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>题目详情</h3>
          <button class="close-btn" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <div class="detail-section">
            <h4>题目</h4>
            <p class="question-text">{{ selectedQuestion.question }}</p>
          </div>
          <div class="detail-section">
            <h4>涉及文本</h4>
            <ul>
              <li v-for="(text, idx) in selectedQuestion.texts" :key="idx">{{ text }}</li>
            </ul>
            <div class="text-source-info">
              <p class="text-source-label">引用文献：</p>
              <p v-if="selectedQuestion.luXunText" class="text-source">
                <strong>鲁迅：</strong>{{ selectedQuestion.luXunText }}
              </p>
              <p v-if="selectedQuestion.zhangAiLingText" class="text-source">
                <strong>张爱玲：</strong>{{ selectedQuestion.zhangAiLingText }}
              </p>
            </div>
          </div>
          <div class="detail-section">
            <h4>审题解析</h4>
            <p>{{ selectedQuestion.analysis }}</p>
          </div>
          <div class="detail-section">
            <h4>推荐大纲类型</h4>
            <span class="tag tag-theme">{{ selectedQuestion.outlineType }}</span>
          </div>
          <div class="detail-section">
            <h4>相关范文</h4>
            <div class="sample-essays">
              <div
                v-for="essay in getEssaysForQuestion(selectedQuestion.id)"
                :key="essay.id"
                class="essay-item"
              >
                <div class="essay-header">
                  <span class="score" :class="getScoreClass(essay.score)">
                    {{ essay.score }}分
                  </span>
                  <button
                    class="btn btn-secondary btn-small"
                    @click="viewEssay(essay)"
                  >
                    查看范文
                  </button>
                </div>
                <div class="score-breakdown">
                  <span v-for="(score, criterion) in essay.scoreBreakdown" :key="criterion">
                    {{ criterion }}:{{ score }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <router-link
            :to="`/outlines?type=${selectedQuestion.outlineType}`"
            class="btn btn-primary"
          >
            查看对应大纲
          </router-link>
          <button class="btn btn-secondary" @click="closeModal">关闭</button>
        </div>
      </div>
    </div>

    <div v-if="viewingEssay" class="modal-overlay" @click="closeEssayModal">
      <div class="modal-content essay-modal" @click.stop>
        <div class="modal-header">
          <h3>范文赏析 - {{ viewingEssay.score }}分</h3>
          <button class="close-btn" @click="closeEssayModal">×</button>
        </div>
        <div class="modal-body">
          <div class="essay-text-sources" v-if="viewingEssay.luXunText || viewingEssay.zhangAiLingText">
            <h4>引用文献</h4>
            <div class="source-item" v-if="viewingEssay.luXunText">
              <span class="source-author">鲁迅：</span>
              <span class="source-text">{{ viewingEssay.luXunText }}</span>
            </div>
            <div class="source-item" v-if="viewingEssay.zhangAiLingText">
              <span class="source-author">张爱玲：</span>
              <span class="source-text">{{ viewingEssay.zhangAiLingText }}</span>
            </div>
          </div>
          <div class="essay-score-breakdown">
            <h4>评分细节</h4>
            <div class="criteria-scores">
              <div v-for="(score, criterion) in viewingEssay.scoreBreakdown" :key="criterion" class="criteria-score">
                <span class="criteria-label">{{ criterion }}</span>
                <span class="criteria-value" :class="getScoreClass(score)">{{ score }}</span>
              </div>
            </div>
          </div>
          <div class="essay-thesis">
            <h4>Thesis Statement</h4>
            <p>{{ viewingEssay.thesis }}</p>
          </div>
          <div class="essay-content">
            <h4>全文内容</h4>
            <div class="content-with-annotations">
              <p v-for="(paragraph, idx) in viewingEssay.content.split('\n')" :key="idx" :class="{ 'annotated': hasAnnotation(idx, viewingEssay) }">
                {{ paragraph }}
                <span v-if="getAnnotation(idx, viewingEssay)" class="annotation-badge" :title="getAnnotation(idx, viewingEssay)">
                  💡
                </span>
              </p>
            </div>
          </div>
          <div class="essay-annotations" v-if="viewingEssay.annotations && viewingEssay.annotations.length > 0">
            <h4>标注说明</h4>
            <ul>
              <li v-for="(ann, idx) in viewingEssay.annotations" :key="idx">
                <strong>{{ ann.type }}:</strong> {{ ann.note }}
              </li>
            </ul>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeEssayModal">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { questionBank, luXunStories, zhangAiLingStories } from '@/data/questionBank'
import { sampleEssays } from '@/data/generatedEssays'

const filters = ref({
  textType: '',
  theme: '',
  search: ''
})

const selectedQuestion = ref(null)
const viewingEssay = ref(null)

const filteredQuestions = computed(() => {
  return questionBank.filter(q => {
    const matchTextType = !filters.value.textType || q.textType === filters.value.textType
    const matchTheme = !filters.value.theme || q.theme === filters.value.theme
    const matchSearch = !filters.value.search ||
      q.question.includes(filters.value.search) ||
      q.texts.some(t => t.includes(filters.value.search)) ||
      q.theme.includes(filters.value.search)
    return matchTextType && matchTheme && matchSearch
  })
})

const resetFilters = () => {
  filters.value = { textType: '', theme: '', search: '' }
}

const getDifficultyClass = (difficulty) => {
  return {
    high: 'badge-high',
    medium: 'badge-medium',
    low: 'badge-low'
  }[difficulty]
}

const getDifficultyLabel = (difficulty) => {
  return { high: '高难度', medium: '中等', low: '基础' }[difficulty]
}

const getScoreClass = (score) => {
  if (score >= 7) return 'score-7'
  if (score >= 5) return 'score-5-6'
  if (score >= 4) return 'score-4'
  return 'score-below-4'
}

const selectQuestion = (q) => {
  selectedQuestion.value = q
}

const closeModal = () => {
  selectedQuestion.value = null
}

const getEssaysForQuestion = (questionId) => {
  return sampleEssays.filter(e => e.questionId === questionId)
}

const viewEssay = (essay) => {
  viewingEssay.value = essay
}

const closeEssayModal = () => {
  viewingEssay.value = null
}

const hasAnnotation = (idx, essay) => {
  if (!essay.annotations) return false
  return essay.annotations.some(a => {
    if (a.position === '引言') return idx === 0
    if (a.position === '结论') return idx >= essay.content.split('\n').length - 2
    if (a.position === '主体段1') return idx >= 1 && idx <= 3
    if (a.position === '主体段2') return idx >= 4 && idx <= 6
    return false
  })
}

const getAnnotation = (idx, essay) => {
  if (!essay.annotations) return null
  const ann = essay.annotations.find(a => {
    if (a.position === '引言') return idx === 0
    if (a.position === '结论') return idx >= essay.content.split('\n').length - 2
    if (a.position === '主体段1') return idx >= 1 && idx <= 3
    if (a.position === '主体段2') return idx >= 4 && idx <= 6
    return false
  })
  return ann ? ann.note : null
}
</script>

<style scoped>
.question-bank {
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

.filters {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: var(--bg-card);
  border-radius: 8px;
}

.filter-group {
  flex: 1;
  min-width: 150px;
}

.filter-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.questions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.question-card {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.question-card:hover {
  transform: translateY(-2px);
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.question-meta {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.year-tag {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.category-tag {
  font-size: 0.85rem;
  padding: 0.2rem 0.5rem;
  background-color: #eee;
  border-radius: 4px;
  color: #666;
}

.question-tags {
  display: flex;
  gap: 0.5rem;
}

.question-content {
  margin-bottom: 1rem;
}

.question-text {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 0.5rem;
}

.question-texts {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.question-actions {
  display: flex;
  justify-content: flex-end;
}

.no-results {
  text-align: center;
  padding: 3rem;
  color: var(--text-secondary);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: var(--bg-card);
  border-radius: 12px;
  max-width: 700px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: var(--text-secondary);
}

.modal-body {
  padding: 1.5rem;
}

.detail-section {
  margin-bottom: 1.5rem;
}

.detail-section h4 {
  font-size: 1rem;
  color: var(--accent-color);
  margin-bottom: 0.5rem;
}

.detail-section ul {
  padding-left: 1.5rem;
}

.sample-essays {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.essay-item {
  padding: 1rem;
  background-color: var(--bg-primary);
  border-radius: 8px;
}

.essay-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.score {
  font-size: 1.2rem;
  font-weight: bold;
}

.score-breakdown {
  display: flex;
  gap: 1rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #eee;
}

.essay-modal {
  max-width: 900px;
}

.essay-score-breakdown {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: var(--bg-primary);
  border-radius: 8px;
}

.criteria-scores {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.criteria-score {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.criteria-label {
  font-weight: bold;
}

.essay-thesis {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #e8f4f8;
  border-left: 4px solid var(--accent-color);
  border-radius: 4px;
}

#app.dark-mode .essay-thesis {
  background-color: #1a4a6e;
}

.essay-content {
  margin-bottom: 1.5rem;
}

.content-with-annotations {
  background-color: var(--bg-primary);
  padding: 1rem;
  border-radius: 8px;
  font-size: 0.95rem;
  line-height: 1.8;
}

.content-with-annotations p {
  margin-bottom: 0.5rem;
}

.content-with-annotations p.annotated {
  background-color: #fffde7;
  padding: 0.5rem;
  border-radius: 4px;
}

#app.dark-mode .content-with-annotations p.annotated {
  background-color: #3d3d00;
}

.annotation-badge {
  cursor: help;
  margin-left: 0.5rem;
}

.essay-annotations ul {
  padding-left: 1.5rem;
}

.essay-annotations li {
  margin-bottom: 0.5rem;
}

.text-source-info {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #e8f4f8;
  border-radius: 8px;
  border-left: 4px solid #3498db;
}

#app.dark-mode .text-source-info {
  background-color: #1a4a6e;
}

.text-source-label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: var(--accent-color);
}

.text-source {
  margin: 0.25rem 0;
  font-size: 0.95rem;
}

.essay-text-sources {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #fef9e7;
  border-radius: 8px;
  border-left: 4px solid #f39c12;
}

#app.dark-mode .essay-text-sources {
  background-color: #3d3520;
}

.essay-text-sources h4 {
  margin-bottom: 0.75rem;
  color: #d35400;
}

.source-item {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.source-author {
  font-weight: bold;
  color: #c0392b;
}

#app.dark-mode .source-author {
  color: #e74c3c;
}

.source-text {
  color: var(--text-primary);
}

.btn-small {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}
</style>
