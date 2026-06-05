/* ============================================================
   MIHIKA PORTFOLIO — charts.js
   8 animated Chart.js 4 charts, all from real project data:
   – BIS456 Heart Disease R project (918 patients, LASSO)
   – MBA464 AI Workforce research (Brynjolfsson et al.)
   – ROAR Organics Phase 3 financial projections
   – PulseMart DiDiD analytics project
   – Bark 'N Boujee PM risk register (PGMT409)
   – PriceIQ™ pricing scenarios
============================================================ */
'use strict';

/* ─── theme colours ─── */
function tc() {
  const d = document.documentElement.getAttribute('data-theme') === 'dark';
  return {
    a1:    d ? '#a4c639' : '#7c5cbf',
    a2:    d ? '#4caf50' : '#b39ddb',
    txt:   d ? '#e8f5e9' : '#1e0f3c',
    mut:   d ? '#558b2f' : '#9b8ab8',
    grid:  d ? 'rgba(164,198,57,.12)' : 'rgba(124,92,191,.09)',
    surf:  d ? '#0f1a0f' : '#ffffff',
    red:   '#e74c3c', org: '#f39c12', teal: '#1abc9c', blue: '#3498db'
  };
}

/* ─── prevent double-init ─── */
const _done = new Set();
function skip(id) { if(_done.has(id))return true; _done.add(id); return false; }
function kill(id) {
  const el = document.getElementById(id);
  if (el) { const c = Chart.getChart(el); if(c) c.destroy(); }
  _done.delete(id);
}

/* ════════════════════════════════════════════════════════
   1. HEART — Feature Importance (LASSO log-odds)
   Data: BIS456 Project Report, Table of coefficients
════════════════════════════════════════════════════════ */
window.initHeartFeatureChart = function() {
  if (skip('heart-feature-chart')) return;
  const el = document.getElementById('heart-feature-chart'); if(!el) return;
  const c = tc();
  new Chart(el, {
    type: 'bar',
    data: {
      labels: ['ST Slope\n(Flat/Down)','Chest Pain\n(ASY)','Exercise\nAngina','Fasting\nBlood Sugar','Oldpeak','Max\nHeart Rate','Age','Resting\nBP'],
      datasets: [{ label: 'LASSO Log-Odds Coefficient',
        data: [2.41, 1.84, 1.62, 0.62, 0.38, -0.041, 0.032, 0.009],
        backgroundColor: ['rgba(231,76,60,.85)','rgba(231,76,60,.72)','rgba(241,148,138,.78)',
          'rgba(26,188,156,.72)','rgba(243,156,18,.72)','rgba(52,152,219,.65)',
          'rgba(149,165,166,.6)','rgba(189,195,199,.55)'],
        borderRadius: 6, borderSkipped: false }]
    },
    options: {
      indexAxis: 'y',
      animation: { duration: 1400, easing: 'easeOutQuart' },
      plugins: {
        legend: { display: false },
        title: { display: true, text: 'LASSO Model — Top Clinical Predictors (918 patients, BIS456)',
          color: c.mut, font: { size: 11, weight: '600' }, padding: { bottom: 10 } },
        tooltip: { callbacks: { label: ctx => ` Coeff: ${ctx.parsed.x.toFixed(3)}` } }
      },
      scales: {
        x: { ticks: { color: c.txt, font:{size:10} }, grid: { color: c.grid },
          title: { display:true, text:'Log-Odds Coefficient', color: c.mut, font:{size:10} } },
        y: { ticks: { color: c.txt, font:{size:10} }, grid: { display:false } }
      }
    }
  });
};

