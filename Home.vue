<template>
  <div class="home">
    <section class="hero">
      <h2>阿马做的妙妙工具</h2>
      <p class="hero-subtitle">专为IB课程语文科目学生设计的Paper2写作助手</p>
      <p class="hero-description">解决"不会审题、思路混乱、不知如何落笔、缺乏高分参考"的核心痛点</p>
      <div class="hero-actions">
        <router-link to="/question-bank" class="btn btn-primary">浏览题库</router-link>
        <router-link to="/outlines" class="btn btn-secondary">查看大纲</router-link>
      </div>
    </section>

    <section class="features">
      <h3>核心功能</h3>
      <div class="feature-grid">
        <div class="feature-card card">
          <div class="feature-icon">📚</div>
          <h4>题库与范文</h4>
          <p>收录近10-15年IB语文Paper2真实考试题目，每题匹配2-3篇不同分数段范文，对比学习高效提分</p>
        </div>
        <div class="feature-card card">
          <div class="feature-icon">📝</div>
          <h4>写作大纲</h4>
          <p>按题目类型提供详细段落式大纲，贴合IB写作结构，可直接套用框架填充内容</p>
        </div>
        <div class="feature-card card">
          <div class="feature-icon">🔍</div>
          <h4>写作工具</h4>
          <p>论点检查、评分自查、引用格式辅助，全方位提升写作质量</p>
        </div>
        <div class="feature-card card">
          <div class="feature-icon">💡</div>
          <h4>词汇句式库</h4>
          <p>按主题分类整理高分写作常用词汇和句式，直接借鉴提升语言表达</p>
        </div>
      </div>
    </section>

    <section class="quick-start">
      <h3>快速开始</h3>
      <div class="step-list">
        <div class="step card">
          <div class="step-number">1</div>
          <div class="step-content">
            <h4>选择题目</h4>
            <p>从题库中筛选对应题目，查看审题解析避免偏题</p>
          </div>
        </div>
        <div class="step card">
          <div class="step-number">2</div>
          <div class="step-content">
            <h4>参考范文</h4>
            <p>阅读高分范文，标注学习论点句、引用、分析句的写法</p>
          </div>
        </div>
        <div class="step card">
          <div class="step-number">3</div>
          <div class="step-content">
            <h4>套用大纲</h4>
            <p>根据题目类型选择对应大纲模板，填充自己的分析内容</p>
          </div>
        </div>
        <div class="step card">
          <div class="step-number">4</div>
          <div class="step-content">
            <h4>使用工具检查</h4>
            <p>利用论点检查和评分自查工具，确保写作符合IB标准</p>
          </div>
        </div>
      </div>
    </section>

    <section class="ib-criteria">
      <h3>IB Paper2 评分标准</h3>
      <div class="criteria-grid">
        <div class="criteria-card card">
          <h4>Criterion A - 要点与引用</h4>
          <p>文本分析与引用准确性</p>
        </div>
        <div class="criteria-card card">
          <h4>Criterion B - 组织和结构</h4>
          <p>逻辑性与连贯性</p>
        </div>
        <div class="criteria-card card">
          <h4>Criterion C - 语言与风格</h4>
          <p>表达的准确性与适当性</p>
        </div>
        <div class="criteria-card card">
          <h4>Criterion D - 深度理解</h4>
          <p>批判性思考与深层理解</p>
        </div>
        <div class="criteria-card card">
          <h4>Criterion E - 概念与背景</h4>
          <p>文学概念的运用</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
</script>

<style scoped>
.home {
  padding: 1rem 0;
}

.hero {
  text-align: center;
  padding: 3rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
  margin-bottom: 2rem;
}

.hero h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.hero-subtitle {
  font-size: 1.5rem;
  opacity: 0.9;
  margin-bottom: 0.5rem;
}

.hero-description {
  font-size: 1.1rem;
  opacity: 0.8;
  margin-bottom: 2rem;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.features, .quick-start, .ib-criteria {
  margin-bottom: 3rem;
}

.features h3, .quick-start h3, .ib-criteria h3 {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.feature-card {
  text-align: center;
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h4 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: var(--accent-color);
}

.step-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 600px;
  margin: 0 auto;
}

.step {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.step-number {
  width: 3rem;
  height: 3rem;
  background-color: var(--accent-color);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  flex-shrink: 0;
}

.step-content h4 {
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
  color: var(--text-primary);
}

.step-content p {
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.criteria-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.criteria-card {
  text-align: center;
}

.criteria-card h4 {
  font-size: 1rem;
  color: var(--accent-color);
  margin-bottom: 0.5rem;
}

.criteria-card p {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

#app.dark-mode .hero {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

#app.dark-mode .hero h2 {
  color: #eee;
}

#app.dark-mode .hero-subtitle,
#app.dark-mode .hero-description {
  color: #bbb;
}
</style>
