<template>
  <div class="locations-view">
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ $t('nav.locations') }}</h1>
        <p class="page-subtitle">Visualização topológica e gerenciamento do mapa Endereçamento do armazém.</p>
      </div>
      <el-button type="primary" icon="el-icon-plus">Nova Localidade Tática</el-button>
    </div>

    <el-card class="glass-panel" style="border: none; border-radius: 16px;">
      <el-table :data="locations" v-loading="loading" style="width: 100%" class="modern-table">
        <el-table-column prop="id" label="Location ID (Bin)" width="180"></el-table-column>
        <el-table-column prop="zone" label="Zona / Área Estrutural"></el-table-column>
        <el-table-column prop="aisle" label="Corredor" width="120" align="center"></el-table-column>
        <el-table-column prop="shelf" label="Prateleira (Shelf)" width="160" align="center"></el-table-column>
        <el-table-column prop="status" label="Status Ocupação" width="160" align="center">
          <template slot-scope="scope">
              <el-tag :type="scope.row.status === 'Livre' ? 'success' : 'danger'" effect="dark" style="border-radius: 8px;">
                  <i :class="scope.row.status === 'Livre' ? 'el-icon-check' : 'el-icon-close'"></i> {{ scope.row.status }}
              </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { wmsAPI } from '../../services/mockData'

export default {
  name: 'LocationsManager',
  data() { return { locations: [], loading: false } },
  async created() {
    this.loading = true;
    this.locations = await wmsAPI.getLocations();
    this.loading = false;
  }
}
</script>

<style scoped>
.modern-table { background: transparent; }
.modern-table ::v-deep th { background-color: transparent !important; }
.modern-table ::v-deep tr { background-color: transparent !important; }
</style>
