# ☕ Aroma Café

Sistema de pedidos de uma **cafeteria**, desenvolvido em **Vue 3**.
Este projeto é a evolução e customização do sistema base **T-Burguer** (trabalhado em
sala de aula), reaproveitando toda a sua estrutura — Options API, `vue-router`,
`fetch`, propriedade global `$apiUrl` e JSON Server — adaptada para um novo segmento
comercial.

---

## 📌 Visão Geral

O segmento escolhido foi uma **cafeteria**. O sistema permite que o cliente navegue
por um cardápio de cafés, monte seu pedido (escolhendo tipo de leite, tamanho,
acompanhamentos e adicionais) e acompanhe a lista de pedidos realizados, com troca de
status e exclusão.

### Principais alterações em relação ao T-Burguer

| T-Burguer (original) | Aroma Café (novo) |
|---|---|
| Item principal `burguer` | `cafe` |
| `tipos_pontos` / *"Ponto da carne"* | `tipos_leite` / *"Tipo de leite"* |
| *(não existia)* | `tamanhos` / *"Tamanho"* (campo novo) |
| `opcionais.complemento` | `opcionais.acompanhamentos` (cookie, muffin, pão de queijo) |
| `opcionais.bebidas` | `opcionais.adicionais` (chantilly, calda, dose extra) |
| `menu.burgues` | `menu.cafes` |
| Paleta dourado/preto (`darkgoldenrod`, `#333`) | Paleta café/caramelo (`#3e2723`, `#b07d4f`) |

**Alterações estruturais (dados e regras):** o campo *"Ponto da carne"* deixou de fazer
sentido e foi substituído por *"Tipo de leite"*. Foi acrescentado o campo obrigatório
*"Tamanho"*. O objeto enviado para a API ao confirmar um pedido foi remodelado:

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

**Alterações visuais:** novo nome, logo e banner, troca completa de imagens (cafés),
textos e paleta de cores. Exemplo da troca de identidade na barra de navegação:

```html
<!-- NavBarComponent.vue -->
<img src="/img/logo_aroma.svg" id="logo" />
```

```css
#nav {
  background-color: #3e2723;     /* café espresso */
  border-bottom: #b07d4f 4px solid; /* caramelo */
}
```

> **Imagens:** os arquivos em `public/img/*.svg` são *placeholders* gerados para o
> projeto rodar sem imagens quebradas. Substitua-os pelas suas próprias fotos de café
> mantendo os mesmos nomes (ou atualize os caminhos no `db/db.json`).

---

## 🚦 Solução Técnica dos Alertas

A comunicação visual foi centralizada em um único componente reutilizável,
`AlertaComponent.vue`, que recebe três `props`: `tipo`, `mensagem` e `visivel`.
O `tipo` define a cor semântica e o ícone exibido:

| Tipo | Cor | Uso |
|---|---|---|
| `erro` | 🔴 Vermelho | Erros de preenchimento ou ações inválidas |
| `aviso` | 🟠 Laranja | Avisos importantes |
| `info` | 🔵 Azul | Informações contextuais |
| `sucesso` | 🟢 Verde | Sucesso ao cadastrar, editar ou excluir |

O ícone é resolvido por uma `computed` a partir do `tipo`, e a cor é aplicada via
*class binding* dinâmico (`alerta-${tipo}`):

```js
// AlertaComponent.vue
computed: {
  icone() {
    const icones = { erro: "✕", aviso: "⚠", info: "ℹ", sucesso: "✓" };
    return icones[this.tipo] || "ℹ";
  },
},
```

```html
<div v-if="visivel" :class="['alerta', `alerta-${tipo}`]" role="alert">
  <span class="alerta-icone">{{ icone }}</span>
  <span class="alerta-mensagem">{{ mensagem }}</span>
</div>
```

Cada tela que usa alertas mantém um objeto reativo `alerta` em `data()` e um método
único `mostrarAlerta(tipo, mensagem)` que o atualiza:

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

### Validação de campos obrigatórios

Antes de enviar o pedido, `validarPedido()` bloqueia a confirmação caso falte algum
campo essencial, disparando o alerta apropriado:

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

### Experiência do Usuário (UX)

- **Redirecionamento inteligente:** ao confirmar o pedido com sucesso, é exibido o
  alerta verde e, em seguida, o usuário é levado automaticamente para a lista de
  pedidos:

  ```js
  this.mostrarAlerta("sucesso", "Pedido confirmado com sucesso!");
  setTimeout(() => { this.$router.push("/pedidos"); }, 1200);
  ```

- **Estado em tempo real:** a tela de pedidos consulta a API ao ser montada
  (`mounted`), exibindo imediatamente o novo registro.

- **Feedback de remoção:** ao excluir, o item é removido do array local com `filter`,
  forçando a re-renderização imediata sem novo *fetch*, seguido do alerta verde:

  ```js
  this.listaPedidosRealizados = this.listaPedidosRealizados.filter(
    (pedido) => pedido.id !== id
  );
  this.mostrarAlerta("sucesso", "Pedido excluído com sucesso!");
  ```

---

## ⚙️ Como rodar localmente

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar o banco (JSON Server) na porta 3000
npm run bancojson

# 3. Em outro terminal, rodar a aplicação
npm run serve
```

> Crie um arquivo `.env.development` (copie de `.env.exemplo`) com:
> `VUE_APP_API_BASE_URL=http://localhost:3000`

---

## 🔗 Links da Entrega

- **API (JSON Server):** ‹INSIRA AQUI A URL PÚBLICA DA SUA API›
- **Produção (site publicado):** ‹INSIRA AQUI O LINK DO GITHUB PAGES›
- **Repositório do código-fonte:** ‹INSIRA AQUI O LINK DO REPOSITÓRIO›

> **Deploy no GitHub Pages:** no `vue.config.js`, ajuste o `publicPath` para
> `'/<NOME-DO-REPO>/'` em produção (ex: `'/aroma-cafe/'`) antes de gerar o build com
> `npm run build`. Em produção, defina `VUE_APP_API_BASE_URL` em `.env.production`
> apontando para a URL pública do seu JSON Server.
