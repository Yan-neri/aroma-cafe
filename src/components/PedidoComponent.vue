<template>
  <div>
    <AlertaComponent
       ref="alertaRef"
      :tipo="alerta.tipo"
      :mensagem="alerta.mensagem"
      :visivel="alerta.visivel"
    />
    <form id="pedido-form" @submit="criarPedido($event)">
      <div>
        <p id="nome-cafe-content">
          {{ cafe && cafe.nome ? cafe.nome : "-" }}
        </p>
        <img id="foto-content" :src="cafe && cafe.foto ? cafe.foto : ''" />
      </div>
      <div class="inputs" id="form-pedido">
        <label for="nome-cliente">Nome</label>
        <input
          type="text"
          v-model="nomeCliente"
          id="nome-cliente"
          name="nome-cliente"
          placeholder="Digite seu Nome"
        />
      </div>
      <div class="inputs">
        <label>Tipo de leite</label>
        <select name="tipo-leite" id="tipo-leite" v-model="tipoLeiteSelecionado">
          <option value="" selected>Selecione o leite</option>
          <option
            v-for="tipoLeite in listaTiposLeite"
            :key="tipoLeite.id"
            :value="tipoLeite"
          >
            {{ tipoLeite.descricao }}
          </option>
        </select>
      </div>
      <div class="inputs">
        <label>Tamanho</label>
        <select name="tamanho" id="tamanho" v-model="tamanhoSelecionado">
          <option value="" selected>Selecione o tamanho</option>
          <option
            v-for="tamanho in listaTamanhos"
            :key="tamanho.id"
            :value="tamanho"
          >
            {{ tamanho.descricao }}
          </option>
        </select>
      </div>
      <div class="inputs">
        <label id="opcionais-titulo"> Selecione os opcionais</label>
        <label id="opcionais-subtitulo"> Adicione um acompanhamento</label>

        <div
          class="checkbox-container"
          v-for="acompanhamento in listaAcompanhamentos"
          :key="acompanhamento.id"
        >
          <input
            type="checkbox"
            :name="acompanhamento.nome"
            :value="acompanhamento"
            v-model="listaAcompanhamentosSelecionados"
          />
          <span>{{ acompanhamento.nome }}</span>
        </div>

        <label> Turbine seu café</label>

        <div
          class="checkbox-container"
          id="checkbox-container"
          v-for="adicional in listaAdicionais"
          :key="adicional.id"
        >
          <input
            type="checkbox"
            :name="adicional.nome"
            :value="adicional"
            v-model="listaAdicionaisSelecionados"
          />
          <span>{{ adicional.nome }}</span>
        </div>
        <div class="inputs">
          <input type="submit" class="submit-btn" value="Confirmar Pedido" />
        </div>
      </div>
    </form>
  </div>
</template>
<script>
import AlertaComponent from "@/components/AlertaComponent.vue";

export default {
  name: "PedidoComponent",
  components: {
    AlertaComponent,
  },
  props: {
    cafe: null,
  },
  data() {
    return {
      listaTiposLeite: [],
      listaTamanhos: [],
      listaAcompanhamentos: [],
      listaAdicionais: [],
      nomeCliente: "",
      tipoLeiteSelecionado: "",
      tamanhoSelecionado: "",
      listaAcompanhamentosSelecionados: [],
      listaAdicionaisSelecionados: [],
      alerta: {
        visivel: false,
        tipo: "info",
        mensagem: "",
      },
    };
  },
  methods: {
    mostrarAlerta(tipo, mensagem) {
  this.alerta = { visivel: true, tipo, mensagem };
  this.$nextTick(() => {
    const el = this.$refs.alertaRef.$el;
    if (el && el.scrollIntoView) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
},
    async getTiposLeite() {
      const response = await fetch(`${this.$apiUrl}/tipos_leite`);
      const dados = await response.json();
      this.listaTiposLeite = dados;
    },
    async getTamanhos() {
      const response = await fetch(`${this.$apiUrl}/tamanhos`);
      const dados = await response.json();
      this.listaTamanhos = dados;
    },
    async getOpcionais() {
      const response = await fetch(`${this.$apiUrl}/opcionais`);
      const dados = await response.json();
      this.listaAcompanhamentos = dados.acompanhamentos;
      this.listaAdicionais = dados.adicionais;
    },
    validarPedido() {
      if (!this.cafe || !this.cafe.nome) {
        this.mostrarAlerta(
          "aviso",
          "Volte ao Menu e selecione um café antes de continuar."
        );
        return false;
      }
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
    },
    async criarPedido(e) {
      e.preventDefault();

      if (!this.validarPedido()) {
        return;
      }

      const dadosPedido = {
        nome: this.nomeCliente,
        tipoLeite: this.tipoLeiteSelecionado,
        tamanho: this.tamanhoSelecionado,
        acompanhamentos: Array.from(this.listaAcompanhamentosSelecionados),
        adicionais: Array.from(this.listaAdicionaisSelecionados),
        cafe: this.cafe,
        statusId: 1,
      };

      const dadosJson = JSON.stringify(dadosPedido);

      try {
        const req = await fetch(`${this.$apiUrl}/pedidos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: dadosJson,
        });

        if (!req.ok) {
          throw new Error("Falha ao registrar o pedido");
        }

        this.mostrarAlerta("sucesso", "Pedido confirmado com sucesso!");
        setTimeout(() => {
          this.$router.push("/pedidos");
        }, 1200);
      } catch (erro) {
        this.mostrarAlerta(
          "erro",
          "Não foi possível registrar o pedido. Tente novamente."
        );
      }
    },
  },
  mounted() {
    this.getTiposLeite();
    this.getTamanhos();
    this.getOpcionais();
  },
};
</script>
<style scoped>
#foto-content {
  margin-bottom: 16px;
  border-radius: 16px;
  position: relative;
  z-index: -1;
  justify-content: center;
  width: 100%;
  height: 180px;
  object-fit: cover;
}

#nome-cafe-content {
  font-size: 43px;
  font-weight: bold;
  text-align: start;
  margin-bottom: -90px;
  margin-left: 40px;
  color: #3e2723;
  padding: 16px;
}

#form-pedido {
  max-width: 750px;
}

.inputs {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
}

label {
  font-weight: bold;
  margin-bottom: 16px;
  color: #3e2723;
  padding: 5px 12px;
  flex-direction: start;
  display: flex;
  border-left: 4px solid #b07d4f;
}

input,
select {
  padding: 12px;
  width: 300px;
  border: solid #3e2723 1px;
  border-radius: 8px;
  height: 20px;
  font-size: 12px;
}

select {
  height: 45px;
}

#opcionais-titulo {
  width: 100%;
}

#opcionais-subtitulo {
  display: flex;
  align-items: flex-start;
  align-content: center;
  width: 100%;
  margin-bottom: 12px;
}

.checkbox-container span {
  margin-left: 6px;
  font-weight: bold;
}

.checkbox-container span,
.checkbox-container input {
  width: auto;
  height: 20px;
}

.submit-btn {
  background-color: #3e2723;
  color: #e0b88a;
  font-weight: bold;
  border: none;
  font-size: 18px;
  border-radius: 12px;
  padding: 16px;
  margin: 0 auto;
  cursor: pointer;
  width: 100%;
  height: auto;
  transition: 0.5s;
}

.submit-btn:hover {
  background-color: #b07d4f;
  color: #3e2723;
}
</style>
