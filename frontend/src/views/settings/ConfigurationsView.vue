<template>
  <div class="configs-view">
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ $t('nav.config') }}</h1>
        <p class="page-subtitle">{{ $t('labels.description') }} de apoio Mestre: Categorias e Tipos Unificados.</p>
      </div>
    </div>

    <el-tabs type="border-card" class="glass-panel" style="border:none;">
      
      <!-- Categorias CRUD -->
      <el-tab-pane :label="$t('labels.category')">
         <el-button type="primary" size="small" icon="el-icon-plus" style="margin-bottom: 16px;" @click="openCatDialog()">{{ $t('actions.new') }} {{ $t('labels.category') }}</el-button>
         <el-table :data="categories" style="width: 100%" class="modern-table">
            <el-table-column prop="id" label="ID Lógico" width="120"></el-table-column>
            <el-table-column prop="name" :label="$t('labels.category')"></el-table-column>
            <el-table-column prop="description" :label="$t('labels.description')"></el-table-column>
            <el-table-column :label="$t('labels.actions')" width="120" align="center">
               <template slot-scope="scope">
                 <el-button type="text" icon="el-icon-edit" @click="openCatDialog(scope.row)"></el-button>
                 <el-button type="text" class="text-danger" icon="el-icon-delete" @click="deleteCat(scope.row.id)"></el-button>
               </template>
            </el-table-column>
         </el-table>
      </el-tab-pane>

      <!-- Unidades CRUD -->
      <el-tab-pane :label="$t('labels.unit')">
         <el-button type="primary" size="small" icon="el-icon-plus" style="margin-bottom: 16px;" @click="openUnitDialog()">{{ $t('actions.new') }} {{ $t('labels.unit') }}</el-button>
         <el-table :data="units" style="width: 100%" class="modern-table">
            <el-table-column prop="id" label="ID / Chave Padrão" width="180"></el-table-column>
            <el-table-column prop="name" :label="$t('labels.description')"></el-table-column>
            <el-table-column :label="$t('labels.actions')" width="120" align="center">
               <template slot-scope="scope">
                 <el-button type="text" icon="el-icon-edit" @click="openUnitDialog(scope.row)"></el-button>
                 <el-button type="text" class="text-danger" icon="el-icon-delete" @click="deleteUnit(scope.row.id)"></el-button>
               </template>
            </el-table-column>
         </el-table>
      </el-tab-pane>

    </el-tabs>

    <!-- Dialog Categoria -->
    <el-dialog :title="catForm.id ? $t('actions.edit') : $t('actions.new')" :visible.sync="catDialogVisible" width="400px" custom-class="premium-dialog">
       <el-form label-position="top">
         <el-form-item :label="$t('labels.category')">
           <el-input v-model="catForm.name"></el-input>
         </el-form-item>
         <el-form-item :label="$t('labels.description')">
           <el-input v-model="catForm.description"></el-input>
         </el-form-item>
       </el-form>
       <div slot="footer">
         <el-button @click="catDialogVisible = false">{{ $t('actions.cancel') }}</el-button>
         <el-button type="primary" @click="saveCat" :loading="saving">{{ $t('actions.save') }}</el-button>
       </div>
    </el-dialog>

    <!-- Dialog Unidade -->
    <el-dialog :title="unitForm.id ? $t('actions.edit') : $t('actions.new')" :visible.sync="unitDialogVisible" width="400px" custom-class="premium-dialog">
       <el-form label-position="top">
         <el-form-item label="Chave de Amarração (Code ID)">
           <el-input v-model="unitForm.id" :disabled="!!unitForm.id" placeholder="Ex: CX, UN"></el-input>
         </el-form-item>
         <el-form-item :label="$t('labels.description')">
           <el-input v-model="unitForm.name"></el-input>
         </el-form-item>
       </el-form>
       <div slot="footer">
         <el-button @click="unitDialogVisible = false">{{ $t('actions.cancel') }}</el-button>
         <el-button type="primary" @click="saveUnit" :loading="saving">{{ $t('actions.save') }}</el-button>
       </div>
    </el-dialog>
  </div>
</template>

<script>
import { wmsAPI } from '../../services/mockData'

export default {
  name: 'ConfigurationsView',
  data() {
    return {
      categories: [],
      units: [],
      catDialogVisible: false,
      unitDialogVisible: false,
      saving: false,
      catForm: { id: null, name: '', description: '' },
      unitForm: { id: '', name: '' }
    }
  },
  async created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      this.categories = await wmsAPI.getCategories();
      this.units = await wmsAPI.getUnits();
    },
    openCatDialog(cat = null) {
      if(cat) this.catForm = { ...cat };
      else this.catForm = { id: null, name: '', description: '' };
      this.catDialogVisible = true;
    },
    async saveCat() {
      if (!this.catForm.name) return;
      this.saving = true;
      await wmsAPI.saveCategory(this.catForm)
      this.saving = false
      this.catDialogVisible = false
      this.$message.success(this.$t('notifications.savedSuccess'))
      this.fetchData()
    },
    async deleteCat(id) {
      try {
        await this.$confirm(this.$t('messages.confirmDelete'), { type: 'warning' })
        await wmsAPI.deleteCategory(id)
        this.$message.success(this.$t('notifications.deletedSuccess'))
        this.fetchData()
      } catch (e) {}
    },
    openUnitDialog(unit = null) {
      if(unit) this.unitForm = { ...unit };
      else this.unitForm = { id: '', name: '' };
      this.unitDialogVisible = true;
    },
    async saveUnit() {
      if (!this.unitForm.id) return this.$message.error(this.$t('validation.required'))
      this.saving = true
      await wmsAPI.saveUnit(this.unitForm)
      this.saving = false
      this.unitDialogVisible = false
      this.$message.success(this.$t('notifications.savedSuccess'))
      this.fetchData()
    },
    async deleteUnit(id) {
       try {
        await this.$confirm(this.$t('messages.confirmDelete'), { type: 'warning' })
        await wmsAPI.deleteUnit(id)
        this.$message.success(this.$t('notifications.deletedSuccess'))
        this.fetchData()
      } catch (e) {}
    }
  }
}
</script>

<style scoped>
.modern-table { background: transparent; }
.modern-table ::v-deep th { background-color: transparent !important; }
.modern-table ::v-deep tr { background-color: transparent !important; }
.text-danger { color: var(--danger-color); }
</style>
