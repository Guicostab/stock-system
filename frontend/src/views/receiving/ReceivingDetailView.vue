<template>
  <div class="receiving-create">
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ isDetail ? 'Recebimento ' + doc.id : 'Novo Recebimento' }}</h1>
        <p class="page-subtitle">{{ isDetail ? 'Detalhes e execução do documento de recebimento' : 'Preencha os dados e itens do recebimento' }}</p>
      </div>
      <el-button icon="el-icon-arrow-left" @click="$router.push('/receiving')">Voltar</el-button>
    </div>

    <!-- Stepper -->
    <el-steps :active="activeStep" finish-status="success" align-center class="steps-bar" style="margin-bottom:32px;">
      <el-step title="Dados"></el-step>
      <el-step title="Itens"></el-step>
      <el-step title="Conferência"></el-step>
      <el-step title="Recontagem" v-if="hasRecount"></el-step>
      <el-step title="Putaway"></el-step>
    </el-steps>

    <!-- Step 0: Dados do Documento -->
    <el-card v-if="activeStep === 0" class="glass-panel step-card" style="border:none;">
      <el-form :model="docForm" label-position="top" :rules="docRules" ref="docFormRef">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="Fornecedor" prop="supplier">
              <el-input v-model="docForm.supplier" placeholder="Nome do fornecedor"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Nota Fiscal / Documento" prop="docNumber">
              <el-input v-model="docForm.docNumber" placeholder="Ex: NF-12345"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="Data Prevista de Chegada" prop="expectedDate">
              <el-date-picker v-model="docForm.expectedDate" type="date" style="width:100%" value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Observações">
              <el-input v-model="docForm.notes" placeholder="Observações opcionais"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div style="text-align:right">
          <el-button type="primary" @click="nextStep(0)">Próximo: Itens</el-button>
        </div>
      </el-form>
    </el-card>

    <!-- Step 1: Itens -->
    <el-card v-if="activeStep === 1" class="glass-panel step-card" style="border:none;">
      <h4 style="margin:0 0 20px; color:var(--text-main); font-weight:700;">Itens do Recebimento</h4>
      <el-table :data="docItems" class="modern-table" style="width:100%; margin-bottom:16px;">
        <el-table-column label="Produto" min-width="200">
          <template slot-scope="s">
            <el-select v-model="s.row.productId" filterable style="width:100%" placeholder="Selecionar produto">
              <el-option v-for="p in products" :key="p.id" :label="p.code + ' — ' + p.name" :value="p.id"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="Qtd. Esperada" width="150">
          <template slot-scope="s">
            <el-input-number v-model="s.row.expectedQty" :min="1" controls-position="right" style="width:100%"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="Lote" width="160">
          <template slot-scope="s">
            <el-input v-model="s.row.lotId" placeholder="Auto se vazio"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="Vencimento" width="170">
          <template slot-scope="s">
            <el-date-picker v-model="s.row.expiration" type="date" style="width:100%" value-format="yyyy-MM-dd" placeholder="Opcional"></el-date-picker>
          </template>
        </el-table-column>
        <el-table-column label="" width="60" align="center">
          <template slot-scope="s">
            <el-button type="text" icon="el-icon-delete" class="text-danger" @click="removeItem(s.$index)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button icon="el-icon-plus" @click="addItem">Adicionar Item</el-button>
      <div style="text-align:right; margin-top:20px;">
        <el-button @click="activeStep = 0" style="margin-right:8px">Voltar</el-button>
        <el-button type="primary" @click="nextStep(1)" :loading="saving">Salvar e Ir para Conferência</el-button>
      </div>
    </el-card>

    <!-- Step 2: Conferência -->
    <el-card v-if="activeStep === 2" class="glass-panel step-card" style="border:none;">
      <h4 style="margin:0 0 20px; color:var(--text-main); font-weight:700;">Conferência Física</h4>
      <el-table :data="doc.items" class="modern-table" style="width:100%; margin-bottom:16px;">
        <el-table-column label="Produto" min-width="180">
          <template slot-scope="s">{{ s.row.product ? s.row.product.name : s.row.productId }}</template>
        </el-table-column>
        <el-table-column prop="lotId" label="Lote" width="160"></el-table-column>
        <el-table-column prop="expectedQty" label="Esperado" width="120" align="center"></el-table-column>
        <el-table-column label="Contado" width="150" align="center">
          <template slot-scope="s">
            <el-input-number v-model="s.row.countedQty" :min="0" controls-position="right" style="width:100%"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="Status" width="120" align="center">
          <template slot-scope="s">
            <el-tag v-if="s.row.countedQty === null" type="info" effect="plain">—</el-tag>
            <el-tag v-else-if="s.row.countedQty === s.row.expectedQty" type="success" effect="plain">✓ OK</el-tag>
            <el-tag v-else type="danger" effect="plain">⚠ Divergente</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="doc.status === 'CONCLUIDO'" class="info-alert">
        <i class="el-icon-success"></i> Este recebimento já foi finalizado.
      </div>
      <div v-else style="text-align:right; margin-top:20px;">
        <el-button type="primary" @click="submitConference" :loading="saving">Confirmar Conferência</el-button>
      </div>
    </el-card>

    <!-- Step 3: Recontagem (conditional) -->
    <el-card v-if="hasRecount && activeStep === 3" class="glass-panel step-card" style="border:none;">
      <el-alert type="warning" title="Divergências encontradas — Recontagem necessária" :closable="false" show-icon style="margin-bottom:20px;"></el-alert>
      <el-table :data="doc.items" class="modern-table" style="width:100%; margin-bottom:16px;">
        <el-table-column label="Produto" min-width="180">
          <template slot-scope="s">{{ s.row.product ? s.row.product.name : s.row.productId }}</template>
        </el-table-column>
        <el-table-column prop="expectedQty" label="Esperado" width="120" align="center"></el-table-column>
        <el-table-column prop="countedQty" label="1ª Contagem" width="130" align="center"></el-table-column>
        <el-table-column label="Recontagem" width="160" align="center">
          <template slot-scope="s">
            <el-input-number v-model="s.row.recountedQty" :min="0" controls-position="right" style="width:100%"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="Justificativa" min-width="180">
          <template slot-scope="s">
            <el-input v-model="s.row.recount_reason" placeholder="Motivo da divergência" v-if="s.row.countedQty !== s.row.expectedQty"></el-input>
            <span v-else style="color:var(--text-muted);">—</span>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align:right; margin-top:20px;">
        <el-button type="warning" @click="submitRecount" :loading="saving">Confirmar Recontagem</el-button>
      </div>
    </el-card>

    <!-- Step: Putaway -->
    <el-card v-if="activeStep === putawayStep" class="glass-panel step-card" style="border:none;">
      <h4 style="margin:0 0 20px; color:var(--text-main); font-weight:700;">Atribuição de Local (Putaway)</h4>
      <el-table :data="doc.items" class="modern-table" style="width:100%; margin-bottom:16px;">
        <el-table-column label="Produto" min-width="180">
          <template slot-scope="s">{{ s.row.product ? s.row.product.name : s.row.productId }}</template>
        </el-table-column>
        <el-table-column prop="lotId" label="Lote" width="160"></el-table-column>
        <el-table-column label="Qtd. Aprovada" width="140" align="center">
          <template slot-scope="s">{{ s.row.countedQty || s.row.expectedQty }}</template>
        </el-table-column>
        <el-table-column label="Local de Armazenamento" min-width="220">
          <template slot-scope="s">
            <el-select v-model="s.row.locationId" filterable placeholder="Selecionar Bin" style="width:100%">
              <el-option v-for="loc in locations" :key="loc.id" :label="loc.id + ' — ' + loc.zone" :value="loc.id"></el-option>
            </el-select>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="doc.status === 'CONCLUIDO'" class="info-alert success">
        <i class="el-icon-success"></i> Recebimento concluído! Todos os itens foram adicionados ao estoque.
      </div>
      <div v-else style="text-align:right; margin-top:20px;">
        <el-button type="success" @click="finalize" :loading="saving">Finalizar e Atualizar Estoque</el-button>
      </div>
    </el-card>

    <!-- Timeline -->
    <el-card v-if="doc.id" class="glass-panel" style="border:none; margin-top:24px;">
      <div style="font-weight:700; color:var(--text-main); margin-bottom:16px;"><i class="el-icon-time"></i> Histórico do Documento</div>
      <el-timeline>
        <el-timeline-item v-for="h in doc.history" :key="h.step" :timestamp="formatDateTime(h.at)" placement="top" :color="h.step === 'CONCLUIDO' || h.step === 'EXPEDIDO' ? '#10b981' : '#6366f1'">
          <div style="font-weight:700;">{{ h.label }}</div>
          <div style="color:var(--text-muted); font-size:0.85rem;">por {{ h.by }}</div>
        </el-timeline-item>
      </el-timeline>
    </el-card>
  </div>
