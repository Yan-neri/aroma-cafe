<template>
  <div v-if="visivel" :class="['alerta', `alerta-${tipo}`]" role="alert">
    <span class="alerta-icone">{{ obterIcone() }}</span>
    <span class="alerta-mensagem">{{ mensagem }}</span>
  </div>
</template>
<script>
export default {
  name: "AlertaComponent",
  props: {
    tipo: {
      type: String,
      default: "info",
    },
    mensagem: {
      type: String,
      default: "",
    },
    visivel: {
      type: Boolean,
      default: false,
    },
  },
   methods: {
    obterIcone() {
      const icones = {
        erro: "✕",
        aviso: "⚠",
        info: "ℹ",
        sucesso: "✓",
      };
      return icones[this.tipo] || "ℹ";
    },
  },
};
</script>
<style scoped>
.alerta {
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 750px;
  margin: 16px auto;
  padding: 14px 18px;
  border-radius: 10px;
  font-weight: bold;
  text-align: left;
  border-left: 6px solid;
}

.alerta-icone {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  color: #fff;
  font-size: 16px;
  flex-shrink: 0;
}


.alerta-erro {
  background-color: #fdecea;
  color: #b71c1c;
  border-color: #c62828;
}
.alerta-erro .alerta-icone {
  background-color: #c62828;
}


.alerta-aviso {
  background-color: #fff4e5;
  color: #9c4d00;
  border-color: #ef6c00;
}
.alerta-aviso .alerta-icone {
  background-color: #ef6c00;
}


.alerta-info {
  background-color: #e8f1fb;
  color: #0d47a1;
  border-color: #1565c0;
}
.alerta-info .alerta-icone {
  background-color: #1565c0;
}

.alerta-sucesso {
  background-color: #e9f7ef;
  color: #1b5e20;
  border-color: #2e7d32;
}
.alerta-sucesso .alerta-icone {
  background-color: #2e7d32;
}
</style>
