<template>
  <div class="unified-inventory">
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ $t('nav.inventory') }}</h1>
        <p class="page-subtitle">{{ $t('wms.batches') }}</p>
      </div>
      <el-button type="primary" icon="el-icon-refresh" @click="fetchData">{{ $t('actions.refresh') }}</el-button>
    </div>

    <el-card class="glass-panel" style="border:none;">
      <div class="filter-bar">
        <el-input v-model="filters.search" :placeholder="$t('actions.search')" prefix-icon="el-icon-search" style="width: 280px;"></el-input>
        <el-select v-model="filters.category" :placeholder="$t('labels.category')" clearable style="width:200px;">
          <el-option v-for="c in categories" :key="c.id" :label="c.name" :value="c.id"></el-option>
        </el-select>
        <el-select v-model="filters.status" :placeholder="$t('labels.status')" clearable style="width:180px;">
          <el-option :label="$t('status.approved')" value="APROVADO"></el-option>
          <el-option :label="$t('status.quarantine')" value="QUARENTENA"></el-option>
        </el-select>
      </div>

      <el-table :data="pagedInventory" v-loading="loading" style="width: 100%" class="modern-table">
        <el-table-column prop="product.name" :label="$t('labels.product')" min-width="200"></el-table-column>
        <el-table-column prop="id" :label="$t('labels.batch')" width="180"></el-table-column>
        <el-table-column prop="locationId" :label="$t('labels.location')" width="160" align="center"></el-table-column>

        <el-table-column :label="$t('labels.quantity')" width="130" align="center">
          <template slot-scope="scope">
            <el-tag type="info" effect="plain" style="font-weight:bold;">{{ scope.row.quantity }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="Reservado" width="120" align="center">
          <template slot-scope="scope">
            <span style="color: #f59e0b; font-weight:700;">{{ scope.row.reserved || 0 }}</span>
          </template>
        </el-table-column>

        <el-table-column :label="$t('labels.available')" width="130" align="center">
          <template slot-scope="scope">
            <el-tag
              :type="(scope.row.quantity - (scope.row.reserved || 0)) > 0 ? 'success' : 'danger'"
              effect="dark"
              style="font-weight:bold;"
            >{{ scope.row.quantity - (scope.row.reserved || 0) }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="expiration" :label="$t('labels.expiration')" width="160" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.expiration">{{ new Date(scope.row.expiration).toLocaleDateString('pt-BR') }}</span>
            <span v-else style="color:var(--text-muted);">—</span>
          </template>
        </el-table-column>

        <el-table-column :label="$t('labels.status')" width="130" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status === 'APROVADO' ? 'success' : 'warning'" effect="plain">
              {{ scope.row.status === 'APROVADO' ? $t('status.approved') : $t('status.quarantine') }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>

      <div class="table-pagination">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next"
          :total="filteredInventory.length"
          :page-sizes="[10, 25, 50]"
          :page-size.sync="pageSize"
          :current-page.sync="currentPage"
          @current-change="currentPage = $event"
          @size-change="pageSize = $event"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { wmsAPI } from '../../services/mockData'

export default {
  name: 'UnifiedInventory',
  data() {
    return {
      inventory: [],
      categories: [],
      loading: false,
      currentPage: 1,
      pageSize: 10,
      filters: { search: '', category: '', status: '' }
    }
  },
  computed: {
    filteredInventory() {
      return this.inventory.filter(item => {
        if (this.filters.search) {
          const s = this.filters.search.toLowerCase()
          if (!item.product.name.toLowerCase().includes(s) && !item.id.toLowerCase().includes(s)) return false
        }
        if (this.filters.status && item.status !== this.filters.status) return false
        return true
      })
    },
    pagedInventory() {
      const start = (this.currentPage - 1) * this.pageSize
      return this.filteredInventory.slice(start, start + this.pageSize)
    }
  },
  watch: {
    'filters.search'() { this.currentPage = 1 },
    'filters.status'() { this.currentPage = 1 }
  },
  async created() {
    this.fetchData()
    this.categories = await wmsAPI.getCategories()
  },
  methods: {
    async fetchData() {
      this.loading = true
      this.inventory = await wmsAPI.getBatches()
      this.loading = false
    }
  }
}
</script>

<style scoped>
.modern-table { background: transparent; }
.modern-table ::v-deep th { background-color: transparent !important; }
.modern-table ::v-deep tr { background-color: transparent !important; }
</style>