</template>

<script>
import { wmsAPI } from '../../services/mockData'

export default {
  name: 'ReceivingDetailView',
  data() {
    return {
      doc: { items: [], history: [] },
      products: [],
      locations: [],
      loading: false,
      saving: false,
      activeStep: 0,
      docForm: { supplier: '', docNumber: '', expectedDate: '', notes: '' },
      docItems: [],
      docRules: {
        supplier: [{ required: true, message: 'Informe o fornecedor', trigger: 'blur' }],
        docNumber: [{ required: true, message: 'Informe o número do documento', trigger: 'blur' }]
      }
    }
  },
  computed: {
    isDetail() { return this.$route.params.id !== 'new' },
    hasRecount() { return this.doc.status === 'RECONTAGEM' || (this.doc.items || []).some(i => i.recountedQty !== null) },
    putawayStep() { return this.hasRecount ? 4 : 3 }
  },
  async created() {
    this.products = await wmsAPI.getProducts()
    this.locations = await wmsAPI.getLocations()
    if (this.isDetail) {
      await this.loadDoc()
    } else {
      this.addItem()
    }
  },
  methods: {
    async loadDoc() {
      this.loading = true
      this.doc = await wmsAPI.getReceiving(this.$route.params.id) || { items: [], history: [] }
      this.syncStep()
      this.loading = false
    },
    syncStep() {
      const map = { AGUARDANDO: 0, CONFERENCIA: 2, RECONTAGEM: this.hasRecount ? 3 : 2, CONFERIDO: this.putawayStep, CONCLUIDO: this.putawayStep }
      this.activeStep = map[this.doc.status] ?? 0
    },
    addItem() {
      this.docItems.push({ productId: '', expectedQty: 1, lotId: '', expiration: '' })
    },
    removeItem(idx) {
      this.docItems.splice(idx, 1)
    },
    nextStep(step) {
      if (step === 0) {
        this.$refs.docFormRef.validate(valid => { if (valid) this.activeStep = 1 })
      } else if (step === 1) {
        if (!this.docItems.length || this.docItems.some(i => !i.productId)) {
          return this.$message.error('Adicione pelo menos um item com produto selecionado.')
        }
        this.saveNewDoc()
      }
    },
    async saveNewDoc() {
      this.saving = true
      const user = this.$store.getters.userProfile?.name || 'Operador'
      const payload = { ...this.docForm, createdBy: user, items: this.docItems.map((i, idx) => ({ id: 'i' + idx, ...i, countedQty: null, recountedQty: null, status: 'PENDENTE' })) }
      this.doc = await wmsAPI.createReceiving(payload)
      this.doc.items = this.doc.items.map(i => ({ ...i, product: this.products.find(p => p.id === i.productId) || {} }))
      this.saving = false
      this.activeStep = 2
      this.$router.replace('/receiving/' + this.doc.id)
    },
    async submitConference() {
      if (this.doc.items.some(i => i.countedQty === null || i.countedQty === undefined)) {
        return this.$message.error('Preencha a quantidade contada para todos os itens.')
      }
      this.saving = true
      const user = this.$store.getters.userProfile?.name || 'Operador'
      this.doc = await wmsAPI.submitConference(this.doc.id, this.doc.items, user)
      this.doc.items = this.doc.items.map(i => ({ ...i, product: this.products.find(p => p.id === i.productId) || {} }))
      this.saving = false
      this.syncStep()
      if (this.doc.status === 'CONFERIDO') { this.$message.success('Conferência concluída sem divergências!') }
      else { this.$message.warning('Divergências encontradas. Recontagem iniciada.') }
    },
    async submitRecount() {
      this.saving = true
      const user = this.$store.getters.userProfile?.name || 'Operador'
      this.doc = await wmsAPI.submitRecount(this.doc.id, this.doc.items.map(i => ({ ...i, countedQty: i.recountedQty ?? i.countedQty })), user)
      this.doc.items = this.doc.items.map(i => ({ ...i, product: this.products.find(p => p.id === i.productId) || {} }))
      this.saving = false
      this.syncStep()
      this.$message.success('Recontagem aprovada! Prossiga para o putaway.')
    },
    async finalize() {
      if (this.doc.items.some(i => !i.locationId)) {
        return this.$message.error('Atribua um local de armazenamento para todos os itens.')
      }
      this.saving = true
      const user = this.$store.getters.userProfile?.name || 'Operador'
      // Update items with selected locations before finalizing
      const docInDB = (await wmsAPI.listReceivings()).find(r => r.id === this.doc.id)
      if (docInDB) docInDB.items = this.doc.items
      this.doc = await wmsAPI.finalizeReceiving(this.doc.id, user)
      this.doc.items = (this.doc.items || []).map(i => ({ ...i, product: this.products.find(p => p.id === i.productId) || {} }))
      this.saving = false
      this.$message.success('Recebimento concluído! Estoque atualizado.')
    },
    formatDate(d) { return d ? new Date(d).toLocaleDateString('pt-BR') : '—' },
    formatDateTime(d) { return d ? new Date(d).toLocaleString('pt-BR') : '—' }
  }
}
</script>

<style scoped>
.step-card { padding: 8px; }
.modern-table { background: transparent; }
.modern-table ::v-deep th { background-color: transparent !important; }
.modern-table ::v-deep tr { background-color: transparent !important; }
.text-danger { color: var(--danger-color) !important; }
.info-alert { padding: 16px 20px; border-radius: 8px; background: rgba(16,185,129,0.08); color: var(--success-color); font-weight: 700; display:flex; align-items:center; gap:8px; }
.steps-bar ::v-deep .el-step__title { font-size: 0.875rem; }
</style>
