<template>
  <div class="products-view">
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ $t('wms.products') }}</h1>
        <p class="page-subtitle">{{ $t('nav.catalog') }}</p>
      </div>
      <el-button type="primary" icon="el-icon-plus" @click="openDialog()">{{ $t('actions.new') }} {{ $t('labels.product') }}</el-button>
    </div>

    <el-card class="glass-panel" style="border: none; border-radius: 16px;">
      <div class="filter-bar">
        <el-input v-model="searchQuery" :placeholder="$t('actions.search')" prefix-icon="el-icon-search" clearable style="width: 320px;"></el-input>
      </div>

      <el-table :data="pagedProducts" v-loading="loading" style="width: 100%" class="modern-table">
        <el-table-column prop="code" label="SKU" width="150" sortable></el-table-column>
        <el-table-column prop="name" :label="$t('labels.product')" sortable></el-table-column>
        <el-table-column prop="category" :label="$t('labels.category')" width="220">
           <template slot-scope="scope">
              {{ scope.row.category || '—' }}
           </template>
        </el-table-column>
        <el-table-column prop="minStock" :label="$t('labels.minStock')" width="180" align="center"></el-table-column>
        <el-table-column :label="$t('labels.actions')" width="120" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" @click="openDialog(scope.row)"></el-button>
            <el-button type="text" class="text-danger" icon="el-icon-delete" @click="handleDelete(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="table-pagination">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next"
          :total="filteredProducts.length"
          :page-sizes="[10, 20, 50]"
          :page-size.sync="pageSize"
          :current-page.sync="currentPage"
          @current-change="currentPage = $event"
          @size-change="pageSize = $event"
        ></el-pagination>
      </div>
    </el-card>

    <el-dialog :title="form.id ? $t('actions.edit') : $t('actions.new')" :visible.sync="dialogVisible" width="500px" custom-class="premium-dialog" destroy-on-close>
      <el-form :model="form" :rules="rules" ref="form" label-position="top">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="SKU" prop="code">
              <el-input v-model="form.code"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('labels.category')" prop="category">
              <el-select v-model="form.category" style="width: 100%" placeholder="...">
                <el-option v-for="cat in categories" :key="cat.name" :label="cat.name" :value="cat.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item :label="$t('labels.product')" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('labels.minStock')" prop="minStock">
              <el-input-number v-model="form.minStock" :min="0" style="width: 100%" controls-position="right"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('labels.unit')" prop="unit">
              <el-select v-model="form.unit" style="width: 100%" placeholder="...">
                <el-option v-for="u in units" :key="u.id" :label="u.name" :value="u.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" style="border-radius: 8px;">{{ $t('actions.cancel') }}</el-button>
        <el-button type="primary" @click="saveProduct" :loading="saving">{{ $t('actions.save') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { wmsAPI } from '../../services/mockData'

export default {
  name: 'ProductsView',
  data() {
    return {
      products: [],
      categories: [],
      units: [],
      loading: false,
      searchQuery: '',
      currentPage: 1,
      pageSize: 10,
      dialogVisible: false,
      saving: false,
      form: { id: null, code: '', name: '', category: '', minStock: 0, unit: 'UN' },
      rules: {
        code: [{ required: true, message: 'Requerido', trigger: 'blur' }],
        name: [{ required: true, message: 'Requerido', trigger: 'blur' }]
      }
    }
  },
  computed: {
    filteredProducts() {
      if (!this.searchQuery) return this.products
      const lower = this.searchQuery.toLowerCase()
      return this.products.filter(p => p.name.toLowerCase().includes(lower) || p.code.toLowerCase().includes(lower))
    },
    pagedProducts() {
      const start = (this.currentPage - 1) * this.pageSize
      return this.filteredProducts.slice(start, start + this.pageSize)
    }
  },
  async created() {
    this.categories = await wmsAPI.getCategories();
    this.units = await wmsAPI.getUnits();
    this.fetchData();
  },
  methods: {
    resolveCategory(catName) {
      if (!catName) return '-';
      return catName;
    },
    async fetchData() {
      this.loading = true;
      this.products = await wmsAPI.getProducts();
      this.loading = false;
    },
    openDialog(product) {
      if (product) {
        this.form = { ...product };
      } else {
        this.form = { id: null, code: '', name: '', category: '', minStock: 0, unit: 'UN' };
      }
      this.dialogVisible = true;
    },
    saveProduct() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.saving = true;
          await wmsAPI.saveProduct(this.form);
          this.$message.success(this.$t('notifications.productUpdated'), { customClass: 'premium-toast' });
          this.dialogVisible = false;
          this.saving = false;
          this.fetchData();
        }
      });
    },
    async handleDelete(product) {
      try {
        await this.$confirm(this.$t('messages.confirmDelete') + '?', 'Atenção', { type: 'warning' });
        await wmsAPI.deleteProduct(product.id);
        this.$message.success(this.$t('notifications.productDeleted'));
        this.fetchData();
      } catch (e) { }
    }
  }
}
</script>

<style scoped>
.modern-table { background: transparent; }
.modern-table ::v-deep th { background-color: transparent !important; }
.modern-table ::v-deep tr { background-color: transparent !important; }
.text-danger { color: var(--danger-color) !important; }
</style>
