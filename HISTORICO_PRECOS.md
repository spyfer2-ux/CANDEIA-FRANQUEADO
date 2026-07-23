# Histórico de Preços — CANDEIA Franqueado

> Registro dos ajustes de preços da tabela de insumos vendida aos franqueados.
> Os preços ficam em `src/App.jsx`, dentro da constante `CATEGORIAS` (campo `preco` de cada item).

## Como funciona o faturamento
Você (franqueador) fornece insumos para as pastelarias. O faturamento vem do que cada franqueado pede pelo Portal (coleção `orcamentos` no Firebase). Aumentar o `preco` de um insumo aumenta diretamente a sua receita por pedido.

## Base de dados usada nos cálculos
- **Fonte:** 48 pedidos reais dos franqueados (coleção `orcamentos`).
- **Período analisado:** 19/05/2026 a 22/07/2026 (~2,1 meses).
- **Critério de ranking:** receita gerada por insumo (preço × quantidade pedida).
- O volume mensal de cada item é a média no período.

---

## Ajuste de 23/07/2026

Meta: +R$130/mês no Grupo 1 e +R$150/mês no Grupo 2. Aumento uniforme por grupo, em centavos "limpos".

### Grupo 1 — os 10 insumos que mais faturam (aumento uniforme de +R$0,04/un)

| # | Insumo | Preço antigo | Preço novo | Aumento | Un/mês | Ganho/mês |
|---|--------|-------------|-----------|---------|--------|-----------|
| 1 | Carne Pura (70g) | R$ 5.16 | R$ 5.20 | +0.04 | ~433 | +R$ 17.31 |
| 2 | Carne Mistura (50g) | R$ 3.60 | R$ 3.64 | +0.04 | ~514 | +R$ 20.55 |
| 3 | Bacon Mistura (20g) | R$ 2.68 | R$ 2.72 | +0.04 | ~647 | +R$ 25.87 |
| 4 | Carne Seca Mistura (40g) | R$ 7.78 | R$ 7.82 | +0.04 | ~185 | +R$ 7.42 |
| 5 | Calabresa (50g) | R$ 1.78 | R$ 1.82 | +0.04 | ~614 | +R$ 24.54 |
| 6 | Frango Mistura (50g) | R$ 2.48 | R$ 2.52 | +0.04 | ~357 | +R$ 14.27 |
| 7 | Caixa Média (un) | R$ 2.09 | R$ 2.13 | +0.04 | ~267 | +R$ 10.69 |
| 8 | Carne Louca Mistura (60g) | R$ 4.13 | R$ 4.17 | +0.04 | ~109 | +R$ 4.38 |
| 9 | Atum (70g) | R$ 5.00 | R$ 5.04 | +0.04 | ~90 | +R$ 3.61 |
| 10 | Caixa Grande (un) | R$ 2.46 | R$ 2.50 | +0.04 | ~172 | +R$ 6.87 |

**Ganho total do Grupo 1: +R$ 135.51/mês**

### Grupo 2 — do 11º ao 20º insumo (aumento uniforme de +R$0,35/un)

| # | Insumo | Preço antigo | Preço novo | Aumento | Un/mês | Ganho/mês |
|---|--------|-------------|-----------|---------|--------|-----------|
| 1 | Bacon Puro (30g) | R$ 4.47 | R$ 4.82 | +0.35 | ~81 | +R$ 28.30 |
| 2 | Brócolis (70g) | R$ 4.79 | R$ 5.14 | +0.35 | ~66 | +R$ 22.97 |
| 3 | Frango Puro (70g) | R$ 3.19 | R$ 3.54 | +0.35 | ~76 | +R$ 26.63 |
| 4 | Salame (50g) | R$ 4.55 | R$ 4.90 | +0.35 | ~52 | +R$ 18.31 |
| 5 | Sachê Ketchup Heinz (cx unidade) | R$ 25.30 | R$ 25.65 | +0.35 | ~8 | +R$ 2.83 |
| 6 | Carne Louca Pura (100g) | R$ 7.24 | R$ 7.59 | +0.35 | ~26 | +R$ 9.17 |
| 7 | Carne Louca Lanche (160g) | R$ 10.96 | R$ 11.31 | +0.35 | ~17 | +R$ 5.99 |
| 8 | Sachê Mostarda Heinz (cx unidade) | R$ 25.30 | R$ 25.65 | +0.35 | ~7 | +R$ 2.50 |
| 9 | Palmito Mistura (70g) | R$ 2.34 | R$ 2.69 | +0.35 | ~76 | +R$ 26.63 |
| 10 | Batata Frita G (650g) | R$ 8.25 | R$ 8.60 | +0.35 | ~21 | +R$ 7.32 |

**Ganho total do Grupo 2: +R$ 150.65/mês**

### Resumo do ajuste
- **Total adicional deste ajuste: +R$ 286.16/mês**
- Somado ao aumento anterior (~R$190/mês), o total acumulado é de aproximadamente **R$ 476.16/mês** a mais.

---

## Observações importantes
- Os valores de "Un/mês" e "Ganho/mês" são estimativas baseadas na média do período analisado; a receita real varia conforme os pedidos.
- Para recalcular no futuro: exporte os pedidos da coleção `orcamentos`, agregue por nome de insumo (quantidade e receita), ordene por receita e defina o aumento pelo volume mensal de cada grupo.
- Depois de commitar, o GitHub Pages publica automaticamente e os franqueados veem os novos preços no próximo pedido.

## Histórico anterior
- Ajuste anterior (~R$190/mês): aumento de centavos em vários itens (registrado antes deste arquivo).
