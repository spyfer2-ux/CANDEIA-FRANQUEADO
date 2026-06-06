import html2canvas from 'html2canvas'
import { useState, useEffect, useRef } from 'react'
import { auth, db, loginGoogle, logout, getRedirectResult } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, addDoc, getDocs, deleteDoc, doc, query, where, orderBy, updateDoc, onSnapshot, getDoc, setDoc } from 'firebase/firestore'

const ADMIN_PIN = "1234"

const CATEGORIAS = {
  carnes: {
    nome: "🥩 Carnes",
    cor: "#e74c3c",
    corBg: "#fdf2f2",
    unidade: "gramas",
    itens: [
      { id: "bacon-mistura", nome: "Bacon Mistura", preco: 2.68, porcao: "20g" },
      { id: "bacon-puro", nome: "Bacon Puro", preco: 4.47, porcao: "30g" },
      { id: "carne-louca-lanche", nome: "Carne Louca Lanche", preco: 10.96, porcao: "160g" },
      { id: "carne-louca-mistura", nome: "Carne Louca Mistura", preco: 4.13, porcao: "60g" },
      { id: "carne-louca-pura", nome: "Carne Louca Pura", preco: 7.24, porcao: "100g" },
      { id: "carne-mistura", nome: "Carne Mistura", preco: 3.6, porcao: "50g" },
      { id: "carne-pura", nome: "Carne Pura", preco: 5.16, porcao: "70g" },
      { id: "carne-seca-mistura", nome: "Carne Seca Mistura", preco: 7.78, porcao: "40g" },
      { id: "frango-mistura", nome: "Frango Mistura", preco: 2.48, porcao: "50g" },
      { id: "frango-puro", nome: "Frango Puro", preco: 3.19, porcao: "70g" },
      { id: "palmito-mistura", nome: "Palmito Mistura", preco: 2.34, porcao: "70g" },
      { id: "palmito-puro", nome: "Palmito Puro", preco: 5.15, porcao: "150g" },
      { id: "salame", nome: "Salame", preco: 4.55, porcao: "50g" },
      { id: "calabresa", nome: "Calabresa", preco: 1.43, porcao: "50g" },
      { id: "atum", nome: "Atum", preco: 5.0, porcao: "70g" },
      { id: "portuguesa", nome: "Portuguesa", preco: 3.05, porcao: "50g" },
      { id: "misturinha", nome: "Misturinha", preco: 0.80, porcao: "40g" },
      { id: "berinjela", nome: "Berinjela", preco: 3.56, porcao: "90g" },
      { id: "top-cheddar", nome: "Top Cheddar", preco: 29.69, porcao: "un" },
      { id: "requeijao-3-marias", nome: "Requeijão 3 Marias", preco: 204.16, porcao: "5un" },
    ]
  },
  frios: {
    nome: "🧀 Frios",
    cor: "#f39c12",
    corBg: "#fef9f0",
    unidade: "gramas",
    itens: [
      { id: "queijo-fresco", nome: "Queijo Fresco", preco: 4.3, porcao: "100g" },
      { id: "provolone", nome: "Provolone", preco: 1.60, porcao: "30g" },
      { id: "queijo-prato", nome: "Queijo Prato", preco: 1.26, porcao: "30g" },
      { id: "apresuntado", nome: "Apresuntado", preco: 1.52, porcao: "60g" , vendaPorKg: true, kgBase: 0.06 },
      { id: "mussarela", nome: "Mussarela", preco: 2.87, porcao: "60g" , vendaPorKg: true, kgBase: 0.06 },
      { id: "salsicha", nome: "Salsicha", preco: 1.0, porcao: "unidade" },
      { id: "bisnaga-catupiry", nome: "Catupiry", preco: 40.83, porcao: "1,5kg", vendaPorKg: true, kgBase: 1.5 },
      { id: "bisnaga-cheddar", nome: "Cheddar", preco: 13.5, porcao: "1,2kg" },
    ]
  },
  vegetais: {
    nome: "🥦 Vegetais",
    cor: "#27ae60",
    corBg: "#f2fdf5",
    unidade: "gramas",
    itens: [
      { id: "escarola", nome: "Escarola", preco: 3.42, porcao: "70g" },
      { id: "laka", nome: "Laka", preco: 6.06, porcao: "100g" },
      { id: "azeitona", nome: "Balde de Azeitona", preco: 55.00, porcao: "balde" },
      { id: "tomate-seco", nome: "Tomate Seco", preco: 53.66, porcao: "4kg" },
      { id: "milho-mistura", nome: "Milho Mistura", preco: 0.71, porcao: "40g" },
      { id: "milho-puro", nome: "Milho Puro", preco: 1.65, porcao: "80g" },
      { id: "ervilha", nome: "Ervilha", preco: 0.75, porcao: "un" },
      { id: "brocolis", nome: "Brócolis", preco: 4.79, porcao: "70g" },
      { id: "morango", nome: "Morango", preco: 11.00, porcao: "100g" },
      { id: "oregano", nome: "Orégano", preco: 14.60, porcao: "500g" },
      { id: "maionese", nome: "Maionese", preco: 13.50, porcao: "1kg" },
      { id: "pimenta", nome: "Pimenta", preco: 13.49, porcao: "un" },
      { id: "molho-alho", nome: "Molho Alho", preco: 13.20, porcao: "un" },
    ]
  },
  massas: {
    nome: "🥔 Massas",
    cor: "#8e44ad",
    corBg: "#faf2fe",
    unidade: "pacote",
    itens: [
      { id: "batata-palha", nome: "Batata Palha", preco: 28.05, porcao: "800g" , vendaPorKg: true, kgBase: 0.8 },
      { id: "oleo", nome: "Óleo", preco: 7.57, porcao: "un" },
      { id: "massa-pastel", nome: "Massa de Pastel", preco: 47.00, porcao: "pacote 5kg", vendaPorKg: true, kgBase: 5.0 },
      { id: "batata-congelada-350", nome: "Batata Frita P", preco: 4.62, porcao: "325g" },
      { id: "batata-congelada-625", nome: "Batata Frita G", preco: 8.25, porcao: "650g" },
      { id: "pure", nome: "Purê", preco: 8.45, porcao: "500g" },
      { id: "saco-pao-hot-dog", nome: "Pão Hot Dog", preco: 13.50, porcao: "10 unid." },
    ]
  },
  doces: {
    nome: "🍯 Doces",
    cor: "#e67e22",
    corBg: "#fef5ec",
    unidade: "unidade",
    itens: [
      { id: "acucar", nome: "Açúcar", preco: 5.20, porcao: "kg" },
      { id: "goiabada", nome: "Goiabada", preco: 1.30, porcao: "100g" },
      { id: "doce-leite", nome: "Doce de Leite", preco: 135.0, porcao: "balde 4,8kg" , vendaPorKg: true, kgBase: 4.8 },
      { id: "beijinho", nome: "Beijinho", preco: 39.06, porcao: "1kg" },
      { id: "chocolate-cremoso", nome: "Chocolate Cremoso Gourmet", preco: 45.00, porcao: "kg", vendaPorKg: true, kgBase: 1.0 },
      { id: "chocolate-leite", nome: "Chocolate ao Leite", preco: 44.0, porcao: "1kg" , vendaPorKg: true, kgBase: 1.0 },
      { id: "chocolate-branco", nome: "Chocolate Branco", preco: 39.0, porcao: "1kg" , vendaPorKg: true, kgBase: 1.0 },
      { id: "coco", nome: "Coco Ralado", preco: 49.0, porcao: "1kg", pesoCustom: true , vendaPorKg: true, kgBase: 1.0 },
      { id: "canela", nome: "Canela", preco: 22.0, porcao: "500g" },
      { id: "suflair", nome: "Suflair", preco: 9.1, porcao: "50g" },
      { id: "leite-condensado", nome: "Leite Condensado", preco: 8.50, porcao: "395g" },
      { id: "ameixa", nome: "Ameixa", preco: 3.57, porcao: "50g" },
      { id: "cereja", nome: "Cereja", preco: 7.8, porcao: "50g" },
      { id: "granulado", nome: "Granulado", preco: 31.70, porcao: "100g" },
    ]
  },
  salgados: {
    nome: "🥧 Salgados",
    cor: "#c0392b",
    corBg: "#fdf0ef",
    unidade: "unidade",
    itens: [
      { id: "empada-frango-catupiry", nome: "Empada Frango c/ Catupiry", preco: 7.50, porcao: "un" },
      { id: "empada-palmito", nome: "Empada de Palmito", preco: 7.50, porcao: "un" },
      { id: "esfiha-frango-catupiry", nome: "Esfiha Frango Catupiry", preco: 7.50, porcao: "un" },
      { id: "esfiha-calabresa-catupiry", nome: "Esfiha Calabresa Catupiry", preco: 7.50, porcao: "un" },
      { id: "esfiha-carne", nome: "Esfiha de Carne", preco: 7.50, porcao: "un" },
      { id: "coxinha-frango", nome: "Coxinha Frango", preco: 7.50, porcao: "un" },
      { id: "coxinha-frango-catupiry", nome: "Coxinha Frango c/ Catupiry", preco: 7.50, porcao: "un" },
      { id: "kibe", nome: "Kibe", preco: 7.50, porcao: "un" },
      { id: "kibe-catupiry", nome: "Kibe c/ Catupiry", preco: 7.50, porcao: "un" },
      { id: "kibe-mussarela", nome: "Kibe c/ Mussarela", preco: 7.50, porcao: "un" },
    ]
  },
  embalagens: {
    nome: "📦 Embalagens",
    cor: "#2980b9",
    corBg: "#f0f7ff",
    unidade: "unidade",
    itens: [
      { id: "bandeja-batata-g", nome: "Bandeja Batata G", preco: 49.90, porcao: "c/100 unid." },
      { id: "bandeja-batata-p", nome: "Bandeja Batata P", preco: 0.25, porcao: "unidade" },
      { id: "embalagem-empada-50", nome: "Embalagem Empada", preco: 59.00, porcao: "c/50 unid." },
      { id: "embalagem-empada-g", nome: "Embalagem Empada G", preco: 0.19, porcao: "unidade" },
      { id: "embalagem-empada-p", nome: "Embalagem Empada P", preco: 0.15, porcao: "unidade" },
      { id: "bandeja-bh-102", nome: "Estojo 102", preco: 135.50, porcao: "cx c/100" },
      { id: "bandeja-bh-101", nome: "Estojo 101", preco: 52.41, porcao: "cx c/100" },
      { id: "papel-tv", nome: "Papel TV", preco: 10.23, porcao: "un" },
      { id: "interfolha", nome: "Interfolha", preco: 12.76, porcao: "1 pct" },
      { id: "saco-grecepell-1kg", nome: "Saco Grecepell 1kg", preco: 55.00, porcao: "500 unidades" },
      { id: "saco-grecepell-2kg", nome: "Saco Grecepell 2kg", preco: 74.25, porcao: "500 unidades" },
      { id: "toalha-americana", nome: "Toalha Americana", preco: 26.18, porcao: "1 pacote" },
      { id: "copo-300", nome: "Copo 300ml", preco: 7.81, porcao: "pct" },
      { id: "copo-180", nome: "Copo 180ml", preco: 4.18, porcao: "pct" },
      { id: "caixa-media", nome: "Caixa Média", preco: 2.09, porcao: "un" },
      { id: "caixa-grande", nome: "Caixa Grande", preco: 2.46, porcao: "un" },
      { id: "embalagem-lanche", nome: "Embalagem de Lanche", preco: 30.25, porcao: "un" },
      { id: "viagem", nome: "Viagem", preco: 6.60, porcao: "un" },
      { id: "saco-hot-dog", nome: "Saco Hot Dog", preco: 11.0, porcao: "500 unid." },
      { id: "saco-lixo-60l", nome: "Saco de Lixo 60L", preco: 13.46, porcao: "un" },
      { id: "luva-descartavel", nome: "Luva Descartável", preco: 2.20, porcao: "cx" },
      { id: "luva-borracha", nome: "Luva Borracha", preco: 5.60, porcao: "par" },
      { id: "bombril", nome: "Bombril", preco: 2.80, porcao: "un" },
      { id: "papel-toalha", nome: "Papel Toalha", preco: 6.20, porcao: "rolo" },
      { id: "detergente", nome: "Detergente", preco: 2.90, porcao: "un" },
      { id: "saco-lixo", nome: "Saco de Lixo", preco: 13.46, porcao: "un" },
            { id: "ketchup-heinz", nome: "Sachê Ketchup Heinz", preco: 25.30, porcao: "cx unidade" },
      { id: "mostarda-heinz", nome: "Sachê Mostarda Heinz", preco: 25.30, porcao: "cx unidade" },
      { id: "maionese-heinz", nome: "Sachê Maionese Heinz", preco: 25.30, porcao: "cx unidade" },
      { id: "sacola-25x35", nome: "Sacola 25x35", preco: 4.18, porcao: "100 unid." },
      { id: "sacola-35x45", nome: "Sacola 35x45", preco: 8.25, porcao: "100 unid." },
      { id: "touca-descartavel", nome: "Pacote Touca Descartável", preco: 16.50, porcao: "pct" },
      { id: "toca-descartavel", nome: "Toca Descartável", preco: 16.50, porcao: "1 pacote" },
      { id: "bobinas-impressora", nome: "Bobinas", preco: 15.84, porcao: "3 unid." },
      { id: "durex", nome: "Durex", preco: 20.9, porcao: "5 unid." },
      { id: "saco-canudo", nome: "Saco de Canudo", preco: 12.10, porcao: "un" },
    ]
  }
}

