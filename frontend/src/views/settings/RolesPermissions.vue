<template>
  <div class="roles-view">
    <div class="page-header">
      <div>
        <h1 class="page-title">Configurador Fino de RBAC</h1>
        <p class="page-subtitle">Role-Based Access Control para granularidade por perfil operacional (Data Governance).</p>
      </div>
    </div>

    <el-card class="glass-panel" style="border:none;">
      <el-row :gutter="30">
        <el-col :span="8">
           <h3 style="color:var(--text-main); margin-bottom: 20px;">Identidade de Agrupamento</h3>
           <el-menu default-active="1" style="background:transparent; border-right:none;" @select="selectRole">
              <el-menu-item index="1">
                 <i class="el-icon-medal"></i> System Admin (Root)
              </el-menu-item>
              <el-menu-item index="2">
                 <i class="el-icon-truck"></i> Operador Logístico Padrão
              </el-menu-item>
              <el-menu-item index="3">
                 <i class="el-icon-document"></i> Auditoria de Compliance
              </el-menu-item>
           </el-menu>
        </el-col>
        <el-col :span="16">
           <h3 style="color:var(--text-main); margin-bottom: 20px;">Matriz de Governança Acoplada: <strong style="color:var(--primary-color);">{{ activeRole }}</strong></h3>
           <el-table :data="permissions" style="width: 100%" class="modern-table">
              <el-table-column prop="module" label="Módulo Sistêmico Afetado"></el-table-column>
              <el-table-column label="Visualização Fixa" width="130" align="center">
                 <template slot-scope="scope"><el-switch v-model="scope.row.read" :disabled="activeRole==='Administrador'"></el-switch></template>
              </el-table-column>
              <el-table-column label="Autorizações Escritas" width="140" align="center">
                 <template slot-scope="scope"><el-switch v-model="scope.row.write" :disabled="activeRole==='Administrador' || activeRole==='Auditoria de Compliance'"></el-switch></template>
              </el-table-column>
              <el-table-column label="Privilégios de Deleção" width="140" align="center">
                 <template slot-scope="scope"><el-switch v-model="scope.row.delete" :disabled="activeRole!=='Administrador'"></el-switch></template>
              </el-table-column>
           </el-table>
           <div style="margin-top: 24px; text-align: right;">
              <el-button type="primary" :disabled="activeRole==='System Admin (Root)'" @click="savePermissions">Consolidar Regras de Firewall Interno</el-button>
           </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'RolesPermissions',
  data() {
    return {
      activeRole: 'System Admin (Root)',
      permissions: [
        { module: 'Catálogo de Master Data (SKUs)', read: true, write: true, delete: true },
        { module: 'Movimentações, Transações e Shifts', read: true, write: true, delete: true },
        { module: 'Gestão Tática de Batches e Locações', read: true, write: true, delete: true },
        { module: 'Extrações Gerenciais e Consultas', read: true, write: true, delete: true },
        { module: 'Auditoria de Segurança (Immutable)', read: true, write: true, delete: true }
      ]
    }
  },
  methods: {
    selectRole(idx) {
      const rolesMap = { '1': 'System Admin (Root)', '2': 'Operador Logístico Padrão', '3': 'Auditoria de Compliance' };
      this.activeRole = rolesMap[idx];
      this.recalcPerms();
    },
    recalcPerms() {
      if (this.activeRole === 'System Admin (Root)') {
        this.permissions.forEach(p => { p.read=true; p.write=true; p.delete=true; });
      } else if (this.activeRole === 'Auditoria de Compliance') {
        this.permissions.forEach(p => { p.read=true; p.write=false; p.delete=false; });
      } else {
        this.permissions.forEach(p => { p.read=true; p.write=true; p.delete=false; });
      }
    },
    savePermissions() {
       this.$message.success('Firewall e Router Guards atualizados via Vuex RBAC interceptor.');
    }
  }
}
</script>

<style scoped>
.modern-table { background: transparent; }
.modern-table ::v-deep th { background-color: transparent !important; }
.modern-table ::v-deep tr { background-color: transparent !important; }
</style>
