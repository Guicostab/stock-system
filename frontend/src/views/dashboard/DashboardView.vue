<template>
  <div class="dashboard-view">
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ $t('dashboard.title') }}</h1>
        <p class="page-subtitle">{{ $t('dashboard.subtitle') }}</p>
      </div>
      <div>
        <el-date-picker type="daterange" start-placeholder="Start" end-placeholder="End" size="small" style="background:transparent; border-color:var(--border-color);"></el-date-picker>
      </div>
    </div>

    <!-- Quick KPIs -->
    <el-row :gutter="24">
      <el-col :span="6">
        <el-card class="glass-panel kpi-card">
          <div class="kpi-icon primary"><i class="el-icon-box"></i></div>
          <div class="kpi-data">
            <p class="kpi-label">{{ $t('dashboard.totalProducts') }}</p>
            <h2 class="kpi-value">{{ kpis.totalProducts }} <span class="trend up"><i class="el-icon-top"></i> 4%</span></h2>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="glass-panel kpi-card">
          <div class="kpi-icon warning"><i class="el-icon-warning-outline"></i></div>
          <div class="kpi-data">
            <p class="kpi-label">{{ $t('dashboard.lowStock') }}</p>
            <h2 class="kpi-value">{{ kpis.lowStock }} <span class="trend down"><i class="el-icon-bottom"></i> 2%</span></h2>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="glass-panel kpi-card">
          <div class="kpi-icon success"><i class="el-icon-sort"></i></div>
          <div class="kpi-data">
            <p class="kpi-label">{{ $t('dashboard.movementMonth') }}</p>
            <h2 class="kpi-value">{{ kpis.movements }} <span class="trend up"><i class="el-icon-top"></i> 12%</span></h2>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="glass-panel kpi-card">
          <div class="kpi-icon info"><i class="el-icon-data-line"></i></div>
          <div class="kpi-data">
            <p class="kpi-label">{{ $t('dashboard.inventoryValue') }}</p>
            <h2 class="kpi-value">$ 1.2M <span class="trend up"><i class="el-icon-top"></i> 8%</span></h2>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Deep Charts & Graph Visualization -->
    <el-row :gutter="24" style="margin-top: 24px;">
      <el-col :span="16">
        <el-card class="glass-panel" style="border: none;">
          <div slot="header" style="border-bottom:none;">
            <h3 style="margin:0; font-family:'Plus Jakarta Sans',sans-serif; color:var(--text-main);">{{ $t('dashboard.recentMovements') }}</h3>
          </div>
          <div id="movementChart" style="width: 100%; height: 350px;"></div>
        </el-card>
      </el-col>

      <!-- Quick Actions / Shortcuts -->
      <el-col :span="8">
        <el-card class="glass-panel" style="border: none;">
          <div slot="header" style="border-bottom:none;">
             <h3 style="margin:0; font-family:'Plus Jakarta Sans',sans-serif; color:var(--text-main);">{{ $t('dashboard.quickAccess') }}</h3>
          </div>
          <div class="action-grid">
             <el-button class="quick-btn" @click="$router.push('/inventory')"><i class="el-icon-s-operation"></i> {{ $t('nav.inventory') }}</el-button>
             <el-button class="quick-btn" @click="$router.push('/products')"><i class="el-icon-box"></i> {{ $t('wms.products') }}</el-button>
             <el-button class="quick-btn" @click="$router.push('/movements')"><i class="el-icon-camera-solid"></i> {{ $t('wms.track') }}</el-button>
             <el-button class="quick-btn" @click="$router.push('/reports')"><i class="el-icon-pie-chart"></i> {{ $t('nav.reports') }}</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'DashboardView',
  data() {
    return {
      kpis: {
        totalProducts: 1452,
        lowStock: 28,
        movements: 349
      },
      chartInstance: null
    }
  },
  mounted() {
    this.initChart();
  },
  beforeDestroy() {
    if (this.chartInstance) {
       window.removeEventListener('resize', this.chartInstance.resize);
       this.chartInstance.dispose();
    }
  },
  methods: {
    initChart() {
      const chartDom = document.getElementById('movementChart');
      this.chartInstance = echarts.init(chartDom);
      const isDark = document.documentElement.classList.contains('dark-theme-mode');
      const textColor = isDark ? '#f8fafc' : '#64748b';
      
      const option = {
        tooltip: { trigger: 'axis' },
        legend: { data: [this.$t('status.entry'), this.$t('status.exit')], textStyle: { color: textColor } },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: { type: 'category', boundaryGap: false, data: ['14/03', '15/03', '16/03', '17/03', '18/03', '19/03', '20/03'], axisLabel: { color: textColor } },
        yAxis: { type: 'value', axisLabel: { color: textColor }, splitLine: { lineStyle: { color: isDark ? 'rgba(255,255,255,0.05)' : '#e2e8f0' } } },
        series: [
          { name: this.$t('status.entry'), type: 'line', data: [120, 180, 290, 150, 420, 310, 205], areaStyle: {}, smooth: true, itemStyle: { color: '#34d399' } },
          { name: this.$t('status.exit'), type: 'line', data: [90,  150, 180, 190, 380, 240, 290], areaStyle: {}, smooth: true, itemStyle: { color: '#818cf8' } }
        ]
      };
      this.chartInstance.setOption(option);
      window.addEventListener('resize', this.chartInstance.resize);
    }
  },
  watch: {
    '$i18n.locale'() {
       this.initChart();
    }
  }
}
</script>

<style scoped>
.kpi-card { display: flex; align-items: center; border: none; padding: 12px; }
.kpi-card ::v-deep .el-card__body { display: flex; align-items: center; width: 100%; padding: 0; }
.kpi-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; margin-right: 16px; }
.kpi-icon.primary { background: rgba(99, 102, 241, 0.1); color: var(--primary-color); }
.kpi-icon.warning { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
.kpi-icon.success { background: rgba(16, 185, 129, 0.1); color: var(--success-color); }
.kpi-icon.info { background: rgba(56, 189, 248, 0.1); color: #38bdf8; }

.kpi-data { flex: 1; }
.kpi-label { margin: 0; font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; }
.kpi-value { margin: 4px 0 0 0; font-size: 1.8rem; font-weight: 800; color: var(--text-main); display: flex; align-items: center; justify-content: space-between; }

.trend { font-size: 0.85rem; font-weight: 700; padding: 4px 8px; border-radius: 20px; display: flex; align-items: center; gap: 4px; }
.trend.up { background: rgba(16, 185, 129, 0.1); color: var(--success-color); }
.trend.down { background: rgba(244, 63, 94, 0.1); color: var(--danger-color); }

.action-grid { display: flex; flex-direction: column; gap: 12px; }
.quick-btn { text-align: left; padding: 16px; font-size: 1rem; font-weight: 600; border-radius: 12px; background: rgba(99, 102, 241, 0.05); color: var(--primary-color); border: 1px solid rgba(99, 102, 241, 0.2); transition: all 0.2s; }
.quick-btn:hover { background: var(--primary-color); color: white; transform: translateX(4px); border-color: transparent; }
.quick-btn i { font-size: 1.2rem; margin-right: 8px; vertical-align: middle; }
</style>
