<template>
  <div class="outlines">
    <header class="page-header">
      <h2>📝 写作大纲</h2>
      <p>按题目类型提供详细段落式大纲，贴合IB写作结构</p>
    </header>

    <section class="outline-types">
      <div class="type-tabs">
        <button
          v-for="type in outlineTypes"
          :key="type.id"
          :class="['type-tab', { active: selectedType === type.id }]"
          @click="selectedType = type.id"
        >
          {{ type.type }}
        </button>
      </div>
    </section>

    <section v-if="currentOutline" class="outline-detail">
      <div class="outline-description card">
        <p>{{ currentOutline.description }}</p>
        <div class="usage-note">
          <strong>适用场景：</strong>{{ currentOutline.usage }}
        </div>
      </div>

      <div class="outline-structure">
        <div class="introduction-section card">
          <h3>📖 {{ currentOutline.structure.introduction.title }}</h3>
          <div class="section-content">
            <h4>核心内容：</h4>
            <ul>
              <li v-for="(item, idx) in currentOutline.structure.introduction.content" :key="idx">
                {{ item }}
              </li>
            </ul>
            <div class="example-box">
              <h4>示例：</h4>
              <div class="example-item">
                <strong>背景：</strong>{{ currentOutline.structure.introduction.example.context }}
              </div>
              <div class="example-item">
                <strong>Thesis：</strong>{{ currentOutline.structure.introduction.example.thesis }}
              </div>
            </div>
          </div>
          <div class="action-buttons">
            <button class="btn btn-secondary" @click="copyToClipboard('intro')">
              复制引言模板
            </button>
          </div>
        </div>

        <div
          v-for="para in currentOutline.structure.bodyParagraphs"
          :key="para.number"
          class="body-paragraph card"
        >
          <h3>📄 主体段{{ para.number }}：{{ para.title }}</h3>
          <div class="section-content">
            <h4>聚焦维度：</h4>
            <p class="focus-text">{{ para.focus }}</p>

            <h4>核心内容：</h4>
            <ul>
              <li v-for="(item, idx) in para.content" :key="idx">
                {{ item }}
              </li>
            </ul>

            <div class="example-box">
              <h4>示例：</h4>
              <div class="example-item" v-if="para.example.dimension">
                <strong>对比维度：</strong>{{ para.example.dimension }}
              </div>
              <div class="example-item" v-if="para.example.textA">
                <strong>文本A：</strong>{{ para.example.textA }}
              </div>
              <div class="example-item" v-if="para.example.textB">
                <strong>文本B：</strong>{{ para.example.textB }}
              </div>
              <div class="example-item" v-if="para.example.analysis">
                <strong>分析：</strong>{{ para.example.analysis }}
              </div>
            </div>
          </div>
          <div class="action-buttons">
            <button class="btn btn-secondary" @click="copyToClipboard('body' + para.number)">
              复制本段模板
            </button>
          </div>
        </div>

        <div class="conclusion-section card">
          <h3>📝 {{ currentOutline.structure.conclusion.title }}</h3>
          <div class="section-content">
            <h4>核心内容：</h4>
            <ul>
              <li v-for="(item, idx) in currentOutline.structure.conclusion.content" :key="idx">
                {{ item }}
              </li>
            </ul>
            <div class="example-box">
              <h4>示例：</h4>
              <div class="example-item" v-if="currentOutline.structure.conclusion.example">
                <strong>总结：</strong>{{ currentOutline.structure.conclusion.example.summary }}
              </div>
              <div class="example-item" v-if="currentOutline.structure.conclusion.example">
                <strong>意义：</strong>{{ currentOutline.structure.conclusion.example.significance }}
              </div>
            </div>
          </div>
          <div class="action-buttons">
            <button class="btn btn-secondary" @click="copyToClipboard('conclusion')">
              复制结论模板
            </button>
          </div>
        </div>
      </div>

      <div class="copy-feedback" v-if="showCopyFeedback">
        模板已复制到剪贴板！
      </div>
    </section>

    <section class="vocabulary-section">
      <h3>💡 词汇句式库</h3>
      <div class="vocab-tabs">
        <button
          v-for="(vocab, theme) in vocabularyLibrary"
          :key="theme"
          :class="['vocab-tab', { active: selectedVocab === theme }]"
          @click="selectedVocab = theme"
        >
          {{ theme }}
        </button>
      </div>
      <div v-if="selectedVocab && vocabularyLibrary[selectedVocab]" class="vocab-content card">
        <div class="vocab-category">
          <h4>批判性词汇</h4>
          <div class="vocab-items">
            <span
              v-for="word in vocabularyLibrary[selectedVocab].critical"
              :key="word"
              class="vocab-item critical"
              @click="copyWord(word)"
            >
              {{ word }}
            </span>
          </div>
        </div>
        <div class="vocab-category">
          <h4>分析词汇</h4>
          <div class="vocab-items">
            <span
              v-for="word in vocabularyLibrary[selectedVocab].analysis"
              :key="word"
              class="vocab-item analysis"
              @click="copyWord(word)"
            >
              {{ word }}
            </span>
          </div>
        </div>
        <div class="vocab-category">
          <h4>过渡词汇</h4>
          <div class="vocab-items">
            <span
              v-for="word in vocabularyLibrary[selectedVocab].transition"
              :key="word"
              class="vocab-item transition"
              @click="copyWord(word)"
            >
              {{ word }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <section class="templates-section">
      <h3>📋 句式模板</h3>
      <div class="template-tabs">
        <button
          v-for="(templates, type) in sentenceTemplates"
          :key="type"
          :class="['template-tab', { active: selectedTemplate === type }]"
          @click="selectedTemplate = type"
        >
          {{ getTemplateTypeName(type) }}
        </button>
      </div>
      <div v-if="selectedTemplate && sentenceTemplates[selectedTemplate]" class="template-content card">
        <div
          v-for="(template, idx) in sentenceTemplates[selectedTemplate]"
          :key="idx"
          class="template-item"
          @click="copyWord(template)"
        >
          <p>{{ template }}</p>
          <span class="copy-hint">点击复制</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { outlineTemplates, vocabularyLibrary, sentenceTemplates } from '@/data/outlineTemplates'

const selectedType = ref(outlineTemplates[0].id)
const selectedVocab = ref(Object.keys(vocabularyLibrary)[0])
const selectedTemplate = ref('thesis')
const showCopyFeedback = ref(false)

const outlineTypes = outlineTemplates

const currentOutline = computed(() => {
  return outlineTemplates.find(t => t.id === selectedType.value)
})

const getTemplateTypeName = (type) => {
  const names = {
    thesis: '论点句',
    topicSentence: '主题句',
    analysis: '分析句',
    transition: '过渡句',
    conclusion: '结论句'
  }
  return names[type] || type
}

const copyToClipboard = async (section) => {
  if (!currentOutline.value) return

  let text = ''
  if (section === 'intro') {
    text = `引言模板：\n${currentOutline.value.structure.introduction.content.join('\n')}\n\n示例Thesis：\n${currentOutline.value.structure.introduction.example.thesis}`
  } else if (section === 'conclusion') {
    text = `结论模板：\n${currentOutline.value.structure.conclusion.content.join('\n')}`
  } else {
    const paraNum = section.replace('body', '')
    const para = currentOutline.value.structure.bodyParagraphs.find(p => p.number === parseInt(paraNum))
    if (para) {
      text = `主体段${para.number}模板：\n${para.content.join('\n')}\n\n示例：\n维度：${para.example.dimension || 'N/A'}\n文本A：${para.example.textA || 'N/A'}\n文本B：${para.example.textB || 'N/A'}`
    }
  }

  try {
    await navigator.clipboard.writeText(text)
    showCopyFeedback.value = true
    setTimeout(() => {
      showCopyFeedback.value = false
    }, 2000)
  } catch (err) {
    console.error('复制失败:', err)
  }
}

const copyWord = async (word) => {
  try {
    await navigator.clipboard.writeText(word)
  } catch (err) {
    console.error('复制失败:', err)
  }
}

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search)
  const typeParam = urlParams.get('type')
  if (typeParam) {
    const found = outlineTemplates.find(t => t.type === typeParam)
    if (found) {
      selectedType.value = found.id
    }
  }
})
</script>