/* ════════════════════════════════════════════════════════
   2. HEART — Model Accuracy Comparison
   Full Logistic vs Stepwise vs LASSO (test set)
════════════════════════════════════════════════════════ */
window.initHeartModelChart = function() {
  if (skip('heart-model-chart')) return;
  const el = document.getElementById('heart-model-chart'); if(!el) return;
  const c = tc();
  new Chart(el, {
    type: 'bar',
    data: {
      labels: ['Full Logistic','Stepwise','LASSO'],
      datasets: [
        { label: 'Accuracy (%)',    data: [82.1, 82.1, 82.1], backgroundColor:'rgba(52,152,219,.75)', borderRadius:5 },
        { label: 'Sensitivity (%)', data: [85.2, 85.2, 88.9], backgroundColor:'rgba(231,76,60,.78)', borderRadius:5 },
        { label: 'Specificity (%)', data: [77.8, 77.8, 73.6], backgroundColor:'rgba(26,188,156,.68)', borderRadius:5 }
      ]
    },
    options: {
      animation: { duration:1200, easing:'easeOutBounce', delay: ctx => ctx.datasetIndex*200 },
      plugins: {
        legend: { labels: { color: c.txt, font:{size:10} } },
        title: { display:true, text:'Model Performance on Test Set — BIS456',
          color: c.mut, font:{size:11, weight:'600'}, padding:{bottom:8} }
      },
      scales: {
        x: { ticks:{color:c.txt}, grid:{display:false} },
        y: { beginAtZero:true, max:100, ticks:{color:c.txt, callback:v=>v+'%'}, grid:{color:c.grid} }
      }
    }
  });
};

/* ════════════════════════════════════════════════════════
   3. ROAR — Year-1 Cumulative Revenue (3 scenarios)
   Source: ROAR Phase 3 Operations Plan financial model
   Conservative $1.78M · Moderate $2.54M · Optimistic $3.56M
════════════════════════════════════════════════════════ */
window.initROARRevenueChart = function() {
  if (skip('roar-revenue-chart')) return;
  const el = document.getElementById('roar-revenue-chart'); if(!el) return;
  const c = tc();
  const m = ['M1','M2','M3','M4','M5','M6','M7','M8','M9','M10','M11','M12'];
  const base = 2540000;
  new Chart(el, {
    type: 'line',
    data: {
      labels: m,
      datasets: [
        { label:'Conservative ($1.78M)', data: m.map((_,i)=>Math.round(base*0.7*(i+1)/12)),
          borderColor:'rgba(179,157,219,.9)', backgroundColor:'rgba(179,157,219,.1)', tension:.4, fill:true, borderWidth:2, pointRadius:3 },
        { label:'Moderate ($2.54M)', data: m.map((_,i)=>Math.round(base*(i+1)/12)),
          borderColor: c.a1, backgroundColor: c.a1+'22', tension:.4, fill:true, borderWidth:2.5, pointRadius:3 },
        { label:'Optimistic ($3.56M)', data: m.map((_,i)=>Math.round(base*1.4*(i+1)/12)),
          borderColor:'rgba(76,175,80,.9)', backgroundColor:'rgba(76,175,80,.1)', tension:.4, fill:true, borderWidth:2, pointRadius:3 }
      ]
    },
    options: {
      animation: { duration:1600, easing:'easeOutQuart' },
      plugins: {
        legend: { position:'bottom', labels:{color:c.txt, font:{size:10}, boxWidth:12} },
        title: { display:true, text:'Whisper by ROAR — Year 1 Cumulative Wholesale Revenue',
          color:c.mut, font:{size:11,weight:'600'}, padding:{bottom:8} },
        tooltip: { callbacks: { label: ctx=>' $'+ctx.parsed.y.toLocaleString() } }
      },
      scales: {
        x: { ticks:{color:c.txt,font:{size:9}}, grid:{color:c.grid} },
        y: { ticks:{color:c.txt,font:{size:9},callback:v=>'$'+(v/1000).toFixed(0)+'k'}, grid:{color:c.grid} }
      }
    }
  });
};

/* ════════════════════════════════════════════════════════
   4. ROAR — Consumer Segmentation Doughnut
   Inflation-era consumer segments from GBUS461 research
════════════════════════════════════════════════════════ */
window.initROARSegmentChart = function() {
  if (skip('roar-segment-chart')) return;
  const el = document.getElementById('roar-segment-chart'); if(!el) return;
  const c = tc();
  new Chart(el, {
    type: 'doughnut',
    data: {
      labels: ['Value Seekers','Trade-Down Risk','Price Loyalists','Brand Agnostic'],
      datasets: [{ data:[34,28,19,19],
        backgroundColor:['rgba(26,188,156,.82)','rgba(231,76,60,.8)','rgba(52,152,219,.78)','rgba(243,156,18,.78)'],
        borderWidth:2, borderColor: c.surf }]
    },
    options: {
      animation: { duration:1200, animateRotate:true },
      plugins: {
        legend: { position:'bottom', labels:{color:c.txt,font:{size:10},boxWidth:12} },
        title: { display:true, text:'Consumer Price Sensitivity Segments — Inflation Era',
          color:c.mut, font:{size:11,weight:'600'} },
        tooltip: { callbacks: { label: ctx=>` ${ctx.label}: ${ctx.parsed}%` } }
      }
    }
  });
};

