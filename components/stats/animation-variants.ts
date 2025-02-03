export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

export const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export const rainbowText = {
  initial: { color: '#FFFFFF' },
  animate: {
    color: ['#FFFFFF', '#FEF08A', '#86EFAC', '#93C5FD', '#F9A8D4', '#FFFFFF'],
    transition: {
      duration: 10,
      repeat: Infinity,
      ease: "linear"
    }
  }
} 