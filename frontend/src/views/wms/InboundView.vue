<template>
  <div class="inbound-view">
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ $t('inbound.title') }}</h1>
        <p class="page-subtitle">{{ $t('inbound.subtitle') }}</p>
      </div>
    </div>

    <el-card class="glass-panel main-form-card" style="max-width: 900px; margin: 0 auto; border:none; border-radius:16px;">
      <el-form :model="form" :rules="rules" ref="form" label-position="top">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item :label="$t('inbound.product')" prop="productId">
              <el-select v-model="form.productId" style="width: 100%" filterable :placeholder="$t('actions.search') + '...'">
                <el-option v-for="p in products" :key="p.id" :label="p.code + ' — ' + p.name" :value="p.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('inbound.batchId')" prop="batchId">
              <el-input v-model="form.batchId" :placeholder="$t('inbound.batchIdHint')"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item :label="$t('inbound.quantity')" prop="quantity">
              <el-input-number v-model="form.quantity" :min="1" style="width: 100%" controls-position="right"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('inbound.expiration')" prop="expiration">
              <el-date-picker
                v-model="form.expiration"
                type="date"
                style="width: 100%"
                :placeholder="$t('actions.search')"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('inbound.location')" prop="locationId">
              <el-select v-model="form.locationId" filterable style="width: 100%" :placeholder="$t('actions.search') + '...'">
                <el-option label="Z1-A1-B2 — Zona Leste / Corredor A1" value="Z1-A1-B2"></el-option>
                <el-option label="C1-RF — Câmara Fria" value="C1-RF"></el-option>
                <el-option label="Z2-A2 — Zona Oeste / Doca" value="Z2-A2"></el-option>
                <el-option label="Q1-QT — Quarentena" value="Q1-QT"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider></el-divider>

        <div style="text-align: right; margin-top: 16px;">
          <el-button @click="resetForm" style="margin-right:8px;">{{ $t('inbound.reset') }}</el-button>
          <el-button type="success" @click="submitInbound" :loading="loading" class="premium-button">
            {{ $t('inbound.submit') }}
          </el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { wmsAPI } from '../../services/mockData'

export default {
  name: 'InboundView',
  data() {
    return {
      products: [],
      loading: false,
      form: { productId: '', batchId: '', quantity: 1, expiration: '', locationId: '' },
      rules: {
        productId: [{ required: true, message: this.$t('inbound.errorProduct'), trigger: 'change' }],
        quantity:  [{ required: true, message: this.$t('inbound.errorQuantity'), trigger: 'blur' }],
        locationId:[{ required: true, message: this.$t('inbound.errorLocation'), trigger: 'change' }]
      }
    }
  },
  async created() {
    this.products = await wmsAPI.getProducts()
  },
  methods: {
    resetForm() {
      this.$refs.form.resetFields()
    },
    submitInbound() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.loading = true
          const user = this.$store.getters.userProfile?.name || 'Operador'
          await wmsAPI.processInbound({ ...this.form, user })
          this.$message.success(this.$t('inbound.success'))
          this.resetForm()
          this.loading = false
        }
      })
    }
  }
}
</script>

<style scoped>
.main-form-card { padding: 40px; box-shadow: 0 10px 40px rgba(0,0,0,0.06); }
.premium-button {
  background: linear-gradient(135deg, var(--success-color), #059669) !important;
  border: none !important;
  font-weight: 700 !important;
  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);
  color: #fff;
  padding: 12px 24px;
}
.premium-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.6);
}
</style>