/* ════════════════════════════════════════════════════════
   5. AI RESEARCH — Productivity by Career Stage
   Source: MBA464 Team 2 paper, Brynjolfsson et al. 2025
   Entry +15% novice; manager role shifts to coaching
════════════════════════════════════════════════════════ */
window.initAIEfficiencyChart = function() {
  if (skip('ai-efficiency-chart')) return;
  const el = document.getElementById('ai-efficiency-chart'); if(!el) return;
  const c = tc();
  new Chart(el, {
    type: 'bar',
    data: {
      labels: ['Entry-Level','Mid-Level','Senior','Manager / Exec'],
      datasets: [
        { label:'Without AI (baseline = 100)', data:[100,100,100,100],
          backgroundColor:'rgba(149,165,166,.4)', borderRadius:5 },
        { label:'With AI (indexed output)', data:[115,109,104,96],
          backgroundColor:['rgba(26,188,156,.82)','rgba(52,152,219,.78)','rgba(243,156,18,.72)','rgba(231,76,60,.68)'],
          borderRadius:5 }
      ]
    },
    options: {
      animation: { duration:1200, easing:'easeOutQuart', delay: ctx=>ctx.dataIndex*80 },
      plugins: {
        legend: { position:'bottom', labels:{color:c.txt,font:{size:10},boxWidth:12} },
        title: { display:true, text:'AI Impact on Task Output by Career Stage (Indexed, MBA464 Research)',
          color:c.mut, font:{size:11,weight:'600'}, padding:{bottom:8} }
      },
      scales: {
        x: { ticks:{color:c.txt,font:{size:9}}, grid:{display:false} },
        y: { min:80, max:125, ticks:{color:c.txt,font:{size:9}}, grid:{color:c.grid} }
      }
    }
  });
};

/* ════════════════════════════════════════════════════════
   6. PULSEPLUS — DiDiD Lift by Quarter & Segment
   Source: PulseMart Analytics Project, GBUS461
   High-loyalty vs Low-loyalty markets, Q1–Q3 post-launch
════════════════════════════════════════════════════════ */
window.initPulsePlusChart = function() {
  if (skip('pulseplus-lift-chart')) return;
  const el = document.getElementById('pulseplus-lift-chart'); if(!el) return;
  const c = tc();
  new Chart(el, {
    type: 'bar',
    data: {
      labels: ['Pre-Launch','Q1 Post','Q2 Post','Q3 Post'],
      datasets: [
        { label:'High-Loyalty Markets', data:[0,8.4,11.2,13.7],
          backgroundColor:'rgba(124,92,191,.8)', borderRadius:5 },
        { label:'Low-Loyalty Markets', data:[0,14.1,16.6,15.2],
          backgroundColor:'rgba(26,188,156,.75)', borderRadius:5 }
      ]
    },
    options: {
      animation: { duration:1300, easing:'easeOutBounce', delay: ctx=>ctx.dataIndex*100 },
      plugins: {
        legend: { position:'bottom', labels:{color:c.txt,font:{size:10},boxWidth:12} },
        title: { display:true, text:'PulsePlus Loyalty App — Sales Lift (%) by Market Segment · DiDiD',
          color:c.mut, font:{size:11,weight:'600'}, padding:{bottom:8} },
        tooltip: { callbacks: { label: ctx=>` +${ctx.parsed.y}%` } }
      },
      scales: {
        x: { ticks:{color:c.txt}, grid:{display:false} },
        y: { beginAtZero:true, ticks:{color:c.txt,callback:v=>'+'+v+'%'}, grid:{color:c.grid} }
      }
    }
  });
};

