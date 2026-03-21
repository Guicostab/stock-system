<template>
  <div class="auth-wrapper">
    <el-card class="auth-card glass-panel">
      <div class="auth-header">
        <div class="brand">Wemov</div>
        <h2>Recuperação de Acesso</h2>
        <p class="subtitle">Enviaremos as instruções de reset para seu e-mail.</p>
      </div>
      
      <el-form :model="form" :rules="rules" ref="form" @submit.native.prevent="handleRecover">
        <el-form-item prop="email">
          <el-input 
            v-model="form.email" 
            prefix-icon="el-icon-message" 
            :placeholder="$t('auth.email')"
            size="large">
          </el-input>
        </el-form-item>
        
        <el-button type="primary" native-type="submit" class="w-full mb-3" size="large" :loading="loading">
          Enviar Link de Recuperação
        </el-button>
        <el-button class="w-full mt-3" size="large" @click="$router.push('/login')">
          Voltar ao Login
        </el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'ForgotPasswordView',
  data() {
    return {
      loading: false,
      form: { email: '' },
      rules: {
        email: [
          { required: true, message: 'Digite seu e-mail para recuperar', trigger: 'blur' },
          { type: 'email', message: 'E-mail corporativo inválido', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleRecover() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            this.$message.success('E-mail de recuperação enviado com sucesso!');
            this.$router.push('/login');
          }, 1000);
        }
      });
    }
  }
}
</script>

<style scoped>
/* Follows the same layout variables as Login */
.auth-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.auth-card {
  width: 100%;
  max-width: 420px;
  padding: 20px 30px;
  border-radius: 20px;
  border: none;
}
.auth-header {
  text-align: center;
  margin-bottom: 30px;
}
.brand {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--primary-color);
  letter-spacing: -1px;
  margin-bottom: 10px;
}
.auth-header h2 {
  margin: 0 0 5px 0;
  font-size: 1.5rem;
  color: var(--text-main);
  font-weight: 700;
}
.subtitle {
  color: var(--text-muted);
  font-size: 0.95rem;
  margin: 0;
}
.w-full { width: 100%; }
.mb-3 { margin-bottom: 12px; }
.mt-3 { margin-top: 12px; }
</style>
