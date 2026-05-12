import { useState, useEffect } from 'react'

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
      { id: "carne-louca-lanche", nome: "Carne Louca Lanche", preco: 3.50, porcao: "50g" },
      { id: "carne-louca-mistura", nome: "Carne Louca Mistura", preco: 3.00, porcao: "50g" },
      { id: "carne-louca-pura", nome: "Carne Louca Pura", preco: 4.50, porcao: "50g" },
      { id: "carne-mistura", nome: "Carne Mistura", preco: 3.20, porcao: "50g" },
      { id: "carne-pura", nome: "Carne Pura", preco: 4.80, porcao: "50g" },
      { id: "carne-seca-mistura", nome: "Carne Seca Mistura", preco: 4.00, porcao: "50g" },
      { id: "frango-mistura", nome: "Frango Mistura", preco: 2.80, porcao: "50g" },
      { id: "frango-puro", nome: "Frango Puro", preco: 3.50, porcao: "50g" },
      { id: "palmito-mistura", nome: "Palmito Mistura", preco: 2.50, porcao: "50g" },
      { id: "palmito-puro", nome: "Palmito Puro", preco: 3.80, porcao: "50g" },
      { id: "salame", nome: "Salame", preco: 3.50, porcao: "50g" },
      { id: "calabresa", nome: "Calabresa", preco: 3.20, porcao: "50g" },
      { id: "atum", nome: "Atum", preco: 3.00, porcao: "50g" },
      { id: "tomate-seco", nome: "Tomate Seco", preco: 4.78, porcao: "100g" },
      { id: "milho", nome: "Milho", preco: 1.50, porcao: "100g" },
    ]
  },
  frios: {
    nome: "🧀 Frios",
    cor: "#f39c12",
    corBg: "#fef9f0",
    unidade: "gramas",
    itens: [
      { id: "queijo-fresco", nome: "Queijo Fresco", preco: 4.50, porcao: "100g" },
      { id: "provolone", nome: "Provolone", preco: 5.00, porcao: "100g" },
      { id: "queijo-prato", nome: "Queijo Prato", preco: 4.20, porcao: "100g" },
      { id: "cheddar", nome: "Cheddar", preco: 4.50, porcao: "100g" },
      { id: "appresuntado", nome: "Appresuntado", preco: 3.80, porcao: "100g" },
      { id: "salsicha", nome: "Salsicha", preco: 13.20, porcao: "1kg" },
    ]
  },
  vegetais: {
    nome: "🥦 Vegetais",
    cor: "#27ae60",
    corBg: "#f2fdf5",
    unidade: "gramas",
    itens: [
      { id: "azeitona", nome: "Azeitona", preco: 2.50, porcao: "100g" },
    ]
  },
  massas: {
    nome: "🥔 Massas",
    cor: "#8e44ad",
    corBg: "#faf2fe",
    unidade: "pacote",
    itens: [
      { id: "massa-pastel", nome: "Massa de Pastel", preco: 9.40, porcao: "1kg" },
      { id: "batata-congelada-350", nome: "Batata Congelada", preco: 4.62, porcao: "350g" },
      { id: "batata-congelada-625", nome: "Batata Congelada", preco: 8.25, porcao: "625g" },
      { id: "pure", nome: "Purê", preco: 8.45, porcao: "500g" },
    ]
  },
  doces: {
    nome: "🍯 Doces",
    cor: "#e67e22",
    corBg: "#fef5ec",
    unidade: "unidade",
    itens: [
      { id: "doce-leite", nome: "Doce de Leite", preco: 135.00, porcao: "balde 4,8kg" },
      { id: "cereja", nome: "Cereja", preco: 12.60, porcao: "100g" },
      { id: "ameixa", nome: "Ameixa", preco: 19.60, porcao: "400g" },
      { id: "goiabada", nome: "Goiabada", preco: 1.30, porcao: "100g" },
      { id: "chocolate-cremoso", nome: "Chocolate Cremoso Gourmet", preco: 42.63, porcao: "1kg" },
      { id: "chocolate-leite", nome: "Chocolate ao Leite", preco: 44.00, porcao: "860g" },
      { id: "chocolate-branco", nome: "Chocolate Branco", preco: 40.00, porcao: "1kg" },
      { id: "coco", nome: "Coco", preco: 43.00, porcao: "1kg" },
      { id: "canela", nome: "Canela", preco: 5.00, porcao: "100g" },
      { id: "suflair", nome: "Suflair", preco: 8.00, porcao: "pacote" },
      { id: "leite-condensado", nome: "Leite Condensado", preco: 8.50, porcao: "395g" },
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
      { id: "bandeja-bh-102", nome: "Bandeja BH 102", preco: 124.30, porcao: "cx c/100" },
      { id: "bandeja-bh-101", nome: "Bandeja BH 101", preco: 52.41, porcao: "cx c/100" },
      { id: "papel-tv", nome: "Papel TV", preco: 10.23, porcao: "un" },
      { id: "interfolha", nome: "Interfolha", preco: 12.76, porcao: "1 pct" },
      { id: "saco-grecepell-1kg", nome: "Saco Grecepell 1kg", preco: 213.40, porcao: "500un" },
      { id: "saco-grecepell-2kg", nome: "Saco Grecepell 2kg", preco: 165.50, porcao: "500un" },
      { id: "toalha-americana", nome: "Toalha Americana", preco: 26.18, porcao: "pct" },
      { id: "copo-300", nome: "Copo 300ml", preco: 7.81, porcao: "pct" },
      { id: "copo-180", nome: "Copo 180ml", preco: 4.18, porcao: "pct" },
      { id: "caixa-media", nome: "Caixa Média", preco: 2.09, porcao: "un" },
      { id: "caixa-grande", nome: "Caixa Grande", preco: 2.46, porcao: "un" },
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
  } catch { return 10002 }
}

