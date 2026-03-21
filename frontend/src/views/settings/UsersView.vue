<template>
  <div class="users-view">
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ $t('nav.users') }}</h1>
        <p class="page-subtitle">Controle de acesso, credenciais de operadores, e LDAP integrado ao WMS.</p>
      </div>
      <el-button type="primary" icon="el-icon-plus" @click="openDialog()">{{ $t('actions.new') }} Operador</el-button>
    </div>

    <el-card class="glass-panel" style="border:none;">
      <el-table :data="users" style="width: 100%" class="modern-table">
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="name" label="Nome Real Identificado"></el-table-column>
        <el-table-column prop="email" label="E-mail Matrícula" width="250"></el-table-column>
        <el-table-column prop="role" label="Level de Acesso (Role)" width="200" align="center">
           <template slot-scope="scope">
              <el-tag :type="scope.row.role === 'ADMIN' ? 'danger' : 'primary'" effect="plain">
                  {{ scope.row.role }}
              </el-tag>
           </template>
        </el-table-column>
        <el-table-column label="Administração Sistêmica" width="200" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" @click="openDialog(scope.row)">Editar</el-button>
            <el-button type="text" class="text-danger" icon="el-icon-delete" @click="handleDelete(scope.row)">Desativar</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog :title="form.id ? 'Editar Dados do Usuário' : 'Efetivar Novo Operador'" :visible.sync="dialogVisible" custom-class="premium-dialog" width="450px" destroy-on-close>
      <el-form :model="form" ref="userForm" label-position="top">
        <el-form-item label="Nome Completo" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="E-mail / Handle / Matrícula" prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="Perfil de Autorização Estrita (Role)" prop="role">
          <el-select v-model="form.role" style="width: 100%">
            <el-option label="Administrador (Acesso Total Root)" value="ADMIN"></el-option>
            <el-option label="Operador Logístico (Operações Padrão)" value="OPERATOR"></el-option>
            <el-option label="Auditor Regulatório (Somente-Leitura)" value="AUDIT"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Senha de Liberação Inicial" v-if="!form.id">
           <el-input type="password" v-model="form.password" show-password></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false">{{ $t('actions.cancel') }}</el-button>
        <el-button type="primary" @click="saveUser">{{ $t('actions.save') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'UsersView',
  data() {
    return {
      dialogVisible: false,
      form: { id: null, name: '', email: '', role: 'OPERATOR', password: '' },
      users: [
        { id: 1, name: 'Admin Wemov', email: 'admin@wemov.com', role: 'ADMIN' },
        { id: 2, name: 'João Operador de Estoque', email: 'joao.estoque@wemov.com', role: 'OPERATOR' },
        { id: 3, name: 'Maria Silva Compliance', email: 'maria.audit@wemov.com', role: 'AUDIT' }
      ]
    }
  },
  methods: {
    openDialog(user = null) {
      if (user) {
        this.form = { ...user, password: '' }
      } else {
        this.form = { id: null, name: '', email: '', role: 'OPERATOR', password: '' }
      }
      this.dialogVisible = true;
    },
    saveUser() {
      this.dialogVisible = false;
      this.$message.success('Registro de operador de armazém atualizado. (Mock local)');
    },
    async handleDelete() {
      try {
         await this.$confirm('Remover definitivamente e revogar o LDAP deste operador do WMS?', 'Atenção Crítica de Segurança', { type: 'error', confirmButtonText: 'Revogar' });
         this.$message.success('Acesso bloqueado e operador desativado permanentemente.');
      } catch (err) {}
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
