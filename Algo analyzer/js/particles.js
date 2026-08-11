/* ==========================================================================
   Algo Analyzer - Yellow Cyberpunk Social Media Animated Background Engine
   ========================================================================== */

(function () {
  function initSocialYellowCanvas() {
    let canvas = document.getElementById('ambient-particle-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'ambient-particle-canvas';
      canvas.style.position = 'fixed';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.width = '100vw';
      canvas.style.height = '100vh';
      canvas.style.pointerEvents = 'none';
      canvas.style.zIndex = '0';
      canvas.style.opacity = '0.65';
      document.body.prepend(canvas);
    }

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Social Media Floating Badges & Icons definition
    const SOCIAL_TYPES = [
      { text: '▶', label: 'YouTube', color: '#ff0000', glow: 'rgba(255, 0, 0, 0.6)' },
      { text: '🎵', label: 'TikTok', color: '#00f2fe', glow: 'rgba(0, 242, 254, 0.6)' },
      { text: '📸', label: 'Instagram', color: '#e1306c', glow: 'rgba(225, 48, 108, 0.6)' },
      { text: '🟪', label: 'Twitch', color: '#9146ff', glow: 'rgba(145, 70, 255, 0.6)' },
      { text: 'f', label: 'Facebook', color: '#1877f2', glow: 'rgba(24, 119, 242, 0.6)' },
      { text: '📊', label: 'Analytics', color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.8)' },
      { text: '⚡', label: 'Algorithm', color: '#fbbf24', glow: 'rgba(251, 191, 36, 0.8)' },
      { text: '👁', label: 'Views', color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.7)' },
      { text: '♥', label: 'Likes', color: '#ef4444', glow: 'rgba(239, 68, 68, 0.7)' },
      { text: '✦', label: 'Spark', color: '#fcd34d', glow: 'rgba(252, 211, 77, 0.8)' }
    ];

    const nodes = [];
    const nodeCount = Math.min(Math.floor((width * height) / 22000), 45);

    class SocialNode {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 12 + 14;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.type = SOCIAL_TYPES[Math.floor(Math.random() * SOCIAL_TYPES.length)];
        this.alpha = Math.random() * 0.4 + 0.3;
        this.baseAlpha = this.alpha;
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.rot = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.01;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < -30) this.x = width + 30;
        if (this.x > width + 30) this.x = -30;
        if (this.y < -30) this.y = height + 30;
        if (this.y > height + 30) this.y = -30;

        this.pulsePhase += 0.02;
        this.rot += this.rotSpeed;
        this.alpha = this.baseAlpha + Math.sin(this.pulsePhase) * 0.18;
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);

        // Ambient Yellow Glowing Halo
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 1.1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 158, 11, ${Math.max(0.04, this.alpha * 0.25)})`;
        ctx.fill();

        // Node Ring
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.75, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(251, 191, 36, ${Math.max(0.1, this.alpha * 0.6)})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Icon text
        ctx.font = `${Math.floor(this.size * 0.75)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = this.type.glow;
        ctx.shadowBlur = 10;
        ctx.globalAlpha = Math.max(0.2, this.alpha);
        ctx.fillText(this.type.text, 0, 0);

        ctx.restore();
      }
    }

    for (let i = 0; i < nodeCount; i++) {
      nodes.push(new SocialNode());
    }

    // Connect nodes with golden social graph lines
    function drawSocialGraph() {
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            const lineAlpha = (1 - dist / 140) * 0.18;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            const grad = ctx.createLinearGradient(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
            grad.addColorStop(0, `rgba(245, 158, 11, ${lineAlpha})`);
            grad.addColorStop(1, `rgba(251, 191, 36, ${lineAlpha * 0.5})`);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
    }

    // Gentle ambient yellow wave light pulse
    let waveOffset = 0;
    function drawAmbientWaves() {
      waveOffset += 0.005;
      const grad = ctx.createRadialGradient(
        width * 0.5 + Math.sin(waveOffset) * 200,
        height * 0.4 + Math.cos(waveOffset * 0.7) * 150,
        100,
        width * 0.5,
        height * 0.5,
        width * 0.7
      );
      grad.addColorStop(0, 'rgba(245, 158, 11, 0.04)');
      grad.addColorStop(0.5, 'rgba(217, 119, 6, 0.02)');
      grad.addColorStop(1, 'transparent');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      drawAmbientWaves();
      drawSocialGraph();
      nodes.forEach((n) => {
        n.update();
        n.draw();
      });

      requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSocialYellowCanvas);
  } else {
    initSocialYellowCanvas();
  }
})();