<style scoped>
.outlines {
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

.outline-types {
  margin-bottom: 2rem;
}

.type-tabs {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.type-tab {
  padding: 0.75rem 1.5rem;
  border: 1px solid var(--border-color);
  background-color: var(--bg-card);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.95rem;
}

.type-tab:hover {
  background-color: var(--bg-primary);
}

.type-tab.active {
  background-color: var(--accent-color);
  color: white;
  border-color: var(--accent-color);
}

.outline-description {
  margin-bottom: 2rem;
}

.usage-note {
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: var(--bg-primary);
  border-radius: 4px;
}

.outline-structure {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.introduction-section h3,
.body-paragraph h3,
.conclusion-section h3 {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: var(--accent-color);
}

.section-content h4 {
  font-size: 1rem;
  margin: 1rem 0 0.5rem;
  color: var(--text-primary);
}

.section-content ul {
  padding-left: 1.5rem;
  line-height: 1.8;
}

.focus-text {
  font-style: italic;
  color: var(--text-secondary);
  margin: 0.5rem 0;
}

.example-box {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #fef9e7;
  border-radius: 8px;
  border-left: 4px solid #f39c12;
}

#app.dark-mode .example-box {
  background-color: #3d3520;
}

.example-item {
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

.action-buttons {
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;
}

.copy-feedback {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--accent-color);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateX(-50%) translateY(10px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}

.vocabulary-section,
.templates-section {
  margin-bottom: 3rem;
}

.vocabulary-section h3,
.templates-section h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.vocab-tabs,
.template-tabs {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.vocab-tab,
.template-tab {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background-color: var(--bg-card);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.vocab-tab:hover,
.template-tab:hover {
  border-color: var(--accent-color);
}

.vocab-tab.active,
.template-tab.active {
  background-color: var(--accent-color);
  color: white;
  border-color: var(--accent-color);
}

.vocab-content,
.template-content {
  padding: 1.5rem;
}

.vocab-category {
  margin-bottom: 1.5rem;
}

.vocab-category:last-child {
  margin-bottom: 0;
}

.vocab-category h4 {
  font-size: 1rem;
  margin-bottom: 0.75rem;
  color: var(--text-secondary);
}

.vocab-items {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.vocab-item {
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.1s;
  font-size: 0.9rem;
}

.vocab-item:hover {
  transform: scale(1.05);
}

.vocab-item.critical {
  background-color: #fdedec;
  color: #c0392b;
}

#app.dark-mode .vocab-item.critical {
  background-color: #4a1a1a;
  color: #e74c3c;
}

.vocab-item.analysis {
  background-color: #e8f4f8;
  color: #2980b9;
}

#app.dark-mode .vocab-item.analysis {
  background-color: #1a3a4a;
  color: #7ec8e3;
}

.vocab-item.transition {
  background-color: #fef3e2;
  color: #d35400;
}

#app.dark-mode .vocab-item.transition {
  background-color: #4a3a1a;
  color: #f5b041;
}

.template-item {
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: var(--bg-primary);
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  position: relative;
}

.template-item:hover {
  background-color: #e8f4f8;
}

#app.dark-mode .template-item:hover {
  background-color: #1a4a6e;
}

.template-item:last-child {
  margin-bottom: 0;
}

.template-item p {
  margin: 0;
  line-height: 1.6;
}

.copy-hint {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.8rem;
  color: var(--text-secondary);
  opacity: 0;
  transition: opacity 0.2s;
}

.template-item:hover .copy-hint {
  opacity: 1;
}
</style>
