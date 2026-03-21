<template>
  <div class="profile-view">
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ $t('app.profile') }}</h1>
        <p class="page-subtitle">Gerencie suas configurações e dados pessoais.</p>
      </div>
    </div>

    <el-row :gutter="24">
      <el-col :span="8">
        <el-card shadow="hover" class="glass-panel" style="border:none; text-align: center;">
          <el-avatar :size="120" icon="el-icon-user-solid" style="margin-bottom: 20px;"></el-avatar>
          <h2 style="margin:0; font-family:'Plus Jakarta Sans',sans-serif; color:var(--text-main);">{{ form.name }}</h2>
          <p class="text-muted">{{ form.role }}</p>
          <el-tag type="success" effect="dark" size="small">{{ $t('status.active') }}</el-tag>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card shadow="hover" class="glass-panel" style="border:none;">
          <div slot="header">
            <h3 style="margin:0; color:var(--text-main);">Dados da Conta LDAP</h3>
          </div>
          <el-form :model="form" ref="profileForm" label-position="top">
            <el-row :gutter="20">
              <el-col :span="12">
                 <el-form-item label="Nome Completo">
                    <el-input v-model="form.name"></el-input>
                 </el-form-item>
              </el-col>
              <el-col :span="12">
                 <el-form-item label="E-mail">
                    <el-input v-model="form.email" disabled></el-input>
                 </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="Nova Senha">
              <el-input type="password" placeholder="Deixe em branco para não alterar" show-password></el-input>
            </el-form-item>
            <el-button type="primary" @click="saveProfile" icon="el-icon-check">{{ $t('actions.save') }} Alterações</el-button>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'ProfileView',
  data() {
    return {
      form: {
        name: this.$store.getters.userProfile?.name || '',
        email: this.$store.getters.userProfile?.email || '',
        role: this.$store.getters.userRole || ''
      }
    }
  },
  methods: {
    saveProfile() {
      this.$message.success({ message: 'Perfil atualizado com sucesso. Mock de gravação acionado.', customClass: 'premium-toast' });
    }
  }
}
</script>

<style scoped>
.text-muted { color: var(--text-muted); margin-bottom: 16px; font-weight:500; }
</style>