// Todos os itens em lista plana para busca
const TODOS_ITENS = Object.entries(CATEGORIAS).flatMap(([catKey, cat]) =>
  cat.itens.map(item => ({ ...item, catKey, catNome: cat.nome, catCor: cat.cor }))
)

// Gera próximo número de pedido sequencial a partir de 10002
function proximoNumeroPedido() {
  try {
    const ultimo = parseInt(localStorage.getItem('ultimo_pedido') || '10001')
    const proximo = ultimo + 1
    localStorage.setItem('ultimo_pedido', String(proximo))
    return proximo
  } catch {
    return 10002
  }
}

const UNIDADES = [
  "Jd Vila Formosa",
  "Itaquera",
]



const ADMIN_EMAILS = ['spyfer2@gmail.com', 'cibellecristianereis@gmail.com', 'jrmauro380@gmail.com']
const FATURA_PIX_KEY = '306.987.778-83'
const FATURA_FAVORECIDO = 'Cibelle Cristiane Reis'
const FATURA_VENCIMENTO_DIAS = 7
const MENSALIDADE_VALOR = 119.00
const MENSALIDADE_DIA_VENC = 15
const ROYALTIES_VALOR = 1874.00
const ROYALTIES_INICIO = new Date(2026, 7, 7) // 7 de agosto de 2026
const isAdmin = (email) => ADMIN_EMAILS.includes(email?.toLowerCase())

