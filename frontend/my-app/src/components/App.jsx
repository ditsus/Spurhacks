import React from "react";

// Inline styles for simplicity
const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    margin: 0,
    padding: 0,
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    color: '#333',
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
  },
  navTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  header: {
    textAlign: 'center',
    padding: '4rem 2rem',
  },
  heroTitle: {
    fontSize: '3rem',
    margin: '0.5rem 0',
  },
  heroSubtitle: {
    fontSize: '1.25rem',
    margin: '1rem 0',
    maxWidth: '600px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  button: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    color: '#fff',
    backgroundColor: '#0070f3',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  buttonHover: {
    backgroundColor: '#0058c9',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
    padding: '2rem',
  },
  card: {
    backgroundColor: '#fff',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textAlign: 'center',
    transition: 'transform 0.3s',
  },
  cardHover: {
    transform: 'translateY(-5px)',
  },
  footer: {
    textAlign: 'center',
    padding: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
  }
};

function App() {
  const features = [
    { title: "Fast Performance", description: "Optimized for speed and efficiency." },
    { title: "Responsive Design", description: "Looks great on all devices." },
    { title: "Easy Customization", description: "Modify components to fit your needs." },
    { title: "Modern Aesthetics", description: "Clean and minimalistic UI." }
  ];

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <div style={styles.navTitle}>CoolJSXApp</div>
        <button
          style={styles.button}
          onMouseOver={e => (e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor)}
          onMouseOut={e => (e.currentTarget.style.backgroundColor = styles.button.backgroundColor)}
        >
          Sign Up
        </button>
      </nav>

      <header style={styles.header}>
        <h1 style={styles.heroTitle}>Welcome to CoolJSXApp</h1>
        <p style={styles.heroSubtitle}>
          A simple, elegant React template using only React and inline CSS—with no extra dependencies.
        </p>
        <button
          style={styles.button}
          onMouseOver={e => (e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor)}
          onMouseOut={e => (e.currentTarget.style.backgroundColor = styles.button.backgroundColor)}
        >
          Get Started
        </button>
      </header>

      <main style={styles.featuresGrid}>
        {features.map((feature, idx) => (
          <div
            key={idx}
            style={styles.card}
            onMouseOver={e => (e.currentTarget.style.transform = styles.cardHover.transform)}
            onMouseOut={e => (e.currentTarget.style.transform = 'none')}
          >
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </main>

      <footer style={styles.footer}>
        © {new Date().getFullYear()} CoolJSXApp. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
