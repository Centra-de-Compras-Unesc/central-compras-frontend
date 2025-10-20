export async function testarConexao() {
  try {
    const response = await fetch("/api");
    if (response.ok) {
      console.log("✅ Conexão com backend bem-sucedida!");
    } else {
      console.log("⚠️ Backend respondeu, mas com erro:", response.status);
    }
  } catch (error) {
    console.error("❌ Erro ao conectar com backend:", error.message);
  }
}
