<template>
  <div class="reports-view">
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ $t('nav.reports') }}</h1>
        <p class="page-subtitle">{{ $t('pages.stock') }}</p>
      </div>
      <el-button type="success" icon="el-icon-download" @click="exportCurrentTab" class="premium-button">
        {{ $t('actions.export') }} (XLSX)
      </el-button>
    </div>

    <el-tabs v-model="activeTab" type="border-card" class="glass-panel" style="border:none;">

      <!-- Posição de Estoque -->
      <el-tab-pane :label="$t('pages.entries')" name="position">
        <div class="filter-bar">
          <el-input v-model="searchPosition" :placeholder="$t('actions.search')" prefix-icon="el-icon-search" style="width:320px;"></el-input>
        </div>
        <el-table :data="pagedPosition" style="width: 100%" class="modern-table">
          <el-table-column prop="code" label="SKU" width="150"></el-table-column>
          <el-table-column prop="name" :label="$t('labels.product')" min-width="180"></el-table-column>
          <el-table-column prop="physical" :label="$t('labels.quantity')" width="160" align="center"></el-table-column>
          <el-table-column prop="reserved" label="Reservado" width="140" align="center"></el-table-column>
          <el-table-column prop="available" :label="$t('labels.available')" width="140" align="center">
            <template slot-scope="scope">
              <el-tag :type="scope.row.available > 0 ? 'success' : 'danger'" effect="plain" style="font-weight:bold;">
                {{ scope.row.available }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
        <div class="table-pagination">
          <el-pagination background layout="total, sizes, prev, pager, next"
            :total="positionData.length" :page-sizes="[10,25,50]"
            :page-size.sync="pageSize.position" :current-page.sync="page.position"
            @current-change="page.position = $event" @size-change="pageSize.position = $event">
          </el-pagination>
        </div>
      </el-tab-pane>

      <!-- Histórico de Movimentações -->
      <el-tab-pane :label="$t('wms.history')" name="movements">
        <div class="filter-bar">
          <el-input v-model="searchMovements" :placeholder="$t('actions.search')" prefix-icon="el-icon-search" style="width:320px;"></el-input>
          <el-select v-model="filterType" :placeholder="$t('labels.status')" clearable style="width:160px;">
            <el-option :label="$t('status.entry')" value="ENTRADA"></el-option>
            <el-option :label="$t('status.exit')" value="SAIDA"></el-option>
          </el-select>
        </div>
        <el-table :data="pagedMovements" style="width: 100%" class="modern-table">
          <el-table-column prop="date" :label="$t('labels.date')" width="170">
            <template slot-scope="scope">{{ new Date(scope.row.date).toLocaleString('pt-BR') }}</template>
          </el-table-column>
          <el-table-column prop="productName" :label="$t('labels.product')" min-width="180"></el-table-column>
          <el-table-column prop="batchId" :label="$t('labels.batch')" width="160"></el-table-column>
          <el-table-column prop="type" :label="$t('labels.status')" width="110" align="center">
            <template slot-scope="scope">
              <el-tag :type="scope.row.type === 'ENTRADA' ? 'success' : 'danger'" effect="plain" style="font-weight:700;">
                {{ scope.row.type === 'ENTRADA' ? $t('status.entry') : $t('status.exit') }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="quantity" :label="$t('labels.quantity')" width="130" align="center"></el-table-column>
          <el-table-column prop="user" :label="$t('labels.user')" width="150" align="center"></el-table-column>
        </el-table>
        <div class="table-pagination">
          <el-pagination background layout="total, sizes, prev, pager, next"
            :total="filteredMovements.length" :page-sizes="[10,25,50]"
            :page-size.sync="pageSize.movements" :current-page.sync="page.movements"
            @current-change="page.movements = $event" @size-change="pageSize.movements = $event">
          </el-pagination>
        </div>
      </el-tab-pane>

      <!-- Vencimentos -->
      <el-tab-pane :label="$t('labels.expiration')" name="expirations">
        <el-table :data="pagedExpirations" style="width: 100%" class="modern-table">
          <el-table-column prop="product.name" :label="$t('labels.product')" min-width="200"></el-table-column>
          <el-table-column prop="id" :label="$t('labels.batch')" width="180"></el-table-column>
          <el-table-column prop="locationId" :label="$t('labels.location')" width="160"></el-table-column>
          <el-table-column prop="expiration" :label="$t('labels.expiration')" width="160" align="center">
            <template slot-scope="scope">
              <span style="color:var(--danger-color); font-weight:700;">
                {{ new Date(scope.row.expiration).toLocaleDateString('pt-BR') }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="quantity" :label="$t('labels.quantity')" width="130" align="center">
            <template slot-scope="scope">
              <el-tag type="danger" effect="dark" style="font-weight:bold;">{{ scope.row.quantity }}</el-tag>
            </template>
          </el-table-column>
        </el-table>
        <div class="table-pagination">
          <el-pagination background layout="total, sizes, prev, pager, next"
            :total="expirations.length" :page-sizes="[10,25,50]"
            :page-size.sync="pageSize.expirations" :current-page.sync="page.expirations"
            @current-change="page.expirations = $event" @size-change="pageSize.expirations = $event">
          </el-pagination>
        </div>
      </el-tab-pane>

    </el-tabs>
  </div>
</template>

<script>
import { wmsAPI } from '../../services/mockData'
import * as xlsx from 'xlsx'

export default {
  name: 'ReportsView',
  data() {
    return {
      activeTab: 'position',
      searchPosition: '',
      searchMovements: '',
      filterType: '',
      products: [],
      batches: [],
      movements: [],
      page: { position: 1, movements: 1, expirations: 1 },
      pageSize: { position: 10, movements: 10, expirations: 10 }
    }
  },
  computed: {
    positionData() {
      return this.products.map(p => {
        const pb = this.batches.filter(b => b.productId === p.id)
        const physical = pb.reduce((acc, b) => acc + (b.quantity || 0), 0)
        const reserved = pb.reduce((acc, b) => acc + (b.reserved || 0), 0)
        return { ...p, physical, reserved, available: physical - reserved }
      }).filter(p => !this.searchPosition || p.name.toLowerCase().includes(this.searchPosition.toLowerCase()) || (p.code && p.code.toLowerCase().includes(this.searchPosition.toLowerCase())))
    },
    pagedPosition() {
      const s = (this.page.position - 1) * this.pageSize.position
      return this.positionData.slice(s, s + this.pageSize.position)
    },
    filteredMovements() {
      return this.movements.filter(m => {
        if (this.filterType && m.type !== this.filterType) return false
        if (this.searchMovements) {
          const q = this.searchMovements.toLowerCase()
          if (!m.productName?.toLowerCase().includes(q) && !m.batchId?.toLowerCase().includes(q)) return false
        }
        return true
      })
    },
    pagedMovements() {
      const s = (this.page.movements - 1) * this.pageSize.movements
      return this.filteredMovements.slice(s, s + this.pageSize.movements)
    },
    expirations() {
      return this.batches.filter(b => b.status === 'QUARENTENA' || (new Date(b.expiration) - new Date()) / (1000*60*60*24) < 90)
    },
    pagedExpirations() {
      const s = (this.page.expirations - 1) * this.pageSize.expirations
      return this.expirations.slice(s, s + this.pageSize.expirations)
    }
  },
  watch: {
    searchPosition() { this.page.position = 1 },
    searchMovements() { this.page.movements = 1 },
    filterType() { this.page.movements = 1 }
  },
  async created() {
    this.products = await wmsAPI.getProducts()
    this.batches = await wmsAPI.getBatches()
    this.movements = await wmsAPI.getMovements()
    this.movements.sort((a,b) => new Date(b.date) - new Date(a.date))
  },
  methods: {
    exportCurrentTab() {
      let data = [], fileName = ''
      if (this.activeTab === 'position') {
        data = this.positionData.map(d => ({ 'SKU': d.code, 'Produto': d.name, 'Físico': d.physical, 'Reservado': d.reserved, 'Disponível': d.available }))
        fileName = 'Relatório_Posição_Estoque.xlsx'
      } else if (this.activeTab === 'movements') {
        data = this.filteredMovements.map(m => ({ 'Data': new Date(m.date).toLocaleString('pt-BR'), 'Lote': m.batchId, 'Produto': m.productName, 'Tipo': m.type === 'ENTRADA' ? 'Entrada' : 'Saída', 'Quantidade': m.quantity, 'Operador': m.user }))
        fileName = 'Relatório_Histórico_Movimentações.xlsx'
      } else if (this.activeTab === 'expirations') {
        data = this.expirations.map(e => ({ 'Produto': e.product.name, 'Lote': e.id, 'Vencimento': new Date(e.expiration).toLocaleDateString('pt-BR'), 'Quantidade': e.quantity, 'Local': e.locationId }))
        fileName = 'Relatório_Vencimentos.xlsx'
      }
      const ws = xlsx.utils.json_to_sheet(data)
      const wb = xlsx.utils.book_new()
      xlsx.utils.book_append_sheet(wb, ws, 'Dados')
      xlsx.writeFile(wb, fileName)
      this.$message.success(this.$t('notifications.savedSuccess'))
    }
  }
}
</script>

<style scoped>
.modern-table { background: transparent; }
.modern-table ::v-deep th { background-color: transparent !important; }
.modern-table ::v-deep tr { background-color: transparent !important; }

.premium-button {
  background: linear-gradient(135deg, var(--success-color), #059669) !important;
  border: none !important;
  font-weight: 700 !important;
  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);
  color: #fff;
}
.premium-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.6);
}
</style>
