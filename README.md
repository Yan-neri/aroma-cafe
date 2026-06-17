# ☕ Aroma Café

Sistema de pedidos de uma **cafeteria**, desenvolvido em **Vue 3**, evoluído e
customizado a partir do sistema base **T-Burguer** (trabalhado em sala de aula).
A estrutura original foi integralmente reaproveitada — Options API, `vue-router`,
`fetch`, propriedade global `$apiUrl` e JSON Server — e adaptada para um novo
segmento comercial.

---

## 1. Visão Geral

O segmento escolhido foi uma **cafeteria**. O cliente navega por um cardápio de cafés,
monta seu pedido (escolhendo **tipo de leite**, **tamanho**, **acompanhamentos** e
**adicionais**) e acompanha a lista de pedidos realizados, podendo alterar o status e
excluir registros.

### Alterações estruturais (dados e regras)

O campo *"Ponto da carne"* do T-Burguer deixou de fazer sentido para uma cafeteria e
foi substituído por *"Tipo de leite"*. Além disso, foi criado o campo obrigatório
*"Tamanho"*. O objeto principal `burguer` virou `cafe`, e os opcionais foram
remodelados:

| T-Burguer (original) | Aroma Café (novo) |
|---|---|
| `burguer` (item principal) | `cafe` |
| `tipos_pontos` / *"Ponto da carne"* | `tipos_leite` / *"Tipo de leite"* |
| *(não existia)* | `tamanhos` / *"Tamanho"* (campo novo) |
| `opcionais.complemento` | `opcionais.acompanhamentos` |
| `opcionais.bebidas` | `opcionais.adicionais` |
| `menu.burgues` | `menu.cafes` |

Reflexo dessas mudanças no objeto enviado para a API ao confirmar um pedido:

```js
// PedidoComponent.vue
const dadosPedido = {
  nome: this.nomeCliente,
  tipoLeite: this.tipoLeiteSelecionado, // antes: ponto (ponto da carne)
  tamanho: this.tamanhoSelecionado,     // campo novo
  acompanhamentos: Array.from(this.listaAcompanhamentosSelecionados),
  adicionais: Array.from(this.listaAdicionaisSelecionados),
  cafe: this.cafe,                      // antes: burguer
  statusId: 1,
};
```

### Alterações visuais

Novo nome, logo, banner, troca completa das imagens (cafés), textos e paleta de cores
(de dourado/preto para café/caramelo). Exemplo na barra de navegação:

```css
/* NavBarComponent.vue */
#nav {
  background-color: #3e2723;        /* café espresso */
  border-bottom: #b07d4f 4px solid; /* caramelo */
}
```

---

## 2. Solução Técnica dos Alertas

A comunicação visual foi centralizada em um único componente reutilizável,
`AlertaComponent.vue`, que recebe três `props`: `tipo`, `mensagem` e `visivel`.
O `tipo` define a cor semântica e o ícone exibido:

| Tipo | Cor | Uso |
|---|---|---|
| `erro` | 🔴 Vermelho | Erros de preenchimento ou ações inválidas |
| `aviso` | 🟠 Laranja | Avisos importantes |
| `info` | 🔵 Azul | Informações contextuais |
| `sucesso` | 🟢 Verde | Sucesso ao cadastrar, editar ou excluir |

A **exibição dinâmica** funciona assim: a cor é aplicada por *class binding*
(`alerta-${tipo}`) e o ícone é retornado por um método (`obterIcone`) a partir do
`tipo`:

```js
// AlertaComponent.vue
methods: {
  obterIcone() {
    const icones = { erro: "✕", aviso: "⚠", info: "ℹ", sucesso: "✓" };
    return icones[this.tipo] || "ℹ";
  },
},
```

```html
<div v-if="visivel" :class="['alerta', `alerta-${tipo}`]" role="alert">
  <span class="alerta-icone">{{ obterIcone() }}</span>
  <span class="alerta-mensagem">{{ mensagem }}</span>
</div>
```

Cada tela mantém um objeto reativo `alerta` em `data()` e um método único
`mostrarAlerta(tipo, mensagem)` que dispara o alerta certo:

```js
data() {
  return { alerta: { visivel: false, tipo: "info", mensagem: "" } };
},
methods: {
  mostrarAlerta(tipo, mensagem) {
    this.alerta = { visivel: true, tipo, mensagem };
  },
}
```

A **lógica de validação** roda antes de enviar o pedido: `validarPedido()` bloqueia a
confirmação quando falta um campo obrigatório e dispara o alerta vermelho de erro:

```js
validarPedido() {
  if (this.nomeCliente.trim() === "") {
    this.mostrarAlerta("erro", "Informe o nome do cliente para continuar.");
    return false;
  }
  if (this.tipoLeiteSelecionado === "") {
    this.mostrarAlerta("erro", "Selecione o tipo de leite do seu café.");
    return false;
  }
  if (this.tamanhoSelecionado === "") {
    this.mostrarAlerta("erro", "Selecione o tamanho do seu café.");
    return false;
  }
  return true;
}
```

Em caso de sucesso, é exibido o alerta verde e o usuário é redirecionado
automaticamente para a tela de pedidos. Na exclusão, o registro é removido do array
local (re-renderização imediata) seguido do alerta verde de sucesso.

---

## 3. Link da API

URL pública da API mockada (JSON Server, publicada no Render):

**https://banco-json-aroma-cafe.onrender.com** 
---

## 4. Link de Produção

Link ativo do projeto publicado (Vercel):

**https://aroma-cafe-764hgx83u-yan-neris-projects.vercel.app**

---

## 5. Link do Repositório

Código-fonte público no GitHub:

- **Front-end:** https://github.com/Yan-neri/aroma-cafe
- **Banco-json (API):** https://github.com/Yan-neri/banco-json

---

## ⚙️ Como rodar localmente

```bash
npm install          # instala as dependências
npm run bancojson    # inicia o JSON Server na porta 3000
npm run serve        # em outro terminal, roda a aplicação
```

> Crie um `.env.development` (copie de `.env.exemplo`) com
> `VUE_APP_API_BASE_URL=http://localhost:3000`. O Vue só lê o `.env` ao iniciar;
> após editar, reinicie o `npm run serve`.