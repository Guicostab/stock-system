<template>
  <div class="audit-view">
    <div class="page-header">
      <div>
        <h1 class="page-title">Auditoria e Logs de Sistema</h1>
        <p class="page-subtitle">Rastreamento imutável de eventos operacionais críticos.</p>
      </div>
      <el-button icon="el-icon-refresh" type="secondary" class="glass-panel" style="border:1px solid var(--border-color);">Atualizar Logs</el-button>
    </div>

    <el-card class="glass-panel" style="border: none; border-radius: 16px;">
      <el-table :data="logs" style="width: 100%" class="modern-table">
        <el-table-column prop="timestamp" label="Data/Hora" width="180"></el-table-column>
        <el-table-column prop="user" label="Identidade LDAP" width="150"></el-table-column>
        <el-table-column prop="action" label="Ação Engatilhada" width="200">
          <template slot-scope="scope">
              <el-tag size="small" :type="scope.row.level === 'CRITICAL' ? 'danger' : 'info'" effect="plain">{{ scope.row.action }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="details" label="Detalhes Técnicos"></el-table-column>
        <el-table-column prop="ip" label="IPv4 Origin" width="130"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'AuditLogs',
  data() {
    return {
      logs: [
        { timestamp: '2024-03-21 15:33:02', user: 'Admin Wemov', action: 'ROLE_UPDATE', details: 'Alterou permissões do grupo Operador_Master', ip: '192.168.1.100', level: 'CRITICAL' },
        { timestamp: '2024-03-21 14:15:22', user: 'Admin Wemov', action: 'LOGIN_SUCCESS', details: 'Autenticação multifator validada', ip: '192.168.1.100', level: 'INFO' },
        { timestamp: '2024-03-21 11:05:10', user: 'Operador 1', action: 'BATCH_CREATE', details: 'Lançou fisicamente o LOTE-1202', ip: '10.0.0.45', level: 'INFO' },
        { timestamp: '2024-03-21 08:32:11', user: 'SISTEMA_AGENTE', action: 'BACKUP_DB', details: 'Instância Relacional replicada (S3)', ip: '127.0.0.1', level: 'INFO' }
      ]
    }
  }
}
</script>

<style scoped>
.modern-table { background: transparent; }
.modern-table ::v-deep th { background-color: transparent !important; }
.modern-table ::v-deep tr { background-color: transparent !important; }
</style>
