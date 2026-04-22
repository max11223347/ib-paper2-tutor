<template>
  <div class="feedback-page">
    <header class="page-header">
      <h2>💬 反馈与建议</h2>
      <p>帮助我们改进软件，提供你的使用反馈</p>
    </header>

    <section class="feedback-form card">
      <h3>提交反馈</h3>
      <form @submit.prevent="submitFeedback">
        <div class="form-group">
          <label>反馈类型</label>
          <select v-model="feedback.type" required>
            <option value="">请选择</option>
            <option value="bug">问题反馈</option>
            <option value="feature">功能建议</option>
            <option value="content">内容纠错</option>
            <option value="other">其他</option>
          </select>
        </div>

        <div class="form-group">
          <label>联系方式（可选）</label>
          <input
            v-model="feedback.contact"
            type="email"
            placeholder="你的邮箱地址"
          />
        </div>

        <div class="form-group">
          <label>反馈内容</label>
          <textarea
            v-model="feedback.content"
            placeholder="请详细描述你的问题或建议..."
            rows="6"
            required
          ></textarea>
        </div>

        <div class="form-group">
          <label>上传文件（可选）</label>
          <div class="file-upload">
            <input
              type="file"
              id="file-input"
              @change="handleFileUpload"
              accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
            />
            <label for="file-input" class="file-label">
              <span v-if="!feedback.file">📎 选择文件</span>
              <span v-else>✅ {{ feedback.file.name }}</span>
            </label>
            <span class="file-hint">支持 JPG, PNG, PDF, DOC 格式</span>
          </div>
        </div>

        <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
          {{ isSubmitting ? '提交中...' : '提交反馈' }}
        </button>
      </form>
    </section>

    <section v-if="submitSuccess" class="success-message card">
      <div class="success-icon">✅</div>
      <h3>反馈提交成功！</h3>
      <p>感谢你的反馈，我们会尽快处理。</p>
    </section>

    <section class="feedback-guidelines">
      <h3>反馈指南</h3>
      <div class="guidelines-list">
        <div class="guideline-item card">
          <h4>🐛 问题反馈</h4>
          <p>请描述遇到问题的具体步骤、预期结果与实际结果，以及你使用的设备和浏览器信息。</p>
        </div>
        <div class="guideline-item card">
          <h4>✨ 功能建议</h4>
          <p>告诉我们你希望添加的功能，或者对现有功能的改进建议。越详细越好！</p>
        </div>
        <div class="guideline-item card">
          <h4>📝 内容纠错</h4>
          <p>如果你发现题库、范文或大纲中有错误，请指出具体位置和你的建议。</p>
        </div>
      </div>
    </section>

    <section class="faq-section">
      <h3>常见问题</h3>
      <div class="faq-list">
        <div
          v-for="(faq, idx) in faqs"
          :key="idx"
          class="faq-item card"
        >
          <div class="faq-question" @click="toggleFaq(idx)">
            <h4>{{ faq.question }}</h4>
            <span class="faq-toggle">{{ expandedFaq === idx ? '−' : '+' }}</span>
          </div>
          <div v-if="expandedFaq === idx" class="faq-answer">
            <p>{{ faq.answer }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="contact-info">
      <h3>联系我们</h3>
      <div class="contact-card card">
        <p>如果你有其他问题或需要帮助，可以通过以下方式联系我们：</p>
        <div class="contact-methods">
          <div class="contact-item">
            <span class="contact-icon">📧</span>
            <span>support@ibpaper2tutor.com</span>
          </div>
          <div class="contact-item">
            <span class="contact-icon">💬</span>
            <span>微信公众号：IB语文学习助手</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const feedback = reactive({
  type: '',
  contact: '',
  content: '',
  file: null
})

const isSubmitting = ref(false)
const submitSuccess = ref(false)
const expandedFaq = ref(null)

const faqs = [
  {
    question: '这个软件是免费的吗？',
    answer: '是的，IB语文Paper2写作辅助软件的基础功能完全免费使用，包括题库浏览、大纲模板和基础写作工具。'
  },
  {
    question: '题库会定期更新吗？',
    answer: '会的，我们会根据IB官方发布的最新考试题目定期更新题库。通常在每次大考结束后会添加新题目。'
  },
  {
    question: '我可以离线使用这个软件吗？',
    answer: 'MVP版本需要网络连接。后续版本会支持离线模式，让你可以在没有网络的情况下使用。'
  },
  {
    question: '范文是如何评分的？',
    answer: '范文评分基于IB官方评分标准（Criterion A-E），由经验丰富的IB教师评审后标注。'
  },
  {
    question: '我提交的写作作品会被批改吗？',
    answer: '目前反馈功能主要用于收集用户意见和改进建议。后续会考虑添加AI辅助评分功能。'
  }
]

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      alert('文件大小不能超过5MB')
      event.target.value = ''
      return
    }
    feedback.file = file
  }
}

const submitFeedback = async () => {
  if (!feedback.content.trim()) {
    alert('请填写反馈内容')
    return
  }

  isSubmitting.value = true

  try {
    console.log('提交反馈:', feedback)
    await new Promise(resolve => setTimeout(resolve, 1000))

    submitSuccess.value = true
    feedback.type = ''
    feedback.contact = ''
    feedback.content = ''
    feedback.file = null

    setTimeout(() => {
      submitSuccess.value = false
    }, 5000)
  } catch (error) {
    alert('提交失败，请稍后重试')
  } finally {
    isSubmitting.value = false
  }
}

const toggleFaq = (idx) => {
  expandedFaq.value = expandedFaq.value === idx ? null : idx
}
</script>

<style scoped>
.feedback-page {
  padding: 1rem 0;
  max-width: 800px;
  margin: 0 auto;
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

.feedback-form {
  margin-bottom: 2rem;
}

.feedback-form h3 {
  margin-bottom: 1.5rem;
  color: var(--accent-color);
}

form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
}

.file-upload {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.file-upload input[type="file"] {
  display: none;
}

.file-label {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: var(--bg-primary);
  border: 1px dashed var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  text-align: center;
  transition: all 0.2s;
}

.file-label:hover {
  border-color: var(--accent-color);
  background-color: var(--bg-card);
}

.file-hint {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.success-message {
  text-align: center;
  padding: 2rem;
  margin-bottom: 2rem;
  background-color: #e8f8f0;
}

#app.dark-mode .success-message {
  background-color: #1a4a3e;
}

.success-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.success-message h3 {
  margin-bottom: 0.5rem;
  color: #27ae60;
}

.success-message p {
  color: var(--text-secondary);
}

.feedback-guidelines {
  margin-bottom: 2rem;
}

.feedback-guidelines h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.guidelines-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.guideline-item h4 {
  margin-bottom: 0.5rem;
  color: var(--accent-color);
}

.guideline-item p {
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.faq-section {
  margin-bottom: 2rem;
}

.faq-section h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.faq-item {
  padding: 1rem;
}

.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.faq-question h4 {
  margin: 0;
  font-size: 1rem;
}

.faq-toggle {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--accent-color);
}

.faq-answer {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.faq-answer p {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.6;
}

#app.dark-mode .faq-answer {
  border-color: #333;
}

.contact-info h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.contact-card p {
  margin-bottom: 1rem;
  color: var(--text-secondary);
}

.contact-methods {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.contact-icon {
  font-size: 1.25rem;
}
</style>