export default function App() {
  const [aba, setAba] = useState('pedido')
  const [franqueado, setFranqueado] = useState({ nome: '', unidade: '', telefone: '' })
  const [carrinho, setCarrinho] = useState([])
  const [categoriaAtiva, setCategoriaAtiva] = useState('carnes')
  const [quantidades, setQuantidades] = useState({})
  const [busca, setBusca] = useState('')
  const [adminPin, setAdminPin] = useState('')
  const [adminLogado, setAdminLogado] = useState(false)
  const [pinErro, setPinErro] = useState(false)
  const [historico, setHistorico] = useState(() => {
    try { return JSON.parse(localStorage.getItem('historico_precos') || '[]') } catch { return [] }
  })
  const [novaObs, setNovaObs] = useState('')
  const [pedidoGerado, setPedidoGerado] = useState(false)
  const [ultimoPedidoNum, setUltimoPedidoNum] = useState(null)

  const formatPreco = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  // Itens filtrados pela busca
  const itensBusca = busca.trim().length >= 2
    ? TODOS_ITENS.filter(item =>
        item.nome.toLowerCase().includes(busca.toLowerCase()) ||
        item.catNome.toLowerCase().includes(busca.toLowerCase())
      )
    : []

  const adicionarAoCarrinho = (item, catKey) => {
    const qty = quantidades[item.id] || 1
    if (qty <= 0) return
    const catInfo = CATEGORIAS[catKey]
    const existente = carrinho.find(c => c.id === item.id + '-' + catKey)
    if (existente) {
      setCarrinho(carrinho.map(c => c.id === item.id + '-' + catKey ? { ...c, quantidade: c.quantidade + qty } : c))
    } else {
      setCarrinho([...carrinho, {
        id: item.id + '-' + catKey,
        nome: item.nome,
        porcao: item.porcao,
        preco: item.preco,
        quantidade: qty,
        categoria: catInfo.nome
      }])
    }
    setQuantidades({ ...quantidades, [item.id]: 1 })
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
    <h2>Pedido de: ${franqueado.nome || 'Franqueado'} | Unidade: ${franqueado.unidade || '-'} | Tel: ${franqueado.telefone || '-'}</h2>
    <p>Data: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}</p>
    <table><thead><tr><th>Categoria</th><th>Item</th><th>Qtd</th><th>Preço Un.</th><th>Subtotal</th></tr></thead>
    <tbody>${linhas}</tbody></table>
    <div class="total">TOTAL: ${formatPreco(total)}</div>
    <button onclick="window.print()" style="margin-top:20px;padding:10px 20px;background:#c0392b;color:white;border:none;border-radius:5px;font-size:16px">🖨️ Imprimir / Salvar PDF</button>
    </body></html>`)
    win.document.close()
    setUltimoPedidoNum(numPedido)
    setPedidoGerado(true)
  }

  const compartilharWhatsapp = () => {
    const numPedido = ultimoPedidoNum
    const data = new Date().toLocaleDateString('pt-BR')
    const linhasTexto = carrinho.map(item =>
      `  • ${item.nome} (${item.porcao}) x${item.quantidade} = ${formatPreco(item.preco * item.quantidade)}`
    ).join('\n')
    const msg = `🔥 *CANDEIA JR — PEDIDO #${numPedido}*\n\n`
      + `👤 *Franqueado:* ${franqueado.nome || '-'}\n`
      + `🏪 *Unidade:* ${franqueado.unidade || '-'}\n`
      + `📅 *Data:* ${data}\n\n`
      + `📋 *Itens do Pedido:*\n${linhasTexto}\n\n`
      + `💰 *TOTAL: ${formatPreco(total)}*`
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

  const catKeys = Object.keys(CATEGORIAS)

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #c0392b, #e74c3c)', color: 'white', padding: '16px 20px', textAlign: 'center' }}>
        <img src="/CANDEIA-FRANQUEADO/logo.png" alt="Candeia Jr" style={{ height: 110, objectFit: 'contain', display: 'block', margin: '0 auto' }} />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '2px solid #e74c3c', background: 'white' }}>
        {[['pedido','📋 Pedido'],['carrinho',`🛒 Carrinho (${carrinho.length})`],['admin','⚙️ Admin']].map(([key,label]) => (
          <button key={key} onClick={() => setAba(key)} style={{
            flex: 1, padding: '12px', border: 'none', background: aba === key ? '#e74c3c' : 'white',
            color: aba === key ? 'white' : '#333', fontWeight: 'bold', fontSize: 14, transition: 'all 0.2s'
          }}>{label}</button>
        ))}
      </div>

      {/* ABA PEDIDO */}
      {aba === 'pedido' && (
        <div style={{ padding: 16 }}>
          {/* Dados franqueado */}
          <div style={{ background: 'white', padding: 16, borderRadius: 8, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <h3 style={{ marginBottom: 12, color: '#c0392b' }}>Seus dados</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
              {[['nome','Nome completo'],['unidade','Unidade/Loja'],['telefone','Telefone']].map(([key,label]) => (
                <input key={key} placeholder={label} value={franqueado[key]}
                  onChange={e => setFranqueado({...franqueado, [key]: e.target.value})}
                  style={{ padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }}/>
              ))}
            </div>
          </div>

          {/* Campo de busca */}
          <div style={{ background: 'white', padding: '12px 16px', borderRadius: 8, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 18, color: '#aaa' }}>🔍</span>
              <input
                type="text"
                placeholder="Buscar item em todas as categorias..."
                value={busca}
                onChange={e => setBusca(e.target.value)}
                style={{ width: '100%', padding: '10px 12px 10px 40px', border: '2px solid #e74c3c', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', outline: 'none' }}
              />
              {busca && (
                <button onClick={() => setBusca('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', fontSize: 18, color: '#aaa', cursor: 'pointer' }}>✕</button>
              )}
            </div>
            {/* Resultados da busca */}
            {busca.trim().length >= 2 && (
              <div style={{ marginTop: 10 }}>
                {itensBusca.length === 0 ? (
                  <p style={{ color: '#888', textAlign: 'center', padding: '10px 0', fontSize: 14 }}>Nenhum item encontrado para "{busca}"</p>
                ) : (
                  <>
                    <p style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>{itensBusca.length} resultado(s) encontrado(s)</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10 }}>
                      {itensBusca.map(item => (
                        <div key={item.id + item.catKey} style={{
                          background: '#fafafa', borderRadius: 8, padding: 12,
                          borderLeft: `4px solid ${item.catCor}`, boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
                        }}>
                          <div style={{ fontWeight: 'bold', fontSize: 14 }}>{item.nome}</div>
                          <div style={{ fontSize: 11, color: '#888', marginBottom: 6 }}>{item.catNome} · {item.porcao}</div>
                          <div style={{ fontSize: 16, fontWeight: 'bold', color: item.catCor, marginBottom: 8 }}>{formatPreco(item.preco)}</div>
                          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                            <button onClick={() => setQuantidades({...quantidades, [item.id]: Math.max(1,(quantidades[item.id]||1)-1)})}
                              style={{ width: 28, height: 28, border: `1px solid ${item.catCor}`, borderRadius: 4, background: 'white', color: item.catCor, fontWeight: 'bold' }}>-</button>
                            <input type="number" min="1" value={quantidades[item.id] || 1}
                              onChange={e => setQuantidades({...quantidades, [item.id]: Math.max(1, parseInt(e.target.value)||1)})}
                              style={{ width: 44, textAlign: 'center', padding: '3px', border: '1px solid #ddd', borderRadius: 4, fontSize: 13 }}/>
                            <button onClick={() => setQuantidades({...quantidades, [item.id]: (quantidades[item.id]||1)+1})}
                              style={{ width: 28, height: 28, border: `1px solid ${item.catCor}`, borderRadius: 4, background: 'white', color: item.catCor, fontWeight: 'bold' }}>+</button>
                            <button onClick={() => { adicionarAoCarrinho(item, item.catKey); setBusca('') }} style={{
                              flex: 1, padding: '6px', background: item.catCor, color: 'white',
                              border: 'none', borderRadius: 6, fontWeight: 'bold', fontSize: 12, cursor: 'pointer'
                            }}>Adicionar</button>
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
                <button key={cat} onClick={() => setCategoriaAtiva(cat)} style={{
                  padding: '8px 14px', borderRadius: 20, border: `2px solid ${c.cor}`,
                  background: categoriaAtiva === cat ? c.cor : 'white',
                  color: categoriaAtiva === cat ? 'white' : c.cor,
                  fontWeight: 'bold', whiteSpace: 'nowrap', fontSize: 13, transition: 'all 0.2s', cursor: 'pointer'
                }}>{c.nome}</button>
              )
            })}
          </div>

          {/* Itens da categoria */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
            {CATEGORIAS[categoriaAtiva].itens.map(item => {
              const cat = CATEGORIAS[categoriaAtiva]
              return (
                <div key={item.id} style={{
                  background: 'white', borderRadius: 10, padding: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  borderLeft: `4px solid ${cat.cor}`
                }}>
                  <div style={{ fontWeight: 'bold', marginBottom: 4, color: '#222' }}>{item.nome}</div>
                  <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>Embalagem: {item.porcao}</div>
                  <div style={{ fontSize: 18, fontWeight: 'bold', color: cat.cor, marginBottom: 10 }}>{formatPreco(item.preco)}</div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <button onClick={() => setQuantidades({...quantidades, [item.id]: Math.max(1,(quantidades[item.id]||1)-1)})}
                      style={{ width: 32, height: 32, border: `1px solid ${cat.cor}`, borderRadius: 4, background: 'white', color: cat.cor, fontWeight: 'bold', fontSize: 16, cursor: 'pointer' }}>-</button>
                    <input type="number" min="1" value={quantidades[item.id] || 1}
                      onChange={e => setQuantidades({...quantidades, [item.id]: Math.max(1, parseInt(e.target.value)||1)})}
                      style={{ width: 50, textAlign: 'center', padding: '4px', border: '1px solid #ddd', borderRadius: 4 }}/>
                    <button onClick={() => setQuantidades({...quantidades, [item.id]: (quantidades[item.id]||1)+1})}
                      style={{ width: 32, height: 32, border: `1px solid ${cat.cor}`, borderRadius: 4, background: 'white', color: cat.cor, fontWeight: 'bold', fontSize: 16, cursor: 'pointer' }}>+</button>
                    <button onClick={() => adicionarAoCarrinho(item, categoriaAtiva)} style={{
                      flex: 1, padding: '8px', background: cat.cor, color: 'white', border: 'none',
                      borderRadius: 6, fontWeight: 'bold', fontSize: 13, cursor: 'pointer'
                    }}>Adicionar</button>
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
                  <div key={item.id} style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                    borderBottom: i < carrinho.length-1 ? '1px solid #f0f0f0' : 'none'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 'bold', fontSize: 14 }}>{item.nome}</div>
                      <div style={{ fontSize: 12, color: '#888' }}>{item.categoria} · {item.porcao} · {formatPreco(item.preco)}/un</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <button onClick={() => atualizarQtd(item.id, item.quantidade-1)}
                        style={{ width: 28, height: 28, border: '1px solid #ddd', borderRadius: 4, background: 'white', cursor: 'pointer' }}>-</button>
                      <span style={{ minWidth: 24, textAlign: 'center', fontWeight: 'bold' }}>{item.quantidade}</span>
                      <button onClick={() => atualizarQtd(item.id, item.quantidade+1)}
                        style={{ width: 28, height: 28, border: '1px solid #ddd', borderRadius: 4, background: 'white', cursor: 'pointer' }}>+</button>
                    </div>
                    <div style={{ fontWeight: 'bold', minWidth: 80, textAlign: 'right', color: '#c0392b' }}>
                      {formatPreco(item.preco * item.quantidade)}
                    </div>
                    <button onClick={() => removerDoCarrinho(item.id)}
                      style={{ background: 'none', border: 'none', color: '#e74c3c', fontSize: 18, cursor: 'pointer' }}>✕</button>
                  </div>
                ))}
              </div>
              <div style={{ background: 'white', padding: 16, borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
                  <span>Total</span>
                  <span style={{ color: '#c0392b' }}>{formatPreco(total)}</span>
                </div>
                <button onClick={gerarPDF} style={{
                  width: '100%', padding: 14, background: 'linear-gradient(135deg, #c0392b, #e74c3c)',
                  color: 'white', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 'bold', cursor: 'pointer', marginBottom: 10
                }}>📄 Gerar PDF do Pedido</button>
                {pedidoGerado && (
                  <button onClick={compartilharWhatsapp} style={{
                    width: '100%', padding: 14, background: 'linear-gradient(135deg, #25d366, #128c7e)',
                    color: 'white', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 'bold', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                  }}>
                    <span style={{ fontSize: 20 }}>💬</span> Compartilhar via WhatsApp
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* ABA ADMIN */}
      {aba === 'admin' && (
        <div style={{ padding: 16 }}>
          {!adminLogado ? (
            <div style={{ maxWidth: 360, margin: '40px auto', background: 'white', padding: 24, borderRadius: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
              <h3 style={{ textAlign: 'center', marginBottom: 20, color: '#c0392b' }}>🔒 Área Admin</h3>
              <input type="password" placeholder="PIN de acesso" value={adminPin}
                onChange={e => setAdminPin(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && loginAdmin()}
                style={{ width: '100%', padding: 12, border: `1px solid ${pinErro ? '#e74c3c' : '#ddd'}`, borderRadius: 6, fontSize: 16, marginBottom: 8, boxSizing: 'border-box' }}/>
              {pinErro && <p style={{ color: '#e74c3c', fontSize: 13, marginBottom: 8 }}>PIN incorreto</p>}
              <button onClick={loginAdmin} style={{
                width: '100%', padding: 12, background: '#c0392b', color: 'white',
                border: 'none', borderRadius: 6, fontSize: 16, fontWeight: 'bold', cursor: 'pointer'
              }}>Entrar</button>
            </div>
          ) : (
            <div>
              <div style={{ background: 'white', padding: 16, borderRadius: 10, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                <h3 style={{ color: '#c0392b', marginBottom: 12 }}>📝 Registrar Atualização de Preços</h3>
                <textarea placeholder="Observação (ex: Reajuste de 10% em carnes)" value={novaObs}
                  onChange={e => setNovaObs(e.target.value)}
                  style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 6, minHeight: 80, marginBottom: 8, boxSizing: 'border-box', resize: 'vertical' }}/>
                <button onClick={registrarAtualizacao} style={{
                  padding: '10px 20px', background: '#27ae60', color: 'white',
                  border: 'none', borderRadius: 6, fontWeight: 'bold', cursor: 'pointer'
                }}>Registrar</button>
              </div>
              <div style={{ background: 'white', padding: 16, borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                <h3 style={{ color: '#c0392b', marginBottom: 12 }}>📅 Histórico de Atualizações</h3>
                {historico.length === 0 ? (
                  <p style={{ color: '#888', textAlign: 'center', padding: 20 }}>Nenhuma atualização registrada ainda.</p>
                ) : (
                  [...historico].reverse().map(h => (
                    <div key={h.numero} style={{ padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                      <div style={{ fontWeight: 'bold', color: '#c0392b' }}>#{h.numero} — {h.data}</div>
                      <div style={{ color: '#555', marginTop: 4 }}>{h.obs || 'Sem observação'}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
