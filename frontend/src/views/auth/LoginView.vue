<template>
  <div class="auth-wrapper">
    <el-card class="auth-card glass-panel">
      <div class="auth-header">
        <div class="brand">Wemov</div>
        <h2>{{ $t('auth.login') }}</h2>
        <p class="subtitle">{{ $t('auth.title') }}</p>
      </div>
      
      <el-form :model="loginForm" :rules="rules" ref="loginForm" @submit.native.prevent="handleLogin">
        <el-form-item prop="email">
          <el-input 
            v-model="loginForm.email" 
            prefix-icon="el-icon-message" 
            :placeholder="$t('auth.email')"
            size="large">
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input 
            v-model="loginForm.password" 
            prefix-icon="el-icon-lock" 
            type="password" 
            :placeholder="$t('auth.password')"
            show-password
            size="large">
          </el-input>
        </el-form-item>
        
        <div class="auth-actions">
          <el-button type="text" @click="$router.push('/forgot-password')">
            {{ $t('auth.forgot') }}
          </el-button>
        </div>
        
        <el-button type="primary" native-type="submit" class="w-full" size="large" :loading="loading">
          {{ $t('auth.submit') }}
        </el-button>
      </el-form>
      
      <div class="auth-footer mt-4">
        <el-tag size="small" type="info">Demo Logins: admin@wemov.com / admin</el-tag>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'LoginView',
  data() {
    return {
      loading: false,
      loginForm: {
        email: 'admin@wemov.com',
        password: 'admin'
      },
      rules: {
        email: [
          { required: true, message: 'Digite seu e-mail corporativo', trigger: 'blur' },
          { type: 'email', message: 'E-mail inválido', trigger: 'blur' }
        ],
        password: [
          { required: true, message: 'Digite sua senha', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          this.loading = true;
          try {
            await this.$store.dispatch('login', this.loginForm);
            this.$message.success('Autenticado com sucesso. Bem-vindo ao WMS Wemov.');
            this.$router.push('/');
          } catch (error) {
            this.$message.error(error.message);
          } finally {
            this.loading = false;
          }
        }
      })
    }
  }
}
</script>

<style scoped>
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
.auth-actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}
.w-full {
  width: 100%;
}
.auth-footer {
  text-align: center;
}
.mt-4 { margin-top: 24px; }
</style>
