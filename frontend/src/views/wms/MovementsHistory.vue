<template>
  <div class="movements-view">
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ $t('wms.track') }}</h1>
        <p class="page-subtitle">Histórico global e auditoria de movimentações físicas do estoque.</p>
      </div>
      <el-button icon="el-icon-download" type="secondary" class="glass-panel" style="border:1px solid var(--border-color);">Exportar Excel</el-button>
    </div>

    <el-card class="glass-panel" style="border: none; border-radius: 16px;">
      <el-table :data="movements" v-loading="loading" style="width: 100%" class="modern-table">
        <el-table-column prop="date" label="T-Stamp" width="180">
          <template slot-scope="scope">{{ formatDateTime(scope.row.date) }}</template>
        </el-table-column>
        <el-table-column prop="batchId" label="Lote (Batch ID)" width="150"></el-table-column>
        <el-table-column prop="code" label="SKU Origem" width="120"></el-table-column>
        <el-table-column prop="productName" label="Designação de Produto"></el-table-column>
        
        <el-table-column prop="type" label="Natureza" width="130" align="center">
           <template slot-scope="scope">
              <el-tag :type="scope.row.type === 'ENTRADA' ? 'success' : 'danger'" effect="plain">
                  <i :class="scope.row.type === 'ENTRADA' ? 'el-icon-bottom-left' : 'el-icon-top-right'"></i> 
                  {{ scope.row.type }}
              </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="quantity" label="Volume" width="100" align="center">
          <template slot-scope="scope">
            <strong>{{ scope.row.quantity }}</strong>
          </template>
        </el-table-column>

        <el-table-column prop="user" label="ID Operador" width="150" align="center"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { wmsAPI } from '../../services/mockData'

export default {
  name: 'MovementsHistory',
  data() { return { movements: [], loading: false } },
  async created() {
    this.loading = true;
    this.movements = await wmsAPI.getMovements();
    this.movements.sort((a,b) => new Date(b.date) - new Date(a.date));
    this.loading = false;
  },
  methods: {
    formatDateTime(dateStr) {
      if (!dateStr) return '-';
      return new Date(dateStr).toLocaleString('pt-BR');
    }
  }
}
</script>

<style scoped>
.modern-table { background: transparent; }
.modern-table ::v-deep th { background-color: transparent !important; }
.modern-table ::v-deep tr { background-color: transparent !important; }
</style>
