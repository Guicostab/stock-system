<template>
  <div class="outbound-view">
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ $t('outbound.title') }}</h1>
        <p class="page-subtitle">{{ $t('outbound.subtitle') }}</p>
      </div>
    </div>

    <el-card class="glass-panel main-form-card" style="max-width: 950px; margin: 0 auto; border:none; border-radius:16px;">

      <el-form label-position="top">
        <el-form-item :label="$t('outbound.selectProduct')">
          <el-select
            v-model="selectedProduct"
            style="width: 100%"
            filterable
            :placeholder="$t('outbound.selectProductPlaceholder')"
            @change="loadBatches"
          >
            <el-option v-for="p in products" :key="p.id" :label="p.code + ' — ' + p.name" :value="p.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div v-if="selectedProduct && availableBatches.length > 0">
        <h4 style="margin-top:32px; font-weight:700; color:var(--text-main);">{{ $t('outbound.availableBatches') }}</h4>
        <el-table :data="availableBatches" style="width: 100%" class="modern-table">
          <el-table-column prop="id" :label="$t('outbound.batchCode')" width="200"></el-table-column>
          <el-table-column prop="locationId" :label="$t('outbound.binLocation')" width="180"></el-table-column>
          <el-table-column prop="expiration" :label="$t('outbound.expirationDate')" width="220" align="center">
            <template slot-scope="scope">
              <span style="font-weight:700; color:var(--danger-color);">
                {{ scope.row.expiration ? new Date(scope.row.expiration).toLocaleDateString('pt-BR') : '—' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('outbound.freeStock')" width="160" align="center">
            <template slot-scope="scope">
              <el-tag type="success" effect="dark" style="font-weight:700; font-size:1rem;">
                {{ scope.row.quantity - (scope.row.reserved || 0) }} un.
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column align="right">
            <template slot-scope="scope">
              <el-button size="small" type="primary" @click="prepareDispatch(scope.row)">
                {{ $t('outbound.dispatch') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div
        v-else-if="selectedProduct && availableBatches.length === 0"
        style="padding: 40px; margin-top:24px; text-align:center; color:var(--text-muted); background:var(--bg-lighter); border-radius:8px;"
      >
        <i class="el-icon-warning-outline" style="font-size:2rem; margin-bottom:12px; display:block;"></i>
        {{ $t('outbound.noStock') }}
      </div>
    </el-card>

    <el-dialog
      :title="$t('outbound.dialogTitle')"
      :visible.sync="dispatchDialog"
      width="480px"
      custom-class="premium-dialog"
    >
      <el-form label-position="top">
        <el-form-item :label="$t('outbound.selectedBatch')">
          <el-input :value="activeBatch ? activeBatch.id : ''" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('outbound.quantityToDispatch')">
          <el-input-number
            v-model="dispatchForm.quantity"
            :min="1"
            :max="activeBatch ? (activeBatch.quantity - (activeBatch.reserved || 0)) : 1"
            style="width:100%;"
            controls-position="right"
          ></el-input-number>
          <div style="font-size:0.85rem; color:var(--text-muted); margin-top:8px;">
            Máximo disponível neste lote:
            <strong>{{ activeBatch ? (activeBatch.quantity - (activeBatch.reserved || 0)) : 0 }} unidades.</strong>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dispatchDialog = false">{{ $t('outbound.cancel') }}</el-button>
        <el-button type="danger" @click="confirmDispatch" :loading="loading" class="premium-button">
          {{ $t('outbound.confirmDispatch') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { wmsAPI } from '../../services/mockData'

export default {
  name: 'OutboundView',
  data() {
    return {
      products: [],
      allBatches: [],
      selectedProduct: '',
      availableBatches: [],
      dispatchDialog: false,
      activeBatch: null,
      loading: false,
      dispatchForm: { quantity: 1 }
    }
  },
  async created() {
    this.products = await wmsAPI.getProducts()
    this.refreshBatches()
  },
  methods: {
    async refreshBatches() {
      this.allBatches = await wmsAPI.getBatches()
    },
    loadBatches() {
      if (!this.selectedProduct) { this.availableBatches = []; return }
      this.availableBatches = this.allBatches
        .filter(b => b.productId === this.selectedProduct && (b.quantity - (b.reserved || 0)) > 0 && b.status === 'APROVADO')
        .sort((a, b) => {
          if (!a.expiration) return 1
          if (!b.expiration) return -1
          return new Date(a.expiration) - new Date(b.expiration)
        })
    },
    prepareDispatch(batch) {
      this.activeBatch = batch
      this.dispatchForm.quantity = 1
      this.dispatchDialog = true
    },
    async confirmDispatch() {
      this.loading = true
      try {
        const user = this.$store.getters.userProfile?.name || 'Operador'
        await wmsAPI.processOutbound({ batchId: this.activeBatch.id, quantity: this.dispatchForm.quantity, user })
        this.$message.success(this.$t('outbound.success'))
        this.dispatchDialog = false
        await this.refreshBatches()
        this.loadBatches()
      } catch (e) {
        this.$message.error(e.toString())
      }
      this.loading = false
    }
  }
}
</script>

<style scoped>
.modern-table { background: transparent; }
.modern-table ::v-deep th { background-color: transparent !important; }
.modern-table ::v-deep tr { background-color: transparent !important; }
.main-form-card { padding: 40px; box-shadow: 0 10px 40px rgba(0,0,0,0.06); }
.premium-button {
  background: linear-gradient(135deg, var(--danger-color), #be123c) !important;
  border: none !important;
  font-weight: 700 !important;
  box-shadow: 0 4px 14px rgba(225, 29, 72, 0.4);
  color: #fff;
}
.premium-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(225, 29, 72, 0.6);
}
</style>