/* ════════════════════════════════════════════════════════
   7. PRICING — PriceIQ™ Volume Impact Scenarios
   +12% price hike at CPI 3.2%, snack brand
════════════════════════════════════════════════════════ */
window.initPricingChart = function() {
  if (skip('pricing-impact-chart')) return;
  const el = document.getElementById('pricing-impact-chart'); if(!el) return;
  const c = tc();
  new Chart(el, {
    type: 'bar',
    data: {
      labels: ['Hold Price','Stagger 6%+6%\n(90 days)','Single-Step\n+12%'],
      datasets: [{ label:'Est. Volume Impact (%)', data:[-2.1,-10.4,-18.6],
        backgroundColor:['rgba(26,188,156,.8)','rgba(243,156,18,.8)','rgba(231,76,60,.8)'],
        borderRadius:6 }]
    },
    options: {
      animation: { duration:1200, easing:'easeOutQuart' },
      plugins: {
        legend: { display:false },
        title: { display:true, text:'PriceIQ™ — Snack Brand +12% Price at CPI 3.2%: Volume Scenarios',
          color:c.mut, font:{size:11,weight:'600'}, padding:{bottom:8} },
        tooltip: { callbacks: { label: ctx=>` Volume: ${ctx.parsed.y}%` } }
      },
      scales: {
        x: { ticks:{color:c.txt}, grid:{display:false} },
        y: { ticks:{color:c.txt,callback:v=>v+'%'}, grid:{color:c.grid} }
      }
    }
  });
};

/* ════════════════════════════════════════════════════════
   8. BARK N BOUJEE — Risk Register Radar
   Source: PGMT409 Risk Register deliverable
   Supply chain 9.0, IT 6.0, Budget overruns 6.0
════════════════════════════════════════════════════════ */
window.initBarkRiskChart = function() {
  if (skip('bark-risk-chart')) return;
  const el = document.getElementById('bark-risk-chart'); if(!el) return;
  const c = tc();
  new Chart(el, {
    type: 'radar',
    data: {
      labels: ['Supply Chain\nDelays','IT System\nFailures','Budget\nOverruns','Regulatory\nCompliance','Employee\nAdoption','Vendor\nReliability'],
      datasets: [{ label:'Risk Score (P × I)', data:[9.0,6.0,6.0,4.0,5.5,4.8],
        borderColor: c.a1, backgroundColor: c.a1+'33',
        pointBackgroundColor: c.a1, borderWidth:2, pointRadius:4 }]
    },
    options: {
      animation: { duration:1300, easing:'easeOutQuart' },
      plugins: {
        legend: { display:false },
        title: { display:true, text:"Bark 'N Boujee — Risk Register: Probability × Impact Scores (PGMT409)",
          color:c.mut, font:{size:11,weight:'600'}, padding:{bottom:8} }
      },
      scales: {
        r: { min:0, max:10,
          ticks:{color:c.mut,backdropColor:'transparent',font:{size:8}},
          grid:{color:c.grid}, pointLabels:{color:c.txt,font:{size:9}}, angleLines:{color:c.grid} }
      }
    }
  });
};

/* ════════════════════════════════════════════════════════
   IntersectionObserver — fire charts when visible
════════════════════════════════════════════════════════ */
const CHART_INIT = {
  'heart-feature-chart':  window.initHeartFeatureChart,
  'heart-model-chart':    window.initHeartModelChart,
  'roar-revenue-chart':   window.initROARRevenueChart,
  'roar-segment-chart':   window.initROARSegmentChart,
  'ai-efficiency-chart':  window.initAIEfficiencyChart,
  'pulseplus-lift-chart': window.initPulsePlusChart,
  'pricing-impact-chart': window.initPricingChart,
  'bark-risk-chart':      window.initBarkRiskChart,
};

function observeAll() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && CHART_INIT[e.target.id]) CHART_INIT[e.target.id]();
    });
  }, { threshold: 0.15 });
  Object.keys(CHART_INIT).forEach(id => {
    const el = document.getElementById(id); if(el) obs.observe(el);
  });
}

window.PortfolioCharts = {
  reinitAll() {
    Object.keys(CHART_INIT).forEach(id => kill(id));
    _done.clear();
    setTimeout(() => {
      Object.keys(CHART_INIT).forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) CHART_INIT[id]?.();
      });
    }, 100);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  observeAll();
  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    setTimeout(() => window.PortfolioCharts.reinitAll(), 380);
  });
});
