<template>
  <div class="shipping-detail">
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ isNew ? 'Nova Ordem de Expedição' : 'Expedição ' + doc.id }}</h1>
        <p class="page-subtitle">{{ isNew ? 'Informe o destino e os itens para reservar o estoque' : doc.destination }}</p>
      </div>
      <div style="display:flex;gap:8px;">
        <el-tag v-if="doc.status" :type="statusType(doc.status)" effect="plain" size="large" style="font-weight:700; font-size:0.9rem;">{{ statusLabel(doc.status) }}</el-tag>
        <el-button icon="el-icon-arrow-left" @click="$router.push('/shipping')">Voltar</el-button>
      </div>
    </div>

    <!-- === NEW ORDER FORM === -->
    <div v-if="isNew">
      <el-card class="glass-panel" style="border:none; margin-bottom:24px;">
        <h4 style="margin:0 0 20px;font-weight:700;color:var(--text-main);">Dados da Ordem</h4>
        <el-form :model="newForm" :rules="newRules" ref="newFormRef" label-position="top">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="Destino / Cliente" prop="destination">
                <el-input v-model="newForm.destination" placeholder="Nome do destinatário"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Referência do Pedido" prop="orderRef">
                <el-input v-model="newForm.orderRef" placeholder="Ex: PED-10099"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="Data Requerida de Entrega">
                <el-date-picker v-model="newForm.requiredDate" type="date" style="width:100%" value-format="yyyy-MM-dd"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Prioridade">
                <el-select v-model="newForm.priority" style="width:100%">
                  <el-option label="Normal" value="NORMAL"></el-option>
                  <el-option label="Urgente" value="URGENTE"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>

      <el-card class="glass-panel" style="border:none; margin-bottom:24px;">
        <h4 style="margin:0 0 20px;font-weight:700;color:var(--text-main);">Itens da Ordem</h4>
        <el-table :data="newItems" class="modern-table" style="width:100%; margin-bottom:16px;">
          <el-table-column label="Produto" min-width="220">
            <template slot-scope="s">
              <el-select v-model="s.row.productId" filterable placeholder="Selecionar produto" style="width:100%">
                <el-option v-for="p in products" :key="p.id" :label="p.code + ' — ' + p.name" :value="p.id"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="Quantidade" width="160">
            <template slot-scope="s">
              <el-input-number v-model="s.row.requestedQty" :min="1" controls-position="right" style="width:100%"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column label="" width="60" align="center">
            <template slot-scope="s">
              <el-button type="text" icon="el-icon-delete" class="text-danger" @click="newItems.splice(s.$index,1)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button icon="el-icon-plus" @click="newItems.push({productId:'',requestedQty:1})">Adicionar Item</el-button>
        <div style="text-align:right; margin-top:20px;">
          <el-button type="primary" @click="createOrder" :loading="saving">Confirmar e Reservar Estoque</el-button>
        </div>
      </el-card>
    </div>

    <!-- === EXISTING DOC === -->
    <template v-else>

      <!-- PICKING PANEL -->
      <el-card v-if="doc.status === 'SEPARACAO'" class="glass-panel" style="border:none; margin-bottom:24px;">
        <div style="font-weight:700;color:var(--text-main);margin-bottom:16px;font-size:1.1rem;"><i class="el-icon-location"></i> Painel de Separação</div>
        <el-alert type="info" :closable="false" show-icon title="Retire os itens abaixo conforme posição indicada. Confirme cada retirada individualmente." style="margin-bottom:16px;"></el-alert>
        <el-table :data="doc.items" class="modern-table" style="width:100%">
          <el-table-column label="Produto" min-width="180">
            <template slot-scope="s">{{ s.row.product ? s.row.product.name : s.row.productId }}</template>
          </el-table-column>
          <el-table-column prop="reservedBatchId" label="Lote" width="155"></el-table-column>
          <el-table-column label="Posição (Bin)" width="150" align="center">
            <template slot-scope="s">
              <el-tag type="warning" effect="dark" style="font-weight:700;">{{ s.row.reservedBin }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="requestedQty" label="A Retirar" width="110" align="center"></el-table-column>
          <el-table-column label="Status" width="130" align="center">
            <template slot-scope="s">
              <el-tag :type="s.row.status === 'SEPARADO' ? 'success' : 'info'" effect="plain">{{ s.row.status === 'SEPARADO' ? 'Separado' : 'Pendente' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="Confirmar" width="160" align="center">
            <template slot-scope="s">
              <el-button v-if="s.row.status !== 'SEPARADO'" type="success" size="small" @click="confirmPick(s.row)">
                <i class="el-icon-check"></i> Retirado
              </el-button>
              <span v-else style="color:var(--success-color);font-weight:700;"><i class="el-icon-circle-check"></i> OK</span>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- PACKING PANEL -->
      <el-card v-if="doc.status === 'SEPARADO'" class="glass-panel" style="border:none; margin-bottom:24px;">
        <div style="font-weight:700;color:var(--text-main);margin-bottom:16px;font-size:1.1rem;"><i class="el-icon-box"></i> Conferência e Embalagem</div>
        <el-alert type="warning" :closable="false" show-icon title="Confira os itens separados e registre os volumes de embalagem." style="margin-bottom:16px;"></el-alert>
        <el-table :data="doc.items" class="modern-table" style="width:100%; margin-bottom:20px;">
          <el-table-column label="Produto" min-width="180">
            <template slot-scope="s">{{ s.row.product ? s.row.product.name : s.row.productId }}</template>
          </el-table-column>
          <el-table-column prop="requestedQty" label="Solicitado" width="120" align="center"></el-table-column>
          <el-table-column prop="pickedQty" label="Separado" width="120" align="center"></el-table-column>
          <el-table-column label="Conferido (Embalado)" width="180" align="center">
            <template slot-scope="s">
              <el-input-number v-model="s.row.packedQty" :min="0" :max="s.row.pickedQty" controls-position="right" style="width:100%"></el-input-number>
            </template>
          </el-table-column>
        </el-table>

        <div style="font-weight:700;color:var(--text-main);margin-bottom:12px;">Volumes de Embalagem</div>
        <div v-for="(pkg, idx) in packingPackages" :key="idx" style="display:flex;gap:12px;margin-bottom:8px;align-items:center;">
          <el-input v-model="pkg.label" placeholder="Caixa / Volume" style="width:200px;"></el-input>
          <el-input-number v-model="pkg.weight" :min="0" :precision="2" controls-position="right" placeholder="Peso (kg)" style="width:160px;"></el-input-number>
          <el-button type="text" icon="el-icon-delete" class="text-danger" @click="packingPackages.splice(idx,1)"></el-button>
        </div>
        <el-button icon="el-icon-plus" @click="packingPackages.push({label:'', weight:0})">Adicionar Volume</el-button>

        <div style="text-align:right;margin-top:20px;">
          <el-button type="warning" @click="confirmPacking" :loading="saving">Confirmar Embalagem</el-button>
        </div>
      </el-card>

      <!-- DISPATCH PANEL -->
      <el-card v-if="doc.status === 'EMBALAGEM'" class="glass-panel" style="border:none; margin-bottom:24px;">
        <div style="font-weight:700;color:var(--text-main);margin-bottom:16px;font-size:1.1rem;"><i class="el-icon-truck"></i> Expedição Final</div>
        <el-alert type="success" :closable="false" show-icon title="Embalagem concluída. Confirme a expedição para baixar definitivamente o estoque." style="margin-bottom:16px;"></el-alert>
        <el-table :data="doc.items" class="modern-table" style="width:100%; margin-bottom:20px;">
          <el-table-column label="Produto" min-width="180">
            <template slot-scope="s">{{ s.row.product ? s.row.product.name : s.row.productId }}</template>
          </el-table-column>
          <el-table-column prop="requestedQty" label="Solicitado" width="120" align="center"></el-table-column>
          <el-table-column prop="packedQty" label="Embalado" width="120" align="center"></el-table-column>
          <el-table-column prop="reservedBatchId" label="Lote" width="155"></el-table-column>
          <el-table-column prop="reservedBin" label="Bin de Origem" width="150" align="center"></el-table-column>
        </el-table>
        <div v-if="doc.packages && doc.packages.length">
          <div style="font-weight:600;margin-bottom:8px;">Volumes:</div>
          <el-tag v-for="(p,i) in doc.packages" :key="i" style="margin-right:8px;">{{ p.label }} — {{ p.weight }}kg</el-tag>
        </div>
        <div style="text-align:right;margin-top:20px;">
          <el-button type="danger" @click="finalDispatch" :loading="saving">Confirmar Expedição e Baixar Estoque</el-button>
        </div>
      </el-card>

      <!-- EXPEDIDO VIEW -->
      <el-card v-if="doc.status === 'EXPEDIDO'" class="glass-panel" style="border:none; margin-bottom:24px;">
        <el-result icon="success" title="Expedição Finalizada" sub-title="O estoque foi atualizado e o processo está completo."></el-result>
      </el-card>

      <!-- Items summary (always visible) -->
      <el-card class="glass-panel" style="border:none; margin-bottom:24px;">
        <div style="font-weight:700;color:var(--text-main);margin-bottom:16px;">Itens da Ordem</div>
        <el-table :data="doc.items" class="modern-table" style="width:100%;">
          <el-table-column label="Produto" min-width="180">
            <template slot-scope="s">{{ s.row.product ? s.row.product.name : s.row.productId }}</template>
          </el-table-column>
          <el-table-column prop="requestedQty" label="Solicitado" width="120" align="center"></el-table-column>
          <el-table-column prop="reservedBatchId" label="Lote Reservado" width="160"></el-table-column>
          <el-table-column prop="reservedBin" label="Bin" width="150" align="center"></el-table-column>
          <el-table-column label="Status" width="130" align="center">
            <template slot-scope="s">
              <el-tag :type="itemStatusType(s.row.status)" effect="plain" size="small">{{ itemStatusLabel(s.row.status) }}</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </template>

    <!-- Timeline always at the bottom -->
    <el-card v-if="doc.history && doc.history.length" class="glass-panel" style="border:none;">
      <div style="font-weight:700;color:var(--text-main);margin-bottom:16px;"><i class="el-icon-time"></i> Histórico</div>
      <el-timeline>
        <el-timeline-item v-for="h in doc.history" :key="h.step + h.at" :timestamp="formatDateTime(h.at)" placement="top"
          :color="h.step === 'EXPEDIDO' ? '#10b981' : '#6366f1'">
          <div style="font-weight:700;">{{ h.label }}</div>
          <div style="color:var(--text-muted);font-size:0.85rem;">por {{ h.by }}</div>
        </el-timeline-item>
      </el-timeline>
    </el-card>
  </div>
</template>

<script>
import { wmsAPI } from '../../services/mockData'
export default {
  name: 'ShippingDetailView',
  data() {
    return {
      doc: { items: [], history: [], packages: [] },
      products: [],
      loading: false,
      saving: false,
      newForm: { destination: '', orderRef: '', requiredDate: '', priority: 'NORMAL' },
      newItems: [{ productId: '', requestedQty: 1 }],
      packingPackages: [],
      newRules: {
        destination: [{ required: true, message: 'Informe o destino', trigger: 'blur' }],
        orderRef: [{ required: true, message: 'Informe a referência do pedido', trigger: 'blur' }]
      }
    }
  },
  computed: {
    isNew() { return this.$route.params.id === 'new' }
  },
  async created() {
    this.products = await wmsAPI.getProducts()
    if (!this.isNew) await this.loadDoc()
  },
  methods: {
    async loadDoc() {
      this.loading = true
      this.doc = await wmsAPI.getShipping(this.$route.params.id) || { items: [], history: [], packages: [] }
      this.loading = false
    },
    async createOrder() {
      this.$refs.newFormRef.validate(async valid => {
        if (!valid) return
        if (!this.newItems.length || this.newItems.some(i => !i.productId)) return this.$message.error('Selecione o produto em todos os itens.')
        this.saving = true
        try {
          const user = this.$store.getters.userProfile?.name || 'Operador'
          this.doc = await wmsAPI.createShipping({ ...this.newForm, createdBy: user, items: this.newItems })
          this.$message.success('Ordem criada! Estoque reservado automaticamente via FEFO.')
          this.$router.replace('/shipping/' + this.doc.id)
          await this.loadDoc()
        } catch (e) {
          this.$message.error(e.toString())
        }
        this.saving = false
      })
    },
    async confirmPick(item) {
      this.saving = true
      const user = this.$store.getters.userProfile?.name || 'Operador'
      this.doc = await wmsAPI.confirmPick(this.doc.id, item.id, item.requestedQty, user)
      this.doc.items = this.doc.items.map(i => ({ ...i, product: this.products.find(p => p.id === i.productId) || {} }))
      this.saving = false
      if (this.doc.status === 'SEPARADO') this.$message.success('Todos os itens separados! Prossiga para embalagem.')
    },
    async confirmPacking() {
      if (this.doc.items.some(i => i.packedQty === null || i.packedQty === undefined)) return this.$message.error('Confirme a quantidade embalada de todos os itens.')
      this.saving = true
      const user = this.$store.getters.userProfile?.name || 'Operador'
      this.doc = await wmsAPI.confirmPacking(this.doc.id, this.doc.items, this.packingPackages, user)
      this.doc.items = this.doc.items.map(i => ({ ...i, product: this.products.find(p => p.id === i.productId) || {} }))
      this.saving = false
      this.$message.success('Embalagem confirmada! Pronto para expedição.')
    },
    async finalDispatch() {
      this.saving = true
      const user = this.$store.getters.userProfile?.name || 'Operador'
      this.doc = await wmsAPI.dispatchShipping(this.doc.id, user)
      this.doc.items = this.doc.items.map(i => ({ ...i, product: this.products.find(p => p.id === i.productId) || {} }))
      this.saving = false
      this.$message.success('Expedição concluída! Estoque atualizado.')
    },
    statusLabel(s) {
      return { PENDENTE: 'Pendente', SEPARACAO: 'Em Separação', SEPARADO: 'Separado', EMBALAGEM: 'Em Embalagem', EXPEDIDO: 'Expedido' }[s] || s
    },
    statusType(s) {
      return { PENDENTE: 'info', SEPARACAO: 'warning', SEPARADO: 'primary', EMBALAGEM: 'warning', EXPEDIDO: 'success' }[s] || 'info'
    },
    itemStatusLabel(s) { return { PENDENTE: 'Pendente', SEPARADO: 'Separado', EMBALADO: 'Embalado' }[s] || s },
    itemStatusType(s) { return { PENDENTE: 'info', SEPARADO: 'primary', EMBALADO: 'success' }[s] || 'info' },
    formatDateTime(d) { return d ? new Date(d).toLocaleString('pt-BR') : '—' }
  }
}
</script>

<style scoped>
.modern-table { background: transparent; }
.modern-table ::v-deep th { background-color: transparent !important; }
.modern-table ::v-deep tr { background-color: transparent !important; }
.text-danger { color: var(--danger-color) !important; }
</style>