export default function App() {
  const [usuario, setUsuario] = useState(null)
  const [loadingAuth, setLoadingAuth] = useState(true)
  const [aba, setAba] = useState('pedido')
  const [franqueado, setFranqueado] = useState(() => {
    try { const r = JSON.parse(localStorage.getItem('rascunho_pedido') || 'null'); return r?.franqueado || { nome: '', unidade: 'Jd Vila Formosa' } } catch { return { nome: '', unidade: 'Jd Vila Formosa' } }
  })
  const [carrinho, setCarrinho] = useState(() => {
    try { const r = JSON.parse(localStorage.getItem('rascunho_pedido') || 'null'); return r?.carrinho || [] } catch { return [] }
  })
  const [categoriaAtiva, setCategoriaAtiva] = useState('carnes')
  const [quantidades, setQuantidades] = useState({})
  const [busca, setBusca] = useState('')
  const [adminPin, setAdminPin] = useState('')
  const [adminLogado, setAdminLogado] = useState(false)
  const [baixaAtiva, setBaixaAtiva] = useState(null)
  const [obsAtual, setObsAtual] = useState('')
  const [abaAdmin, setAbaAdmin] = useState('pedidos') // 'pedidos' | 'alugueis' | 'precos'
  const [alugueis, setAlugueis] = useState([])
  const [novoAluguel, setNovoAluguel] = useState({ franqueado: '', unidade: '', valor: '', mes: new Date().toLocaleString('pt-BR',{month:'long'}), ano: new Date().getFullYear(), vencimento: '' })
  const [baixaAluguelId, setBaixaAluguelId] = useState(null)
  const [obsAluguel, setObsAluguel] = useState('')
  const [showFormAluguel, setShowFormAluguel] = useState(false)
  const [filtroPedidos, setFiltroPedidos] = useState('todos')
  const [showMensalidadePopup, setShowMensalidadePopup] = useState(false)
  const [mensalidadePaga, setMensalidadePaga] = useState(false)
  const [enviandoComprovante, setEnviandoComprovante] = useState(false)
  const [comprovanteEnviado, setComprovanteEnviado] = useState(false)
  const [subAbaCobranca, setSubAbaCobranca] = useState('mensalidade')
  const [royaltiesEnviado, setRoyaltiesEnviado] = useState(false)
  const [royaltiesPago, setRoyaltiesPago] = useState(false)
  const [mensalidadesAdmin, setMensalidadesAdmin] = useState({})
  const [whatsappNums, setWhatsappNums] = useState({})
  const [editandoWpp, setEditandoWpp] = useState(null)
  const [faturaAtiva, setFaturaAtiva] = useState(null)
  const faturaRef = useRef(null)
  const [pedidoImagemAtivo, setPedidoImagemAtivo] = useState(null)
  const pedidoImagemRef = useRef(null)
  const [pinErro, setPinErro] = useState(false)
  const [historico, setHistorico] = useState(() => {
    try { return JSON.parse(localStorage.getItem('historico_precos') || '[]') }
    catch { return [] }
  })
  const [novaObs, setNovaObs] = useState('')
  const [orcamentosSalvos, setOrcamentosSalvos] = useState(() => {
    try { return JSON.parse(localStorage.getItem('orcamentos_salvos') || '[]') }
    catch { return [] }
  })
  const [orcamentoSalvoMsg, setOrcamentoSalvoMsg] = useState(false)

  // Firebase Auth listener
  useEffect(() => {
    let unsubSnap = null

    const init = async () => {
      // Primeiro processar resultado do redirect
      try {
        const result = await getRedirectResult(auth)
        if (result?.user) console.log('Login por redirect OK:', result.user.email)
      } catch (e) {
        console.error('Redirect error:', e)
      }

      // Depois configurar listener de auth
      const unsub = onAuthStateChanged(auth, (user) => {
      setUsuario(user)
      setLoadingAuth(false)
      if (unsubSnap) { unsubSnap(); unsubSnap = null }
      if (user) {
        // Listener em tempo real dos pedidos do Firestore
        // Admin vê todos os pedidos, franqueado vê só os seus
        const q = isAdmin(user.email)
          ? query(collection(db, 'orcamentos'))
          : query(collection(db, 'orcamentos'), where('uid', '==', user.uid))
        unsubSnap = onSnapshot(q,
          (snap) => {
            const lista = snap.docs.map(d => ({ docId: d.id, ...d.data() }))
            lista.sort((a, b) => b.id - a.id)
            setOrcamentosSalvos(lista)
          },
          (e) => { console.error('Firestore listener error:', e); alert('Erro ao carregar pedidos: ' + e.message) }
        )
      } else {
        try {
          const local = JSON.parse(localStorage.getItem('orcamentos_salvos') || '[]')
          setOrcamentosSalvos(local)
        } catch(e) { setOrcamentosSalvos([]) }
      }
      })
      return unsub
    }

    let cleanup = null
    init().then(unsub => { cleanup = unsub })
    return () => { if (cleanup) cleanup(); if (unsubSnap) unsubSnap() }
  }, [])

  // Auto-salva rascunho no localStorage sempre que carrinho ou franqueado mudar
  useEffect(() => {
    if (carrinho.length > 0 || franqueado.nome) {
      localStorage.setItem('rascunho_pedido', JSON.stringify({ carrinho, franqueado }))
    }
  }, [carrinho, franqueado])

  const [pedidoGerado, setPedidoGerado] = useState(false)
  const [ultimoPedidoNum, setUltimoPedidoNum] = useState(null)

  const formatPreco = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  const itensBusca = busca.trim().length >= 2
    ? TODOS_ITENS.filter(item =>
        item.nome.toLowerCase().includes(busca.toLowerCase()) ||
        item.catNome.toLowerCase().includes(busca.toLowerCase())
      )
    : []

  const adicionarAoCarrinho = (item, catKey) => {
    const catInfo = CATEGORIAS[catKey]
    if (item.vendaPorKg) {
      const kgDigitado = parseFloat(String(quantidades[item.id] || '').replace(',', '.') || 0)
      if (kgDigitado <= 0) return
      const precoKg = item.preco / (item.kgBase || 1)
      const precoFinal = parseFloat((precoKg * kgDigitado).toFixed(2))
      const porcaoLabel = kgDigitado.toFixed(3).replace('.', ',') + ' kg'
      const existente = carrinho.find(c => c.id === item.id + '-' + catKey)
      if (existente) {
        setCarrinho(carrinho.map(c => c.id === item.id + '-' + catKey ? { ...c, quantidade: c.quantidade + 1, porcao: porcaoLabel, preco: precoFinal } : c))
      } else {
        setCarrinho([...carrinho, { id: item.id + '-' + catKey, nome: item.nome, porcao: porcaoLabel, preco: precoFinal, quantidade: 1, categoria: catInfo.nome }])
      }
      setQuantidades({ ...quantidades, [item.id]: '' })
      return
    }
    if (item.pesoCustom) {
      const gramas = quantidades[item.id] || 100
      if (gramas <= 0) return
      const precoUnitario = parseFloat((item.preco / 1000 * gramas).toFixed(2))
      const porcaoLabel = gramas + 'g'
      const existente = carrinho.find(c => c.id === item.id + '-' + catKey)
      if (existente) {
        setCarrinho(carrinho.map(c => c.id === item.id + '-' + catKey ? { ...c, quantidade: c.quantidade + 1, porcao: porcaoLabel, preco: precoUnitario } : c))
      } else {
        setCarrinho([...carrinho, { id: item.id + '-' + catKey, nome: item.nome, porcao: porcaoLabel, preco: precoUnitario, quantidade: 1, categoria: catInfo.nome }])
      }
      setQuantidades({ ...quantidades, [item.id]: 100 })
    } else {
      const qty = quantidades[item.id] || 1
      if (qty <= 0) return
      const existente = carrinho.find(c => c.id === item.id + '-' + catKey)
      if (existente) {
        setCarrinho(carrinho.map(c => c.id === item.id + '-' + catKey ? { ...c, quantidade: c.quantidade + qty } : c))
      } else {
        setCarrinho([...carrinho, { id: item.id + '-' + catKey, nome: item.nome, porcao: item.porcao === 'g' ? qty + 'g' : item.porcao, preco: item.porcao === 'g' ? item.preco * qty : item.preco, quantidade: item.porcao === 'g' ? 1 : qty, categoria: catInfo.nome }])
      }
      setQuantidades({ ...quantidades, [item.id]: 1 })
    }
  }

  const removerDoCarrinho = (id) => setCarrinho(carrinho.filter(c => c.id !== id))

  const atualizarQtd = (id, novaQty) => {
    if (novaQty <= 0) { removerDoCarrinho(id); return }
    setCarrinho(carrinho.map(c => c.id === id ? { ...c, quantidade: novaQty } : c))
  }

  const total = carrinho.reduce((acc, item) => acc + item.preco * item.quantidade, 0)

  const gerarPDF = () => {
    const numPedido = proximoNumeroPedido()
    const win = window.open('', '_blank')
    const linhas = carrinho.map(item =>
      `<tr><td>${item.categoria}</td><td>${item.nome} (${item.porcao})</td><td>${item.quantidade}</td><td>${formatPreco(item.preco)}</td><td>${formatPreco(item.preco * item.quantidade)}</td></tr>`
    ).join('')
    win.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Pedido #${numPedido} — Candeia Jr</title>
<style>body{font-family:Arial,sans-serif;padding:20px}h1{color:#c0392b}h2{color:#555}
.num-pedido{font-size:14px;color:#888;margin-bottom:4px}
table{width:100%;border-collapse:collapse;margin-top:20px}
th{background:#c0392b;color:white;padding:8px;text-align:left}
td{padding:8px;border-bottom:1px solid #ddd}
.total{font-size:18px;font-weight:bold;text-align:right;margin-top:20px;color:#c0392b}
@media print{button{display:none}}</style></head>
<body>
<div class="num-pedido">Pedido Nº <strong>#${numPedido}</strong></div>
<h1>🔥 Candeia Jr — Portal do Franqueado</h1>
<h2>Pedido de: ${franqueado.nome || 'Franqueado'} | Unidade: ${franqueado.unidade || '-'}</h2>
<p>Data: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}</p>
<table><thead><tr><th>Categoria</th><th>Item</th><th>Qtd</th><th>Preço Un.</th><th>Subtotal</th></tr></thead>
<tbody>${linhas}</tbody></table>
<div class="total">TOTAL: ${formatPreco(total)}</div>
<button onclick="window.print()" style="margin-top:20px;padding:10px 20px;background:#c0392b;color:white;border:none;border-radius:5px;font-size:16px">🖨️ Imprimir / Salvar PDF</button>
</body></html>`)
    win.document.close()
    localStorage.removeItem('rascunho_pedido')
    setUltimoPedidoNum(numPedido)
    setPedidoGerado(true)
  }

  const compartilharWhatsapp = () => {
    const numPedido = ultimoPedidoNum
    const data = new Date().toLocaleDateString('pt-BR')
    const linhasTexto = carrinho.map(item =>
      ` • ${item.nome} (${item.porcao}) x${item.quantidade} = ${formatPreco(item.preco * item.quantidade)}`
    ).join('\n')
    const msg = `🔥 *CANDEIA JR — PEDIDO #${numPedido}*\n\n` +
      `👤 *Franqueado:* ${franqueado.nome || '-'}\n` +
      `🏪 *Unidade:* ${franqueado.unidade || '-'}\n` +
      `📅 *Data:* ${data}\n\n` +
      `📋 *Itens do Pedido:*\n${linhasTexto}\n\n` +
      `💰 *TOTAL: ${formatPreco(total)}*`
    const url = `https://wa.me/?text=${encodeURIComponent(msg)}`
    window.open(url, '_blank')
  }

  const loginAdmin = () => {
    if (adminPin === ADMIN_PIN) { setAdminLogado(true); setPinErro(false) }
    else { setPinErro(true) }
  }

  const registrarAtualizacao = () => {
    const novo = { numero: historico.length + 1, data: new Date().toLocaleString('pt-BR'), obs: novaObs }
    const novoHistorico = [...historico, novo]
    setHistorico(novoHistorico)
    localStorage.setItem('historico_precos', JSON.stringify(novoHistorico))
    setNovaObs('')
  }

  const salvarOrcamento = async () => {
    if (carrinho.length === 0) return
    if (!usuario) {
      alert('⚠️ Você precisa fazer login com o Google antes de salvar o pedido!')
      return
    }
    const orcamento = {
      status: 'pendente',
      id: Date.now(),
      data: new Date().toLocaleString('pt-BR'),
      franqueado: franqueado.nome || 'Sem nome',
      unidade: franqueado.unidade || '-',
      itens: [...carrinho],
      total,
      uid: usuario ? usuario.uid : 'anonimo',
      email: usuario ? usuario.email : 'sem-login'
    }
    if (usuario) {
      try {
        // Gerar número sequencial do pedido
        const counterRef = doc(db, 'config', 'contador')
        let numeroPedido = 1
        try {
          const counterSnap = await getDoc(counterRef)
          if (counterSnap.exists()) {
            const atual = counterSnap.data().pedidos
            numeroPedido = Math.max(atual, 10008) + 1
          } else numeroPedido = 10009
          await setDoc(counterRef, { pedidos: numeroPedido })
        } catch(e) { numeroPedido = Date.now() }
        orcamento.numeroPedido = numeroPedido

        await addDoc(collection(db, 'orcamentos'), orcamento)
        // onSnapshot atualiza a lista automaticamente
      } catch(e) {
        console.error('Erro ao salvar:', e)
        alert('Erro ao salvar pedido: ' + e.message + '\nVerifique sua conexão e tente novamente.')
        return
      }
    } else {
      const novos = [orcamento, ...orcamentosSalvos]
      setOrcamentosSalvos(novos)
      localStorage.setItem('orcamentos_salvos', JSON.stringify(novos))
    }
    // Limpar carrinho, ir para Meus Pedidos e compartilhar
    setCarrinho([])
    localStorage.removeItem('rascunho_pedido')
    setAba('meus-pedidos')
    // Pequeno delay para o estado atualizar antes de gerar imagem
    setTimeout(async () => {
      const pedidoParaCompartilhar = { ...orcamento, docId: null }
      await gerarImagemPedido(pedidoParaCompartilhar)
    }, 800)
  }



  const gerarImagemPedido = async (o) => {
    setPedidoImagemAtivo(o)
    await new Promise(r => setTimeout(r, 400))
    if (!pedidoImagemRef.current) return
    try {
      const canvas = await html2canvas(pedidoImagemRef.current, { scale: 2, backgroundColor: '#ffffff', useCORS: true, logging: false })
      canvas.toBlob(async (blob) => {
        const file = new File([blob], `pedido-${o.numeroPedido || o.id}.png`, { type: 'image/png' })
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], title: `Pedido #${o.numeroPedido} — Candeias Jr`, text: `Pedido de ${o.franqueado} — Total: ${o.total?.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}` })
        } else {
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `pedido-${o.numeroPedido || o.id}.png`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
        }
        setPedidoImagemAtivo(null)
      }, 'image/png')
    } catch(e) { console.error(e); setPedidoImagemAtivo(null) }
  }


  const compartilharPedido = async (o) => {
    const linhas = (o.itens || []).map(item =>
      `• ${item.nome} (${item.porcao}) × ${item.quantidade} = ${(item.preco * item.quantidade).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`
    ).join('\n')
    const texto = `🫓 *Pedido Candeias Jr — #${o.numeroPedido || '—'}*\n` +
      `📅 ${o.data}\n` +
      `👤 ${o.franqueado || '—'} | ${o.unidade || '—'}\n\n` +
      `${linhas}\n\n` +
      `💰 *Total: ${o.total?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}*\n` +
      `Status: ${o.status === 'concluido' ? '✅ Concluído' : o.status === 'parcial' ? '🔶 Parcial' : isVencido(o) ? '🔴 Vencido' : '📅 ' + (o.data?.split(' ')[0] || '')}`
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Pedido Candeias Jr', text: texto })
      } else {
        await navigator.clipboard.writeText(texto)
        alert('Pedido copiado! Cole no WhatsApp.')
      }
    } catch (e) { console.error(e) }
  }

  // Verificar mensalidade
  useEffect(() => {
    if (!usuario || isAdmin(usuario.email)) return
    const hoje = new Date()
    const dia = hoje.getDate()
    const mesAno = hoje.getMonth() + '_' + hoje.getFullYear()
    if (dia < 8 || dia > 15) return
    const verificar = async () => {
      // Verificar se admin deu baixa
      try {
        const snap = await getDoc(doc(db, 'mensalidades', mesAno + '_' + usuario.uid))
        if (snap.exists()) {
          if (snap.data().status === 'pago') { setMensalidadePaga(true); return }
          if (snap.data().comprovante) setComprovanteEnviado(true)
        }
      } catch(e) {}
      // Verificar royalties
      try {
        const snapR = await getDoc(doc(db, 'royalties', mesAno + '_' + usuario.uid))
        if (snapR.exists()) {
          if (snapR.data().status === 'pago') setRoyaltiesPago(true)
          if (snapR.data().comprovante) setRoyaltiesEnviado(true)
        }
      } catch(e) {}
      // Verificar 24h desde último dismiss
      const ultimoDismiss = localStorage.getItem('mensalidade_dismiss_' + mesAno + '_' + usuario.uid)
      if (ultimoDismiss) {
        const diff = Date.now() - parseInt(ultimoDismiss)
        if (diff < 24 * 60 * 60 * 1000) return // menos de 24h
      }
      setShowMensalidadePopup(true)
    }
    verificar()
  }, [usuario])


  const isVencido = (o) => {
    if (o.status === 'concluido') return false
    try {
      const partes = o.data?.split(' ')[0]?.split('/')
      if (!partes || partes.length < 3) return false
      const dataPedido = new Date(partes[2], partes[1]-1, partes[0])
      const diff = (new Date() - dataPedido) / (1000 * 60 * 60 * 24)
      return diff > 7
    } catch { return false }
  }


  const gerarFaturaImagem = async (o) => {
    // Salvar dataVencimento no Firestore
    const dataVenc = new Date()
    dataVenc.setDate(dataVenc.getDate() + 7)
    const dataVencStr = dataVenc.toLocaleDateString('pt-BR')
    if (o.docId) {
      try {
        await updateDoc(doc(db, 'orcamentos', o.docId), { dataVencimento: dataVencStr, faturaGerada: true })
      } catch(e) { console.error(e) }
    }
    setFaturaAtiva({ ...o, dataVencimento: dataVencStr })
    await new Promise(r => setTimeout(r, 400))
    if (!faturaRef.current) return
    try {
      const canvas = await html2canvas(faturaRef.current, { scale: 2, backgroundColor: '#ffffff', useCORS: true, logging: false })
      canvas.toBlob(async (blob) => {
        const file = new File([blob], `fatura-${o.numeroPedido || o.id}.png`, { type: 'image/png' })
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], title: `Fatura #${o.numeroPedido || o.id} — Candeias Jr`, text: `Total: ${o.total?.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}` })
        } else {
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `fatura-${o.numeroPedido || o.id}.png`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
        }
        setFaturaAtiva(null)
      }, 'image/png')
    } catch(e) { console.error(e); setFaturaAtiva(null) }
  }



  const salvarWhatsapp = async (franqueadoKey, numero) => {
    const novos = { ...whatsappNums, [franqueadoKey]: numero }
    setWhatsappNums(novos)
    try {
      await setDoc(doc(db, 'config', 'whatsapp_nums'), novos)
    } catch(e) { console.error(e) }
    setEditandoWpp(null)
  }

  const enviarFaturaWhatsapp = (o, numero) => {
    const dataVenc = o.dataVencimento || (() => {
      const d = new Date(); d.setDate(d.getDate()+7); return d.toLocaleDateString('pt-BR')
    })()
    const linhas = (o.itens||[]).map(i => '  • ' + i.nome + ' (' + i.porcao + ') x' + i.quantidade + ' = ' + (i.preco*i.quantidade).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})).join('\n')
    const nl = '\n'
    const msg = [
      '🧾 *FATURA #' + o.numeroPedido + ' — Candeias Jr*',
      '',
      '👤 *' + o.franqueado + '* | 🏪 ' + o.unidade,
      '📅 Emissão: ' + new Date().toLocaleDateString('pt-BR'),
      '⏰ *Vencimento: ' + dataVenc + '*',
      '',
      '📋 *Itens:*',
      linhas,
      '',
      '💰 *TOTAL: ' + o.total?.toLocaleString('pt-BR',{style:'currency',currency:'BRL'}) + '*',
      '',
      '💠 *PIX:* ' + FATURA_PIX_KEY,
      '👤 Favorecido: ' + FATURA_FAVORECIDO,
      '',
      'Por favor envie o comprovante após o pagamento. ✅'
    ].join(nl)
    const num = numero.replace(/\D/g,'')
    window.open(`https://wa.me/55${num}?text=${encodeURIComponent(msg)}`, '_blank')
  }


  const enviarComprovante = async (file) => {
    if (!file || !usuario) return
    setEnviandoComprovante(true)
    try {
      // Comprimir imagem via canvas
      const img = new Image()
      const reader = new FileReader()
      reader.onload = async (e) => {
        img.onload = async () => {
          const canvas = document.createElement('canvas')
          const MAX = 800
          let w = img.width, h = img.height
          if (w > MAX) { h = h * MAX / w; w = MAX }
          if (h > MAX) { w = w * MAX / h; h = MAX }
          canvas.width = w; canvas.height = h
          canvas.getContext('2d').drawImage(img, 0, 0, w, h)
          const base64 = canvas.toDataURL('image/jpeg', 0.7)
          const mesAno = new Date().getMonth() + '_' + new Date().getFullYear()
          const key = mesAno + '_' + usuario.uid
          await setDoc(doc(db, 'mensalidades', key), {
            status: 'aguardando',
            franqueado: franqueado.nome || usuario.displayName || usuario.email,
            unidade: franqueado.unidade || '—',
            uid: usuario.uid,
            email: usuario.email,
            mes: new Date().toLocaleString('pt-BR', { month: 'long', year: 'numeric' }),
            dataEnvio: new Date().toLocaleDateString('pt-BR'),
            comprovante: base64
          })
          setComprovanteEnviado(true)
          setEnviandoComprovante(false)
        }
        img.src = e.target.result
      }
      reader.readAsDataURL(file)
    } catch(e) {
      console.error(e)
      alert('Erro ao enviar: ' + e.message)
      setEnviandoComprovante(false)
    }
  }


  const enviarComprovanteRoyalties = async (file) => {
    if (!file || !usuario) return
    try {
      const img = new Image()
      const reader = new FileReader()
      reader.onload = async (e) => {
        img.onload = async () => {
          const canvas = document.createElement('canvas')
          const MAX = 800
          let w = img.width, h = img.height
          if (w > MAX) { h = h * MAX / w; w = MAX }
          if (h > MAX) { w = w * MAX / h; h = MAX }
          canvas.width = w; canvas.height = h
          canvas.getContext('2d').drawImage(img, 0, 0, w, h)
          const base64 = canvas.toDataURL('image/jpeg', 0.7)
          const mesAno = new Date().getMonth() + '_' + new Date().getFullYear()
          await setDoc(doc(db, 'royalties', mesAno + '_' + usuario.uid), {
            status: 'aguardando',
            franqueado: franqueado.nome || usuario.displayName || usuario.email,
            unidade: franqueado.unidade || '—',
            uid: usuario.uid,
            email: usuario.email,
            mes: new Date().toLocaleString('pt-BR', { month: 'long', year: 'numeric' }),
            dataEnvio: new Date().toLocaleDateString('pt-BR'),
            comprovante: base64
          })
          setRoyaltiesEnviado(true)
        }
        img.src = e.target.result
      }
      reader.readAsDataURL(file)
    } catch(e) { alert('Erro: ' + e.message) }
  }


  const salvarAluguel = async () => {
    if (!novoAluguel.franqueado || !novoAluguel.valor) return
    try {
      const rec = {
        ...novoAluguel,
        id: Date.now(),
        valor: parseFloat(novoAluguel.valor),
        dataEmissao: new Date().toLocaleDateString('pt-BR'),
        status: 'pendente',
        observacao: '',
        uid: usuario.uid
      }
      await addDoc(collection(db, 'alugueis'), rec)
      setNovoAluguel({ franqueado: '', unidade: '', valor: '', mes: new Date().toLocaleString('pt-BR',{month:'long'}), ano: new Date().getFullYear(), vencimento: '' })
      setShowFormAluguel(false)
    } catch(e) { console.error(e) }
  }

  const darBaixaAluguel = async (a, obs) => {
    if (!isAdmin(usuario?.email)) return
    try {
      await updateDoc(doc(db, 'alugueis', a.docId), {
        status: 'pago',
        dataPagamento: new Date().toLocaleDateString('pt-BR'),
        observacao: obs || ''
      })
    } catch(e) { console.error(e) }
    setBaixaAluguelId(null)
    setObsAluguel('')
  }

  const excluirAluguel = async (a) => {
    if (!window.confirm('Excluir este recibo?')) return
    try { await deleteDoc(doc(db, 'alugueis', a.docId)) } catch(e) { console.error(e) }
  }

  const imprimirRecibo = (a) => {
    const w = window.open('', '_blank')
    w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Recibo #${a.id}</title>
    <style>
      body{font-family:Georgia,serif;max-width:600px;margin:40px auto;padding:20px;color:#222}
      h1{text-align:center;color:#c0392b;font-size:22px;margin-bottom:4px}
      .sub{text-align:center;color:#888;font-size:13px;margin-bottom:24px}
      .box{border:2px solid #c0392b;border-radius:8px;padding:20px;margin-bottom:20px}
      .row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f0f0f0;font-size:14px}
      .total{font-size:22px;font-weight:bold;color:#c0392b;text-align:center;padding:16px;background:#fdf0ef;border-radius:8px;margin:16px 0}
      .assinatura{margin-top:40px;border-top:1px solid #ccc;padding-top:10px;text-align:center;font-size:12px;color:#888}
    </style></head><body>
    <h1>🫓 Pastelaria Candeias Jr</h1>
    <div class="sub">RECIBO DE ALUGUEL</div>
    <div class="box">
      <div class="row"><span><b>Franqueado</b></span><span>${a.franqueado}</span></div>
      <div class="row"><span><b>Unidade</b></span><span>${a.unidade || '—'}</span></div>
      <div class="row"><span><b>Referência</b></span><span>${a.mes} / ${a.ano}</span></div>
      <div class="row"><span><b>Emissão</b></span><span>${a.dataEmissao}</span></div>
      <div class="row"><span><b>Vencimento</b></span><span>${a.vencimento || '—'}</span></div>
      <div class="row"><span><b>Status</b></span><span>${a.status === 'pago' ? '✅ PAGO em ' + (a.dataPagamento||'') : '⏳ PENDENTE'}</span></div>
      ${a.observacao ? '<div class="row"><span><b>Obs</b></span><span>'+a.observacao+'</span></div>' : ''}
    </div>
    <div class="total">R$ ${a.valor.toLocaleString('pt-BR',{minimumFractionDigits:2})}</div>
    <div class="assinatura">
      Candeias Jr — Recibo gerado em ${new Date().toLocaleDateString('pt-BR')}<br><br>
      _________________________________<br>Assinatura do Locador
    </div>
    <script>window.print();window.onafterprint=()=>window.close()<\/script>
    </body></html>`)
    w.document.close()
  }


  const darBaixa = async (o, novoStatus, obs) => {
    if (!isAdmin(usuario?.email)) return
    const update = { status: novoStatus, observacao: obs || '' }
    if (o.docId) {
      try {
        await updateDoc(doc(db, 'orcamentos', o.docId), update)
      } catch (e) { console.error(e) }
    }
    setOrcamentosSalvos(prev => prev.map(x => x.id === o.id ? { ...x, ...update } : x))
    setBaixaAtiva(null)
    setObsAtual('')
  }

  const excluirOrcamento = async (id, docId) => {
    if (usuario && docId) {
      try { await deleteDoc(doc(db, 'orcamentos', docId)) } catch(e) { console.error(e) }
    } else {
      const novos = orcamentosSalvos.filter(o => o.id !== id)
      localStorage.setItem('orcamentos_salvos', JSON.stringify(novos))
    }
    setOrcamentosSalvos(orcamentosSalvos.filter(o => o.id !== id))
  }

  const catKeys = Object.keys(CATEGORIAS)

  // Tela de loading
  if (loadingAuth) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fdf6ec' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48 }}>🫓</div>
        <p style={{ color: '#c0392b', fontWeight: 'bold', fontSize: 16 }}>Carregando...</p>
      </div>
    </div>
  )

  // Tela de login obrigatório
  if (!usuario) return (
    <div style={{ minHeight: '100vh', background: '#fdf6ec', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <img src="/CANDEIA-FRANQUEADO/banner.jpg" alt="Candeias Jr" style={{ width: '100%', maxWidth: 500, borderRadius: 16, marginBottom: 32, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }} />
      <div style={{ background: 'white', borderRadius: 16, padding: 32, maxWidth: 380, width: '100%', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <h2 style={{ color: '#c0392b', margin: '0 0 8px' }}>Portal do Franqueado</h2>
        <p style={{ color: '#888', fontSize: 14, margin: '0 0 24px' }}>Faça login com sua conta Google para acessar o sistema de pedidos</p>
        <button onClick={loginGoogle} style={{ width: '100%', padding: '14px', background: 'white', color: '#444', border: '1.5px solid #ddd', borderRadius: 10, cursor: 'pointer', fontWeight: 'bold', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.7 29.3 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6-6C34.5 5.1 29.5 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.6 0 20-7.7 20-21 0-1.3-.2-2.7-.4-4z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.5 15.1 18.9 12 24 12c3.1 0 5.9 1.1 8.1 2.9l6-6C34.5 5.1 29.5 3 24 3 16.3 3 9.7 7.9 6.3 14.7z"/><path fill="#4CAF50" d="M24 45c5.2 0 10-1.9 13.7-5L31 33.9C29.1 35.2 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8L6 32.9C9.3 39.9 16.2 45 24 45z"/><path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.6-2.6 4.8-4.8 6.3l6.7 5.1C41 35.6 44 30.3 44 24c0-1.3-.2-2.7-.4-4z"/></svg>
          Entrar com Google
        </button>
        <p style={{ color: '#bbb', fontSize: 12, marginTop: 16 }}>Apenas franqueados autorizados</p>
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ position: 'relative', width: '100%' }}>
        <img src="/CANDEIA-FRANQUEADO/banner.jpg" alt="Pastelaria Candeias Jr" style={{ width: '100%', display: 'block', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', bottom: 12, right: 12 }}>
          {usuario ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(0,0,0,0.55)', borderRadius: 20, padding: '5px 12px' }}>
              <img src={usuario.photoURL} alt="" style={{ width: 26, height: 26, borderRadius: '50%', border: '2px solid white' }} />
              <span style={{ fontSize: 12, color: 'white', fontWeight: 'bold' }}>{usuario.displayName}</span>
              <button onClick={logout} style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid white', color: 'white', borderRadius: 10, padding: '3px 10px', cursor: 'pointer', fontSize: 11 }}>Sair</button>
            </div>
          ) : (
            <button onClick={loginGoogle} style={{ background: 'white', color: '#c0392b', border: 'none', borderRadius: 20, padding: '8px 18px', cursor: 'pointer', fontWeight: 'bold', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
              <span style={{ fontWeight: 'bold' }}>G</span> Entrar com Google
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '2px solid #e74c3c', background: 'white' }}>
        {[['pedido','📋 Pedido'],['carrinho',`🛒 Carrinho (${carrinho.length})`],['meus-pedidos','📦 Meus Pedidos'],...(isAdmin(usuario?.email) ? [['admin','⚙️ Admin']] : [])].map(([key,label]) => (
          <button key={key} onClick={() => setAba(key)} style={{ flex: 1, padding: '12px', border: 'none', background: aba === key ? '#e74c3c' : 'white', color: aba === key ? 'white' : '#333', fontWeight: 'bold', fontSize: 14, transition: 'all 0.2s' }}>{label}</button>
        ))}
      </div>

      {/* ABA PEDIDO */}
      {aba === 'pedido' && (
        <div style={{ padding: 16 }}>
          {/* Dados franqueado */}
          <div style={{ background: 'white', padding: 16, borderRadius: 8, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <h3 style={{ marginBottom: 12, color: '#c0392b' }}>Seus dados</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
              <input
                placeholder="Nome do Franqueado"
                value={franqueado.nome}
                onChange={e => setFranqueado({...franqueado, nome: e.target.value})}
                style={{ padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }}
              />
              <select
                value={franqueado.unidade}
                onChange={e => setFranqueado({...franqueado, unidade: e.target.value})}
                style={{ padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14, background: 'white' }}
              >
                {UNIDADES.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
          {/* Campo de busca */}
          <div style={{ background: 'white', padding: '12px 16px', borderRadius: 8, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 18, color: '#aaa' }}>🔍</span>
              <input type="text" placeholder="Buscar item em todas as categorias..." value={busca} onChange={e => setBusca(e.target.value)}
                style={{ width: '100%', padding: '10px 12px 10px 40px', border: '2px solid #e74c3c', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', outline: 'none' }} />
              {busca && (
                <button onClick={() => setBusca('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', fontSize: 18, color: '#aaa', cursor: 'pointer' }}>✕</button>
              )}
            </div>
            {busca.trim().length >= 2 && (
              <div style={{ marginTop: 10 }}>
                {itensBusca.length === 0 ? (
                  <p style={{ color: '#888', textAlign: 'center', padding: '10px 0', fontSize: 14 }}>Nenhum item encontrado para "{busca}"</p>
                ) : (
                  <>
                    <p style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>{itensBusca.length} resultado(s) encontrado(s)</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10 }}>
                      {itensBusca.map(item => (
                        <div key={item.id + item.catKey} style={{ background: '#fafafa', borderRadius: 8, padding: 12, borderLeft: `4px solid ${item.catCor}`, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                          <div style={{ fontWeight: 'bold', fontSize: 14 }}>{item.nome}</div>
                          <div style={{ fontSize: 11, color: '#888', marginBottom: 6 }}>{item.catNome} · {item.porcao}</div>
                          <div style={{ fontSize: 16, fontWeight: 'bold', color: item.catCor, marginBottom: 8 }}>{formatPreco(item.preco)}</div>
                          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                            <button onClick={() => setQuantidades({...quantidades, [item.id]: Math.max(1,(quantidades[item.id]||1)-1)})} style={{ width: 28, height: 28, border: `1px solid ${item.catCor}`, borderRadius: 4, background: 'white', color: item.catCor, fontWeight: 'bold' }}>-</button>
                            <input type="text" inputMode="numeric" pattern="[0-9]*" value={quantidades[item.id] === '' ? '' : (quantidades[item.id] ?? 1)} onChange={e => { const v = e.target.value; setQuantidades({...quantidades, [item.id]: v === '' ? '' : Math.max(1, parseInt(v)||1)}) }} style={{ width: 44, textAlign: 'center', padding: '3px', border: '1px solid #ddd', borderRadius: 4, fontSize: 13 }}/>
                            <button onClick={() => setQuantidades({...quantidades, [item.id]: (quantidades[item.id]||1)+1})} style={{ width: 28, height: 28, border: `1px solid ${item.catCor}`, borderRadius: 4, background: 'white', color: item.catCor, fontWeight: 'bold' }}>+</button>
                            <button onClick={() => { adicionarAoCarrinho(item, item.catKey); setBusca('') }} style={{ flex: 1, padding: '6px', background: item.catCor, color: 'white', border: 'none', borderRadius: 6, fontWeight: 'bold', fontSize: 12, cursor: 'pointer' }}>Adicionar</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Categorias nav */}
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 16, paddingBottom: 4 }}>
            {catKeys.map(cat => {
              const c = CATEGORIAS[cat]
              return (
                <button key={cat} onClick={() => setCategoriaAtiva(cat)} style={{ padding: '8px 14px', borderRadius: 20, border: `2px solid ${c.cor}`, background: categoriaAtiva === cat ? c.cor : 'white', color: categoriaAtiva === cat ? 'white' : c.cor, fontWeight: 'bold', whiteSpace: 'nowrap', fontSize: 13, transition: 'all 0.2s', cursor: 'pointer' }}>{c.nome}</button>
              )
            })}
          </div>

          {/* Itens da categoria */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
            {CATEGORIAS[categoriaAtiva].itens.map(item => {
              const cat = CATEGORIAS[categoriaAtiva]
              return (
                <div key={item.id} style={{ background: 'white', borderRadius: 10, padding: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderLeft: `4px solid ${cat.cor}` }}>
                  <div style={{ fontWeight: 'bold', marginBottom: 4, color: '#222' }}>{item.nome}</div>
                  <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>
                    {item.vendaPorKg ? `R$ ${(item.preco / (item.kgBase||1)).toFixed(2).replace('.',',')} / kg` : item.pesoCustom ? `Preço: ${formatPreco(item.preco)}/kg` : `Embalagem: ${item.porcao}`}
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 'bold', color: cat.cor, marginBottom: 10 }}>
                    {item.vendaPorKg
                      ? formatPreco(parseFloat(((item.preco / (item.kgBase||1)) * (parseFloat(String(quantidades[item.id]||'0').replace(',','.')) || 0)).toFixed(2)))
                      : item.pesoCustom
                        ? formatPreco(parseFloat((item.preco / 1000 * (quantidades[item.id] || 100)).toFixed(2)))
                        : formatPreco(item.preco)}
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    {item.vendaPorKg ? (
                      <><input type="number" step="0.001" min="0.001" value={quantidades[item.id] ?? ''} onChange={e => setQuantidades({...quantidades, [item.id]: e.target.value})} placeholder="ex: 3.658" style={{ width: 90, textAlign: 'center', padding: '4px', border: `1.5px solid ${cat.cor}`, borderRadius: 4, fontSize: 14 }}/><span style={{fontSize:12,color:'#888'}}>kg</span></>
                    ) : item.pesoCustom ? (
                      <><input type="text" inputMode="numeric" pattern="[0-9]*" value={quantidades[item.id] === '' ? '' : (quantidades[item.id] ?? 100)} onChange={e => { const v = e.target.value; setQuantidades({...quantidades, [item.id]: v === '' ? '' : Math.max(1, parseInt(v)||1)}) }} style={{ width: 70, textAlign: 'center', padding: '4px', border: `1px solid ${cat.cor}`, borderRadius: 4 }}/><span style={{fontSize:12,color:'#888'}}>g</span></>
                    ) : (
                      <><button onClick={() => setQuantidades({...quantidades, [item.id]: Math.max(1,(quantidades[item.id]||1)-1)})} style={{ width: 32, height: 32, border: `1px solid ${cat.cor}`, borderRadius: 4, background: 'white', color: cat.cor, fontWeight: 'bold', fontSize: 16, cursor: 'pointer' }}>-</button>
                    <input type="text" inputMode="numeric" pattern="[0-9]*" value={quantidades[item.id] === '' ? '' : (quantidades[item.id] ?? 1)} onChange={e => { const v = e.target.value; setQuantidades({...quantidades, [item.id]: v === '' ? '' : Math.max(1, parseInt(v)||1)}) }} style={{ width: 50, textAlign: 'center', padding: '4px', border: '1px solid #ddd', borderRadius: 4 }}/>
                    <button onClick={() => setQuantidades({...quantidades, [item.id]: (quantidades[item.id]||1)+1})} style={{ width: 32, height: 32, border: `1px solid ${cat.cor}`, borderRadius: 4, background: 'white', color: cat.cor, fontWeight: 'bold', fontSize: 16, cursor: 'pointer' }}>+</button></>
                    )}
                    <button onClick={() => adicionarAoCarrinho(item, categoriaAtiva)} style={{ flex: 1, padding: '8px', background: cat.cor, color: 'white', border: 'none', borderRadius: 6, fontWeight: 'bold', fontSize: 13, cursor: 'pointer' }}>Adicionar</button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ABA CARRINHO */}
      {aba === 'carrinho' && (
        <div style={{ padding: 16 }}>
          {carrinho.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#888' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🛒</div>
              <p>Carrinho vazio. Adicione itens na aba Pedido.</p>
            </div>
          ) : (
            <>
              <div style={{ background: 'white', borderRadius: 10, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: 16 }}>
                {carrinho.map((item, i) => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: i < carrinho.length-1 ? '1px solid #f0f0f0' : 'none' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 'bold', fontSize: 14 }}>{item.nome}</div>
                      <div style={{ fontSize: 12, color: '#888' }}>{item.categoria} · {item.porcao} · {formatPreco(item.preco)}/un</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <button onClick={() => atualizarQtd(item.id, item.quantidade-1)} style={{ width: 28, height: 28, border: '1px solid #ddd', borderRadius: 4, background: 'white', cursor: 'pointer' }}>-</button>
                      <span style={{ minWidth: 24, textAlign: 'center', fontWeight: 'bold' }}>{item.quantidade}</span>
                      <button onClick={() => atualizarQtd(item.id, item.quantidade+1)} style={{ width: 28, height: 28, border: '1px solid #ddd', borderRadius: 4, background: 'white', cursor: 'pointer' }}>+</button>
                    </div>
                    <div style={{ fontWeight: 'bold', minWidth: 80, textAlign: 'right', color: '#c0392b' }}>
                      {formatPreco(item.preco * item.quantidade)}
                    </div>
                    <button onClick={() => removerDoCarrinho(item.id)} style={{ background: 'none', border: 'none', color: '#e74c3c', fontSize: 18, cursor: 'pointer' }}>✕</button>
                  </div>
                ))}
              </div>
              <div style={{ background: 'white', padding: 16, borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
                  <span>Total</span>
                  <span style={{ color: '#c0392b' }}>{formatPreco(total)}</span>
                </div>
                {!usuario && (
                  <div style={{ background: '#fff3cd', border: '1px solid #ffc107', borderRadius: 8, padding: '8px 12px', marginBottom: 8, fontSize: 13, color: '#856404', textAlign: 'center' }}>
                    ⚠️ Faça login para salvar pedidos
                  </div>
                )}
                <button onClick={salvarOrcamento} style={{ width: '100%', padding: 16, background: 'linear-gradient(135deg, #25d366, #128c7e)', color: 'white', border: 'none', borderRadius: 8, fontSize: 17, fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                  📲 Salvar e Compartilhar Pedido
                </button>
              </div>
            </>
          )}
        </div>
      )}


      {/* ABA MEUS PEDIDOS */}
      {aba === 'meus-pedidos' && (
        <div style={{ padding: 16 }}>
          <h2 style={{ color: '#c0392b', margin: '0 0 16px' }}>📦 Meus Pedidos Realizados</h2>
          {!usuario ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#888' }}>
              <p style={{ fontSize: 16 }}>Faça login para ver seus pedidos.</p>
              <button onClick={loginGoogle} style={{ marginTop: 12, background: '#c0392b', color: 'white', border: 'none', borderRadius: 8, padding: '10px 24px', cursor: 'pointer', fontWeight: 'bold', fontSize: 15 }}>Entrar com Google</button>
            </div>
          ) : orcamentosSalvos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#aaa' }}>
              <div style={{ fontSize: 48 }}>📦</div>
              <p>Nenhum pedido realizado ainda.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {orcamentosSalvos.map(o => (
                <div key={o.docId || o.id} style={{ background: 'white', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: `2px solid ${o.status === 'concluido' ? '#27ae60' : o.status === 'parcial' ? '#f39c12' : '#e74c3c'}` }}>
                  <div style={{ padding: '12px 16px', background: o.status === 'concluido' ? '#eafaf1' : o.status === 'parcial' ? '#fef9e7' : '#fff5f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#c0392b', fontSize: 15 }}>Pedido #{o.numeroPedido || '—'}</div>
                      <div style={{ fontWeight: 'bold', color: '#333', fontSize: 13 }}>📅 {o.data}</div>
                      <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>Unidade: {o.unidade || '—'}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 'bold', color: '#c0392b', fontSize: 16 }}>{o.total?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                      <div style={{ marginTop: 4, padding: '2px 10px', borderRadius: 12, fontSize: 11, fontWeight: 'bold', background: o.status === 'concluido' ? '#27ae60' : o.status === 'parcial' ? '#f39c12' : '#e74c3c', color: 'white', display: 'inline-block' }}>
                        {o.status === 'concluido' ? '✅ Concluído' : o.status === 'parcial' ? '🔶 Parcial' : isVencido(o) ? '🔴 Vencido' : '📅 ' + (o.data?.split(' ')[0] || '')}
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: '10px 16px' }}>
                    {(o.itens || []).map((item, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '2px 0', color: '#555' }}>
                        <span>{item.nome} ({item.porcao}) × {item.quantidade}</span>
                        <span>{(item.preco * item.quantidade).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ padding: '10px 16px', borderTop: '1px solid #f5f5f5' }}>
                    <button onClick={() => gerarImagemPedido(o)}
                      style={{ width: '100%', padding: '11px', background: 'linear-gradient(135deg, #25d366, #128c7e)', color: 'white', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                      📲 Compartilhar Pedido
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}


      {/* ABA COBRANÇAS */}
      {aba === 'cobrancas' && !isAdmin(usuario?.email) && (
        <div style={{ padding: 16 }}>
          <h2 style={{ color: '#c0392b', margin: '0 0 12px' }}>💰 Cobranças</h2>
          {/* Sub-abas */}
          <div style={{ display:'flex', gap:8, marginBottom:16 }}>
            {[['mensalidade','💳 Mensalidade'],['royalties','👑 Royalties']].map(([k,l]) => (
              <button key={k} onClick={() => setSubAbaCobranca(k)} style={{ flex:1, padding:'10px', border:'none', borderRadius:8, fontWeight:'bold', fontSize:13, cursor:'pointer', background: subAbaCobranca===k ? '#c0392b' : '#f5f5f5', color: subAbaCobranca===k ? 'white' : '#555' }}>{l}</button>
            ))}
          </div>

          {subAbaCobranca === 'mensalidade' && (
          <div>
          <div style={{ background: 'white', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.1)', marginBottom: 16 }}>
            <div style={{ background: 'linear-gradient(135deg, #c0392b, #e74c3c)', padding: '20px 16px', color: 'white', textAlign: 'center' }}>
              <div style={{ fontSize: 13, opacity: 0.9, marginBottom: 4 }}>MENSALIDADE — PORTAL CANDEIAS JR</div>
              <div style={{ fontSize: 36, fontWeight: 'bold' }}>R$ 119,00</div>
              <div style={{ fontSize: 13, opacity: 0.9, marginTop: 4 }}>Vencimento todo dia <b>15</b> do mês</div>
          <div style={{ background: 'white', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.1)', marginBottom: 16 }}>
            <div style={{ background: 'linear-gradient(135deg, #c0392b, #e74c3c)', padding: '20px 16px', color: 'white', textAlign: 'center' }}>
              <div style={{ fontSize: 13, opacity: 0.9, marginBottom: 4 }}>MENSALIDADE — PORTAL CANDEIAS JR</div>
              <div style={{ fontSize: 36, fontWeight: 'bold' }}>R$ 119,00</div>
              <div style={{ fontSize: 13, opacity: 0.9, marginTop: 4 }}>Vencimento todo dia <b>15</b> do mês</div>
            </div>
            <div style={{ padding: '10px 16px', background: 'rgba(0,0,0,0.15)', color: 'rgba(255,255,255,0.9)', fontSize: 12, lineHeight: 1.5 }}>
              Sistema de inserção de pedidos para franqueados e sistema de PDV de funcionamento da unidade
            </div>
            <div style={{ padding: 16 }}>
              {/* Próximo vencimento */}
              {(() => {
                const hoje = new Date()
                const venc = new Date(hoje.getFullYear(), hoje.getMonth(), 15)
                if (hoje.getDate() > 15) venc.setMonth(venc.getMonth() + 1)
                const diff = Math.ceil((venc - hoje) / (1000*60*60*24))
                const mes = venc.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })
                return (
                  <div style={{ background: diff <= 7 ? '#fff3cd' : '#f8f9fa', border: `1px solid ${diff <= 7 ? '#ffc107' : '#e9ecef'}`, borderRadius: 8, padding: '12px 16px', marginBottom: 16, textAlign: 'center' }}>
                    <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>PRÓXIMO VENCIMENTO</div>
                    <div style={{ fontSize: 18, fontWeight: 'bold', color: diff <= 7 ? '#856404' : '#333' }}>
                      15 de {mes}
                    </div>
                    {diff <= 7 && <div style={{ fontSize: 13, color: '#856404', marginTop: 4 }}>⚠️ Vence em {diff} dia{diff !== 1 ? 's' : ''}!</div>}
                  </div>
                )
              })()}

              {/* PIX */}
              <div style={{ background: '#f0fff4', border: '1px solid #9ae6b4', borderRadius: 8, padding: '14px 16px' }}>
                <div style={{ fontSize: 13, fontWeight: 'bold', color: '#276749', marginBottom: 8 }}>💠 Pagar via PIX</div>
                <div style={{ background: 'white', border: '1px solid #ddd', borderRadius: 6, padding: '10px 14px', fontFamily: 'monospace', fontSize: 15, fontWeight: 'bold', textAlign: 'center', letterSpacing: 1, color: '#333', marginBottom: 8 }}>
                  {FATURA_PIX_KEY}
                </div>
                <div style={{ fontSize: 13, color: '#555' }}>👤 Favorecido: <b>{FATURA_FAVORECIDO}</b></div>
                <button onClick={() => { navigator.clipboard?.writeText(FATURA_PIX_KEY); alert('Chave PIX copiada!') }}
                  style={{ width: '100%', marginTop: 10, padding: '10px', background: '#38a169', color: 'white', border: 'none', borderRadius: 6, fontWeight: 'bold', fontSize: 14, cursor: 'pointer' }}>
                  📋 Copiar Chave PIX
                </button>
              </div>

              {/* Enviar comprovante */}
              <div style={{ marginTop: 16 }}>
                {comprovanteEnviado ? (
                  <div style={{ background: '#e8f8f2', border: '1px solid #27ae60', borderRadius: 8, padding: '12px 16px', textAlign: 'center' }}>
                    <div style={{ fontSize: 24, marginBottom: 4 }}>✅</div>
                    <div style={{ fontWeight: 'bold', color: '#27ae60' }}>Comprovante enviado!</div>
                    <div style={{ fontSize: 12, color: '#555', marginTop: 4 }}>Aguardando confirmação do administrador.</div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: 13, color: '#555', marginBottom: 8, textAlign: 'center' }}>Após pagar, envie o comprovante:</div>
                    <label style={{ display: 'block', width: '100%', padding: '12px', background: '#c0392b', color: 'white', border: 'none', borderRadius: 8, fontWeight: 'bold', fontSize: 14, cursor: 'pointer', textAlign: 'center', boxSizing: 'border-box' }}>
                      {enviandoComprovante ? '⏳ Enviando...' : '📎 Enviar Comprovante'}
                      <input type="file" accept="image/*" capture="environment" style={{ display: 'none' }}
                        onChange={e => e.target.files[0] && enviarComprovante(e.target.files[0])} />
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>

          </div>
          )}

          {/* ROYALTIES */}
          {subAbaCobranca === 'royalties' && (
            <div>
              {new Date() < ROYALTIES_INICIO ? (
                <div style={{ background:'white', borderRadius:12, padding:24, textAlign:'center', boxShadow:'0 2px 12px rgba(0,0,0,0.1)' }}>
                  <div style={{ fontSize:40, marginBottom:12 }}>🎉</div>
                  <div style={{ fontSize:18, fontWeight:'bold', color:'#27ae60', marginBottom:8 }}>Você está em período de isenção!</div>
                  <div style={{ fontSize:14, color:'#555', marginBottom:16 }}>
                    Os royalties da marca começam a ser cobrados a partir de<br/>
                    <b>07 de agosto de 2026</b>
                  </div>
                  <div style={{ background:'#f0fff4', border:'1px solid #9ae6b4', borderRadius:8, padding:'12px 16px', display:'inline-block' }}>
                    <div style={{ fontSize:12, color:'#276749' }}>Valor após isenção</div>
                    <div style={{ fontSize:28, fontWeight:'bold', color:'#276749' }}>R$ 1.874,00/mês</div>
                  </div>
                  <p style={{ fontSize:12, color:'#aaa', marginTop:12 }}>Royalties referentes ao uso da marca Candeias Jr.</p>
                </div>
              ) : (
                <div style={{ background:'white', borderRadius:12, overflow:'hidden', boxShadow:'0 2px 12px rgba(0,0,0,0.1)', marginBottom:16 }}>
                  <div style={{ background:'linear-gradient(135deg, #2c3e50, #3d5166)', padding:'20px 16px', color:'white', textAlign:'center' }}>
                    <div style={{ fontSize:13, opacity:0.9, marginBottom:4 }}>ROYALTIES — MARCA CANDEIAS JR</div>
                    <div style={{ fontSize:36, fontWeight:'bold' }}>R$ 1.874,00</div>
                    <div style={{ fontSize:13, opacity:0.9, marginTop:4 }}>Vencimento todo dia <b>15</b> do mês</div>
                  </div>
                  <div style={{ padding:16 }}>
                    {(() => {
                      const hoje = new Date()
                      const venc = new Date(hoje.getFullYear(), hoje.getMonth(), 15)
                      if (hoje.getDate() > 15) venc.setMonth(venc.getMonth()+1)
                      const diff = Math.ceil((venc-hoje)/(1000*60*60*24))
                      return (
                        <div style={{ background: diff<=7 ? '#fff3cd' : '#f8f9fa', border:`1px solid ${diff<=7 ? '#ffc107' : '#e9ecef'}`, borderRadius:8, padding:'12px 16px', marginBottom:16, textAlign:'center' }}>
                          <div style={{ fontSize:12, color:'#888', marginBottom:4 }}>PRÓXIMO VENCIMENTO</div>
                          <div style={{ fontSize:18, fontWeight:'bold', color: diff<=7 ? '#856404' : '#333' }}>15 de {venc.toLocaleString('pt-BR',{month:'long',year:'numeric'})}</div>
                          {diff<=7 && <div style={{ fontSize:13, color:'#856404', marginTop:4 }}>⚠️ Vence em {diff} dia{diff!==1?'s':''}!</div>}
                        </div>
                      )
                    })()}
                    <div style={{ background:'#f0f4ff', border:'1px solid #b2c0f8', borderRadius:8, padding:'14px 16px', marginBottom:16 }}>
                      <div style={{ fontSize:13, fontWeight:'bold', color:'#2c3e50', marginBottom:8 }}>💠 Pagar via PIX</div>
                      <div style={{ background:'white', border:'1px solid #ddd', borderRadius:6, padding:'10px 14px', fontFamily:'monospace', fontSize:15, fontWeight:'bold', textAlign:'center', letterSpacing:1, marginBottom:8 }}>{FATURA_PIX_KEY}</div>
                      <div style={{ fontSize:13, color:'#555' }}>👤 Favorecido: <b>{FATURA_FAVORECIDO}</b></div>
                      <button onClick={() => { navigator.clipboard?.writeText(FATURA_PIX_KEY); alert('Chave copiada!') }}
                        style={{ width:'100%', marginTop:10, padding:'10px', background:'#2c3e50', color:'white', border:'none', borderRadius:6, fontWeight:'bold', fontSize:14, cursor:'pointer' }}>
                        📋 Copiar Chave PIX
                      </button>
                    </div>
                    {royaltiesEnviado ? (
                      <div style={{ background:'#e8f8f2', border:'1px solid #27ae60', borderRadius:8, padding:'12px 16px', textAlign:'center' }}>
                        <div style={{ fontSize:24, marginBottom:4 }}>✅</div>
                        <div style={{ fontWeight:'bold', color:'#27ae60' }}>Comprovante enviado!</div>
                        <div style={{ fontSize:12, color:'#555', marginTop:4 }}>Aguardando confirmação.</div>
                      </div>
                    ) : (
                      <label style={{ display:'block', width:'100%', padding:'12px', background:'#2c3e50', color:'white', border:'none', borderRadius:8, fontWeight:'bold', fontSize:14, cursor:'pointer', textAlign:'center', boxSizing:'border-box' }}>
                        📎 Enviar Comprovante
                        <input type="file" accept="image/*" capture="environment" style={{ display:'none' }}
                          onChange={e => e.target.files[0] && enviarComprovanteRoyalties(e.target.files[0])} />
                      </label>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ABA ADMIN */}
      {aba === 'admin' && isAdmin(usuario?.email) && (
        <div style={{ padding: 16 }}>
          {!adminLogado ? (
            <div style={{ maxWidth: 360, margin: '40px auto', background: 'white', padding: 24, borderRadius: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
              <h3 style={{ textAlign: 'center', marginBottom: 20, color: '#c0392b' }}>🔒 Área Admin</h3>
              <input type="password" placeholder="PIN de acesso" value={adminPin} onChange={e => setAdminPin(e.target.value)} onKeyPress={e => e.key === 'Enter' && loginAdmin()}
                style={{ width: '100%', padding: 12, border: `1px solid ${pinErro ? '#e74c3c' : '#ddd'}`, borderRadius: 6, fontSize: 16, marginBottom: 8, boxSizing: 'border-box' }}/>
              {pinErro && <p style={{ color: '#e74c3c', fontSize: 13, marginBottom: 8 }}>PIN incorreto</p>}
              <button onClick={loginAdmin} style={{ width: '100%', padding: 12, background: '#c0392b', color: 'white', border: 'none', borderRadius: 6, fontSize: 16, fontWeight: 'bold', cursor: 'pointer' }}>Entrar</button>
            </div>
          ) : (
            <div>



              {/* MENSALIDADES - Admin */}
              {abaAdmin === 'mensalidades' && (
                <div>
                  <h3 style={{ color:'#c0392b', marginBottom:12 }}>💳 Mensalidades — {new Date().toLocaleString('pt-BR',{month:'long',year:'numeric'})}</h3>
                  <p style={{ color:'#888', fontSize:13, marginBottom:16 }}>Dê baixa após receber o pagamento de R$ 119,00 de cada franqueado.</p>
                  {orcamentosSalvos.filter((o,i,arr) => arr.findIndex(x => x.uid === o.uid) === i).map(o => {
                    const mesAno = new Date().getMonth() + '_' + new Date().getFullYear()
                    const key = mesAno + '_' + o.uid
                    return (
                      <div key={o.uid} style={{ background:'white', borderRadius:10, padding:'12px 16px', marginBottom:10, border:'1px solid #eee', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                        <div>
                          <div style={{ fontWeight:'bold', color:'#333' }}>👤 {o.franqueado}</div>
                          <div style={{ fontSize:12, color:'#888' }}>{o.unidade}</div>
                        </div>
                        {(() => {
                          const mesAno = new Date().getMonth() + '_' + new Date().getFullYear()
                          const key = mesAno + '_' + o.uid
                          return (
                            <div style={{ display:'flex', flexDirection:'column', gap:6, alignItems:'flex-end' }}>
                              {mensalidadesAdmin[key]?.comprovante && (
                                <img src={mensalidadesAdmin[key].comprovante} alt="comprovante"
                                  onClick={() => window.open(mensalidadesAdmin[key].comprovante)}
                                  style={{ width:60, height:60, objectFit:'cover', borderRadius:6, cursor:'pointer', border:'2px solid #27ae60' }} />
                              )}
                              {mensalidadesAdmin[key]?.status === 'pago' ? (
                                <span style={{ fontSize:12, color:'#27ae60', fontWeight:'bold' }}>✅ Pago em {mensalidadesAdmin[key].dataPagamento}</span>
                              ) : (
                                <button onClick={async () => {
                                  const dados = mensalidadesAdmin[key] || {}
                                  await setDoc(doc(db,'mensalidades',key), { ...dados, status:'pago', franqueado:o.franqueado, uid:o.uid, dataPagamento:new Date().toLocaleDateString('pt-BR'), mes:new Date().toLocaleString('pt-BR',{month:'long',year:'numeric'}) })
                                  setMensalidadesAdmin(prev => ({...prev, [key]: {...(prev[key]||{}), status:'pago', dataPagamento:new Date().toLocaleDateString('pt-BR')}}))
                                }} style={{ padding:'8px 14px', background:'#27ae60', color:'white', border:'none', borderRadius:8, fontWeight:'bold', fontSize:13, cursor:'pointer' }}>
                                  {mensalidadesAdmin[key]?.comprovante ? '✅ Confirmar Pago' : '✅ Dar Baixa'}
                                </button>
                              )}
                            </div>
                          )
                        })()}
                      </div>
                    )
                  })}
                </div>
              )}

              {/* ORÇAMENTOS SALVOS */}
              {abaAdmin === 'pedidos' && (
              <div style={{ background: 'white', padding: 16, borderRadius: 10, marginTop: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <h3 style={{ color: '#c0392b', margin: 0 }}>📦 Pedidos ({orcamentosSalvos.length})</h3>
                    <span style={{ fontSize: 12, color: '#888' }}>
                      {orcamentosSalvos.filter(o => o.status !== 'concluido').length} pendentes
                    </span>
                  </div>
                  {/* Filtros */}
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {[['todos','🗂️ Todos'], ['pendente','Abertos'], ['parcial','🔶 Parciais'], ['vencido','🔴 Vencidos'], ['concluido','✅ Concluídos']].map(([k,l]) => (
                      <button key={k} onClick={() => setFiltroPedidos(k)} style={{
                        padding: '6px 12px', borderRadius: 16, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 'bold',
                        background: filtroPedidos === k ? '#c0392b' : '#f5f5f5',
                        color: filtroPedidos === k ? 'white' : '#555'
                      }}>{l} ({k === 'todos' ? orcamentosSalvos.length : orcamentosSalvos.filter(o => o.status === k).length})</button>
                    ))}
                  </div>
                </div>
                {orcamentosSalvos.filter(o => filtroPedidos === 'todos' || (filtroPedidos === 'vencido' ? isVencido(o) : o.status === filtroPedidos)).length === 0 ? (
                  <p style={{ color: '#888', textAlign: 'center', padding: 20 }}>Nenhum pedido neste filtro.</p>
                ) : (
                  orcamentosSalvos.filter(o => filtroPedidos === 'todos' || (filtroPedidos === 'vencido' ? isVencido(o) : o.status === filtroPedidos)).map(o => (
                    <div key={o.docId || o.id} style={{ border: `2px solid ${o.status === 'concluido' ? '#27ae60' : o.status === 'parcial' ? '#f39c12' : '#e74c3c'}`, borderRadius: 8, marginBottom: 12, overflow: 'hidden' }}>
                      <div style={{ background: o.status === 'concluido' ? '#eafaf1' : o.status === 'parcial' ? '#fef9e7' : '#fdf0ef', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 'bold', color: '#c0392b' }}>👤 {o.franqueado} — {o.unidade}</div>
                          <div style={{ fontSize: 11, marginTop: 2, display:'flex', gap:4, flexWrap:'wrap', alignItems:'center' }}>
                            <span style={{ padding: '2px 8px', borderRadius: 10, fontWeight: 'bold', background: o.status === 'concluido' ? '#27ae60' : o.status === 'parcial' ? '#f39c12' : isVencido(o) ? '#8e44ad' : '#e0e0e0', color: o.status === 'concluido' || o.status === 'parcial' || isVencido(o) ? 'white' : '#888' }}>
                              {o.status === 'concluido' ? '✅ Concluído' : o.status === 'parcial' ? '🔶 Parcial' : isVencido(o) ? '🔴 Vencido' : ''}
                            </span>
                            {o.data && <span style={{ color: '#888' }}>📅 Pedido: {o.data.split(' ')[0]}</span>}
                            {o.dataVencimento && <span style={{ color: o.status !== 'concluido' ? '#e74c3c' : '#888', fontWeight: 'bold' }}>⏰ Vence: {o.dataVencimento}</span>}
                            {o.numeroPedido && <span style={{ color: '#aaa' }}>#{o.numeroPedido}</span>}
                          </div>
                          <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>🕐 {o.data}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ fontWeight: 'bold', color: '#c0392b', fontSize: 16 }}>{o.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                            {!o.faturaGerada && (
                            <button onClick={() => gerarFaturaImagem(o)}
                              style={{ background:'#2c3e50', color:'white', border:'none', borderRadius:6, padding:'5px 10px', cursor:'pointer', fontSize:12, fontWeight:'bold' }}>
                              🧾 Fatura
                            </button>
                          )}

                          <button onClick={() => { if (window.confirm("⚠️ Tem certeza que deseja EXCLUIR este pedido?\n\nEsta ação não pode ser desfeita!")) excluirOrcamento(o.id, o.docId) }}
                            style={{ background: 'none', border: 'none', color: '#e74c3c', fontSize: 18, cursor: 'pointer', lineHeight: 1 }}>✕</button>
                        </div>
                      </div>
                      <div style={{ padding: '10px 14px' }}>
                        {o.itens.map((item, i) => (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '3px 0', borderBottom: i < o.itens.length - 1 ? '1px solid #f9f9f9' : 'none' }}>
                            <span style={{ color: '#444' }}>{item.nome} ({item.porcao}) × {item.quantidade}</span>
                            <span style={{ fontWeight: 'bold', color: '#555' }}>{(item.preco * item.quantidade).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                          </div>
                        ))}
                        {o.observacao && (
                          <div style={{ marginTop: 8, padding: '6px 10px', background: '#fffbe6', borderRadius: 6, fontSize: 12, color: '#666', borderLeft: '3px solid #f0ad00' }}>
                            📝 {o.observacao}
                          </div>
                        )}
                      </div>

                      {/* Botões de baixa */}
                      {o.status !== 'concluido' && (
                        <div style={{ padding: '10px 14px', borderTop: '1px solid #f5f5f5' }}>
                          {baixaAtiva === o.id ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                              <input
                                type="text"
                                placeholder="Observação (opcional)..."
                                value={obsAtual}
                                onChange={e => setObsAtual(e.target.value)}
                                style={{ width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: 6, fontSize: 13, boxSizing: 'border-box' }}
                              />
                              <div style={{ display: 'flex', gap: 8 }}>
                                <button onClick={() => darBaixa(o, 'parcial', obsAtual)}
                                  style={{ flex: 1, padding: '9px', background: '#f39c12', color: 'white', border: 'none', borderRadius: 6, fontWeight: 'bold', fontSize: 13, cursor: 'pointer' }}>
                                  🔶 Baixa Parcial
                                </button>
                                <button onClick={() => darBaixa(o, 'concluido', obsAtual)}
                                  style={{ flex: 1, padding: '9px', background: '#27ae60', color: 'white', border: 'none', borderRadius: 6, fontWeight: 'bold', fontSize: 13, cursor: 'pointer' }}>
                                  ✅ Concluído
                                </button>
                              </div>
                              <button onClick={() => { setBaixaAtiva(null); setObsAtual('') }}
                                style={{ width: '100%', padding: '7px', background: '#eee', color: '#666', border: 'none', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>
                                Cancelar
                              </button>
                            </div>
                          ) : (
                            <button onClick={() => { setBaixaAtiva(o.id); setObsAtual('') }}
                              style={{ width: '100%', padding: '9px', background: o.status === 'parcial' ? '#f39c12' : '#c0392b', color: 'white', border: 'none', borderRadius: 6, fontWeight: 'bold', fontSize: 13, cursor: 'pointer' }}>
                              {o.status === 'parcial' ? '🔶 Atualizar Baixa' : '📋 Dar Baixa'}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Popup mensalidade */}
      {showMensalidadePopup && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: 'white', borderRadius: 16, maxWidth: 360, width: '100%', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
            <div style={{ background: 'linear-gradient(135deg, #c0392b, #e74c3c)', padding: '20px 16px', color: 'white', textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 4 }}>💳</div>
              <div style={{ fontSize: 18, fontWeight: 'bold' }}>Mensalidade a Vencer!</div>
              <div style={{ fontSize: 13, opacity: 0.9 }}>Portal Candeias Jr</div>
            </div>
            <div style={{ padding: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>Vencimento dia 15/{String(new Date().getMonth()+1).padStart(2,'0')}/{new Date().getFullYear()}</div>
              <div style={{ fontSize: 32, fontWeight: 'bold', color: '#c0392b', marginBottom: 16 }}>R$ 119,00</div>
              <div style={{ background: '#f8f8f8', borderRadius: 8, padding: '10px 14px', marginBottom: 12 }}>
                <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Chave PIX</div>
                <div style={{ fontFamily: 'monospace', fontWeight: 'bold', fontSize: 15 }}>{FATURA_PIX_KEY}</div>
                <div style={{ fontSize: 12, color: '#555', marginTop: 4 }}>Favorecido: {FATURA_FAVORECIDO}</div>
              </div>
              <button onClick={() => { navigator.clipboard?.writeText(FATURA_PIX_KEY); alert('Chave copiada!') }}
                style={{ width: '100%', padding: '10px', background: '#38a169', color: 'white', border: 'none', borderRadius: 8, fontWeight: 'bold', fontSize: 14, cursor: 'pointer', marginBottom: 8 }}>
                📋 Copiar Chave PIX
              </button>
              <button onClick={() => {
                const mesAno = new Date().getMonth() + '_' + new Date().getFullYear()
                localStorage.setItem('mensalidade_dismiss_' + mesAno + '_' + usuario.uid, Date.now().toString())
                setShowMensalidadePopup(false)
              }} style={{ width: '100%', padding: '10px', background: '#eee', color: '#555', border: 'none', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>
                Ok, já vi — fechar por 24h
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Card invisível para imagem do pedido */}
      {pedidoImagemAtivo && (
        <div style={{ position: 'fixed', left: -9999, top: 0, zIndex: -1 }}>
          <div ref={pedidoImagemRef} style={{ width: 580, background: 'white', fontFamily: 'Arial, sans-serif', padding: 0, color: '#222', borderRadius: 12, overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg, #7c2f00, #c44010)', color: 'white', padding: '20px 24px' }}>
              <div style={{ fontSize: 11, opacity: 0.8, letterSpacing: 2, marginBottom: 4 }}>CANDEIAS JR — PEDIDO CONFIRMADO</div>
              <div style={{ fontSize: 22, fontWeight: 'bold' }}>Pedido #{pedidoImagemAtivo.numeroPedido || '—'}</div>
              <div style={{ fontSize: 13, opacity: 0.9, marginTop: 4 }}>📅 {pedidoImagemAtivo.data} &nbsp;|&nbsp; 👤 {pedidoImagemAtivo.franqueado} &nbsp;|&nbsp; 🏪 {pedidoImagemAtivo.unidade}</div>
            </div>
            {/* Itens */}
            <div style={{ padding: '16px 24px' }}>
              <div style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10, fontWeight: 'bold' }}>Itens do Pedido</div>
              {(pedidoImagemAtivo.itens || []).map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid #f5f5f5', fontSize: 13 }}>
                  <span style={{ color: '#333' }}>{item.nome} <span style={{ color: '#aaa', fontSize: 12 }}>({item.porcao})</span></span>
                  <span style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <span style={{ color: '#888', fontSize: 12 }}>×{item.quantidade}</span>
                    <span style={{ fontWeight: 'bold', color: '#333', minWidth: 80, textAlign: 'right' }}>{(item.preco * item.quantidade).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</span>
                  </span>
                </div>
              ))}
            </div>
            {/* Total */}
            <div style={{ background: '#fdf0ef', padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid #c0392b' }}>
              <span style={{ fontWeight: 'bold', fontSize: 15, color: '#7c2f00' }}>TOTAL DO PEDIDO</span>
              <span style={{ fontWeight: 'bold', fontSize: 22, color: '#c0392b' }}>{pedidoImagemAtivo.total?.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</span>
            </div>
            {/* Footer */}
            <div style={{ background: '#1a1a1a', color: '#aaa', padding: '10px 24px', fontSize: 11, textAlign: 'center' }}>
              🫓 Pastelaria Candeias Jr &nbsp;•&nbsp; Pedido gerado em {new Date().toLocaleString('pt-BR')}
            </div>
          </div>
        </div>
      )}

      {/* Card invisível para geração de imagem da fatura */}
      {faturaAtiva && (
        <div style={{ position: 'fixed', left: -9999, top: 0, zIndex: -1 }}>
          <div ref={faturaRef} style={{ width: 600, background: 'white', fontFamily: 'Arial, sans-serif', padding: 32, color: '#222' }}>
            {/* Header */}
            <div style={{ background: '#c0392b', color: 'white', padding: 24, borderRadius: '8px 8px 0 0', textAlign: 'center', marginBottom: 0 }}>
              <div style={{ fontSize: 20, letterSpacing: 2, fontWeight: 'bold', marginBottom: 4 }}>FATURA DE COBRANÇA</div>
              <div style={{ fontSize: 14, opacity: 0.9 }}>Pedido #{faturaAtiva.numeroPedido || faturaAtiva.id} — Candeias Jr</div>
            </div>
            {/* Info grid */}
            <div style={{ border: '1px solid #ddd', borderTop: 'none', marginBottom: 16 }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #ddd' }}>
                <div style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', marginBottom: 4 }}>UNIDADE</div>
                <div style={{ fontWeight: 'bold' }}>{faturaAtiva.franqueado} — {faturaAtiva.unidade}</div>
              </div>
              <div style={{ display: 'flex' }}>
                <div style={{ flex: 1, padding: '12px 16px', borderRight: '1px solid #ddd' }}>
                  <div style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', marginBottom: 4 }}>DATA DE EMISSÃO</div>
                  <div style={{ fontWeight: 'bold' }}>{new Date().toLocaleDateString('pt-BR')}</div>
                </div>
                <div style={{ flex: 1, padding: '12px 16px' }}>
                  <div style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', marginBottom: 4 }}>VENCIMENTO</div>
                  <div style={{ fontWeight: 'bold', color: '#e74c3c' }}>{faturaAtiva.dataVencimento || (() => { const d = new Date(); d.setDate(d.getDate()+7); return d.toLocaleDateString('pt-BR') })()}</div>
                </div>
              </div>
            </div>
            {/* Tabela de itens */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 16, border: '1px solid #ddd' }}>
              <thead>
                <tr style={{ background: '#f5f5f5' }}>
                  <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: 12, color: '#555' }}>DESCRIÇÃO</th>
                  <th style={{ padding: '8px 12px', textAlign: 'center', fontSize: 12, color: '#555' }}>QTD</th>
                  <th style={{ padding: '8px 12px', textAlign: 'right', fontSize: 12, color: '#555' }}>VALOR</th>
                </tr>
              </thead>
              <tbody>
                {(faturaAtiva.itens || []).map((item, i) => (
                  <tr key={i}>
                    <td style={{ padding: '7px 12px', borderBottom: '1px solid #f0f0f0', fontSize: 13 }}>{item.nome} ({item.porcao})</td>
                    <td style={{ padding: '7px 12px', borderBottom: '1px solid #f0f0f0', textAlign: 'center', fontSize: 13 }}>{item.quantidade}</td>
                    <td style={{ padding: '7px 12px', borderBottom: '1px solid #f0f0f0', textAlign: 'right', fontSize: 13 }}>{(item.preco * item.quantidade).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ background: '#c0392b', color: 'white' }}>
                  <td colSpan={2} style={{ padding: '12px', fontWeight: 'bold', fontSize: 15 }}>VALOR TOTAL</td>
                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', fontSize: 15 }}>{faturaAtiva.total?.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</td>
                </tr>
              </tfoot>
            </table>
            {/* PIX */}
            <div style={{ background: '#f9f9f9', border: '2px solid #e0e0e0', borderRadius: 8, padding: 20 }}>
              <div style={{ color: '#c0392b', fontWeight: 'bold', fontSize: 15, marginBottom: 10 }}>💠 Instruções para Pagamento via PIX</div>
              <div style={{ marginBottom: 8 }}>Favor utilizar a chave CPF abaixo para transferência:</div>
              <div style={{ background: 'white', border: '1px solid #ddd', borderRadius: 6, padding: '12px 16px', fontFamily: 'monospace', fontSize: 18, fontWeight: 'bold', textAlign: 'center', letterSpacing: 2, marginBottom: 8 }}>{FATURA_PIX_KEY}</div>
              <div><b>Favorecido:</b> {FATURA_FAVORECIDO}</div>
            </div>
            <div style={{ marginTop: 20, textAlign: 'center', fontSize: 12, color: '#aaa', borderTop: '1px solid #eee', paddingTop: 12 }}>
              Documento gerado em {new Date().toLocaleDateString('pt-BR')}. Por favor, envie o comprovante após o pagamento.
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
