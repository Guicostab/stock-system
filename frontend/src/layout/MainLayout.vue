<template>
  <el-container class="layout-container" :class="{ 'dark-mode': isDark }">
    <el-aside width="260px" class="glass-panel sidebar">
      <div class="logo-area">
        <div class="brand">Wemov</div>
        <div class="brand-subtitle">{{ $t('wms.system') }}</div>
      </div>
      <el-menu
        :default-active="$route.path"
        router
        class="custom-menu"
      >
        <el-menu-item index="/">
          <i class="el-icon-data-board"></i>
          <span>{{ $t('nav.dashboard') }}</span>
        </el-menu-item>
        
        <el-submenu index="catalog">
          <template slot="title">
            <i class="el-icon-goods"></i>
            <span>{{ $t('nav.catalog') }}</span>
          </template>
          <el-menu-item index="/products">{{ $t('wms.products') }}</el-menu-item>
        </el-submenu>

        <el-submenu index="operations">
          <template slot="title">
            <i class="el-icon-truck"></i>
            <span>Operações Logísticas</span>
          </template>
          <el-menu-item index="/receiving">
            <i class="el-icon-download"></i> Recebimento
          </el-menu-item>
          <el-menu-item index="/shipping">
            <i class="el-icon-upload2"></i> Expedição
          </el-menu-item>
        </el-submenu>

        <el-submenu index="wms">
          <template slot="title">
            <i class="el-icon-box"></i>
            <span>{{ $t('nav.inventory') }}</span>
          </template>
          <el-menu-item index="/inventory">{{ $t('wms.batches') }}</el-menu-item>
          <el-menu-item index="/movements">{{ $t('wms.history') }}</el-menu-item>
        </el-submenu>

        <el-menu-item index="/locations">
          <i class="el-icon-map-location"></i>
          <span>{{ $t('nav.locations') }}</span>
        </el-menu-item>

        <el-menu-item index="/reports">
          <i class="el-icon-document"></i>
          <span>{{ $t('nav.reports') }}</span>
        </el-menu-item>

        <el-submenu index="admin" v-if="isAdmin">
          <template slot="title">
            <i class="el-icon-setting"></i>
            <span>{{ $t('nav.settings') }}</span>
          </template>
          <el-menu-item index="/users">{{ $t('nav.users') }}</el-menu-item>
          <el-menu-item index="/roles">{{ $t('nav.roles') }}</el-menu-item>
          <el-menu-item index="/configs">{{ $t('nav.config') }}</el-menu-item>
          <el-menu-item index="/audit">{{ $t('nav.settings') }} — Auditoria</el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    
    <el-container>
      <el-header class="topbar">
        <div class="header-content">
          <div class="breadcrumbs">
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item :to="{ path: '/' }">WMS</el-breadcrumb-item>
              <el-breadcrumb-item>{{ currentRouteName }}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div class="user-actions">
            <!-- Theme Toggle -->
            <el-switch
              v-model="isDark"
              active-icon-class="el-icon-moon"
              inactive-icon-class="el-icon-sunny"
              @change="toggleTheme"
              class="mr-4">
            </el-switch>
            
            <!-- Language Selection -->
            <el-dropdown @command="changeLanguage" class="mr-4 cursor-pointer">
              <span class="el-dropdown-link" style="color: var(--text-main); font-weight: 600;">
              {{ currentLang === 'en-US' ? 'EN' : currentLang === 'es-ES' ? 'ES' : 'PT' }} <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="pt-BR">Português (BR)</el-dropdown-item>
                <el-dropdown-item command="en-US">English (US)</el-dropdown-item>
                <el-dropdown-item command="es-ES">Español (ES)</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

            <!-- Profile & Logout -->
            <el-dropdown @command="handleProfileMenu">
              <div class="user-profile cursor-pointer">
                <el-avatar size="small" icon="el-icon-user-solid"></el-avatar>
                <span class="username">{{ userProfile ? userProfile.name : 'Unknown' }}</span>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="profile" icon="el-icon-user">{{ $t('app.profile') }}</el-dropdown-item>
                <el-dropdown-item command="logout" divided icon="el-icon-switch-button">{{ $t('nav.logout') }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </el-header>
      
      <el-main class="main-content">
        <transition name="fade-transform" mode="out-in">
          <router-view />
        </transition>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'MainLayout',
  data() {
    return {
      isDark: this.$store.getters.currentTheme === 'dark'
    }
  },
  computed: {
    currentRouteName() {
      // Maps current route name to a robust localized or literal string
      return this.$route.name || this.$t('nav.dashboard')
    },
    userProfile() {
      return this.$store.getters.userProfile
    },
    isAdmin() {
      return this.$store.getters.userRole === 'ADMIN'
    },
    currentLang() {
      return this.$store.getters.currentLanguage
    }
  },
  methods: {
    toggleTheme(val) {
      const theme = val ? 'dark' : 'light';
      this.$store.commit('SET_THEME', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark-theme-mode');
      } else {
        document.documentElement.classList.remove('dark-theme-mode');
      }
    },
    changeLanguage(lang) {
      this.$store.dispatch('setLanguage', lang);
      this.$i18n.locale = lang;
    },
    async handleProfileMenu(command) {
      if (command === 'logout') {
        await this.$store.dispatch('logout')
        this.$router.push('/login')
        this.$message.success(this.$t('app.logout'))
      } else if (command === 'profile') {
        this.$router.push('/profile');
      }
    }
  },
  mounted() {
    if (this.isDark) {
      document.documentElement.classList.add('dark-theme-mode');
    }
  }
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
}
.sidebar {
  margin: 16px 0 16px 16px;
  height: calc(100vh - 32px);
  display: flex;
  flex-direction: column;
}
.logo-area {
  padding: 32px 24px;
  text-align: center;
}
.brand {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--primary-color);
  letter-spacing: -0.5px;
}
.brand-subtitle {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
}
.topbar {
  background: transparent;
  display: flex;
  align-items: center;
  padding: 0 40px;
  height: 80px !important;
}
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  padding: 12px 24px;
  border-radius: 12px;
  border: 1px solid var(--glass-border);
  box-shadow: 0 4px 12px rgba(0,0,0,0.02);
}
.user-actions {
  display: flex;
  align-items: center;
}
.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
}
.username {
  font-weight: 600;
  color: var(--text-main);
}
.mr-4 { margin-right: 16px; }
.cursor-pointer { cursor: pointer; }
.main-content {
  padding: 24px 40px 40px 40px;
}
.fade-transform-leave-active, .fade-transform-enter-active {
  transition: all .3s;
}
.fade-transform-enter { opacity: 0; transform: translateX(-15px); }
.fade-transform-leave-to { opacity: 0; transform: translateX(15px); }
</style>
