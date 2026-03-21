<template>
  <div class="shipping-list">
    <div class="page-header">
      <div>
        <h1 class="page-title">Expedição de Mercadorias</h1>
        <p class="page-subtitle">Ordens de saída, separação e embalagem</p>
      </div>
      <el-button type="primary" icon="el-icon-plus" @click="$router.push('/shipping/new')">
        Nova Ordem de Expedição
      </el-button>
    </div>

    <div class="filter-bar">
      <el-input v-model="search" placeholder="Buscar por destino, pedido ou ID..." prefix-icon="el-icon-search" style="width:320px;" clearable></el-input>
      <el-select v-model="filterStatus" placeholder="Status" clearable style="width:200px;">
        <el-option label="Pendente" value="PENDENTE"></el-option>
        <el-option label="Em Separação" value="SEPARACAO"></el-option>
        <el-option label="Separado" value="SEPARADO"></el-option>
        <el-option label="Em Embalagem" value="EMBALAGEM"></el-option>
        <el-option label="Expedido" value="EXPEDIDO"></el-option>
      </el-select>
      <el-button icon="el-icon-refresh" @click="load">Atualizar</el-button>
    </div>

    <el-card class="glass-panel" style="border:none;" v-loading="loading">
      <el-table :data="pagedList" style="width:100%" class="modern-table">
        <el-table-column prop="id" label="Ordem" width="130"></el-table-column>
        <el-table-column prop="destination" label="Destino" min-width="180"></el-table-column>
        <el-table-column prop="orderRef" label="Pedido" width="140"></el-table-column>
        <el-table-column prop="requiredDate" label="Entrega Prevista" width="150" align="center">
          <template slot-scope="s">{{ formatDate(s.row.requiredDate) }}</template>
        </el-table-column>
        <el-table-column label="Prioridade" width="110" align="center">
          <template slot-scope="s">
            <el-tag :type="s.row.priority === 'URGENTE' ? 'danger' : 'info'" effect="plain" size="small">{{ s.row.priority }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Itens" width="75" align="center">
          <template slot-scope="s">{{ s.row.items.length }}</template>
        </el-table-column>
        <el-table-column label="Status" width="160" align="center">
          <template slot-scope="s">
            <el-tag :type="statusType(s.row.status)" effect="plain" style="font-weight:700;">
              {{ statusLabel(s.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Ações" width="120" align="center">
          <template slot-scope="s">
            <el-button type="text" icon="el-icon-view" @click="$router.push('/shipping/' + s.row.id)">Abrir</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="table-pagination">
        <el-pagination background layout="total, sizes, prev, pager, next"
          :total="filtered.length" :page-sizes="[10,25,50]"
          :page-size.sync="pageSize" :current-page.sync="currentPage"
          @current-change="currentPage = $event" @size-change="pageSize = $event">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { wmsAPI } from '../../services/mockData'
export default {
  name: 'ShippingListView',
  data() {
    return { list: [], loading: false, search: '', filterStatus: '', currentPage: 1, pageSize: 10 }
  },
  computed: {
    filtered() {
      return this.list.filter(s => {
        if (this.filterStatus && s.status !== this.filterStatus) return false
        if (this.search) {
          const q = this.search.toLowerCase()
          if (!s.destination.toLowerCase().includes(q) && !s.orderRef.toLowerCase().includes(q) && !s.id.toLowerCase().includes(q)) return false
        }
        return true
      })
    },
    pagedList() {
      const start = (this.currentPage - 1) * this.pageSize
      return this.filtered.slice(start, start + this.pageSize)
    }
  },
  watch: { search() { this.currentPage = 1 }, filterStatus() { this.currentPage = 1 } },
  created() { this.load() },
  methods: {
    async load() {
      this.loading = true
      this.list = await wmsAPI.listShippings()
      this.loading = false
    },
    formatDate(d) { return d ? new Date(d).toLocaleDateString('pt-BR') : '—' },
    statusLabel(s) {
      return { PENDENTE: 'Pendente', SEPARACAO: 'Em Separação', SEPARADO: 'Separado', EMBALAGEM: 'Em Embalagem', EXPEDIDO: 'Expedido' }[s] || s
    },
    statusType(s) {
      return { PENDENTE: 'info', SEPARACAO: 'warning', SEPARADO: 'primary', EMBALAGEM: 'warning', EXPEDIDO: 'success' }[s] || 'info'
    }
  }
}
</script>

<style scoped>
.modern-table { background: transparent; }
.modern-table ::v-deep th { background-color: transparent !important; }
.modern-table ::v-deep tr { background-color: transparent !important; }
</style>
