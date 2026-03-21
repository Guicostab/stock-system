<template>
  <div class="receiving-list">
    <div class="page-header">
      <div>
        <h1 class="page-title">Recebimento de Mercadorias</h1>
        <p class="page-subtitle">Gestão de documentos de entrada no armazém</p>
      </div>
      <el-button type="primary" icon="el-icon-plus" @click="$router.push('/receiving/new')">
        Novo Recebimento
      </el-button>
    </div>

    <!-- Filters -->
    <div class="filter-bar">
      <el-input v-model="search" placeholder="Buscar por fornecedor, nota ou ID..." prefix-icon="el-icon-search" style="width:320px;" clearable></el-input>
      <el-select v-model="filterStatus" placeholder="Status" clearable style="width:180px;">
        <el-option label="Aguardando" value="AGUARDANDO"></el-option>
        <el-option label="Conferência" value="CONFERENCIA"></el-option>
        <el-option label="Recontagem" value="RECONTAGEM"></el-option>
        <el-option label="Conferido" value="CONFERIDO"></el-option>
        <el-option label="Concluído" value="CONCLUIDO"></el-option>
      </el-select>
      <el-button icon="el-icon-refresh" @click="load">Atualizar</el-button>
    </div>

    <el-card class="glass-panel" style="border:none;" v-loading="loading">
      <el-table :data="pagedList" style="width:100%" class="modern-table">
        <el-table-column prop="id" label="Documento" width="130"></el-table-column>
        <el-table-column prop="supplier" label="Fornecedor" min-width="180"></el-table-column>
        <el-table-column prop="docNumber" label="Nota Fiscal" width="140"></el-table-column>
        <el-table-column prop="expectedDate" label="Data Prevista" width="140" align="center">
          <template slot-scope="s">{{ formatDate(s.row.expectedDate) }}</template>
        </el-table-column>
        <el-table-column label="Itens" width="80" align="center">
          <template slot-scope="s">{{ s.row.items.length }}</template>
        </el-table-column>
        <el-table-column label="Status" width="150" align="center">
          <template slot-scope="s">
            <el-tag :type="statusType(s.row.status)" effect="plain" style="font-weight:700;">
              {{ statusLabel(s.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Ações" width="130" align="center">
          <template slot-scope="s">
            <el-button type="text" icon="el-icon-view" @click="$router.push('/receiving/' + s.row.id)">Abrir</el-button>
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
  name: 'ReceivingListView',
  data() {
    return { list: [], loading: false, search: '', filterStatus: '', currentPage: 1, pageSize: 10 }
  },
  computed: {
    filtered() {
      return this.list.filter(r => {
        if (this.filterStatus && r.status !== this.filterStatus) return false
        if (this.search) {
          const q = this.search.toLowerCase()
          if (!r.supplier.toLowerCase().includes(q) && !r.docNumber.toLowerCase().includes(q) && !r.id.toLowerCase().includes(q)) return false
        }
        return true
      })
    },
    pagedList() {
      const s = (this.currentPage - 1) * this.pageSize
      return this.filtered.slice(s, s + this.pageSize)
    }
  },
  watch: { search() { this.currentPage = 1 }, filterStatus() { this.currentPage = 1 } },
  created() { this.load() },
  methods: {
    async load() {
      this.loading = true
      this.list = await wmsAPI.listReceivings()
      this.loading = false
    },
    formatDate(d) { return d ? new Date(d).toLocaleDateString('pt-BR') : '—' },
    statusLabel(s) {
      return { AGUARDANDO: 'Aguardando', CONFERENCIA: 'Em Conferência', RECONTAGEM: 'Recontagem', CONFERIDO: 'Conferido', CONCLUIDO: 'Concluído' }[s] || s
    },
    statusType(s) {
      return { AGUARDANDO: 'info', CONFERENCIA: 'warning', RECONTAGEM: 'danger', CONFERIDO: 'primary', CONCLUIDO: 'success' }[s] || 'info'
    }
  }
}
</script>

<style scoped>
.modern-table { background: transparent; }
.modern-table ::v-deep th { background-color: transparent !important; }
.modern-table ::v-deep tr { background-color: transparent !important; }
</style>
