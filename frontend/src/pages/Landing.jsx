import { Link } from "react-router-dom";

const featureCards = [
  {
    label: "01",
    title: "Guided AI tutor",
    text: "ThinkLoop asks smart guiding questions before giving answers, so students build reasoning instead of copying.",
  },
  {
    label: "02",
    title: "Progressive hints",
    text: "Learners get gentle nudges first, stronger hints next, and full explanations only when they truly need them.",
  },
  {
    label: "03",
    title: "Debug by thinking",
    text: "Programming help focuses on tracing errors, understanding logic, and learning the pattern behind the fix.",
  },
  {
    label: "04",
    title: "Reflect, quiz, improve",
    text: "Self-assessments, reflection prompts, and topic history turn every session into long-term learning.",
  },
];

const stats = [
  ["24/7", "AI tutor access"],
  ["3+", "hint levels"],
  ["1:1", "guided learning"],
];

const targetUsers = [
  "Undergraduate students",
  "Graduate students",
  "Self-learners",
  "Programming beginners",
  "Competitive programmers",
  "Educators and mentors",
];

const useCases = [
  "Algorithms and coding concepts",
  "Guided code debugging",
  "Math and science understanding",
  "Interview and exam preparation",
  "Academic revision",
  "Problem-solving practice",
];

const testimonials = [
  {
    quote:
      "It does not just hand me code. It asks the right questions until I can see the bug myself.",
    name: "Rohan",
    detail: "Programming beginner",
  },
  {
    quote:
      "ThinkLoop feels more like a tutor than a chatbot. I remember concepts longer because I work through them.",
    name: "Maya",
    detail: "Undergraduate student",
  },
  {
    quote:
      "The hint levels are perfect for exam prep. I can practice without immediately spoiling the solution.",
    name: "Sara",
    detail: "Competitive learner",
  },
];

const studyTimeline = [
  "Understand the problem",
  "Answer guiding questions",
  "Unlock stronger hints",
  "Reflect and self-assess",
];

export default function Landing() {
  return (
    <div className="launch-landing">
      <header className="launch-nav">
        <Link to="/" className="launch-brand" aria-label="ThinkLoop home">
          <img src="/logo.jpg" alt="" className="launch-logo" />
          <span>ThinkLoop</span>
        </Link>

        <nav className="launch-links" aria-label="Landing navigation">
          <a href="#benefits">Features</a>
          <a href="#use-cases">Use cases</a>
          <a href="#flow">How it works</a>
        </nav>

        <div className="launch-actions">
          <Link to="/login" className="launch-login">
            Log in
          </Link>
          <Link to="/signup" className="launch-button small">
            Start free
          </Link>
        </div>
      </header>

      <main>
        <section className="launch-hero" aria-labelledby="launch-title">
          <div className="launch-backdrop" aria-hidden="true">
            <div className="launch-photo" />
            <div className="launch-mesh" />
            <div className="launch-grid" />
          </div>

          <div className="launch-hero-inner">
            <div className="launch-copy">
              <p className="launch-eyebrow">ThinkLoop - AI Tutor</p>
              <h1 id="launch-title">ThinkLoop</h1>
              <p className="launch-lede">
                <strong>Learn by Thinking, Not by Copying.</strong> ThinkLoop is
                an AI-powered tutor that guides students with structured
                questions, progressive hints, and personalized feedback.
              </p>

              <div className="launch-cta-row">
                <Link to="/signup" className="launch-button">
                  Start Learning Free
                </Link>
                <a href="#flow" className="launch-button ghost">
                  See the tutor flow
                </a>
              </div>

              <div className="launch-trust">
                <span>Guided learning first</span>
                <span>Hints before answers</span>
                <span>Built for real understanding</span>
              </div>
            </div>

            <div className="launch-product" id="product" aria-label="ThinkLoop tutoring preview">
              <div className="product-shell">
                <div className="product-topbar">
                  <div>
                    <span className="product-dot" />
                    <span className="product-dot" />
                    <span className="product-dot" />
                  </div>
                  <strong>Guided Tutor Session</strong>
                </div>

                <div className="product-panel">
                  <div className="prompt-card">
                    <span>Student question</span>
                    <p>Can you give me the answer for this recursion problem?</p>
                  </div>

                  <div className="answer-card">
                    <span>ThinkLoop response</span>
                    <h2>Let us reason it out first.</h2>
                    <p>
                      What is the smallest input where the function should stop?
                      Once you find that base case, we can build the recursive
                      step together.
                    </p>
                  </div>

                  <div className="session-row">
                    <div>
                      <strong>Hint 2</strong>
                      <span>stronger guidance unlocked</span>
                    </div>
                    <div>
                      <strong>Quiz</strong>
                      <span>check understanding next</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="floating-note note-one">
                <strong>Memory</strong>
                <span>Personalized history across topics</span>
              </div>
              <div className="floating-note note-two">
                <strong>Debugging</strong>
                <span>Trace the logic before fixing code</span>
              </div>
            </div>
          </div>
        </section>

        <section className="launch-stats" id="proof" aria-label="ThinkLoop learning outcomes">
          {stats.map(([value, label]) => (
            <div key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </section>

        <section className="launch-section" id="benefits">
          <div className="section-intro">
            <p>Not an answer machine</p>
            <h2>A tutor that protects critical thinking.</h2>
          </div>

          <div className="benefit-grid">
            {featureCards.map((item) => (
              <article className="benefit-card" key={item.title}>
                <span>{item.label}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="workflow-band" id="flow">
          <div className="workflow-copy">
            <p>Learning flow</p>
            <h2>From stuck to independent, one thought at a time.</h2>
            <span>
              ThinkLoop increases support gradually, helping students analyze
              problems, explain their reasoning, and build confidence before
              seeing complete solutions.
            </span>
          </div>

          <div className="workflow-steps" aria-label="Guided tutoring workflow">
            {studyTimeline.map((step, index) => (
              <div className="workflow-step" key={step}>
                <strong>{String(index + 1).padStart(2, "0")}</strong>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="launch-section audience-section" id="use-cases">
          <div className="section-intro">
            <p>Who it is for</p>
            <h2>Built for learners who want concepts to click.</h2>
          </div>

          <div className="audience-grid">
            <div className="audience-panel">
              <h3>Target users</h3>
              <div className="pill-cloud">
                {targetUsers.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>

            <div className="audience-panel">
              <h3>Use cases</h3>
              <div className="pill-cloud">
                {useCases.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="launch-section testimonial-section">
          <div className="section-intro">
            <p>Expected outcomes</p>
            <h2>Better reasoning, stronger retention, more confidence.</h2>
          </div>

          <div className="launch-testimonials">
            {testimonials.map((item) => (
              <article className="launch-testimonial" key={item.name}>
                <p>"{item.quote}"</p>
                <div>
                  <strong>{item.name}</strong>
                  <span>{item.detail}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="faq-strip" id="faq">
          <div>
            <p>No-risk free trial</p>
            <h2>Start learning by thinking, not copying.</h2>
          </div>
          <Link to="/signup" className="launch-button">
            Start Learning Free
          </Link>
        </section>
      </main>

      <footer className="launch-footer">
        <span>ThinkLoop - AI Tutor</span>
        <div>
          <Link to="/login">Log in</Link>
          <Link to="/signup">Start free</Link>
        </div>
      </footer>
    </div>
  );
}
